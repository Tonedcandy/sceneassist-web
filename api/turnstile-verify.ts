// api/turnstile-verify.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
        const { token } = req.body ?? {};
        if (!token) return res.status(400).json({ success: false, error: 'Missing token' });

        const ip =
            (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
            req.socket.remoteAddress ||
            '';

        const params = new URLSearchParams({
            secret: process.env.SCENEASSIST_WEB_TURNSTILE_SECRET_KEY as string,
            response: token,
            remoteip: ip,
        });

        const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
        });

        const out = await r.json();
        // out = { success, 'error-codes'?, action?, cdata? }
        const ok = out.success === true;

        res.status(200).json({ success: ok, raw: out });
    } catch (e: any) {
        res.status(500).json({ success: false, error: e?.message || 'verify-failed' });
    }
}