// Serve the exported site locally, including real 404s and Netlify path aliases.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('out');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.zip': 'application/zip', '.woff2': 'font/woff2' };
const rules = (await fs.readFile(path.join(root, '_redirects'), 'utf8')).trim().split('\n').map(l => l.split(/\s+/));
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const requested = decodeURIComponent(url.pathname);
    const file = path.resolve(root, '.' + requested);
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    let actual = file;
    try { if ((await fs.stat(file)).isDirectory()) actual = path.join(file, 'index.html'); } catch { /* Check legacy redirects below. */ }
    let data;
    try { data = await fs.readFile(actual); }
    catch {
      const rule = rules.find(([from]) => from.toLowerCase() === requested.toLowerCase());
      if (rule) { res.writeHead(301, { Location: rule[1] + url.search }); res.end(); return; }
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(await fs.readFile(path.join(root, '404.html'))); return;
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(actual)] || 'application/octet-stream' }); res.end(data);
  } catch { res.writeHead(500); res.end('Unable to serve exported page.'); }
}).listen(Number(process.env.PORT || 3000), '127.0.0.1', () => console.log(`Workbench preview: http://127.0.0.1:${process.env.PORT || 3000}`));
