# Oliver Flint / Workbench

A personal technical website built with Next.js App Router and TypeScript. Posts are ordinary Markdown and compiled, highlighted and rendered into static HTML during the build. Netlify publishes `out/`; there is no server rendering or Markdown compilation at request time.

## Development

Use Node 22 and npm:

```sh
npm ci
npm run dev
```

`dev` prepares the content before starting Next.js. After changing Markdown, run `npm run content` to regenerate the content manifest; Next.js will pick up its changes. Restart `npm run dev` if adding a new route.

## Build and review

```sh
npm run build
npm run check:export
npm run typecheck
npm run preview
```

The preview server runs at `http://127.0.0.1:3000`, serves the exported HTML, follows legacy aliases and returns a genuine 404 for missing pages. It is a local convenience; Netlify remains the authority for deployment redirect behaviour.

`npm run build:preview` produces a build with `noindex` headers and disallowing robots rules. `npm run build` generates the normal production rules, unless Netlify's `CONTEXT` is `deploy-preview` or `branch-deploy`. Always rebuild for the intended deployment context.

## Writing a post

Create `content/posts/a-new-note.md`:

```yaml
---
title: A new note
slug: a-new-note
published: '2026-10-04T09:00:00Z'
path: /2026/10/04/a-new-note/
description: A short description for metadata and the RSS feed.
summary: A concise sentence for the writing index.
topics: [power-platform]
tags: [PCF, Dataverse]
draft: false
---

Write ordinary Markdown here.
```

Available topics: `power-platform`, `dynamics-typescript`, `azure-devops`. Dates are explicit UTC timestamps and paths are explicit; a timezone change never moves an article. An optional `updated` timestamp should record an actual editorial revision.

For D365 TypeScript series members, add `series: d365-typescript` and `order: 1` (through 6). Do not assign these fields to unrelated posts.

Place assets in `content/assets/a-new-note/` and reference them by filename from the Markdown. The build copies originals to the article's published folder, creates responsive WebP variants, validates references and adds image dimensions. Image descriptions should use real Markdown alt text; inherited filename-based labels are only a fallback for legacy images. ZIP downloads stay byte-for-byte intact.

Place unpublished material in `content/drafts/`, or set `draft: true` in front matter. The production pipeline reads only `content/posts/` and excludes posts explicitly marked as drafts from pages, search, RSS and the sitemap. There is no public draft mode.

## Content compilation

`scripts/prepare-content.mjs` validates metadata with Zod, parses Markdown with remark, sanitises HTML, and highlights code with Shiki. It prepares:

- `.generated/posts.json`: rendered HTML, metadata and contents; imported by Server Components.
- `public/`: assets, responsive images, fonts, sharing cards, RSS and Netlify redirect/header files.
- Static Next.js routes for home, writing, topics, series, About and all articles.

Search matches titles, descriptions, summaries and tags, and runs locally in the browser. It does not query a service. Small browser components provide theme selection and code copying. The reading interface defaults to Workbench's dark palette and remembers a visitor's light/dark choice.

Fonts are self-hosted Inter and JetBrains Mono from the Fontsource packages. They are distributed under the SIL Open Font License; their package licences are copied alongside the published fonts.

## Deployment to Netlify

`netlify.toml` specifies Node 22, `npm run build` and `out` publishing, with the Next.js runtime skipped for the static export. Preserve the existing site's custom domain and Git repository connection. Confirm the production branch before changing continuous deployment: the previous Hexo config pushed generated content to `master`, whereas the development checkout is on `source`.

Local draft deployment after linking to the existing site:

```sh
npx netlify link --git-remote-url https://github.com/OliverFlint/oliverflint.co.uk
npm run build:preview
npx netlify deploy --dir=out --no-build
```

For an agreed production release, run a fresh `npm run build`, then `npm run check:export`, and publish that artifact. Do not publish the noindex preview artifact to production. Record the previous Netlify deploy ID before cutover so it can be restored if necessary. A deployment does not push source changes to Git; continuous deployment needs this source committed and pushed to the configured branch.

## Migration record

`migration/legacy-routes.json`, `legacy-sitemap.xml` and `legacy-rss.xml` capture the existing site. The build preserves original publication timestamps and RSS item GUIDs, historical mixed-case article routes, heading anchors and download paths. Non-article legacy routes map to their new writing/topic/series/About destinations.

`scripts/check-export.mjs` checks the actual output for every imported post and historical page, heading compatibility, unchanged assets, RSS identities, canonical origin, broken local references and draft exclusion.

The original `source/`, `themes/`, `_config.yml`, `scaffolds/` and `_old/` are retained as migration references and do not participate in the Next.js build. The previous ignored generated `public/` output was moved locally to `legacy/hexo-public/`. The one-time `npm run migrate:hexo` importer does not overwrite existing Markdown.

Analytics, comment embeds and the floating donation widget have been replaced by ordinary profile, RSS and support links. The site does not require external scripts for reading.
