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

    // Required fields check
    if (!full_name || !apple_id_email || !affiliation || !role || !consent) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ ok: false, error: 'Missing required fields' }));
    }

    try {
        // Metadata
        const ip = (req.headers?.['x-forwarded-for'] || '').toString().split(',')[0] || null;
        const ua = (req.headers?.['user-agent'] || '').toString() || null;

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