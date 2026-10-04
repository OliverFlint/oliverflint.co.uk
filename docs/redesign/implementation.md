# Workbench implementation

Completed 4 October 2026. The redesign is implemented in this workspace and available as a Netlify draft deployment.

- [Review the Workbench preview](https://6ac2d13c5c17f0659154d5bf--oliverflintcouk.netlify.app/)
- [Netlify deployment log](https://app.netlify.com/projects/oliverflintcouk/deploys/6ac2d13c5c17f0659154d5bf)

## Delivered

- Next.js 16.3.8, React 19.3.0 and TypeScript, producing a fully static export.
- Workbench home page, writing/search index, three topic pages, series index, ordered six-part TypeScript guide, About page and a custom 404.
- Dark and light themes, self-hosted Inter and JetBrains Mono, responsive layouts and keyboard focus/skip controls.
- All 12 published posts moved into `content/posts/` as Markdown with validated front matter. The httpBook draft is preserved in `content/drafts/` and excluded from published output.
- Post HTML, Shiki code highlighting and article contents compiled at build time. Small browser components handle search/filtering, code copying and theme choice.
- Original Markdown bodies retained. Concise listing summaries added separately from original descriptions.
- Publication dates, legacy heading IDs, old mixed-case article paths and RSS item GUIDs preserved.
- 31 PNGs, one SVG, six ZIP files and one diagram source preserved. Images have dimensions, lazy loading and responsive WebP variants where useful; downloads retain their original bytes.
- Canonical URLs, metadata, structured article data, RSS, sitemap, robots and individual sharing images generated.
- Netlify configuration publishes `out/`. The draft build has `noindex` response headers and robots exclusion.
- Historical About, category, tag, archive and series routes map to their new destinations.
- Original Hexo source/theme directories retained as references outside the active Next.js build. The previous ignored generated output is locally archived under `legacy/hexo-public/`.

## Validation

Both production and preview builds completed successfully. The final preview build also passed TypeScript and `npm run check:export`.

The export check reconciled every imported post and all 63 historical page addresses, tested original heading IDs, compared asset bytes, verified RSS identities and sitemap canonicals, checked local output references and confirmed that unpublished draft text is absent.

Browser review covered desktop and 390px mobile layouts, the dark and light themes, writing search, code copying and article heading navigation. The inspected mobile article had no page-level horizontal overflow; wide tables scroll within their own area. The selected text colours have calculated contrast ratios of at least 4.82:1 against their page backgrounds. This is not a claim of a complete accessibility certification or a measured Core Web Vitals result.

Direct checks against the actual Netlify draft confirmed:

| Request | Result |
| --- | --- |
| Home and writing index | HTTP 200 |
| `/Me/` | HTTP 301 to `/about/` |
| Legacy D365 TypeScript category | HTTP 301 to the ordered series |
| Mixed-case PCF WebApi article | HTTP 301 to its canonical lower-case path |
| Legacy ZIP download | HTTP 200, `application/zip` |
| Legacy SVG diagram | HTTP 200, `image/svg+xml` |
| Unknown page | HTTP 404 with the custom page |
| RSS | HTTP 200, XML |
| Robots | Disallows preview indexing |

## Typography revision

Small labels and metadata now use at least 13px. Navigation, card summaries, code and article contents are larger; article prose is 18px on desktop and 17px on mobile. Spacing and wrapping were adjusted for the larger text. The preview build completed successfully and the home and article layouts were reviewed at desktop and 390px mobile widths.

## Production cutover

The existing Netlify site is `oliverflintcouk`, ID `c786ebee-1d25-437b-87f6-906ec4e25e28`, with custom domain `oliverflint.co.uk`. Its configured production branch is currently **master**, and its build command/publish directory are unset in the dashboard. This checkout is on **source**. Source changes have not been committed or pushed by this task.

The draft deployment is `6ac2d13c5c17f0659154d5bf`. The previous production deployment recorded for rollback is `697a23c219a86c0008937074`. Production was not replaced.

After reviewing the redesign:

1. Commit and push the migration source to the intended branch.
2. For continuous deployment, point the existing Netlify site's production branch at the migrated source (recommended: `source`) so the committed `netlify.toml` controls builds.
3. Run a fresh production build (`npm run build`) and `npm run check:export`; production robots rules must allow indexing. Never promote the noindex preview artifact directly.
4. Publish the production artifact, preserve the custom domain and verify the key legacy routes/downloads on that domain.
5. Monitor route errors and feed delivery. Restore deploy `697a23c219a86c0008937074` and the previous build/branch configuration if rollback is needed.

The [root README](../../README.md) documents development, writing, builds, previews and publishing.
