# Admin / CMS Scope

**Date:** 2026-05-05
**Source:** [P2 spec §9](../superpowers/specs/2026-05-05-dentisthsu-phase-2-ia-content-strategy.md#9-admin--cms-scope-locked)

The CMS demo is the closer move that differentiates our pitch from agencies pushing static templates. This doc nails down exactly what the dentist will see during the meeting.

## Pitch demo scope

### Editable content

**`blog_posts` only.** Everything else is code-versioned (MDX) or curated JSON. Justification:

- Blog posts are the part of the site Dr. Hsu most realistically will touch — he already writes long-form posts on technology adoption.
- Editing services, doctor bios, technology copy daily isn't a real need; those change quarterly at most.
- Building a full CMS for every content type triples the build time for ~5% more pitch impact.
- We *show* him a working blog editor; we *tell* him "v2 extends this to services / doctors / etc."

### Routes

| Route | Purpose |
|---|---|
| `/admin/login` | Supabase Auth (email + password) |
| `/admin/dashboard` | Recent appointment requests + post list. Read-only on requests. |
| `/admin/posts` | Post list (drafts + published) |
| `/admin/posts/new` | New post — Tiptap rich-text editor |
| `/admin/posts/[id]` | Edit existing post |

### Auth

- **Single account** for the demo — Dr. Brien Hsu.
- **Email + password** via Supabase Auth.
- We hand him the credentials during the meeting (printed on a card in the leave-behind PDF).
- No multi-user, no roles. Deferred to v2.

### Editor stack

- **Tiptap** (React rich-text editor).
- Stores content as MDX-compatible markdown in `BlogPost.bodyMdx`.
- Supports: bold, italic, headings (H2/H3), lists, blockquotes, links, images (uploaded to Supabase Storage), code blocks (probably not used but free).
- Preview pane shows the rendered post side-by-side.

### Workflow

1. Dentist logs in at `/admin/login`.
2. Lands on `/admin/dashboard`.
3. Clicks "New Post" → `/admin/posts/new`.
4. Types title, picks featured image from media library, types body in Tiptap.
5. Hits "Publish" → Server Action writes to Supabase + sets `status='published'` and `publishedAt=now()` + calls `revalidateTag('blog')`.
6. Within ~5 seconds the post appears at `/blog` (index revalidates) and at `/blog/<slug>` (post revalidates).
7. Dentist clicks the dashboard's "View site" link in a new tab and sees his published post live.

This is the **closer moment** — published-to-public in seconds, watched live during the meeting.

### Media library

- Uploads go to Supabase Storage.
- URLs inserted directly into post body via Tiptap's image node.
- Per [`content/schemas.ts`](../../content/schemas.ts) `MediaAsset` type.
- Image optimization (AVIF/WebP) handled at render time by `next/image`.

### Dashboard

`/admin/dashboard` shows:

1. **Recent appointment requests** (latest 10) — name, phone, preferred time, status. Read-only.
2. **Recent posts** (latest 5) — title, status, published date, edit link.

That's it. No analytics, no traffic graphs, no inbox. The dashboard's job is "you can see what your site is doing without leaving the admin."

## Explicitly out of scope (deferred to v2)

- ❌ Editing services, doctors, technology, reviews
- ❌ Multi-user / role-based access (associate dentists getting their own logins)
- ❌ Approval workflows / review-before-publish
- ❌ Real-time collaborative editing
- ❌ Post scheduling / future-dated publish
- ❌ Comment moderation
- ❌ Per-post analytics / view counts
- ❌ Email notifications when appointments are submitted (the form already emails — no admin notif needed)
- ❌ Global content search
- ❌ Tag management UI (tags are typed inline in the editor; no taxonomy admin)
- ❌ Audit log of edits

## Pitch-day demo flow (for reference)

1. Open `/admin/login` in a new tab during the live demo.
2. Log in as Dr. Hsu.
3. Hand him the laptop / give control of screen share.
4. Walk him through dashboard.
5. Have him click "New Post."
6. Suggest a title — e.g. "Welcome to the new dentisthsu.com" or use one of his existing real posts as a draft template.
7. He types a sentence or two; uploads a photo from his phone via media library.
8. He hits "Publish."
9. Switch to a public tab; refresh `/blog`; the post is there.
10. *That* is the moment that closes the engagement.

## Performance budget for admin

Admin doesn't need to hit the same Lighthouse 95+ as marketing pages, but reasonable bounds:

- `/admin/login` — Lighthouse mobile Performance ≥ 80
- `/admin/dashboard` — load time < 2s on typical broadband
- `/admin/posts/new` — Tiptap initialization < 1s
- Publish action (form submit → ISR revalidate → public) — end-to-end ≤ 8s

## Security posture

- Middleware on `/admin/*` checks Supabase Auth session; unauthenticated → redirect to `/admin/login`.
- RLS enabled on `blog_posts`, `appointment_requests`, `media_assets` tables.
- Media uploads sanitized (file-type allowlist: jpeg/png/webp/avif; max 8MB).
- Server Actions validate input via zod (slug uniqueness, body length, etc.).
- No CSRF tokens needed (Server Actions handle this).
- Honeypot + Vercel Edge rate-limit on `/admin/login` (auth abuse prevention).

## Costs

For the pitch demo, this lives entirely on Vercel Hobby tier + Supabase free tier. Both are sufficient for the volume of activity expected (1 dentist, occasional posts, low appointment-request volume). v2 will likely warrant Vercel Pro + Supabase Pro.
