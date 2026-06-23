# ATM Lab Website

The public website and content-management system for the **Advanced Thermal Management Laboratory** at Ajou University. It serves the lab's research, people, publications, and news to visitors, and gives the lab's students a password-protected admin UI to edit all of that content directly — no redeploy needed, since pages render per request from a Postgres database.

The lab studies two-phase cooling, battery thermal management, phase-change materials, and heat pump systems. The site replaces a legacy GNUBOARD installation; a one-shot migration script (`db:migrate-gnuboard`) imports the old data.

## Tech stack

| Area            | Choice                                                                                              |
|-----------------|-----------------------------------------------------------------------------------------------------|
| Framework       | Next.js 14.2.35 (App Router, React 18, server components + Server Actions)                          |
| Language        | TypeScript 5                                                                                        |
| Database        | PostgreSQL via Prisma 7.8, using the `@prisma/adapter-pg` driver adapter over `pg` 8.20             |
| Auth            | Auth.js / NextAuth v5 (beta), Credentials provider, JWT sessions (no DB session adapter)            |
| Passwords / 2FA | `bcryptjs` for hashing, `otpauth` + `qrcode` for TOTP two-factor                                    |
| Styling         | Tailwind CSS 3.4 (Ajou brand tokens in `tailwind.config.ts`)                                        |
| Rich text       | Tiptap 3 (`starter-kit`, image, text-align, text-style), sanitized server-side with `sanitize-html` |
| Images          | `sharp` for upload resizing + thumbnail generation                                                  |
| Validation      | `zod`                                                                                               |
| Fonts           | Pretendard (self-hosted Latin subset) + JetBrains Mono, via `next/font`                             |


### Data model (`prisma/schema.prisma`)

`Member` (professor / researcher / student / alumni, with professor-only JSON fields for education, work history, research fields, and lectures), `Project`, `Publication` (journal / conference / patent), `Lecture`, `News`, `GalleryItem`, and the research hierarchy `ResearchTopic → ResearchSubsection → ResearchFigure` plus a singleton `ResearchPageMeta`. Auth/ops tables: `User`, `AuditLog`, `LoginAttempt`. Most content models carry `published` and `order` fields for visibility and manual sorting.

## Features

### Public site (`app/(pages)`)
- **Home** (`app/page.tsx`) — aggregates research topics, projects, members, latest news, gallery, lectures, and recent publications (tabbed by type) in one query batch.
- **Research** — topics with nested subsections and captioned figures; hero copy and a "years active" stat driven by the `ResearchPageMeta` singleton.
- **Members** — professor profile plus researchers, students, and alumni grouped by role.
- **Publications** — journals, conferences, and patents, with per-item detail pages (`publications/[id]`).
- **Projects**, **Lectures**, and a **Board** with News and Gallery sections, each with detail pages (`board/news/[id]`, `board/gallery/[id]`).
- SEO/meta: per-page metadata, `sitemap.ts`, `robots.ts`; the Vercel demo deploy emits `noindex` so only the school deploy is indexed.

### Admin CMS (`app/admin`)
- Full CRUD over every content model, each backed by a typed Server Action (`actions.ts` per section) with Zod validation.
- **Rich text editor** (Tiptap) for news/lecture content; HTML is sanitized server-side before storage.
- **Image uploads** — `ImageUploadField` posts images (≤5 MB multipart, body limit raised to 6 MB in `next.config.mjs`); `sharp` generates thumbnails. Uploaded files land in `public/uploads` (gitignored) and are swept/cleaned by helper scripts.
- **Research management** — nested editing of topics → subsections → figures, plus a page-meta editor.
- **Security page** (`app/admin/security`) — enroll/disable TOTP 2FA via QR code.
- **Activity log** (`app/admin/activity`) — browsable audit trail of admin actions.

### Auth & security
- Single shared `ADMIN` account model (students share one login; per-person accounts aren't used). Bootstrap via the `db:seed-admin` script — there is no public signup.
- Credentials login with optional TOTP second factor; validation logic is centralized in `lib/auth/authenticate.ts` and reused by both the login Server Action and the Auth.js `authorize()` boundary.
- **IP rate limiting**: 5 failed attempts per 15-minute window (`LoginAttempt` table) blocks further attempts before bcrypt runs.
- **Audit logging**: login/logout and content mutations recorded to `AuditLog`.
- **Edge guard** (`middleware.ts`): optimistically redirects cookie-less `/admin` requests to `/login` to prevent content flash; the authoritative check is `requireAdmin()` per page.
- **CSP**: per-request nonce + `strict-dynamic` in production (relaxed for Turbopack HMR in dev), set in middleware; `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and HSTS set in `next.config.mjs`.

### Deployment
Dual deploy from the same codebase: a **Vercel** demo (seed data, `noindex`) and the **school server** (`atmlab.ajou.ac.kr`) running `next start` behind Nginx with TLS terminated at the proxy. On the school server, set `AUTH_URL=https://atmlab.ajou.ac.kr` so Auth.js treats requests as HTTPS (Secure cookies + trustHost behind the proxy).

## Running locally

Requires Node.js (developed on v24) and a PostgreSQL database.

1. **Install dependencies** (the `postinstall` hook runs `prisma generate`, which emits the client to `app/generated/prisma`):
   ```bash
   npm install
   ```

2. **Configure environment.** Create `.env.local`:
   ```bash
   DATABASE_URL=postgresql://user:pass@localhost:5432/atm_lab
   AUTH_SECRET=<random string, e.g. `openssl rand -base64 32`>
   # AUTH_URL=http://localhost:3000   # only needed when not auto-detected
   ```

3. **Apply migrations:**
   ```bash
   npx prisma migrate deploy   # or `npx prisma migrate dev` while developing
   ```

4. **Create the admin account:**
   ```bash
   SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='<strong password>' npm run db:seed-admin
   ```
   The script enforces a password-strength policy and refuses to overwrite an existing account unless `SEED_ADMIN_FORCE=1` is set.

5. **(Optional) Seed content** — research topics, professor profile, or import legacy data:
   ```bash
   npm run db:seed-research
   npm run db:seed-professor
   npm run db:migrate-gnuboard   # needs GNUBOARD_SQL_PATH set in .env.local
   ```

6. **Run the dev server:**
   ```bash
   npm run dev        # Next.js + Turbopack, http://localhost:3000
   ```
   The admin UI lives at `/admin` (redirects to `/login` when signed out).

### Other scripts

| Script                                                           | Purpose                                        |
|------------------------------------------------------------------|------------------------------------------------|
| `npm run build` / `npm run start`                                | Production build / serve                       |
| `npm run lint`                                                   | ESLint (`next lint`)                           |
| `npm run build-thumbnails`                                       | Regenerate image thumbnails                    |
| `npm run sweep-uploads`                                          | Remove orphaned files from `public/uploads`    |
| `npm run db:fetch-legacy-images` / `db:fetch-publication-images` | Pull images from the legacy site               |
| `npm run db:map-research-figures`                                | Attach fetched figures to research subsections |
| `npm run db:localize-news-images` / `db:clean-news-styles`       | Normalize migrated news HTML                   |
