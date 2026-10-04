// Migration acceptance checks against the actual production artifact.
import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('out');
const posts = JSON.parse(await fs.readFile('.generated/posts.json', 'utf8'));
const legacy = JSON.parse(await fs.readFile('migration/legacy-routes.json', 'utf8'));
const failures = [];
const redirects = (await fs.readFile('out/_redirects', 'utf8')).trim().split('\n').map(line => line.split(/\s+/));
const exists = async url => {
  const file = path.join(root, decodeURIComponent(url).replace(/^\//, ''));
  try { const stat = await fs.stat(file); return stat.isDirectory() ? Boolean(await fs.stat(path.join(file, 'index.html'))) : true; } catch { return false; }
};
for (const old of legacy.posts) {
  const post = posts.find(p => p.path === old.canonical);
  if (!post) { failures.push(`Missing published post: ${old.path}`); continue; }
  if (post.published !== old.published) failures.push(`Changed publication date: ${old.path}`);
  for (const route of new Set([post.path, old.path])) {
    if (!await exists(route)) { failures.push(`Missing article route: ${route}`); continue; }
    const html = await fs.readFile(path.join(root, route, 'index.html'), 'utf8');
    if (!html.includes(`href="https://oliverflint.co.uk${post.path}"`)) failures.push(`Canonical missing: ${route}`);
    for (const id of old.headings) if (!html.includes(`id="${id}"`)) failures.push(`Lost heading ${route}#${id}`);
    if (!html.includes('BlogPosting')) failures.push(`Missing article structured data: ${route}`);
  }
  const sourceFolder = `content/assets/${post.slug}`;
  let assets = [];
  try { assets = await fs.readdir(sourceFolder); } catch { /* Not every post has assets. */ }
  for (const file of assets) for (const route of new Set([post.path, old.path])) {
    try {
      const source = await fs.readFile(path.join(sourceFolder, file));
      const target = await fs.readFile(path.join(root, route, file));
      if (!source.equals(target)) failures.push(`Asset changed: ${route}${file}`);
    } catch { failures.push(`Missing asset: ${route}${file}`); }
  }
}
for (const old of legacy.pages) {
  if (await exists(old.path)) continue;
  const alias = redirects.find(([from]) => from.toLowerCase() === old.path.toLowerCase());
  if (!alias || !await exists(alias[1])) failures.push(`Unmapped legacy page: ${old.path}`);
}
const legacyRss = await fs.readFile('migration/legacy-rss.xml', 'utf8');
const rss = await fs.readFile('out/rss.xml', 'utf8');
for (const [, guid] of legacyRss.matchAll(/<guid[^>]*>([^<]*)<\/guid>/g)) if (!rss.includes(`>${guid}</guid>`)) failures.push(`Changed RSS identity: ${guid}`);
const sitemap = await fs.readFile('out/sitemap.xml', 'utf8');
if (sitemap.includes('<loc>http://www.oliverflint.co.uk')) failures.push('Legacy origin remains in sitemap');
for (const p of posts) if (!sitemap.includes(`https://oliverflint.co.uk${p.path}`)) failures.push(`Missing sitemap post: ${p.path}`);
const walk = async dir => (await Promise.all((await fs.readdir(dir, { withFileTypes: true })).map(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))).flat();
const output = await walk(root);
for (const file of output.filter(f => /\.(html|xml|json|txt)$/.test(f))) {
  const content = await fs.readFile(file, 'utf8');
  if (/Using httpBook with Dataverse to test the web api/i.test(content)) failures.push(`Unpublished draft leaked: ${file}`);
  if (!file.endsWith('.html')) continue;
  for (const [, url] of content.matchAll(/(?:href|src)="(\/[^"<>]*)"/g)) {
    const local = url.split('#')[0].split('?')[0].replaceAll('&amp;', '&');
    if (local && !await exists(local) && !redirects.some(([from]) => from.toLowerCase() === local.toLowerCase())) failures.push(`Broken local reference in ${path.relative(root, file)}: ${url}`);
  }
}
if (!await exists('/404.html')) failures.push('Missing 404 artifact');
if (failures.length) { console.error([...new Set(failures)].join('\n')); process.exitCode = 1; }
else console.log(`Export accepted: ${posts.length} posts, ${legacy.pages.length} legacy pages, original assets and heading anchors, RSS identities, sitemap and draft exclusion.`);
