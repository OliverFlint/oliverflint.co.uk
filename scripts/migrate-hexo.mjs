// One-time, non-destructive import. Existing Markdown is never overwritten.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import YAML from 'yaml';

const legacy = JSON.parse(fs.readFileSync('migration/legacy-routes.json', 'utf8'));
fs.mkdirSync('content/posts', { recursive: true });
fs.mkdirSync('content/drafts', { recursive: true });
for (const old of legacy.posts) {
  const source = fs.readdirSync('source/_posts').find(f => f.toLowerCase() === old.source.toLowerCase());
  if (!source) throw new Error(`No source for ${old.path}`);
  const parsed = matter(fs.readFileSync(path.join('source/_posts', source), 'utf8'));
  const name = source.slice(0, -3);
  const seriesOrder = Number(name.match(/Part-(\d)/i)?.[1]) || undefined;
  const topic = seriesOrder ? 'dynamics-typescript' : /Azure-DevOps/i.test(name) ? 'azure-devops' : name === 'Welcome' ? undefined : 'power-platform';
  const data = {
    title: parsed.data.title,
    slug: name.toLowerCase(),
    published: old.published,
    path: old.canonical,
    description: parsed.data.description || 'A new home for my notes on technology, development and the things I learn along the way.',
    topics: topic ? [topic] : [],
    tags: parsed.data.tags || [],
    draft: false,
    legacyPath: old.path,
    rssGuid: `http://www.oliverflint.co.uk${old.path}`,
    legacyHeadings: old.headings,
    ...(seriesOrder ? { series: 'd365-typescript', order: seriesOrder } : {}),
  };
  const target = `content/posts/${name.toLowerCase()}.md`;
  if (!fs.existsSync(target)) fs.writeFileSync(target, `---\n${YAML.stringify(data)}---\n${parsed.content}`);
  const assetFolder = path.join('source/_posts', name);
  if (fs.existsSync(assetFolder)) {
    const dest = `content/assets/${name.toLowerCase()}`;
    fs.mkdirSync(dest, { recursive: true });
    fs.cpSync(assetFolder, dest, { recursive: true, force: false });
  }
}
for (const name of fs.readdirSync('source/_drafts').filter(f => f.endsWith('.md'))) {
  const parsed = matter(fs.readFileSync(`source/_drafts/${name}`, 'utf8'));
  const target = `content/drafts/${name.toLowerCase()}`;
  if (!fs.existsSync(target)) fs.writeFileSync(target, `---\n${YAML.stringify({ ...parsed.data, draft: true })}---\n${parsed.content}`);
}
console.log(`Imported ${legacy.posts.length} posts and preserved the unpublished draft.`);
