import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const usage = 'Usage: npm run new:post -- "Post title" [YYYY-MM-DD]';

function localDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function slugify(title, date) {
  const slug = title.normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return slug || `post-${date}`;
}

function parseDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  return !Number.isNaN(Date.parse(`${date}T00:00:00.000Z`))
    && new Date(`${date}T00:00:00.000Z`).toISOString().slice(0, 10) === date;
}

const args = process.argv.slice(2);
if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
  console.log(`${usage}\nCreates a draft post and its matching content/assets/<slug>/ folder. The date defaults to your local calendar date.`);
  process.exit(0);
}

const title = args[0]?.trim();
const date = args[1] ?? localDate();
if (!title || args.length > 2) {
  console.error(usage);
  process.exit(1);
}
if (!parseDate(date)) {
  console.error(`Invalid date "${date}". Use a real calendar date in YYYY-MM-DD format.\n${usage}`);
  process.exit(1);
}

const slug = slugify(title, date);
const postPath = path.join(projectRoot, 'content', 'posts', `${slug}.md`);
const assetsPath = path.join(projectRoot, 'content', 'assets', slug);
const urlPath = `/${date.replaceAll('-', '/')}/${slug}/`;
const markdown = [
  '---',
  `title: ${JSON.stringify(title)}`,
  `slug: ${slug}`,
  `published: '${date}T09:00:00.000Z'`,
  `path: ${urlPath}`,
  'description: "TODO: Add a short description for search and the RSS feed."',
  'summary: "TODO: Add a concise summary for article listings."',
  'topics: []',
  'tags: []',
  'draft: true',
  '---',
  '',
  'Write the article in Markdown.',
  '',
  `<!-- Place images and downloads in content/assets/${slug}/ and reference them by filename. -->`,
  '',
].join('\n');

let createdAssetsFolder = false;
let createdPostFile = false;
let postHandle;
try {
  await fs.mkdir(assetsPath);
  createdAssetsFolder = true;
  postHandle = await fs.open(postPath, 'wx');
  createdPostFile = true;
  await postHandle.writeFile(markdown, 'utf8');
  await postHandle.close();
  postHandle = undefined;
} catch (error) {
  if (postHandle) await postHandle.close().catch(() => {});
  if (createdPostFile) await fs.rm(postPath, { force: true });
  if (createdAssetsFolder) await fs.rmdir(assetsPath).catch(() => {});
  if (error.code === 'EEXIST') {
    console.error(`A post or assets folder already exists for "${slug}"; nothing was overwritten.`);
  } else {
    console.error(`Could not create the post: ${error.message}`);
  }
  process.exit(1);
}

console.log(`Created ${path.relative(projectRoot, postPath)}`);
console.log(`Created ${path.relative(projectRoot, assetsPath)}\n`);
console.log('The post is marked as a draft. Add its description, summary, topics and tags before publishing.');
