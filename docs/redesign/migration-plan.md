# Website redesign and migration proposal

Reviewed 4 October 2026. Status: Workbench implemented and deployed to a Netlify draft preview. See `implementation.md` for results and the production cutover checklist.

## Selected direction

Use **Concept 2: Workbench**, selected by the user. Build a personal technical blog with a dark navy background, mint accents, proportional reading typography and monospace code and metadata. Give the home page a clear technical introduction, one featured article, topic discovery, an ordered series entry point and compact writing rows. Use the same visible brand and navigation throughout the site.

The first implementation should prioritise the existing writing and six-part series. Refine the writing index, topic pages and long article template around Workbench, including readable code blocks, copy controls, tables, screenshots, downloads and a visible table of contents. Use the light reading theme as an alternative; Workbench's dark treatment is the default visual direction.

Build with Next.js App Router and TypeScript. Author posts in ordinary Markdown with YAML front matter. Compile every published post and its supporting pages during `next build`; deploy a static export to Netlify. Keep the original publication dates and existing dated article paths for the first release. This gives the redesign room to change the presentation without making every indexed article depend on a redirect.

Open `concepts.html` alongside this document to compare three visual directions. The homepage and article previews are design studies with illustrative copy, rather than a functioning implementation.

## Current state

### Content and structure

| Area | Observed state | Design or migration implication |
| --- | --- | --- |
| Framework | Hexo 8.1.1; custom `cactus-of` theme using EJS, Stylus and jQuery | Replace templates and theme scripts with Next.js layouts and components |
| Published content | 12 Markdown posts, dated March 2020 to January 2026 | Small enough to reconcile every post individually |
| Drafts | One separate httpBook/Dataverse draft, without a front matter publication date | Preserve as a draft and exclude from production HTML, feeds, sitemap and search |
| Series | Six D365 TypeScript articles; a series landing page | Make series an explicit content relationship with ordered previous/next links |
| Pages | Home, categories, archive, Me, D365 TypeScript | Introduce clearer Writing, Topics, Series and About navigation |
| Assets | 31 PNGs, one SVG, six ZIP downloads and one diagram source file beside posts | Preserve downloads and exact asset filename case; migrate images deliberately |
| Discovery | Latest ten posts on home; older entries accessible through archive | Provide an obvious all-writing route and series/topic discovery |
| Categories | Nested category paths; PCF content appears under more than one parent | Consolidate reader-facing topics while retaining legacy category aliases |
| Hosting | Live sitemap and RSS requests return HTTP 200 with `Server: Netlify` | Inspect the existing Netlify site's Git connection and build settings before creating anything new |
| Deployment config | Hexo deploy script pushes generated content to GitHub `master`; no `netlify.toml` found | Establish which branch Netlify builds; replace the generated-content publishing workflow |

The workspace was clean at the start of the review. `public/` is ignored generated output; `_old/` contains an earlier Bootstrap site. Neither is the new application's content source.

### Visual and usability assessment

- The dark charcoal background, turquoise accents and monospaced typography give the current site a recognisable developer character.
- The home page is largely a chronological list. Long excerpts compete with titles, while series and subject expertise are harder to discover.
- Excerpt text is visibly subdued against the background. The redesign should use stronger text contrast and verify it against WCAG AA.
- Monospace throughout makes lengthy prose and long article titles harder to scan. Use a proportional reading face; retain monospace for code and selected metadata.
- Articles already have useful code copying and a table of contents. Preserve these capabilities with a clearer hierarchy and consistent site identity.
- The article header uses compact utility navigation at the edge of the screen instead of the prominent brand header used elsewhere.
- Category pages expose the taxonomy as nested lists, with little explanation of the subjects or suggested starting points.
- The About page is a short list of personal facts. It can explain Oliver's experience and link directly to writing and series, using copy Oliver has confirmed.
- The floating Ko-fi overlay attracts attention on reading pages. A quieter Support link in the footer is the proposed alternative.
- Social links are font icons whose accessible names appear as glyphs in the browser accessibility tree. Use visible names or explicit accessible labels.

This is a visual, content and source review. No performance benchmark, full accessibility audit or technical accuracy review of old articles has been performed.

### Technical details to address

1. **Canonical domain:** `_config.yml` uses `http://www.oliverflint.co.uk/`. The generated home Open Graph URL, live sitemap and RSS use that origin. Standardise metadata and new sitemap links to `https://oliverflint.co.uk/`; handle host and HTTPS redirects through Netlify.
2. **Dates versus paths:** PCF WebApi execute is dated 10 June 2020 in front matter and displayed metadata, but its existing path is `/2020/06/11/PCF-WebApi-execute/`. Treat publication date and published path as separate fields. Do not derive old URLs by formatting dates again.
3. **URL casing:** Mixed-case paths are present in the sitemap and internal links; the live article and Me navigations observed redirect to lower-case URLs. Inventory both forms and the platform's normalisation behaviour. Avoid redirects that point back to their own normalised URL.
4. **Anchors:** Existing headings have IDs such as `Results-amp-Conclusion` and `Type-Declarations-for-the-D365-x2F-XRM-Client-API`. New slugging rules can break bookmarked fragments even if page paths survive. Retain old IDs or add invisible alias anchors to the corresponding headings. Fragments are handled in the page, not in server redirects.
5. **Asset rewriting:** Markdown uses relative PNG and ZIP links. One post also uses raw HTML `<img src="custom-events.svg" ...>`. Handle HTML attributes as well as Markdown image/link nodes.
6. **Dates of updates:** Hexo uses filesystem modification time for updates. Do not turn the migration date into a claimed editorial update. Use an explicit `updated` field only when a post is substantively revised.
7. **RSS:** Preserve `/rss.xml`, and preserve existing item GUIDs when changing feed link origins so readers do not receive the archive as new posts.
8. **Analytics and comments:** The theme includes a `UA-...` analytics identifier and Disqus configuration. Decide whether analytics and comments are still wanted. Do not assume the old analytics tag provides useful current tracking or that comments are absent because an embed is not visible.
9. **Zoom:** The theme's viewport tag contains `maximum-scale=1`; omit that restriction in the new layout.

## Three design concepts

### 1. Fieldnotes — alternative

**Character:** calm, personal, editorial. A technical journal that is comfortable to read for twenty minutes.

- Palette: warm paper `#F4F1E9`, deep ink `#202820`, forest green `#285D49`, muted rules `#D7D9CE`.
- Type: expressive serif headings, proportional sans-serif navigation and prose, monospace code. The study uses Georgia and system fonts; self-host any chosen production fonts.
- Identity: Oliver Flint as the brand; a small OF mark and restrained section numbering.
- Home: short introduction → featured article → browse topics → series spotlight → recent writing → brief About link.
- Article: large title and short summary, spacious reading column, desktop contents rail, excellent code blocks, inline mobile contents and series navigation.
- Mobile: stack featured content and series; remove decorative numbering when it crowds the title; keep navigation visible and allow it to wrap.
- Best fit: personal blog, long technical explanations, a recognisable identity without needing imagery for every post.
- Tradeoff: less immediately associated with a software tool; technical credibility comes from the content and code presentation.

### 2. Workbench — selected

**Character:** precise, modern, technical. A home for practical development notes and reference material.

- Palette: near-black navy `#111A22`, slate panels `#19252F`, pale text `#E4EBF1`, mint `#8CE0BC`.
- Type: proportional sans-serif titles and prose; monospace labels and code.
- Identity: a compact wordmark, restrained grid, file-like labels without simulated terminal effects.
- Home: clear technical introduction → featured note → topic filters → compact writing rows → learning paths.
- Article: topic breadcrumb, version/context callout, visible contents, strong syntax highlighting, copy controls and downloadable samples.
- Mobile: filters wrap, writing rows become a single column, contents use an accessible disclosure.
- Best fit: repeat developer visitors looking for a specific API, code sample or debugging solution.
- Tradeoff: needs disciplined spacing and colour use to prevent the dark interface becoming dense or generic.

### 3. Profile & Practice

**Character:** confident, professional and personal. A profile site where technical writing demonstrates experience.

- Palette: white `#FFFFFF`, midnight blue `#172A43`, cobalt `#3558E8`, pale blue `#EDF2FA`.
- Type: large sans-serif headings, readable sans-serif prose, monospace code.
- Identity: Oliver's name, a simple geometric OF mark, large typography and generous whitespace.
- Home: professional introduction → selected writing → technical series → background and external profiles.
- Article: clean editorial template with blue accents; modest author context after the article.
- Mobile: the profile introduction and featured article stack; large type scales down; all essential links remain visible.
- Best fit: if the site should also support professional introductions or future consulting enquiries.
- Tradeoff: requires more current biography copy. Add projects or case studies only when there is real material to publish.

Shared principles: light/dark reading themes in production, 65–75 character prose width, 18px starting body size, accessible contrast and focus states, reduced-motion support, no decorative hero photos required, no invented credentials or projects.

## Proposed information architecture

| New route | Purpose | Existing routes |
| --- | --- | --- |
| `/` | Personal introduction and curated writing | Retain root |
| `/blog/` | All writing, chronological; lightweight topic filtering/search | Retain or redirect `/archives/` and its date/pagination paths deliberately |
| `/topics/` and `/topics/[slug]/` | Explain subjects and list matching posts | Map `/categories/`, nested categories and `/tags/.../` to appropriate destinations |
| `/series/` | Available learning series | New index |
| `/series/d365-typescript/` | Ordered six-part guide | Alias `/D365-Typescript/`, its `index.html` form and normalised form |
| `/about/` | Biography and external profile links | Alias `/Me/`, `/me/`, and `index.html` forms |
| `/[year]/[month]/[day]/[slug]/` | Existing article addresses | Preserve manifest paths and their live normalised equivalents |
| `/rss.xml`, `/sitemap.xml`, `/robots.txt` | Feed and discovery | Preserve feed endpoint; replace generated metadata |
| 404 page | Useful recovery links | Genuine HTTP 404 on Netlify |

Start with Power Platform/PCF, Dynamics 365/TypeScript and Azure/DevOps as the main reader-facing groups. Keep tags for specific technologies. Treat D365 TypeScript as a series, not only as a topic. Avoid separate empty landing pages for every word in the existing description.

## Content and build architecture

Proposed layout:

```text
app/                       # App Router layouts and statically generated routes
components/                # Header, post list, article, series, contents, code
content/posts/*.md         # Ordinary Markdown; no JSX required
content/drafts/*.md         # Private to production builds
content/pages/             # About and series introduction copy
content/series/             # Series metadata and ordered membership
lib/content/               # Front matter validation and Markdown compilation
scripts/                   # Import, assets, search, feed and route generation
public/                    # Curated source assets, replacing Hexo generated output
migration/legacy-routes.json # Frozen URL, anchor, feed identity and asset mapping
netlify.toml
```

Example post front matter:

```yaml
---
title: PCF WebApi execute
slug: pcf-webapi-execute
published: '2020-06-10T23:05:42Z'
path: /2020/06/11/pcf-webapi-execute/
description: Calling execute from a Power Apps component.
topics: [power-platform]
tags: [pcf, dataverse, web-api]
draft: false
# series: d365-typescript  # Only for actual members
# order: 1
# updated: '2026-10-04'    # Only after an editorial revision
---
```

The example description is proposed copy. The final `path` must come from the frozen live route mapping, including explicit aliases for historic mixed-case forms.

Pipeline:

1. Read Markdown and YAML front matter from the filesystem at build time.
2. Validate with a schema: required metadata, unique paths, valid dates, topic references, unique series order and resolvable assets. Fail the build on errors.
3. Use a unified/remark/rehype pipeline for Markdown, GitHub-style tables, heading IDs, contents and HTML rendering. Use Shiki for syntax highlighting during the build. Normalize language aliases such as `TypeScript` before highlighting.
4. Convert the existing raw SVG image tag to ordinary Markdown, or explicitly parse and sanitise supported HTML. Rewrite local assets and preserve old heading IDs or alias anchors before generating the HTML.
5. Use `generateStaticParams()` for every article, topic and series route. Render content in Server Components during the build. No Markdown parser or syntax highlighter ships to the browser.
6. Generate RSS, sitemap, a small search index and static Open Graph images from the same published manifest. For this archive, a lazy-loaded JSON title/description/tag search is sufficient; include body text if full-text discovery proves necessary.
7. Emit static HTML/CSS/JS using `output: 'export'` and `trailingSlash: true`. Browser JavaScript is limited to theme selection, search/filtering, code copying and optional image enlargement.

Use explicit publication timestamps; quote date-only strings in YAML and apply one documented interpretation for sorting. Do not let the developer machine's timezone recalculate published paths.

### Netlify configuration

For the proposed fully static mode:

```js
// next.config.ts — illustrative initial settings
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
```

```toml
# netlify.toml — illustrative; reconcile with existing dashboard settings
[build]
  command = "npm run build"
  publish = "out"
```

`npm run build` should perform content preparation and `next build`. Use the current supported stable Next.js/React combination and an actively supported Node LTS compatible with both Next.js and Netlify at implementation time; record the versions and commit the lockfile.

The default Next.js image optimisation service does not work with a static export. Initially generate responsive image variants during the build and use native `img`/`picture` markup with dimensions and lazy loading. Use `next/image` with `unoptimized` only for images that are already processed. An Image CDN loader can be introduced later if needed.

Static export redirects and headers belong in Netlify configuration or generated `_redirects`/`_headers` files copied into `out/`. Do not add a blanket SPA rewrite to the home page. Check Netlify's framework detection and any existing runtime plugin configuration; the export deployment must publish `out/` and need no page-rendering functions.

Next.js also supports build-time prerendering through Netlify's OpenNext adapter with `.next` publishing. That is a valid future option for server features, but the proposed release uses the simpler export contract. Do not mix the `.next` adapter settings with an `out/` export.

### Content workflow

Create a Markdown file → add front matter and assets → preview locally → commit/push → Netlify deploy preview → publish through the production branch. Any published content change triggers a build. Draft content stays excluded from every production output; optionally include it in an explicitly restricted local preview mode. Avoid sending unpublished drafts to public deploy previews by default.

## Migration stages and acceptance gates

### 1. Freeze and inventory — approximately half to one day

- Create a migration branch; record the current commit and deployed site identifier.
- Capture the live sitemap, RSS GUIDs, article URLs, final URLs, HTML heading IDs, archive/category/tag routes and all downloadable asset addresses.
- Reconcile those records with the 12 post files, generated output and one draft. Audit live references, rather than assuming generated output always matches production.
- Record internal links, `index.html` aliases and mixed-case variants. Build a route/asset manifest before changing names or dates.
- Inspect Netlify's repository, base directory, production branch, redirects, domain aliases and environment settings. The workspace alone does not establish that configuration.

Gate: every published post and reader-facing asset has a destination; the draft is explicitly marked unpublished.

### 2. Select and detail the design — approximately one to two days

- Refine the selected Workbench concept across home, writing index, series and article templates.
- Agree actual biography text, light/dark treatments and typography.
- Resolve comments, analytics and Support-link treatment. Default recommendation: a simple support link and no analytics/comments scripts until their purpose is confirmed.
- Define responsive states, focus treatment, heading scale and code/table presentation.

Gate: a complete visual direction including a long article, tables, code, images and mobile navigation.

### 3. Build the foundation and content pipeline — approximately one to two days

- Set up Next.js, TypeScript, static export and the production font/style system.
- Implement metadata validation, Markdown compilation, heading compatibility, code highlighting and asset processing.
- Build shared header/footer, article components, contents and code copying.
- Generate one representative long post, one SVG post and the current ESBuild article.

Gate: posts appear in exported HTML with working assets, tables, code and legacy fragments; unknown routes remain absent.

### 4. Import the archive and build discovery — approximately one to two days

- Import all 12 posts without rewriting their technical arguments; keep the Welcome post address even if it is not featured.
- Preserve six ZIP downloads and old asset endpoints. Either keep assets under dated post folders or generate explicit aliases to new `/media/` paths; do not redirect ZIP/image requests to an article page.
- Add summaries where absent, review missing alt text and attach series metadata.
- Build writing, topic, series, About and 404 pages; add related posts and ordered series navigation.
- Produce feed, sitemap, robots, sharing images and route aliases from the manifest.

Gate: content and asset totals reconcile, the draft is absent, and all legacy routes have intentional outcomes.

### 5. Deploy preview and release review — approximately one day

- Deploy a preview from the migration branch through the existing Netlify site or an isolated staging site.
- Review desktop/mobile layouts, keyboard use, zoom, contrast and reduced motion. Check long titles, wide tables, screenshots and overflowing code.
- Validate redirects, real 404 status, image/download responses, case-sensitive paths and fragment navigation on Netlify.
- Check HTML metadata, canonical URLs, structured data, RSS identities and sitemap entries. Keep previews unindexed using context-specific robots headers; confirm production remains indexable.
- Measure page speed on representative pages. Aim for good Core Web Vitals and minimal interaction code; establish measured results before claiming them.

Gate: a reviewable deployment with no unexplained missing content, broken local references or route regressions.

### 6. Cutover and observe — approximately half a day, then monitoring

- Tag the last Hexo release and record its Netlify deploy ID before replacing the production branch/build settings.
- If using the existing Netlify site, switch its build workflow and release the approved build while retaining its custom domain. If using a new site, prepare the domain/HTTPS cutover separately.
- Monitor 404s, redirect loops, feed delivery and search indexing. Update the sitemap registration if applicable.
- Roll back immediately to the previous Netlify deploy if critical route/content problems emerge; restore the old branch/build settings as well so future builds do not undo the rollback.
- Retire Hexo dependencies, scaffolds and theme sources from the active build after the new release is stable. Git history retains the previous implementation.

Overall planning allowance: **roughly 6–10 working days**, depending on copy changes, design revisions and deployment access. This is a scope estimate, not a delivery commitment.

## Release criteria

- All 12 existing posts accessible, with original publication dates and compatible legacy page/fragment URLs.
- All 31 PNGs, one SVG and six ZIP downloads accounted for; unused assets retained in the migration record until disposition is clear.
- The single draft excluded from HTML, metadata listings, RSS, sitemap and search.
- Six-part series navigation follows editorial order rather than date sorting.
- Every page has a clear title, readable layout, accessible navigation and correct canonical origin.
- Article text, highlighted code and contents generated at build time.
- `/rss.xml` works and preserves item identity; sitemap lists only canonical published pages.
- Production Netlify build publishes `out/`, changed URLs have explicit permanent mappings and unknown URLs return a real 404.
- Preview indexing controls do not leak into production.
- A documented publishing workflow and a recorded rollback deployment.

## Decisions for the next step

Workbench is selected. Proceed with detailed layouts for the personal technical blog and its existing archive. Biography, comments and analytics decisions can be resolved while the layout is developed. Professional services or case studies can be added later when there is confirmed copy and material to publish.

## Evidence and references

- [Live home](https://oliverflint.co.uk/), [categories](https://oliverflint.co.uk/categories/), [archive](https://oliverflint.co.uk/archives/), [About](https://oliverflint.co.uk/me/) and [ESBuild article](https://oliverflint.co.uk/2026/01/28/power-platform-component-framework-esbuild/): content and desktop layout reviewed in browser.
- [Live sitemap](https://oliverflint.co.uk/sitemap.xml) and [RSS](https://oliverflint.co.uk/rss.xml): fetched directly, both HTTP 200; origin/path details above reflect those responses.
- Workspace: `package.json`, `_config.yml`, `themes/cactus-of/`, `source/_posts/`, `source/_drafts/`, `source/Me/`, `source/D365-Typescript/`, and existing `public/` output.
- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports): build-time Server Components, `output: 'export'`, static path generation, export limitations and image handling.
- [Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/): OpenNext support and the alternative adapter deployment mode.

Third-party page-fetch failures for XML were not treated as site outages; direct HTTP retrieval confirmed the feed and sitemap are available.
