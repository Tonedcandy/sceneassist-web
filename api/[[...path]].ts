// api/[[...path]].ts
import fs from 'node:fs';
import path from 'node:path';

// read once at init; file is bundled via vercel.json includeFiles
const HTML_404 = fs.readFileSync(
    path.join(process.cwd(), 'public', '404.html'),
    'utf8'
);

export default function handler(req: any, res: any) {
    const accept = String(req.headers['accept'] || '');
    if (accept.includes('application/json')) {
        return res.status(404).json({ error: 'Not Found', route: req.url });
    }
    res
        .status(404)
        .setHeader('content-type', 'text/html; charset=utf-8')
        .setHeader('cache-control', 'public, max-age=60')
        .setHeader('x-sa-handler', 'api-catchall')
        .send(HTML_404);
}