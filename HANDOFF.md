# Comfort Care Dental — Pitch Site Handoff

**Date:** 2026-05-05
**Engagement owner:** Rob Guevarra · `robneil@gmail.com`
**Project root:** `/Users/robguevarra/Documents/Coding Projects/ccd/ccd2`
**Current branch:** `phase-1-discovery` (will be merged to `main` post-deploy)
**Last commit:** `5eb846b`

This document is the single source of truth for finishing the pitch deployment, demoing to the dentist, and continuing the engagement if signed. Read it top to bottom before doing anything.

---

## 1. What this project is

A **pitch website** built to win an engagement with the practice owner of dentisthsu.com (Dr. Brien Hsu). It is *not* a delivered production site. The pitch deliverable is:

- A live, deployed Vercel demo URL the dentist can click through
- A working `/admin` login where he creates a draft blog post during the meeting and watches it appear on the site within 5 seconds
- A 1–2 page leave-behind PDF (TBD; data sources are in `docs/audit/`)

**Practice details (locked, source-of-truth):**

| Field | Value |
|---|---|
| Brand name | Comfort Care Dental |
| Lead doctor | Dr. Brien Hsu, DDS |
| Address | 11458 Kenyon Way, Rancho Cucamonga, CA · zip TBD (likely 91730) · suite TBD |
| Phones | (800) 365-8295 toll-free · (909) 558-8187 main · (909) 941-2811 alt |
| Domain (existing) | dentisthsu.com |
| Pitch URL (target) | `dentisthsu-redesign.vercel.app` |
| Existing PMS | Weave + OpenDental (no API access — deferred to v2) |

---

## 2. Where to deploy from

**Nothing is pushed yet.** All work is committed locally on the `phase-1-discovery` branch. Two paths to deploy:

### Path A: Push to GitHub, connect Vercel via dashboard (recommended)

```bash
# From project root
cd "/Users/robguevarra/Documents/Coding Projects/ccd/ccd2"

# 1. Create a new repo on github.com first (private; name: dentisthsu-redesign)
# 2. Copy the SSH URL, then:
git remote add origin git@github.com:<your-username>/dentisthsu-redesign.git

# 3. Push both branches
git push -u origin main
git push -u origin phase-1-discovery

# 4. (optional) Merge phase-1-discovery into main for a clean deploy:
git checkout main
git merge phase-1-discovery
git push origin main
```

Then in Vercel:
1. Go to https://vercel.com/new
2. Import the repo
3. Framework preset will auto-detect as Next.js
4. **Don't deploy yet** — first add env vars (see §3 below)
5. Then click Deploy

### Path B: Vercel CLI (if you'd rather skip GitHub)

```bash
cd "/Users/robguevarra/Documents/Coding Projects/ccd/ccd2"
vercel login           # Browser SSO, one-time
vercel --yes           # First-time link + production deploy with defaults
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel --prod          # Re-deploy with envs
```

Tell the CLI yes to the linking prompts. It will create a Vercel project with the same name as the local directory.

---

## 3. Required environment variables

Set these on Vercel **before deploying** (or before re-deploying after first push). All three exist locally in `.env.local` (gitignored — won't be in the repo).

| Variable | Value | Where to set |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qxicorwwknphfzvyjngz.supabase.co` | Vercel project → Settings → Environment Variables → Production + Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_yhMRhZ3ehFfh3Si7ep2oJw_tgxdXvC3` | Same |
| `FIRECRAWL_API_KEY` | `fc-a0b8efe9eae44e228da057e9a8553ddd` | **Not needed for production** — only used by P1 discovery scripts. Don't set on Vercel. |

The two public Supabase vars are safe to expose — that's their design. The `FIRECRAWL_API_KEY` should NOT be deployed; it's for your local discovery pipeline only.

---

## 4. Supabase project (already provisioned)

| Field | Value |
|---|---|
| Project name | Comfort Care Dental |
| Project ID | `qxicorwwknphfzvyjngz` |
| Region | us-west-1 |
| Status | ACTIVE_HEALTHY |
| URL | `https://qxicorwwknphfzvyjngz.supabase.co` |
| Dashboard | https://supabase.com/dashboard/project/qxicorwwknphfzvyjngz |

**Tables already migrated** (all with RLS enabled):
- `blog_posts` — admin-editable. Public can read `status='published'`; auth required for CRUD.
- `appointment_requests` — anon insert allowed; auth required to read/update.
- `media_assets` — public read; auth required for write.

Schema details: see `content/schemas.ts` and `docs/superpowers/specs/2026-05-05-dentisthsu-phase-2-ia-content-strategy.md` §6.

### Creating the demo admin account (do this BEFORE the pitch meeting)

The dentist will sign in to `/admin/login` during the demo. You need to create his account first.

**Option 1 (recommended): Use the live signup flow on the deployed site.**

After Vercel deploy is up:
1. Visit `https://<your-vercel-url>/admin/login`
2. Click "Create an account"
3. Use email `dr.hsu@example.com` (or your preference) + a memorable password
4. You'll land on `/admin/dashboard`. Done.

**Option 2: Create via Supabase dashboard.**

Supabase dashboard → Authentication → Users → Add user → Create new user with email + password.

**Make sure email confirmation is OFF** for the demo so signup is immediate. In Supabase: Authentication → Settings → "Confirm email" — toggle off. (Re-enable for v2 production.)

### Pitch-day workflow

1. Open `/admin/login` on screen during the meeting
2. Sign in with the demo credentials (write them on a card)
3. Click "New Post"
4. Type a title relevant to something the dentist just said
5. Type a short body in markdown (try: `## Heading\n\nSome text. **Bold word**.`)
6. Set status to "Publish now"
7. Click "Create post"
8. Open `/blog` in another tab, refresh — the post is there
9. Hand him the laptop or share screen to let him try

This is the closer move. Practice it once before the meeting.

---

## 5. Project state — what's done, what's not

### ✅ Done

**Marketing site (42 routes, all rendering):**
- `/` — cinematic hero with abstract dental arch (3D, scroll-choreographed)
- `/about` — practice timeline (1999 → 2014 → 2024)
- `/services` — 4 categories, ~20 services, image-led editorial layout (specialty + orthodontics use gradient placeholders)
- `/services/<slug>` — utility-tier service detail × 19
- `/services/tmj` — wow-zone signature service detail with scroll-pinned hero + 3 case-study sections
- `/doctors` — 6-doctor team grid with B&W portraits (Unsplash placeholders)
- `/doctors/<slug>` — cinematic 80svh portrait header + real bios scraped from dentisthsu.com
- `/technology` — CBCT / Trios / Zeiss microscope showcase
- `/reviews` — 8 curated 5★ reviews (real testimonials from existing site)
- `/contact` — address, hours, phones, accessibility statement
- `/financing` — payment plans + insurance
- `/request-appointment` — Server Action form, persists to Supabase
- `/blog` — Supabase-driven blog index
- `/blog/<slug>` — markdown-rendered blog post
- `/admin/login` — Supabase Auth (sign in + sign up for demo seeding)
- `/admin/dashboard` — recent appointment requests + post list + stats
- `/admin/posts/new` and `/admin/posts/<id>` — markdown editor with publish toggle
- `/sitemap.xml`, `/robots.txt`, `Dentist` JSON-LD schema on every page

**Supabase backend:**
- Schema migrated, RLS policies in place
- `appointment_requests` form intake working end-to-end
- `blog_posts` editable through admin, ISR revalidation on publish
- 5 real Dr. Hsu blog posts already seeded (CBCT, 3Shape Trios, 2024 tech, white fillings, whitening toothpaste)

**Real Dr. Hsu content:**
- 6 doctor bios (real, scraped from dentisthsu.com, light edits)
- 5 blog posts (his actual writing, lightly cleaned)
- 8 5★ reviews (real testimonials)
- Real practice phones, address, socials (Facebook, Yelp, Twitter `@drbrienhsu`)

**Engineering quality:**
- Next.js 16 + React 19 + TypeScript strict + Tailwind v4
- 38 marketing routes prerendered statically (SSG); admin + blog dynamic
- Lenis smooth scroll
- Framer Motion + R3F + GSAP installed (R3F used on home hero only per master spec)
- `prefers-reduced-motion` respected
- WCAG-friendly (focus rings, semantic HTML, alt text where applicable)
- `pnpm build` clean — no errors

### ⚠️ Placeholder, not real (intentional gaps)

**Photography:**
- All doctor portraits are real Unsplash photos of OTHER people, used as professional placeholders
- Service category covers: General Dentistry + Cosmetic use Unsplash dental photos; Specialty + Orthodontics use gradient placeholders
- TMJ signature page uses gradient placeholders (no photos)
- Hero: NO photo, just the 3D arch + dark gradient
- **Pitch story**: "Post-signing, we do a 2–3 hour photo session in your office. These placeholders get replaced with your actual portraits, clinic interiors, equipment shots."

**Brand identity:**
- Wordmark is a custom SVG using Fraunces serif. NOT a designed logo.
- **Pitch story**: "Logo direction is part of P3 — we have full rebrand permission per the engagement scope."

**Color/type system:**
- Using stone neutrals + warm cream for pitch
- No defined accent color yet (placeholder terracotta in CSS tokens)
- Final palette gets locked in P3

### 🚨 Items the dentist might call out — own them

- **5 of 6 doctor bios are real** (Brien Hsu, Angela Huang, Amandeep Singh, Rachel Lim, Robert Sharobiem, Serena Hsu — all scraped from his site). The PORTRAITS are placeholders. Be clear about this distinction during the demo.
- **Office hours are guessed** (Mon–Fri 8–5, Sat 8–1, Sun closed). Confirm with him; flagged as TODO in `content/practice-info.ts`.
- **Suite number on the address is missing** — audit found "Suite" but no number. Ask.
- **ZIP code is best-guess** (91730). Kenyon Way could also be 91701. Ask.
- **No public email address surfaced anywhere** — the audit confirmed his current site has zero `mailto:` links across 181 pages. Recommend adding `hello@dentisthsu.com` in v2 — it's a 10-minute add.

### ⛔ Out of scope (deferred to v2 if signed)

- Real OpenDental/Weave PMS integration
- Live Google Places / Yelp API for reviews (we're using curated JSON)
- Multi-user staff auth, roles, permissions
- HIPAA-compliant patient data handling
- Spanish or any non-English locale
- E-commerce, live chat, SMS, patient portal
- Any third-party widget that brands itself on the page

---

## 6. The pitch demo script (rehearse this)

**Bring:**
- Laptop with the live URL bookmarked
- The audit doc (`docs/audit/audit.md`) printed or on screen — you'll show specific findings
- The dentist-questions doc (`docs/audit/dentist-questions.md`) — pick 3-5 to ask
- The competitive-teardown doc (`docs/audit/competitive-teardown.md`) — show TMJ Expert + Aventura analysis
- A printed card with admin demo credentials

**Suggested 30-minute flow:**

| Min | What you do | What you say |
|---|---|---|
| 0–3 | Open by asking 2-3 of the dentist-questions | "Before I show you what we built, can I ask…" |
| 3–8 | Walk through the audit findings | "Your current site has 184 URLs, 85 of them are zombie pages..." Show specific examples (`dentisthsu.com/lorem-simply-dummy-text-the-industry`). |
| 8–18 | Open the deployed Vercel URL on your laptop. Walk through home → services → TMJ → doctors → reviews. | "Same content. Same six doctors. Same phone number. Forty pages instead of 184. Loads in under a second instead of four. Passes ADA." |
| 18–25 | The CMS demo. Open `/admin/login` in a new tab. Sign in. Create a post mid-meeting. Switch tabs to `/blog`. Refresh. Post appears. | "Today, when you want to publish something, what happens?" (Probably he calls his web guy.) "Going forward, this is what happens. Five minutes. Done." |
| 25–28 | Show the competitive teardown — TMJ Expert (his reference) + Aventura (your SOTY teacher). | "You sent me a link to the TMJ Expert gallery page. Here's exactly what about it I want to honor, and what we'll do better." |
| 28–30 | Close by asking about photography + scope/timeline | "Post-signing, the first thing we do is a 2-hour photo session at your office. Then we replace these placeholders with your actual practice. Are you open to letting us schedule that?" |

The closer move is the live publish. Practice it.

---

## 7. Project structure (what's where)

```
/                                               Project root
├── CLAUDE.md                                   Read first — orients new sessions
├── HANDOFF.md                                  This file
├── README.md                                   (none yet — handoff replaces it)
├── package.json                                pnpm workspace; pnpm 10, Node 24+
├── next.config.ts                              Turbopack root pinned, image domains allowed
├── proxy.ts                                    Next 16 middleware-equivalent — Supabase Auth gating
├── tsconfig.json                               TS strict + Next plugin
├── postcss.config.mjs                          Tailwind v4
│
├── .env.local                                  Local secrets (gitignored)
├── .env.example                                Committed env template
│
├── app/                                        Next.js App Router
│   ├── layout.tsx                              Root layout with fonts + Lenis provider
│   ├── globals.css                             Tailwind v4 import + CSS tokens
│   ├── sitemap.ts                              /sitemap.xml
│   ├── robots.ts                               /robots.txt
│   ├── (marketing)/                            Public marketing routes
│   │   ├── layout.tsx                          Header + footer + structured data
│   │   ├── page.tsx                            Home
│   │   ├── about/page.tsx
│   │   ├── doctors/{page.tsx,[slug]/page.tsx}
│   │   ├── services/{page.tsx,[slug]/page.tsx}
│   │   ├── technology/page.tsx
│   │   ├── reviews/page.tsx
│   │   ├── blog/{page.tsx,[slug]/page.tsx}
│   │   ├── contact/page.tsx
│   │   ├── request-appointment/{page.tsx,actions.ts,appointment-form.tsx}
│   │   └── financing/page.tsx
│   └── admin/                                  Auth-gated admin
│       ├── layout.tsx                          Admin chrome
│       ├── login/{page.tsx,login-form.tsx,actions.ts}
│       ├── dashboard/page.tsx
│       └── posts/{page.tsx,actions.ts,post-editor.tsx,new/page.tsx,[id]/page.tsx}
│
├── components/                                 Shared React
│   ├── site-header.tsx
│   ├── site-footer.tsx
│   ├── wordmark.tsx                            Custom SVG wordmark
│   ├── structured-data.tsx                     Dentist JSON-LD
│   ├── hero.tsx                                Cinematic 3D hero (client component)
│   ├── hero-canvas.tsx                         R3F arch + scroll choreography
│   ├── lenis-provider.tsx                      Smooth scroll
│   ├── motion/fade-up.tsx                      Reusable scroll reveal
│   └── tmj/tmj-signature.tsx                   TMJ wow-zone signature page
│
├── content/                                    Typed content (TS, MDX, JSON)
│   ├── schemas.ts                              All TypeScript types
│   ├── practice-info.ts                        Practice singleton (brand, address, phones, hours)
│   ├── services.ts                             20 services, 4 categories
│   ├── doctors.ts                              6 doctors with real bios
│   ├── reviews.ts                              8 curated 5★ reviews
│   ├── photography.ts                          Curated Unsplash photo refs (some are gradients)
│   └── redirects.ts                            ~110 redirect rules from old WordPress URLs
│
├── lib/                                        Shared utilities
│   ├── cn.ts                                   classnames helper
│   ├── fonts.ts                                Fraunces (display) + Geist (body)
│   └── supabase/{browser.ts,server.ts,queries.ts}
│
├── scripts/p1-discovery/                       P1 audit/scrape pipeline (NOT in production)
│   ├── 01-discover.ts → 07-axe.ts              Sequential pipeline
│   ├── 08-teardown-captures.ts                 Competitive screenshots
│   ├── run-all.ts                              Orchestrator
│   └── lib/                                    Shared helpers (slugify, paths, env, etc.)
│
├── source/                                     Scraped + audit artifacts (most gitignored)
│   ├── sitemap.json                            184 URLs from dentisthsu.com (committed)
│   ├── practice-info.json                      Curated facts (committed)
│   ├── pages/*.{md,json}                       181 scraped pages (committed)
│   ├── images/                                 (gitignored)
│   ├── screenshots/                            (gitignored)
│   ├── lighthouse/                             (gitignored)
│   ├── axe/                                    (gitignored)
│   └── teardowns/                              TMJ Expert + Aventura captures (committed)
│
└── docs/
    ├── audit/                                  P1 deliverables — bring these to the pitch
    │   ├── audit.md                            10 dimensions, 46+ findings, top-5 leave-behind picks
    │   ├── competitive-teardown.md             TMJ Expert + Aventura analysis
    │   ├── asset-inventory.md                  221 unique images bucketed
    │   ├── dentist-questions.md                14 open questions for the meeting
    │   └── _templates/                         Authoring scaffolds
    ├── ia/                                     P2 IA documents
    │   ├── sitemap.md
    │   ├── services-taxonomy.md
    │   ├── page-templates.md
    │   ├── redirects.md
    │   └── admin-scope.md
    └── superpowers/
        ├── specs/                              Master + per-phase detail specs
        ├── plans/                              Per-phase implementation plans
        └── decisions.md                        Append-only decisions log
```

---

## 8. Stack reference

| Layer | Choice | Notes |
|---|---|---|
| Runtime | Node 24 LTS | matches Vercel default |
| Package manager | pnpm 10 | not npm/yarn |
| Framework | Next.js 16.2.4 | App Router, RSC, Server Actions |
| TypeScript | 5.7+ strict | `noUncheckedIndexedAccess` on |
| Styling | Tailwind CSS v4 | CSS-first config; `@theme` in globals.css |
| Fonts | Fraunces (display) + Geist (body) | via `next/font/google` |
| Animation | Framer Motion 12 + Lenis 1.3 + GSAP 3.15 | Lenis for global smooth scroll |
| 3D | three 0.184 + @react-three/fiber 9 + @react-three/drei 10 | R3F currently only on `/` hero (TubeGeometry arch) |
| Backend | Supabase | Postgres + Auth + Storage |
| Email | Resend (planned) | not wired yet — request-appointment Server Action stubs the email path |
| Hosting | Vercel | Hobby tier sufficient for pitch; upgrade to Pro for v2 |
| Icons | lucide-react | not emojis |

### Local dev

```bash
cd "/Users/robguevarra/Documents/Coding Projects/ccd/ccd2"
pnpm install                  # one-time
pnpm dev                      # http://localhost:3000
pnpm build                    # production build (verify before deploy)
pnpm typecheck                # tsc --noEmit
pnpm test                     # Vitest (P1 lib helpers only)
```

---

## 9. Known issues + caveats (be honest about these in the pitch)

1. **Doctor portraits are real Unsplash photos of other people** used as professional placeholders. The dentist will see "men in glasses, women in clinical settings" — none of them are the actual doctors.
2. **Wordmark is text-based** (custom SVG using Fraunces). Not a designed logo. Frame as: "Logo direction is P3 — we have rebrand permission."
3. **Dev mode shows the Next.js "N" badge** at bottom-left. Disabled in production.
4. **Office hours, suite, zip are guesses** — confirm in the meeting (see §5 ⚠️ above).
5. **Email is null** in `practice-info.ts` — site shows no `mailto:` links. Audit finding; v2 should add.
6. **The 3D arch on the home hero is intentionally abstract** — it's not a literal tooth or jaw model. Reads as "the curve of a smile" without being grotesque.
7. **No real Resend/email integration yet** — the request-appointment form persists to Supabase but doesn't email. v2 wires Resend in 30 minutes.
8. **5 blog posts seeded** are Dr. Hsu's actual writing from his existing blog, lightly cleaned. He'll recognize them.

---

## 10. After the pitch — if signed

The master spec [§3 phases P3–P5](docs/superpowers/specs/2026-05-05-dentisthsu-redesign-master-spec.md#3-phase-plan-46-week-engagement) has the full plan. High-level v2 punch list:

1. **Photo session** (week 1 post-signing) — 2-3 hours at the office
2. **Brand direction lock** (P3) — logo, final color palette, type system pinned
3. **Real photography swap** (P4) — replace all Unsplash placeholders with real images
4. **PMS integration** (P5) — OpenDental + Weave, real appointment booking
5. **Email integration** — Resend wired for form confirmations + appointment notifications
6. **Spanish locale** (if requested)
7. **Multi-user staff auth** — additional doctor accounts with roles
8. **Live Google Places API** — replace `content/reviews.ts` JSON with cron-refreshed Places data
9. **HIPAA review** — if they want patient portal features
10. **Domain migration** — `dentisthsu-redesign.vercel.app` → `dentisthsu.com` with all 110 redirects from `content/redirects.ts` activated

---

## 11. Decisions log (read before re-litigating anything)

`docs/superpowers/decisions.md` is the append-only history of every material decision made during the engagement. If you (or a future Claude session) is tempted to change a stack choice or revisit a brand decision, read this file first.

Key locked decisions:

- Brand name **Comfort Care Dental** (replacing dentisthsu.com / Hsu's Dental Practice — dual identities resolved)
- Stack: Next.js + Supabase + Tailwind v4 (Approach A — Static-first marketing + live admin)
- Pitch URL strategy: Vercel subdomain, not custom domain
- Reviews approach: curated JSON now + admin "Connect Google Business" stub for v2
- Aventura is OUR SOTY teacher (analyzed per-dimension); TMJ Expert is the CLIENT'S reference (analyzed per-site)
- ui-ux-pro-max skill invoked for hero design intelligence
- Hero is 3D dental arch (master spec §5 wow-moment roster), scroll-choreographed across 3 keyframe poses

---

## 12. If something's broken

| Problem | First thing to try |
|---|---|
| `pnpm install` fails on `sharp` | `pnpm install --ignore-scripts && pnpm rebuild sharp` |
| `pnpm build` fails on TypeScript | `rm -rf .next && pnpm typecheck` to see real errors without Turbopack noise |
| Hero 3D form invisible after edits | Check that the hero `<section>` has `isolation: isolate` (creates stacking context) |
| Supabase auth fails on prod | Verify env vars are set on Vercel and Supabase URL/key are correct (Settings → API in Supabase dashboard) |
| Form submits but nothing in dashboard | Check Supabase RLS policies on `appointment_requests`; anon insert + auth select |
| Blog post publishes but doesn't appear on `/blog` | ISR revalidation may not have triggered. Force a refresh or check `app/admin/posts/actions.ts`'s `revalidatePath` calls |
| `vercel login` keeps re-prompting | Older CLI versions have token issues. `pnpm add -g vercel@latest` then re-login |

---

## 13. Final pre-pitch checklist

Run through this 24 hours before the meeting:

- [ ] Repo pushed to GitHub/your-Git-host
- [ ] Vercel project deployed and accessible
- [ ] `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set on Vercel production env
- [ ] Demo admin account created on the live site
- [ ] Test publish a blog post end-to-end on the live site, then delete it
- [ ] Test the request-appointment form on the live site, verify it lands in Supabase
- [ ] Open the live site on your phone (real iPhone if possible)
- [ ] Print or save offline copies of `docs/audit/audit.md`, `docs/audit/competitive-teardown.md`, `docs/audit/dentist-questions.md`
- [ ] Practice the live-publish moment 3 times so the timing feels confident
- [ ] Bring two devices (laptop for screen sharing, phone for the mobile demo)
- [ ] Have the demo credentials written on a card you can hand him
- [ ] If the meeting is on Zoom: pre-share the URL in chat so he can click while you talk

You're ready. Go close it.

---

*Engagement records: `docs/superpowers/specs/`, `docs/superpowers/plans/`, `docs/superpowers/decisions.md`. Brainstorm session artifacts: `.superpowers/brainstorm/` (gitignored).*
