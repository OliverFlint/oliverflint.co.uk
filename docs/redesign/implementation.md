# Workbench implementation

Completed 4 October 2026. The redesign is implemented in this workspace and launched on the existing Netlify site.

- [Live website](https://oliverflint.co.uk/)
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

The redesign launched on 4 October 2026 at [oliverflint.co.uk](https://oliverflint.co.uk/). The existing Netlify site and custom domain were retained.

- Netlify site: `oliverflintcouk`, ID `c786ebee-1d25-437b-87f6-906ec4e25e28`.
- Production Git branch: `source`, connected to `OliverFlint/oliverflint.co.uk` on GitHub.
- Build command: `npm run build`; publish directory: `out`; Node 22.
- Redesign commit: `30c2ccd`; original asset byte preservation: `9070fe9`.
- Production deployment: `6ac2d3fdcb03a200089415d4` ([deployment log](https://app.netlify.com/projects/oliverflintcouk/deploys/6ac2d3fdcb03a200089415d4)).
- Git pushes to `source` now trigger Netlify production builds automatically.
- Production robots rules allow indexing; no preview `noindex` headers are present.

The local production build and migration export checks passed. Live checks covered all 12 article pages, the six principal index pages, all 63 historical page addresses, legacy About/category/article redirects, original ZIP/SVG downloads, RSS identities, sitemap entries, a genuine custom 404 and the www-to-apex redirect. Browser review confirmed the homepage at desktop and 390px mobile widths.

Git attributes preserve downloadable asset bytes across Windows and Netlify's Linux checkout, including line endings in the original SVG and diagram source.

### Rollback

The previous Hexo production deployment is `697a23c219a86c0008937074`. If rollback is required, restore that deploy through Netlify and restore its production branch to `master`, clearing the dashboard build command and publish directory. Pause automatic builds during rollback so a subsequent push cannot immediately replace the restored deploy. The historical `master` branch and Hexo sources remain available.

The [root README](../../README.md) documents development, writing, builds, previews and publishing.
