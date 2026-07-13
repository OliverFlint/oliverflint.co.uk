import TurndownService from "turndown";
import { getPayload } from "payload";
import config from "./payload.config.ts";

const SITE = "https://oliverflint.co.uk";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

const CATEGORY_DEFS = [
  { title: "Power Platform", slug: "power-platform" },
  { title: "Power Apps", slug: "power-apps" },
  { title: "Dynamics 365", slug: "dynamics-365" },
  { title: "Dataverse", slug: "dataverse" },
  { title: "Azure", slug: "azure" },
];

function categoriesForTitle(title: string): string[] {
  const t = title.toLowerCase();
  const slugs: string[] = [];
  if (t.includes("pcf") || t.includes("power platform component")) {
    slugs.push("power-apps", "power-platform");
  }
  if (t.includes("d365") || t.includes("dynamics")) {
    slugs.push("dynamics-365");
  }
  if (t.includes("dataverse")) {
    slugs.push("dataverse");
  }
  if (t.includes("azure")) {
    slugs.push("azure");
  }
  return Array.from(new Set(slugs));
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function extractArticle(html: string): string {
  const cleaned = stripHtml(html);
  const article = cleaned.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (article) return article[1];
  const main = cleaned.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (main) return main[1];
  const content =
    cleaned.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  if (content) return content[1];
  return cleaned;
}

function decodeEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function extractTitle(html: string, fallback: string): string {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return decodeEntities(h1[1].replace(/<[^>]+>/g, "")).trim();
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title) return decodeEntities(title[1].replace(/<[^>]+>/g, "")).trim();
  return fallback;
}

function slugFromUrl(url: string): string {
  const m = url.match(/\/\d{4}\/\d{2}\/\d{2}\/([^/]+)\/?$/);
  return m ? m[1] : url;
}

function dateFromUrl(url: string): string {
  const m = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  const payload = await getPayload({ config });

  console.log("Seeding categories...");
  const categoryIds: Record<string, number> = {};
  for (const cat of CATEGORY_DEFS) {
    const existing = await payload.find({
      collection: "categories",
      where: { slug: { equals: cat.slug } },
      limit: 1,
    });
    if (existing.docs.length) {
      categoryIds[cat.slug] = existing.docs[0].id as number;
      continue;
    }
    const created = await payload.create({
      collection: "categories",
      data: { title: cat.title, slug: cat.slug },
    });
    categoryIds[cat.slug] = created.id as number;
  }

  console.log("Fetching post list from homepage...");
  const homeRes = await fetch(SITE);
  const homeHtml = await homeRes.text();
  const postUrls = Array.from(
    new Set(
      Array.from(homeHtml.matchAll(/href="(\/\d{4}\/\d{2}\/\d{2}\/[^"?#]+)"/g)).map(
        (m) => SITE + m[1],
      ),
    ),
  );
  console.log(`Found ${postUrls.length} posts`);

  for (const url of postUrls) {
    const slug = slugFromUrl(url);
    const existing = await payload.find({
      collection: "posts",
      where: { slug: { equals: slug } },
      limit: 1,
    });
    if (existing.docs.length) {
      console.log(`  skip (exists): ${slug}`);
      continue;
    }

    const res = await fetch(url);
    const html = await res.text();
    const articleHtml = extractArticle(html);
    const markdown = turndown.turndown(articleHtml).trim();
    const title = extractTitle(html, slug);
    const date = dateFromUrl(url);
    const catSlugs = categoriesForTitle(title);
    const categories = catSlugs
      .map((s) => categoryIds[s])
      .filter((id): id is number => typeof id === "number");

    const created = await payload.create({
      collection: "posts",
      data: {
        title,
        slug,
        date,
        categories,
        author: "Oliver Flint",
        excerpt: markdown.slice(0, 200).replace(/\n+/g, " ").trim(),
        content: markdown,
      },
    });
    console.log(`  created: ${created.title} (${date})`);
  }

  console.log("Migrating the 'Me' page...");
  const meRes = await fetch(`${SITE}/Me/`);
  if (meRes.ok) {
    const meHtml = await meRes.text();
    const meMarkdown = turndown.turndown(extractArticle(meHtml)).trim();
    const rawTitle = extractTitle(meHtml, "Me");
    const meTitle = rawTitle === "A Blog by Oliver Flint" ? "Oliver Flint" : rawTitle;
    const meExisting = await payload.find({
      collection: "pages",
      where: { slug: { equals: "me" } },
      limit: 1,
    });
    if (!meExisting.docs.length) {
      await payload.create({
        collection: "pages",
        data: { title: meTitle, slug: "me", content: meMarkdown },
      });
      console.log(`  created page: ${meTitle}`);
    } else {
      await payload.update({
        collection: "pages",
        id: meExisting.docs[0].id,
        data: { title: meTitle, slug: "me", content: meMarkdown },
      });
      console.log(`  updated page: ${meTitle}`);
    }
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
