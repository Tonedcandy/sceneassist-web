// /api/testflight-signup.ts
import getRawBody from 'raw-body';
import { createClient } from '@supabase/supabase-js';

// Server-only env vars (Project → Settings → Environment Variables)
const supabaseUrl = process.env.SCENEASSIST_WEB_SUPABASE_URL!;
const serviceKey = process.env.SCENEASSIST_WEB_SUPABASE_SERVICE_ROLE_KEY!; // DO NOT expose client-side

// Create Supabase client (no session persistence in serverless)
const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

// Optional: pin region if your Supabase is US West
// export const config = { regions: ['sfo1'] };

export default async function handler(req: any, res: any) {
    // Graceful for history/back/refresh
    if (req.method === 'GET' || req.method === 'HEAD') {
        res.statusCode = 303;
        res.setHeader('Location', '/');
        return res.end();
    }
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.setHeader('Allow', 'POST, GET, HEAD, OPTIONS');
        return res.end();
    }
    if (req.method !== 'POST') {
        res.statusCode = 405;
        return res.end('Method Not Allowed');
    }

    // --- Robust body read ---
    const ctHeader = (req.headers?.['content-type'] || '').toString();
    const charset = ctHeader.match(/charset=([^;]+)/i)?.[1]?.toLowerCase() || 'utf-8';
    const len = req.headers?.['content-length'];

    const raw = await readBody(req, { length: len, encoding: charset });
    const ct = ctHeader.toLowerCase();

    // Parse urlencoded or JSON; fallback to urlencoded
    let fields: Record<string, string> = {};
    if (ct.includes('application/x-www-form-urlencoded')) {
        fields = Object.fromEntries(new URLSearchParams(raw));
    } else if (ct.includes('application/json')) {
        try { fields = JSON.parse(raw || '{}'); } catch { fields = {}; }
    } else {
        fields = Object.fromEntries(new URLSearchParams(raw));
    }

    // Honeypot: if present/non-empty, silently succeed
    if (fields.website) {
        res.statusCode = 303;
        res.setHeader('Location', '/thank-you');
        return res.end();
    }

    // Extract + normalize
    const full_name = (fields.full_name || '').trim();
    const apple_id_email = (fields.apple_id_email || '').trim();
    const affiliation = (fields.affiliation || '').trim();
    const role = (fields.role || '').trim();
    const consent = ['on', 'true', '1', 'yes'].includes((fields.consent || '').toLowerCase());
    const cfTurnstileToken = (fields.cf_turnstile_token || '').trim();

    // Required fields check
    if (!full_name || !apple_id_email || !affiliation || !role || !consent || !cfTurnstileToken) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ ok: false, error: 'Missing required fields' }));
    }

    try {
        // Metadata
        const ip = (req.headers?.['x-forwarded-for'] || '').toString().split(',')[0] || null;
        const ua = (req.headers?.['user-agent'] || '').toString() || null;

        // Verify Turnstile token server-side before proceeding
        let turnstileResult: Awaited<ReturnType<typeof verifyTurnstile>> | null = null;
        try {
            turnstileResult = await verifyTurnstile(cfTurnstileToken, ip);
        } catch (verifyErr) {
            console.error('[Turnstile verification error]', verifyErr);
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            return res.end(
                JSON.stringify({
                    ok: false,
                    error: 'Turnstile verification error',
                })
            );
        }
        if (!turnstileResult?.success) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            return res.end(
                JSON.stringify({
                    ok: false,
                    error: 'Turnstile verification failed',
                    codes: turnstileResult['error-codes'] ?? [],
                })
            );
        }

        // Upsert by email (ensure you have a UNIQUE index on apple_id_email)
        const { error } = await supabase
            .from('testflight_signups')
            .upsert(
                { full_name, apple_id_email, affiliation, role, consent, ip, ua },
                { onConflict: 'apple_id_email', ignoreDuplicates: false }
            );

        if (error) throw error;

        const wantsJSON = (req.headers?.accept || '').includes('application/json');
        if (wantsJSON) { res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ ok: true })); }

        // Success → redirect to thank you
        res.statusCode = 303;
        res.setHeader('Location', '/thank-you');


        return res.end();
    } catch (err: any) {
        console.error('[Supabase insert failed]', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        // Keep prod-generic; for local debugging you can include err.message
        return res.end(JSON.stringify({ ok: false, error: 'DB insert failed' }));
    }
}

// ---- helpers ----
async function verifyTurnstile(token: string, ip: string | null) {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) throw new Error('Turnstile secret key not configured');

    const params = new URLSearchParams();
    params.set('secret', secret);
    params.set('response', token);
    if (ip) params.set('remoteip', ip);

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });

    if (!result.ok) {
        throw new Error(`Turnstile verify upstream failure: ${result.status}`);
    }

    const payload = await result.json();
    return payload as {
        success: boolean;
        challenge_ts?: string;
        hostname?: string;
        action?: string;
        cdata?: string;
        'error-codes'?: string[];
    };
}

async function readBody(
    req: any,
    opts: { length?: string | number; encoding?: string }
): Promise<string> {
    // If already parsed by some middleware (unlikely in Vercel Node functions)
    if (typeof req.body === 'string') return req.body;
    if (req.body && typeof req.body === 'object') {
        try { return new URLSearchParams(req.body as Record<string, string>).toString(); } catch { }
        try { return JSON.stringify(req.body); } catch { }
    }
    try {
        const raw: Buffer | string = await getRawBody(req, {
            length: opts.length,
            encoding: (opts.encoding || 'utf-8') as BufferEncoding,
        });
        return typeof raw === 'string' ? raw : (raw as Buffer).toString('utf-8');
    } catch {
        return '';
    }
}
