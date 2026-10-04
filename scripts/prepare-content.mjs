import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import YAML from 'yaml';
import { z } from 'zod';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import rehypeShiki from '@shikijs/rehype';
import { visit } from 'unist-util-visit';
import sharp from 'sharp';

const origin = 'https://oliverflint.co.uk';
const topicIds = ['power-platform', 'dynamics-typescript', 'azure-devops'];
const schema = z.object({
  title: z.string().min(1), slug: z.string().regex(/^[a-z0-9-]+$/),
  published: z.string().datetime(), path: z.string().regex(/^\/\d{4}\/\d{2}\/\d{2}\/[a-z0-9-]+\/$/),
  description: z.string().min(1), summary: z.string().min(1).optional(), topics: z.array(z.enum(topicIds)), tags: z.array(z.string()),
  draft: z.boolean().default(false), updated: z.string().datetime().optional(),
  legacyPath: z.string().optional(), rssGuid: z.string().optional(), legacyHeadings: z.array(z.string()).optional(),
  series: z.literal('d365-typescript').optional(), order: z.number().int().min(1).max(6).optional(),
});
await fs.mkdir('.generated', { recursive: true });
await fs.mkdir('public/generated', { recursive: true });
await fs.mkdir('public/fonts', { recursive: true });
const fonts = [
  { package: 'inter', family: 'Workbench Sans', weights: [400, 500, 600, 700] },
  { package: 'jetbrains-mono', family: 'Workbench Mono', weights: [400, 600] },
];
const fontRules = [];
for (const font of fonts) for (const weight of font.weights) {
  const filename = `${font.package}-latin-${weight}-normal.woff2`;
  await fs.copyFile(`node_modules/@fontsource/${font.package}/files/${filename}`, `public/fonts/${filename}`);
  fontRules.push(`@font-face{font-family:'${font.family}';font-style:normal;font-weight:${weight};font-display:swap;src:url('/fonts/${filename}') format('woff2')}`);
}
for (const font of fonts) await fs.copyFile(`node_modules/@fontsource/${font.package}/LICENSE`, `public/fonts/${font.package}-LICENSE.txt`);
await fs.writeFile('public/fonts/fonts.css', fontRules.join('\n'));
await sharp(Buffer.from(await fs.readFile('public/icon.svg', 'utf8'))).resize(180, 180).png().toFile('public/apple-touch-icon.png');
const names = (await fs.readdir('content/posts')).filter(n => n.endsWith('.md'));
const rawPosts = [];
for (const name of names) {
  const parsed = matter(await fs.readFile(`content/posts/${name}`, 'utf8'), { engines: { yaml: s => YAML.parse(s) } });
  if (parsed.data.draft === true) continue;
  const data = schema.parse(parsed.data);
  if (Boolean(data.series) !== Boolean(data.order)) throw Error(`${name}: series and order must be specified together`);
  rawPosts.push({ ...data, markdown: parsed.content });
}
for (const key of ['path', 'slug']) {
  if (new Set(rawPosts.map(p => p[key])).size !== rawPosts.length) throw Error(`Duplicate post ${key}`);
}
const seriesPosts = rawPosts.filter(p => p.series);
if (new Set(seriesPosts.map(p => p.order)).size !== seriesPosts.length) throw Error('Duplicate series order');
const legacy = JSON.parse(await fs.readFile('migration/legacy-routes.json', 'utf8'));
const rewrite = url => {
  let local = url.replace(/^https?:\/\/(www\.)?oliverflint\.co\.uk/, '');
  const pageAliases = { '/index.html': '/', '/Me/': '/about/', '/me/': '/about/', '/D365-Typescript/': '/series/d365-typescript/', '/categories/D365-Typescript/': '/series/d365-typescript/', '/categories/D365-TypeScript/': '/series/d365-typescript/' };
  if (pageAliases[local]) return pageAliases[local];
  if (local.startsWith('/categories/') && /PCF|Component-Framework/i.test(local)) return '/topics/power-platform/';
  for (const p of rawPosts) {
    if (p.legacyPath && local.toLowerCase().startsWith(p.legacyPath.toLowerCase())) return p.path + local.slice(p.legacyPath.length);
  }
  return local;
};
const imageInfo = new Map();
for (const post of rawPosts) {
  const folder = `content/assets/${post.slug}`;
  let assets;
  try { assets = await fs.readdir(folder); } catch (e) { if (e.code === 'ENOENT') continue; throw e; }
  for (const filename of assets) {
    const file = path.join(folder, filename);
    for (const route of new Set([post.path, post.legacyPath].filter(Boolean))) {
      const dest = path.join('public', route.slice(1));
      await fs.mkdir(dest, { recursive: true });
      await fs.copyFile(file, path.join(dest, filename));
    }
    if (!/\.(png|jpe?g|svg)$/i.test(filename)) continue;
    const meta = await sharp(file).metadata();
    const variants = [];
    if (!filename.endsWith('.svg')) {
      for (const width of [640, 1280].filter(w => w < meta.width)) {
        const target = `public/generated/${post.slug}-${path.parse(filename).name}-${width}.webp`;
        await sharp(file).resize(width).webp({ quality: 85 }).toFile(target);
        variants.push(`/generated/${path.basename(target)} ${width}w`);
      }
    }
    imageInfo.set(post.path + filename, { width: meta.width, height: meta.height, variants });
  }
}
const toText = node => node.value || node.children?.map(toText).join('') || '';
const slugify = s => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section';
const posts = [];
for (const post of rawPosts) {
  const headings = [], localReferences = [];
  const usedIds = new Set();
  let headingIndex = 0;
  function enrich() {
    return tree => {
      visit(tree, 'element', node => {
        if (/^h[1-6]$/.test(node.tagName)) {
          const text = toText(node);
          const base = post.legacyHeadings?.[headingIndex++] || slugify(text);
          let id = base, suffix = 1;
          while (usedIds.has(id)) id = `${base}-${suffix++}`;
          usedIds.add(id); node.properties.id = id;
          if (['h2', 'h3'].includes(node.tagName)) headings.push({ id, text, depth: Number(node.tagName[1]) });
        }
        for (const attr of ['src', 'href']) {
          const value = node.properties?.[attr];
          if (typeof value !== 'string') continue;
          if (value.startsWith('#') || /^(?:https?:|mailto:|tel:)/.test(value) && !/oliverflint\.co\.uk/.test(value)) continue;
          const resolved = value.startsWith('/') || /^https?:/.test(value) ? rewrite(value) : new URL(value, origin + post.path).pathname;
          node.properties[attr] = resolved;
          if (resolved.startsWith('/')) localReferences.push(resolved.split('#')[0].split('?')[0]);
        }
        if (node.tagName === 'img') {
          const info = imageInfo.get(node.properties.src);
          if (info) {
            node.properties.width = info.width; node.properties.height = info.height;
            if (info.variants.length) {
              node.properties.srcSet = [...info.variants, `${node.properties.src} ${info.width}w`].join(', ');
              node.properties.sizes = '(max-width: 800px) calc(100vw - 40px), 740px';
            }
          }
          node.properties.loading = 'lazy'; node.properties.decoding = 'async';
          if (!node.properties.alt) node.properties.alt = path.parse(String(node.properties.src)).name.replace(/[-_]/g, ' ');
        }
        if (node.tagName === 'code' && node.properties.className) {
          node.properties.className = node.properties.className.map(c => c.startsWith('language-') ? c.toLowerCase().replace('language-powershell', 'language-ps1') : c);
        }
      });
    };
  }
  const html = String(await unified().use(remarkParse).use(remarkGfm).use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw).use(enrich)
    .use(rehypeSanitize, { ...defaultSchema, clobberPrefix: '', attributes: { ...defaultSchema.attributes, '*': [...defaultSchema.attributes['*'], 'id'], img: [...defaultSchema.attributes.img, 'width', 'height', 'srcSet', 'sizes', 'loading', 'decoding'], code: [['className', /^language-/]] } })
    .use(rehypeShiki, { themes: { dark: 'github-dark', light: 'github-light' }, defaultColor: false })
    .use(rehypeStringify).process(post.markdown));
  const proseText = post.markdown.replace(/```[\s\S]*?```/g, '').replace(/<[^>]*>/g, '').replace(/[#*_`\[\]]/g, '');
  for (const ref of new Set(localReferences)) {
    if (!path.extname(ref)) continue;
    if (ref.endsWith('.html')) continue;
    try { await fs.access(path.join('public', decodeURIComponent(ref))); } catch { throw Error(`${post.slug}: missing asset ${ref}`); }
  }
  const { markdown, legacyHeadings, ...metadata } = post;
  posts.push({ ...metadata, html, headings, readingMinutes: Math.max(1, Math.ceil(proseText.split(/\s+/).length / 220)) });
}
posts.sort((a, b) => b.published.localeCompare(a.published));
await fs.writeFile('.generated/posts.json', JSON.stringify(posts));
const summaries = posts.map(({ html, headings, ...p }) => p);
await fs.writeFile('public/search-index.json', JSON.stringify(summaries));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
async function socialCard(title, subtitle, file) {
  const lines = []; let line = '';
  for (const word of title.split(' ')) {
    if ((line + ' ' + word).length > 33 && line) { lines.push(line); line = word; } else line += (line ? ' ' : '') + word;
  }
  if (line) lines.push(line);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#111a22"/><rect x="65" y="58" width="70" height="70" rx="15" fill="#19252f" stroke="#2e3c47"/><text x="78" y="105" fill="#8ce0bc" font-family="monospace" font-size="35" font-weight="bold">of.</text><text x="158" y="104" fill="#e4ebf1" font-family="sans-serif" font-size="26">Oliver Flint / Workbench</text><line x1="65" y1="166" x2="1135" y2="166" stroke="#2e3c47"/>${lines.slice(0, 5).map((l, i) => `<text x="65" y="${245 + i * 58}" fill="${i === 0 ? '#8ce0bc' : '#e4ebf1'}" font-family="sans-serif" font-size="45" font-weight="600">${esc(l)}</text>`).join('')}<text x="65" y="567" fill="#a5b5c4" font-family="monospace" font-size="17">${esc(subtitle)}</text><text x="1135" y="567" text-anchor="end" fill="#8ce0bc" font-family="monospace" font-size="17">oliverflint.co.uk</text></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(file);
}
await socialCard('Practical notes. Working knowledge.', 'POWER PLATFORM / DYNAMICS 365 / AZURE', 'public/generated/social-card.png');
for (const p of posts) await socialCard(p.title, `${p.published.slice(0, 10)} / ${p.readingMinutes} MIN READ`, `public/generated/${p.slug}-social.png`);
const rss = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Oliver Flint — Workbench</title><link>${origin}/</link><description>Practical notes on Power Platform, Dynamics 365, Dataverse and Azure.</description><language>en-gb</language><atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml"/>${posts.map(p => `<item><title>${esc(p.title)}</title><link>${origin}${p.path}</link><guid isPermaLink="${p.rssGuid ? 'true' : 'false'}">${esc(p.rssGuid || origin + p.path)}</guid><pubDate>${new Date(p.published).toUTCString()}</pubDate><description>${esc(p.description)}</description></item>`).join('')}</channel></rss>`;
await fs.writeFile('public/rss.xml', rss);
const redirectMap = new Map([['/Me/', '/about/'], ['/me/', '/about/'], ['/D365-Typescript/', '/series/d365-typescript/'], ['/d365-typescript/', '/series/d365-typescript/'], ['/categories/', '/topics/'], ['/archives/', '/blog/']]);
const tagMap = new Map();
for (const p of posts) for (const tag of p.tags) if (!tagMap.has(tag.toLowerCase())) tagMap.set(tag.toLowerCase(), p.topics[0]);
for (const old of legacy.pages) {
  if (/^\/archives\//.test(old.path) || /^\/page\//.test(old.path)) redirectMap.set(old.path, '/blog/');
  if (/^\/categories\//.test(old.path) && old.path !== '/categories/') {
    const target = /D365-TypeScript/i.test(old.path) ? '/series/d365-typescript/' : /Azure|DevOps/i.test(old.path) ? '/topics/azure-devops/' : '/topics/power-platform/';
    redirectMap.set(old.path, target);
  }
  if (/^\/tags\//.test(old.path)) {
    const tag = decodeURIComponent(old.path.split('/')[2]).replaceAll('-', ' ').toLowerCase();
    const topic = tagMap.get(tag);
    redirectMap.set(old.path, topic ? `/topics/${topic}/` : '/blog/');
  }
}
for (const [from, to] of [...redirectMap]) if (from !== '/') redirectMap.set(from + 'index.html', to);
await fs.writeFile('public/_redirects', [...redirectMap].map(([from, to]) => `${from} ${to} 301`).join('\n') + '\n');
const preview = ['deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT);
await fs.writeFile('public/_headers', preview ? '/*\n  X-Robots-Tag: noindex, nofollow\n' : '');
await fs.writeFile('.generated/build-info.json', JSON.stringify({ preview }));
console.log(`Compiled ${posts.length} posts, ${imageInfo.size} images, ${redirectMap.size} legacy aliases. Drafts excluded.`);
