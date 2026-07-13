# Active Context: Oliver Flint Blog (migrated to Payload CMS)

## Current State

**Status**: ✅ Migrated to Payload CMS v3 (headless CMS) integrated with Next.js 16 (App Router).

The site `oliverflint.co.uk` (a blog about Power Platform, Power Apps, Dynamics 365,
Dataverse and Azure) has been re-platformed onto **Payload CMS v3.86** running inside the
existing Next.js 16 app. Content (10 posts + categories + the "Me" page) was scraped from the
live site and seeded into Payload. The public blog is rendered by Next.js server components
that read from the Payload local API; the Payload admin panel is available at `/admin`.

## Recently Completed

- [x] Re-themed public blog frontend to match live `oliverflint.co.uk` dark "Pacman" Hexo design (bg `#1d1f21`, text `#c9cacc`, green accent `#2bbc8a`, pink `#d480aa`, monospace font, signature underline-gradient links, flex post-list with date meta column, About + Writing sections, footer with copyright + nav)
- [x] Upgraded Next.js 16.1.3 -> 16.2.10 (required by `@payloadcms/next@3.86`)
- [x] Installed Payload v3 deps: `payload`, `@payloadcms/next`, `@payloadcms/richtext-lexical`, `@payloadcms/db-sqlite`, `sharp`, `graphql`
- [x] Created `src/payload.config.ts` (SQLite/libSQL adapter, auto schema push in dev)
- [x] Created collections: `Posts`, `Categories`, `Pages`, `Media`
- [x] Wired Payload admin (`/admin`) + REST/GraphQL API routes (`/api`, `/api/graphql`)
- [x] Built blog frontend (route group `(frontend)`): home, `/posts/[slug]`, `/categories`, `/categories/[slug]`, `/archives`, `/me`
- [x] Added multi-root-layout setup: `(frontend)` + `(payload)` each render their own `<html>`
- [x] Wrote `src/seed.ts` which migrates real content from oliverflint.co.uk (HTML -> Markdown via turndown)
- [x] Ran seed: 10 posts, 5 categories, "Me" page created; DB at `payload.db`
- [x] Verified: home/posts/categories/archives/me render migrated content; `/admin` 200; REST `/api/posts` 200 (public read)
- [x] `bun typecheck`, `bun lint`, `bun build` all pass

## Current Structure

| File/Directory | Purpose |
|----------------|---------|
| `src/payload.config.ts` | Payload config (collections, SQLite adapter, importMap path) |
| `src/collections/*.ts` | Post/Category/Page/Media collections |
| `src/app/(payload)/` | Payload admin UI + REST/GraphQL API routes |
| `src/app/(payload)/admin/importMap.ts` | Auto-generated Payload import map |
| `src/app/(frontend)/` | Public blog (layout + pages) |
| `src/components/` | `SiteHeader`, `SiteFooter`, `PostList`, `Markdown` |
| `src/lib/payload.ts` | `getPayloadClient()` helper |
| `src/lib/format.ts` | Date formatting helpers |
| `src/seed.ts` | Content migration script (`bun seed`) |
| `payload.db` | Local SQLite database (gitignored) |

## Key Decisions

- **Database**: SQLite via `@payloadcms/db-sqlite` (libSQL, prebuilt native — no compile step).
  `DATABASE_URI=file:./payload.db`. Dev auto-pushes schema (`pushDevSchema`).
- **Content field**: Post/Page bodies stored as **Markdown** (`code` field) and rendered with
  `react-markdown` + `remark-gfm`. Chosen for a faithful, low-friction migration of the existing
  Markdown-based blog; the admin edits Markdown directly.
- **Access**: `read` is public on Posts/Categories/Pages (public blog). Create/update/delete
  remain restricted to authenticated users.
- **Routing**: Multi-root layout pattern (no top-level `app/layout.tsx`); `(frontend)` and
  `(payload)` each own an `<html>` root.
- **Admin server functions**: `(payload)/layout.tsx` wraps `handleServerFunctions` in a
  `"use server"` function so it can cross the server -> client boundary.

## Pending / Notes

- [ ] Create the first admin user at `/admin` (first-visit shows create-first-user screen).
- [ ] Production deployments should set a real `PAYLOAD_SECRET` and run `payload migrate` (or
      rely on `prodMigrations`); dev uses auto schema push.
- [ ] Add images/media if desired (Media collection exists; `sharp` installed).

## Session History

| Date | Changes |
|------|---------|
| Initial | Next.js 16 starter template created |
| 2026-07-13 | Migrated site to Payload CMS v3: config, collections, admin/API routes, blog frontend, seed script, seeded 10 posts + categories + Me page |
| 2026-07-13 | Re-styled public blog to match live oliverflint.co.uk dark theme (globals.css rewrite, header/footer/post-list restructure, About + Writing sections) |
