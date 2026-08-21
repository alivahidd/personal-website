# Mona Moradi — portfolio CMS

A cinematic portfolio site with a protected management workspace. Every public work item shares one project template and is stored in the site-managed Cloudflare D1 database.

## Prerequisites

- Node.js `>=22.13.0`

## Quick start

```bash
npm install
npm run dev
npm run build
```

## What is included

- Public home and dynamic project pages at `/works/[slug]`
- Owner-only portfolio manager at `/admin`
- OpenAI sign-in through the platform-owned sign-in flow
- Server-protected REST endpoints for create, edit, and delete operations
- D1 schema and first-run seed content in `db/` and `drizzle/`

## Managing portfolio entries

Visit `/admin` and sign in with the OpenAI account that owns this Site. The admin check is enforced on the server using the Site-scoped OpenAI user ID, so the UI and the write APIs reject every other signed-in account.

Create a project using a title, lowercase hyphenated slug, type, year, hero image URL, optional YouTube video ID, optional gallery image URLs (one per line), description, credits, and display order. The project appears on the home page and uses the shared template at `/works/<slug>`.

Image fields currently accept public URLs or project-local paths such as `/assets/project-blue-room.png`. This intentionally avoids an upload service until a media-storage choice is made.

## Data and deployment

`.openai/hosting.json` declares the `DB` D1 binding. The initial migration creates the `portfolio_items` table, indexes the display order, protects slugs from duplication, and inserts the original three placeholder projects.

After changing `db/schema.ts`, generate and review a migration before publishing:

```bash
npm run db:generate
npm run build
```

The Sites publish workflow packages and applies pending migrations during deployment. Never hand-edit production records outside `/admin` unless doing a deliberate data migration.

## Configuration placeholders

- **Custom domain:** configure it in the Sites hosting settings, then update `metadataBase` in `app/layout.tsx` to the final HTTPS domain.
- **Media uploads:** [FILL: choose a storage provider, such as Cloudflare R2]. The current CMS stores URLs only.
- **Additional admins:** [FILL: only if explicitly required]. Add Site-scoped OpenAI user IDs to the server allowlist in `app/admin/access.ts`. Do not use an email address alone as an authorization check.
- **Contact information:** [FILL: add a public contact method in `app/page.tsx`].
