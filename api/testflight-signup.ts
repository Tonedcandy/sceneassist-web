// /api/testflight-signup.ts
import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.statusCode = 405;
        return res.end('Method Not Allowed');
    }

    const body = await readBody(req);
    const form = new URLSearchParams(body);

    // Honeypot
    if (form.get('website')) {
        res.statusCode = 303;
        res.setHeader('Location', '/thank-you');
        return res.end();
    }

    const full_name = (form.get('full_name') || '').trim();
    const apple_id_email = (form.get('apple_id_email') || '').trim();
    const affiliation = (form.get('affiliation') || '').trim();
    const role = (form.get('role') || '').trim();
    const consent = form.get('consent') === 'on';

    if (!full_name || !apple_id_email || !affiliation || !role || !consent) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ ok: false, error: 'Missing required fields' }));
    }

    try {
        const ip = (req.headers?.['x-forwarded-for'] || '').toString().split(',')[0] || null;
        const ua = (req.headers?.['user-agent'] || '').toString() || null;

        await sql`
      INSERT INTO testflight_signups
        (full_name, apple_id_email, affiliation, role, consent, ip, ua)
      VALUES
        (${full_name}, ${apple_id_email}, ${affiliation}, ${role}, ${consent}, ${ip}, ${ua});
    `;

        res.statusCode = 303;
        res.setHeader('Location', '/thank-you');
        return res.end();
    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ ok: false, error: 'DB insert failed' }));
    }
}

async function readBody(req: any): Promise<string> {
    // No Buffer usage → no Node types needed
    const decoder = new TextDecoder('utf-8');
    let out = '';
    for await (const chunk of req as AsyncIterable<any>) {
        out += typeof chunk === 'string' ? chunk : decoder.decode(chunk);
    }
    return out;
}