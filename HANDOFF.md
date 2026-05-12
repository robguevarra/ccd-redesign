# Comfort Care Dental — Pitch Site Handoff

**Date:** 2026-05-07
**Engagement owner:** Rob Guevarra · `robneil@gmail.com`
**Project root:** `/Users/robguevarra/Documents/Coding Projects/ccd/ccd2`
**Active worktree:** `/Users/robguevarra/Documents/Coding Projects/ccd2/vigorous-curie-fee25e`
**Current branch:** `main` (all P3.5 audit-pass + v2 polish work merged)
**Last commit:** `068a284`
**Repo:** [github.com/robguevarra/ccd-redesign](https://github.com/robguevarra/ccd-redesign)

This document is the single source of truth for finishing the pitch deployment, demoing to the dentist, and continuing the engagement if signed. Read it top to bottom before doing anything.

---

## 1. What this project is

A **pitch website** built to win an engagement with the practice owner of dentisthsu.com (Dr. Brien Hsu). It is *not* yet a delivered production site — but it is significantly further along than a typical pitch deliverable thanks to the audit pass and v2 polish that have shipped since the original handoff.

**Pitch deliverable:**
- A live, deployed Vercel demo URL the dentist can click through
- A working `/admin` login where he creates a draft blog post during the meeting and watches it appear on the site within 5 seconds
- A 1–2 page leave-behind PDF (TBD; data sources are in `docs/audit/`)

**Practice details (locked, confirmed against the real flyers):**

| Field | Value |
|---|---|
| Brand name | Comfort Care Dental |
| Lead doctor | Dr. Brien Hsu, DDS, MS |
| Legal name | Brien Hsu, DDS, MS & Associates |
| Address | **11458 Kenyon Way, Suite 120, Rancho Cucamonga, CA 91701** |
| Phone | **(909) 941-2811** (single primary; old toll-free + alt numbers retired) |
| Email | **advancedcare@dentisthsu.com** |
| Hours | **Mon/Tues/Thurs 9–6 · Wed 8–5 · Closed Fri/Sat/Sun** |
| Domain (existing) | dentisthsu.com |
| Pitch URL | `ccd-redesign.vercel.app` (canonical URL lives in [lib/site.ts](lib/site.ts)) |
| Existing PMS | Weave + OpenDental (no API access — deferred to v2) |

These were corrected in the audit pass from the practice's actual marketing flyers. The original HANDOFF guesses (zip 91730, three phone numbers, Mon–Sat hours, no email) are all wrong — do not regress them.

---

## 2. Where to deploy from

The branch is **on `main` and pushed to `origin/main`** at `github.com/robguevarra/ccd-redesign`. No more "nothing is pushed" — every audit-pass + v2 commit (43 of them) is merged.

### Path A: Connect Vercel via dashboard (recommended)

1. Visit https://vercel.com/new
2. Import `robguevarra/ccd-redesign`
3. Framework preset auto-detects as Next.js
4. **Before clicking Deploy**, set env vars on Production + Preview (see §3)
5. Deploy

Vercel will auto-deploy every push to `main` after that.

### Path B: Vercel CLI

```bash
cd "/Users/robguevarra/Documents/Coding Projects/ccd/ccd2"
vercel login           # Browser SSO, one-time
vercel --yes           # First-time link + production deploy with defaults
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel --prod          # Re-deploy with envs
```

Tell the CLI yes to the linking prompts.

---

## 3. Required environment variables

Set these on Vercel **before deploying**. They exist locally in `.env.local` (gitignored).

| Variable | Value | Where to set |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qxicorwwknphfzvyjngz.supabase.co` | Vercel project → Settings → Environment Variables → Production + Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_yhMRhZ3ehFfh3Si7ep2oJw_tgxdXvC3` | Same |
| `FIRECRAWL_API_KEY` | `fc-a0b8efe9eae44e228da057e9a8553ddd` | **Not needed for production** — only used by P1 discovery scripts. Don't set on Vercel. |

The two public Supabase vars are safe to expose — that's their design.

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

**Tables migrated** (RLS enabled):
- `blog_posts` — admin-editable; public reads `status='published'`. **5 real Dr. Hsu posts seeded** (CBCT 2014, 3Shape Trios, 2024 tech update, white fillings, whitening toothpaste).
- `appointment_requests` — anon insert allowed; auth required to read/update.
- `media_assets` — public read; auth required for write.

### Creating the demo admin account (do this BEFORE the pitch meeting)

The dentist will sign in to `/admin/login` during the demo. You need to create his account first.

**Recommended: live signup flow.**
1. Visit `https://<your-vercel-url>/admin/login`
2. Click "Create an account"
3. Use email `dr.hsu@example.com` (or your preference) + memorable password
4. You'll land on `/admin/dashboard`. Done.

**Important:** Make sure email confirmation is OFF for the demo so signup is immediate. Supabase dashboard → Authentication → Settings → "Confirm email" — toggle off.

### Pitch-day workflow

1. Open `/admin/login` on screen during the meeting
2. Sign in with the demo credentials (write them on a card)
3. Click "New Post"
4. Type a title relevant to something the dentist just said
5. Type a short body in markdown
6. Set status to "Publish now"
7. Click "Create post"
8. Open `/blog` in another tab, refresh — the post is there
9. Hand him the laptop or share screen to let him try

This is the closer move. Practice it.

---

## 5. Recent work — what's been done since the original handoff

Since the 2026-05-05 handoff baseline (commit `ef3c9f7`), **43 commits** have shipped across two large sweeps. All on `main` now.

### 5a. P3.5 Pre-Pitch Audit Pass (2026-05-06)

A full audit-pass driven by client annotations on the deployed site + the real practice flyers. Spec: [`docs/superpowers/specs/2026-05-06-dentisthsu-pre-pitch-audit-pass.md`](docs/superpowers/specs/2026-05-06-dentisthsu-pre-pitch-audit-pass.md). Plan: [`docs/superpowers/plans/2026-05-06-pre-pitch-audit-pass.md`](docs/superpowers/plans/2026-05-06-pre-pitch-audit-pass.md).

| What changed | Where |
|---|---|
| **IA rebuild** — old `/services/{general,cosmetic,specialty,orthodontics}` replaced by **two lanes**: `/dental` (22 services) + `/medical` (10 services) across 9 subcategories | `app/(marketing)/dental/`, `app/(marketing)/medical/`, `content/services.ts`, `content/redirects.ts` |
| **Service catalog rewrite** — 32 services / 9 subcategories. Drops amalgam, ortho ×2, pediatric, sedation, oral-hygiene. Adds 19 new stub services | `content/schemas.ts` (added `lane` + `subcategory` fields), `content/services.ts` |
| **Redirects** — 14 lane-migration 301s + 7 410 Gone entries | `content/redirects.ts` |
| **Brand lockup** — added `<Logo>` component (deep-ink mark) + lane-aware sub-label switching | `components/logo.tsx`, `components/site-header.tsx`, `lib/sublabel.ts` |
| **Color tokens** — terracotta placeholder replaced with editorial teal palette (`--color-accent-50/200/600/900`) | `app/globals.css` |
| **Practice facts corrected** from real flyers (suite, ZIP, hours, single phone, email surfaced) | `content/practice-info.ts` |
| **Doctor roster** — 6 → 5 (Serena Hsu dropped pending dentist confirmation); 4 bios swapped to polished flyer copy; Dr. Hsu's scraped bio kept | `content/doctors.ts` |
| **Home hero rewrite** — `<AirwayHero>` keyframes restructured (see §6 for current state) | `app/(marketing)/page.tsx` |
| **Testing scaffold** — Vitest tests guarding service taxonomy, doctor roster, practice info, redirects, sublabel helper | `content/__tests__/`, `lib/__tests__/` |

### 5b. V2 Polish Sweep (2026-05-06 → 2026-05-07)

Continued work to bring the site to "$100k pitch" register before the meeting.

| What changed | Where |
|---|---|
| **Real doctor portraits** — 5 real headshots replacing Unsplash placeholders. Per-portrait focal points (`objectPosition`) so each face centers in the 3:4 thumbnail aspect | `public/images/doctors/dr-*.png`, `content/doctors.ts`, `content/schemas.ts` (added `objectPosition` field), `app/(marketing)/doctors/` |
| **Long-form service bodies** — all 32 services expanded from 50–80 word stubs to 200–350 word editorial-register bodies. Grounded in scraped practice pages + flyer copy | `content/services.ts` |
| **Mobile hamburger drawer** — full-screen menu with serif nav + Request/Call/Email CTAs + visit address. Active route gets teal accent. Closes on route change | `components/site-header.tsx` |
| **Teal expansion** — color appears across footer headings + hover states, doctor specialty pills, `/doctors` eyebrow, mobile drawer active state, doctor cards on home | `components/site-footer.tsx`, `app/(marketing)/doctors/`, `app/(marketing)/page.tsx`, `components/site-header.tsx` |
| **Doctor cards on home** — replaced text-only doctor strip with 5-card grid using real portraits | `app/(marketing)/page.tsx` |
| **Section reorder** — Doctors before Technology on home | `app/(marketing)/page.tsx` |
| **Deep teal-black tokens** — `--color-accent-950` and `--color-ink-teal` for dark sections that should pick up brand color instead of cold navy | `app/globals.css`, `app/(marketing)/page.tsx` |
| **Hero copy iterations** — multiple rounds of refinement; current state in §6 | `app/(marketing)/page.tsx` |
| **Brand-broad pinned carousel** — new `<WhyPatientsStay>` section between hero and "Two practices, under one roof". Apple/Stripe pinned-scroll pattern: section pins to viewport while vertical scroll translates 3 panels horizontally. Magnet snap fires on user-input idle (450ms quiet + 5 stable rAF frames). Reduced-motion fallback stacks vertically | `components/why-patients-stay.tsx`, `components/lenis-provider.tsx` (exposes lenis on `window.__lenis` for programmatic snap) |
| **Lenis scroll reset on route change** — was carrying scroll position across navigations, leaving users mid-page on the new route | `components/lenis-provider.tsx` |
| **Cleanups** — orphaned components removed, "next generation of Hsu family" copy softened (Serena drop made it potentially inaccurate), Blog link restored to header + mobile menu + footer | various |

### 5c. Specific factual corrections

These all came from the client's annotations on the deployed site:
- **Comprehensive Exam** — body no longer mentions CT/CBCT scan (the practice doesn't claim this); now correctly says full-mouth series or panoramic, periodontal charting, oral cancer screening
- **Composite Fillings** — "microscope-level magnification" claim removed (was inaccurate; tracked permanently in test that asserts `composite-fillings.body` does not contain "microscope")
- **Professional Cleaning** — body now mentions "three or four cleanings a year" cadence + fluoride + sealants + patient education
- **Crowns & Bridges** — renamed from "Crowns & Caps", merged with fixed-bridges; body contains "restoring it back to functionality" language
- **Direct Composite Veneers** — added as a new service (was missing)
- **Porcelain Veneers** — summary now says "with minimal reduction of the underlying teeth" (was incorrectly "without changing")
- **"Medical-grade dentistry"** — phrase removed everywhere (the practice doesn't use it); replaced with warmer phrasings like "dental and medical care under one roof"

---

## 6. Current home page architecture

The home page tells a deliberate three-act story. Each section has a defined role.

```
1. <AirwayHero>                — pinned, scroll-scrubbed video (sleep-apnea airway visualization)
   F1  "Why people drive in"           Pain you thought was permanent.
   F2  "What you're looking at"        Sleep apnea, TMJ. Both manageable.
   F3  "Where this work happens"       Twenty-five years on Kenyon Way.

   The hero captions are now SPECIALTY-NARROWED to match the airway video.
   (Earlier iterations broadened to identity/family — but that disconnected
    from the visual. Brand-broad messaging now lives in section 2 below.)

2. <WhyPatientsStay>           — pinned, horizontally-scrolled 3-panel carousel
   Panel 1   "Why patients stay"       The gentle dentist, still.
   Panel 2   "How we work"             Conservative, by design.
   Panel 3   "Who we serve"            Same office, same family.

   Apple/Stripe pinned-scroll pattern. Section is 300svh tall; inner content
   stays sticky to viewport. Vertical scroll translates the panel row from
   panel 1 → 2 → 3. After panel 3, normal scroll resumes.

   Magnet snap: when user input (wheel/touch/key) goes quiet for 450ms AND
   progress stays stable for 5 rAF frames, smoothly pulls to nearest panel
   boundary. Snap cancels if the user resumes scrolling.

3. Two practices, under one roof   — large 2-card lane chooser
   - Dental Practice (warm stone hover) → /dental
   - Medical Practice (teal hover via --color-accent-50) → /medical

4. Doctors strip                — 5-card grid against bg-[var(--color-ink-teal)]
   Real portraits, grayscale-on-default + color-on-hover, per-portrait focal points.
   Eyebrow "The team", heading "Five doctors, one office.", body about Hsu's
   tenure and the four colleagues, then the cards, then "Meet the team →"

5. Technology                   — 3-bullet differentiator (CBCT, Trios, microscope)
   Eyebrow now teal; link hover state teal.

6. Final CTA                    — "Book a visit, or just say hello."
```

### The pinned-scroll mechanic

Both `<AirwayHero>` and `<WhyPatientsStay>` use the same pattern:

1. Outer wrapper has explicit height (e.g., `300svh`) — provides scroll budget
2. Inner `<div>` uses `position: sticky; top: 0; height: 100vh` — pins to viewport
3. A manual rAF loop reads `getBoundingClientRect` each frame to compute progress (bypasses Lenis's event coalescing)
4. Progress drives a framer-motion `MotionValue` that animates inner content (video currentTime, panel translateX)

**Why a manual rAF loop instead of useScroll/useTransform?** Lenis's smooth-scroll loop coalesces native scroll events; framer-motion's scroll listeners can lag behind. Reading `getBoundingClientRect` every frame is robust against this.

### Magnet snap (WhyPatientsStay only)

Two-stage gate prevents the snap from firing during a continuous scroll gesture (the bug where snap fires between wheel ticks, yanking the user mid-action):

1. **Input quiet gate**: track `lastInputAt` via `wheel`/`touchmove`/`touchstart`/`keydown` listeners. Only consider snapping when `now - lastInputAt > 450ms`.
2. **Progress stability gate**: once input is quiet, require 5 consecutive rAF frames where progress hasn't moved (~83ms). Then snap.

If the user resumes scrolling during a snap animation, `cancelSnapIfRunning()` immediately calls `lenis.scrollTo(currentY, { immediate: true })` to release control without a fight.

`window.__lenis` is exposed in `lenis-provider.tsx` so `<WhyPatientsStay>` can reach the Lenis instance for `scrollTo`.

---

## 7. Project state — current

### ✅ Shipped and pitch-ready

**Marketing site:**
- `/` — full home page (hero + brand-broad carousel + lane chooser + doctors + tech + CTA)
- `/dental` — lane landing with all 22 services across 5 subcategories
- `/dental/[slug]` — dental service detail (×22, all with 200-350 word bodies)
- `/medical` — lane landing with all 10 services across 4 subcategories
- `/medical/[slug]` — medical service detail (×10, including the TMJ wow page)
- `/medical/tmj` — short-circuits to existing `<TmjSignature>` cinematic component
- `/about` — practice timeline
- `/doctors` — 5 real portraits with grayscale + per-portrait focal points
- `/doctors/[slug]` — cinematic 80svh portrait header + flyer-derived bios
- `/technology` — CBCT / Trios / Zeiss showcase
- `/reviews` — 8 curated 5★ reviews
- `/blog` — Supabase-driven, 5 real Dr. Hsu posts seeded
- `/blog/[slug]` — markdown-rendered post with editor pipeline
- `/contact` — corrected facts (Suite 120, ZIP 91701, hours, email mailto)
- `/financing` — payment plans + insurance
- `/request-appointment` — Server Action form, Supabase persistence
- `/admin/*` — auth-gated CMS (login, dashboard, post editor)

**Brand & visual:**
- Real logo SVG at `public/logo.png` (Frame A canonical)
- Editorial teal accent palette (4 stops + deep teal-black token)
- Lane-aware header sub-label (`/dental` → "DENTAL PRACTICE", `/medical` → "OROFACIAL PAIN & ORAL MEDICINE", everywhere else → "EST. 1999 · RANCHO CUCAMONGA")
- Mobile hamburger drawer with full nav + CTAs
- Per-portrait `objectPosition` focal points so each face centers correctly

**Backend:**
- Supabase schema migrated, RLS in place
- Form intake working end-to-end
- 5 blog posts seeded
- Lenis smooth scroll with route-change reset

**Testing:**
- 37 Vitest tests across `content/__tests__/` and `lib/__tests__/` enforcing:
  - 32 services across 9 subcategories
  - 5 doctors only, no Serena Hsu
  - Suite 120, ZIP 91701, single phone, email surfaced
  - Lane-migration redirects + 410 entries
  - Sublabel resolution
  - Word-count gates (40–500 per service body)
  - "microscope" absence from `composite-fillings.body`

### ⚠️ Placeholder, not real (intentional)

- **Photography beyond doctor portraits** — service category covers, hero supplementary imagery, clinic interiors all use Unsplash or gradient placeholders. Real photo session is week-1 v2 work.
- **Service category covers** — General Dentistry + Cosmetic use Unsplash dental photos; Specialty + Orthodontics use gradient placeholders (orthodontics catalog dropped anyway).
- **TMJ signature page imagery** — gradient placeholders.
- **Color/type system** — final palette refinement is P3 polish post-signing.

### 🚨 Items the dentist may call out — own them

- **Five doctor portraits ARE real photos provided by the practice.** No more Unsplash placeholders for doctor headshots. Other photography (clinic, hero atmosphere) is still Unsplash.
- **Hours are confirmed** from the dental flyer: Mon/Tues/Thurs 9–6, Wed 8–5, closed Fri/Sat/Sun. Not guesses anymore.
- **Suite 120, ZIP 91701** — confirmed from flyer.
- **Email** — `advancedcare@dentisthsu.com` is the actual address from the flyer.
- **Phone** — `(909) 941-2811` is the only number now (matches both flyers). The toll-free and `(909) 558-8187` numbers were not in either flyer and have been retired from public surfaces.
- **Dr. Serena Hsu was dropped** — she's not on either flyer. If she IS still on staff, restore by re-adding to `content/doctors.ts` (the page has dynamic routes that will pick her up automatically).
- **Orthodontics, pediatric, sedation services were dropped** — none are in the practice's flyers. If they are real services, ask which to restore.

### ⛔ Out of scope (deferred to v2 if signed)

- Real OpenDental/Weave PMS integration
- Live Google Places / Yelp API for reviews (curated JSON instead)
- Resend email integration on `/request-appointment` (form persists to Supabase but doesn't email)
- Multi-user staff auth, roles, permissions
- HIPAA-compliant patient data handling
- Spanish locale
- E-commerce, live chat, SMS, patient portal
- Logo SVG conversion (currently 138KB optimized PNG; SVG would be sharper + smaller)
- Real photography for hero supplementary, clinic interiors, service covers
- "When this is medical / when this is dental" dual-context blocks on shared procedures (extractions, PRF/PRP, implants)

---

## 8. Pitch demo script (rehearse this)

**Bring:**
- Laptop with the live URL bookmarked
- The audit doc (`docs/audit/audit.md`) printed or on screen
- The dentist-questions doc (`docs/audit/dentist-questions.md`) — 14 open questions
- The competitive-teardown doc (`docs/audit/competitive-teardown.md`)
- A printed card with admin demo credentials

**Suggested 30-minute flow:**

| Min | What you do | What you say |
|---|---|---|
| 0–3 | Open by asking 2-3 of the dentist-questions | "Before I show you what we built, can I ask…" |
| 3–8 | Walk through the audit findings | "Your current site has 184 URLs, 85 of them are zombie pages..." Show specific examples. |
| 8–12 | Open the deployed Vercel URL. **Hero scroll moment.** Let the AirwayHero play through F1 → F2 → F3. | "Pain you thought was permanent. Sleep apnea, TMJ. Both manageable. Twenty-five years on Kenyon Way." |
| 12–14 | **Pinned brand-broad carousel.** Continue scrolling. Show panel 1 → 2 → 3 with the snap on each transition. | "The gentle dentist, still. Conservative, by design. Same office, same family." |
| 14–18 | Scroll through Two Practices → Doctors strip (real portraits, grayscale → color hover) → Technology → Final CTA. | "Same content. Same five doctors — those are their real photos. Forty pages instead of 184." |
| 18–22 | Switch to mobile (real iPhone or DevTools). Hamburger menu. Same hero scroll. | "Mobile-first build. The hero feels like an app." |
| 22–25 | The CMS demo. Open `/admin/login`. Sign in. Create a post mid-meeting. Switch tabs to `/blog`. Refresh. Post appears. | "Today, when you want to publish, what happens? Probably you call your web guy. Going forward, this is what happens. Five minutes. Done." |
| 25–28 | Show the competitive teardown — TMJ Expert + Aventura. | "You sent me a link to the TMJ Expert gallery page. Here's exactly what we honor, and what we'll do better." |
| 28–30 | Close by asking about photography + scope/timeline | "Post-signing, the first thing we do is a 2–3 hour photo session. Are you open to that?" |

The closer move is the live publish. Practice it.

---

## 9. Project structure

```
/                                               Project root
├── CLAUDE.md                                   Read first — orients new sessions
├── HANDOFF.md                                  This file
├── package.json                                pnpm workspace; pnpm 10, Node 24+
├── next.config.ts                              Turbopack root pinned
├── proxy.ts                                    Supabase Auth gating middleware
├── tsconfig.json
├── postcss.config.mjs                          Tailwind v4
│
├── .env.local                                  Local secrets (gitignored)
├── .env.example                                Committed env template
│
├── app/
│   ├── layout.tsx                              Root layout (fonts, Lenis provider)
│   ├── globals.css                             Tailwind + CSS tokens (teal palette + ink-teal)
│   ├── sitemap.ts                              /sitemap.xml — includes all /dental/* + /medical/*
│   ├── robots.ts
│   ├── (marketing)/
│   │   ├── layout.tsx                          Header + footer wrap
│   │   ├── page.tsx                            Home (hero + carousel + lanes + doctors + tech + CTA)
│   │   ├── about/page.tsx
│   │   ├── doctors/{page.tsx,[slug]/page.tsx}  Real portraits + per-doctor focal points
│   │   ├── dental/{page.tsx,[slug]/page.tsx}   Lane landing + 22 service detail pages
│   │   ├── medical/{page.tsx,[slug]/page.tsx}  Lane landing + 10 service detail (with TMJ special-case)
│   │   ├── technology/page.tsx
│   │   ├── reviews/page.tsx
│   │   ├── blog/{page.tsx,[slug]/page.tsx}     Supabase-driven
│   │   ├── contact/page.tsx                    Corrected facts
│   │   ├── request-appointment/{page,actions,form}.tsx
│   │   └── financing/page.tsx
│   └── admin/                                  Auth-gated admin (Supabase Auth)
│       ├── layout.tsx
│       ├── login/{page,login-form,actions}.tsx
│       ├── dashboard/page.tsx
│       └── posts/{page,actions,post-editor,new,[id]}.tsx
│
├── components/
│   ├── airway-hero.tsx                         Pinned scroll-scrubbed video hero (used on /)
│   ├── why-patients-stay.tsx                   Pinned 3-panel horizontal carousel (used on /) ⭐ NEW
│   ├── site-header.tsx                         Logo + lane-aware sub-label + nav + mobile drawer
│   ├── site-footer.tsx                         Email surfaced, single phone, teal hover states
│   ├── wordmark.tsx                            "Comfort Care Dental" custom SVG wordmark
│   ├── logo.tsx                                Practice mark (moon/face/star/tooth) ⭐ NEW
│   ├── lenis-provider.tsx                      Smooth-scroll + route-change reset + window.__lenis ⭐ EXTENDED
│   ├── structured-data.tsx                     Dentist JSON-LD
│   ├── motion/fade-up.tsx                      Reusable scroll reveal
│   ├── tmj/tmj-signature.tsx                   TMJ wow page (rendered on /medical/tmj)
│   └── sleep-apnea/sleep-apnea-signature.tsx
│
├── content/                                    Typed content (TS, MDX, JSON)
│   ├── schemas.ts                              All TS types (Service has lane + subcategory; Image has objectPosition)
│   ├── practice-info.ts                        Brand, address, single phone, real hours, email
│   ├── services.ts                             32 services / 9 subcategories / 2 lanes / 200-350 word bodies
│   ├── doctors.ts                              5 doctors, real portraits with focal points, flyer-derived bios
│   ├── reviews.ts                              8 curated 5★ reviews
│   ├── photography.ts                          Curated Unsplash refs (doctorPlaceholders retired)
│   ├── redirects.ts                            ~130 rules (WordPress legacy + lane migrations + 410s)
│   └── __tests__/                              Vitest suite — 28 tests guarding catalog invariants ⭐ NEW
│
├── lib/
│   ├── cn.ts                                   classnames helper
│   ├── fonts.ts                                Fraunces (display) + Geist (body)
│   ├── sublabel.ts                             getSublabel(pathname) → header sub-label ⭐ NEW
│   ├── __tests__/sublabel.test.ts              ⭐ NEW
│   └── supabase/{browser,server,queries}.ts
│
├── public/
│   ├── logo.png                                Real practice logo (138KB optimized) ⭐ NEW
│   ├── images/doctors/dr-*.png                 5 real doctor portraits (~5-6MB each) ⭐ NEW
│   └── videos/sleep-apnea-airway-scrub.mp4
│
├── scripts/p1-discovery/                       P1 audit/scrape pipeline (NOT in production)
│   └── ...                                     7 cache-aware steps + run-all + teardown-captures
│
├── source/                                     Scraped + audit artifacts (most gitignored)
│   ├── sitemap.json                            184 URLs from dentisthsu.com
│   ├── pages/*.{md,json}                       181 scraped pages (committed)
│   └── teardowns/                              TMJ Expert + Aventura captures
│
└── docs/
    ├── audit/                                  P1 deliverables — bring these to the pitch
    │   ├── audit.md                            10 dimensions, 46+ findings
    │   ├── competitive-teardown.md             TMJ Expert + Aventura analysis
    │   ├── asset-inventory.md                  221 unique images
    │   ├── dentist-questions.md                14 open questions for the meeting
    │   └── _templates/
    ├── ia/                                     P2 IA documents (sitemap, taxonomy, templates, redirects, admin scope)
    └── superpowers/
        ├── specs/
        │   ├── 2026-05-05-dentisthsu-redesign-master-spec.md   Original master spec
        │   ├── 2026-05-05-dentisthsu-phase-1-discovery-audit.md
        │   ├── 2026-05-05-dentisthsu-phase-2-ia-content-strategy.md
        │   └── 2026-05-06-dentisthsu-pre-pitch-audit-pass.md   ⭐ The audit-pass spec
        ├── plans/
        │   ├── 2026-05-05-phase-1-discovery-audit-pipeline.md
        │   ├── 2026-05-05-phase-2-ia-content-strategy.md
        │   └── 2026-05-06-pre-pitch-audit-pass.md              ⭐ The audit-pass plan
        └── decisions.md                                         Append-only decisions log
```

---

## 10. Stack reference

| Layer | Choice | Notes |
|---|---|---|
| Runtime | Node 24 LTS | matches Vercel default |
| Package manager | pnpm 10 | not npm/yarn |
| Framework | Next.js 16.2.4 | App Router, RSC, Server Actions |
| TypeScript | 5.7+ strict | `noUncheckedIndexedAccess` on |
| Styling | Tailwind CSS v4 | CSS-first config; `@theme` in globals.css |
| Fonts | Fraunces (display) + Geist (body) | via `next/font/google` |
| Animation | Framer Motion 12 + Lenis 1.3 + GSAP 3.15 | Lenis exposed at `window.__lenis` for the WhyPatientsStay snap |
| 3D | three 0.184 + @react-three/fiber 9 + @react-three/drei 10 | (R3F not currently rendered on home — earlier iterations retired) |
| Backend | Supabase | Postgres + Auth + Storage |
| Email | Resend (planned) | not wired yet |
| Hosting | Vercel | Hobby tier sufficient for pitch; Pro for v2 |
| Icons | lucide-react | not emojis |
| Testing | Vitest | 37 tests across content + lib |

### Local dev

```bash
cd "/Users/robguevarra/Documents/Coding Projects/ccd/ccd2"
pnpm install                  # one-time
pnpm dev                      # http://localhost:3000
pnpm build                    # production build (verify before deploy)
pnpm typecheck                # tsc --noEmit
pnpm vitest --run             # 37/37 passing
```

---

## 11. Known issues + caveats (be honest about these in the pitch)

1. **Doctor portraits are now REAL.** Five real headshots provided by the practice. No more Unsplash placeholders for doctors. Tell the dentist these are his actual team — no caveat needed.
2. **Hero supplementary photography is still Unsplash** — clinic atmosphere shots, service category covers. Real photo session is week-1 v2.
3. **Wordmark is text-based** (custom SVG using Fraunces). The practice provided a logo (moon/face/star/tooth — committed at `public/logo.png`); the wordmark + logo lockup is the current branding direction.
4. **Dev mode shows the Next.js "N" badge** at bottom-left. Disabled in production.
5. **Office hours are real** (Mon/Tues/Thurs 9–6, Wed 8–5, closed Fri/Sat/Sun) per the dental flyer.
6. **Suite 120, ZIP 91701** — confirmed from flyer.
7. **Email is real**: `advancedcare@dentisthsu.com` (per flyer).
8. **Phone is real**: `(909) 941-2811` (the number on both flyers).
9. **No real Resend/email integration yet** — the request-appointment form persists to Supabase but doesn't email. v2 wires Resend in 30 minutes.
10. **5 blog posts seeded** are Dr. Hsu's actual writing. He'll recognize them.
11. **"Five doctors" excludes Dr. Serena Hsu** pending confirmation. If she's still on staff, restoring her is a 2-line edit to `content/doctors.ts` (plus update the count strings in `app/(marketing)/page.tsx` and the various "Five doctors" headings).
12. **Lighthouse scores have not been measured against the production deploy.** Local builds compile clean; targeted Lighthouse-mobile spot check is on the post-deploy checklist below.

---

## 12. After the pitch — if signed

The master spec [§3 phases P3–P5](docs/superpowers/specs/2026-05-05-dentisthsu-redesign-master-spec.md#3-phase-plan-46-week-engagement) has the full plan. Many items that were originally v2 work have already been completed during the audit-pass + polish sweeps. What's left:

### Confirm-with-dentist items (week 1)
1. **Dr. Serena Hsu** — keep dropped or restore?
2. **Ortho / pediatric / sedation services** — actually offered? If so, restore.
3. **Logo: Frame A vs Frame B** — Frame A is currently canonical; Frame B exists at `~/Downloads/Dental/Frame B.png`. Confirm.
4. **Friday/Saturday closure** — permanent or seasonal?
5. **The `(800) 365-8295` toll-free + `(909) 558-8187` lines** — still active? If so, surface where?

### Photo session (week 1)
- 2–3 hours at the office
- Clinic interiors (operatories, waiting room, equipment shots)
- Replace the Unsplash hero supplementary imagery
- Replace service category covers
- Optional: re-shoot the 5 doctor portraits in a unified setup (current portraits are professional but appear to come from different shoots)

### Brand polish (week 1-2)
- **Logo SVG conversion** — currently 138KB PNG; SVG would be sharper + smaller
- **Final color palette lock** (currently teal accent at `#356a66` is WCAG-AA verified; minor shade tuning possible)
- **Typography pinning** — current Fraunces + Geist combo is editorial; finalize size scales

### Content depth (week 2-3)
- Long-form bodies are SHIPPED (200-350 words each on all 32 services). Further depth (500+ words) only if dentist requests.
- Doctor bios already swapped to flyer copy. Further depth optional.
- **"When this is medical / when this is dental"** dual-context blocks on shared procedures (surgical extractions, PRF/PRP, implants, oral appliance therapy)

### Integrations (week 3-4)
- **Resend** — wire `/request-appointment` to actually email
- **Live Google Places API** for reviews (replace curated JSON)
- **OpenDental + Weave PMS** — real appointment booking
- **Multi-user staff auth** — additional doctor accounts with roles
- **GA4 / Plausible** analytics
- **Search Console** + sitemap submission

### Polish + perf + a11y (week 5)
- Lighthouse mobile ≥ 95 across every route
- Real WCAG AA audit (axe + screen reader testing)
- Cross-browser pass
- Real iPhone testing of AirwayHero scroll-scrub mechanics

### Domain migration (week 6)
- `ccd-redesign.vercel.app` → `dentisthsu.com`
- Activate all 130+ redirects in `content/redirects.ts`
- DNS cutover with maintenance window
- Old WordPress site put behind redirect-only proxy

---

## 13. Decisions log

`docs/superpowers/decisions.md` is the append-only history of every material decision. Read before re-litigating anything.

**Key locked decisions:**
- Brand name: **Comfort Care Dental** (resolved against dentisthsu.com / Hsu's Dental Practice dual identities)
- Stack: Next.js + Supabase + Tailwind v4
- Pitch URL: Vercel subdomain, not custom domain
- Reviews: curated JSON now + admin "Connect Google Business" stub for v2
- Aventura is OUR SOTY teacher (analyzed per-dimension); TMJ Expert is the CLIENT'S reference
- Hero is `<AirwayHero>` scroll-scrubbed video (sleep-apnea airway visualization), captions narrowed to specialty
- Brand-broad story lives in `<WhyPatientsStay>` pinned carousel below the hero
- Editorial teal accent palette (`#e8f1f0` → `#356a66` → `#1f3d3b`); deep teal-black `#0a2520` for dark sections
- Lane sub-label switching: `/dental` → "DENTAL PRACTICE", `/medical` → "OROFACIAL PAIN & ORAL MEDICINE"
- 32 services across 9 subcategories under 2 lanes
- 5 doctors, no Serena Hsu (pending confirmation)

---

## 14. If something's broken

| Problem | First thing to try |
|---|---|
| `pnpm install` fails on `sharp` | `pnpm install --ignore-scripts && pnpm rebuild sharp` |
| `pnpm build` fails on TypeScript | `rm -rf .next && pnpm typecheck` to see real errors without Turbopack noise |
| AirwayHero scroll-scrub stutters | Check that the section has `isolation: isolate` on its parent (creates stacking context) |
| WhyPatientsStay carousel doesn't pin | Verify `position: sticky` on the inner div + outer wrapper has explicit `height: 300svh`. If user is on `prefers-reduced-motion`, the section falls back to a vertical stack — that's intentional. |
| Magnet snap fights the user | The 450ms input-quiet gate is intentional; if it feels too aggressive/passive, tune `SNAP_AFTER_QUIET_MS` in `components/why-patients-stay.tsx` |
| Lenis scroll reset on route change broken | `lenis-provider.tsx` listens to `usePathname()` and calls `lenis.scrollTo(0, { immediate: true })` on change. Confirm Lenis is mounted (check `window.__lenis`). |
| Supabase auth fails on prod | Verify env vars on Vercel and Supabase URL/key are correct (Settings → API in Supabase dashboard) |
| Form submits but nothing in dashboard | Check Supabase RLS policies on `appointment_requests` |
| Blog post publishes but doesn't appear on `/blog` | ISR revalidation didn't trigger. Check `app/admin/posts/actions.ts`'s `revalidatePath` calls |
| Doctor portraits don't load | Verify `public/images/doctors/dr-*.png` exists. Falls back to broken-image icon if missing. |
| Mobile menu doesn't open | The drawer is in `components/site-header.tsx` and uses local `useState` + body scroll-lock. Check the hamburger button's `aria-controls="mobile-menu"`. |

---

## 15. Final pre-pitch checklist

Run through this 24 hours before the meeting:

- [x] Repo pushed to GitHub (`github.com/robguevarra/ccd-redesign`)
- [ ] Vercel project deployed and accessible
- [ ] `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set on Vercel production env
- [ ] Demo admin account created on the live site
- [ ] Test publish a blog post end-to-end on the live site, then delete it
- [ ] Test the request-appointment form on the live site, verify it lands in Supabase
- [ ] Open the live site on your phone (real iPhone if possible)
- [ ] **Verify the AirwayHero scroll mechanic works on real iPhone** (iOS Safari has video-decoder quirks; the hero has explicit warmup logic but real-device testing is the only way to be sure)
- [ ] **Verify the WhyPatientsStay pinned carousel works on real iPhone** (touch swipe + magnet snap)
- [ ] Lighthouse mobile spot-check on `/`, `/dental`, `/medical/tmj`, `/dental/composite-fillings` (target ≥ 95)
- [ ] Print or save offline copies of `docs/audit/audit.md`, `docs/audit/competitive-teardown.md`, `docs/audit/dentist-questions.md`
- [ ] Practice the live-publish moment 3 times so the timing feels confident
- [ ] Bring two devices (laptop for screen sharing, phone for the mobile demo)
- [ ] Have the demo credentials written on a card you can hand him
- [ ] If Zoom: pre-share the URL in chat so he can click while you talk

You're ready. Go close it.

---

## 16. Recent commit timeline (for context)

The 43 commits since the original handoff baseline, in chronological order (top of `main`):

```
068a284 fix(home): magnet snap is now input-aware (no more fighting the user)
24cd958 feat(home): magnet snap on the pinned-scroll carousel
0b8c316 feat(home): pinned scroll-driven horizontal carousel for brand-broad section
8ffefb5 feat(home): narrow hero to specialty + add brand-broad editorial section
9c46dcb feat(home): restructure hero arc — identity → capability → relationship
8a1485a fix(home): F3 hero — 'The gentle dentist, still.'
80dee8b fix: clearer F3 hero copy + restore Blog link in nav
6939838 feat(home): swap section order, deep teal-black, humanize hero captions
a40e6ea feat(audit): mobile menu + teal expansion + doctor cards on home + hero warmth + factual fixes
acccb10 content: humanize service bodies + hero, drop 'medical-grade' phrasing
261f9a2 fix(doctors): nudge Dr. Rachel Lim portrait further (58% → 65%)
37e3964 fix(doctors): expose both shoulders for Singh + Lim thumbnails
72b42b7 fix(doctors): center Dr. Rachel Lim's portrait (45% → 50%)
47a53e4 fix(doctors): per-portrait focal points + scroll reset on route change
74840c9 feat(doctors): replace Unsplash placeholders with real practice portraits
5f7a7ad content(services): expand dental-lane bodies to long-form (200-350 words)
cb72d04 content(services): expand medical-lane bodies to long-form (200-350 words)
f65d913 chore: post-merge cleanups from final review (minor items)
f9b75f7 chore: optimize logo, untrack tsbuildinfo, autoPort for preview server
8100397 fix(audit): address final-review findings before pitch deploy
fb5e22e fix(contact): render corrected facts cleanly + surface email
080186c feat(medical): /medical landing + /medical/[slug] with TMJ signature special-case
4e042d2 feat(dental): /dental landing + /dental/[slug] service detail
a980b36 feat(home): replace 'Four practices' with two-lane card grid
590ecf8 feat(home): hero captions rewrite + drop redundant editorial section + fix doctor count
a3ab4ae feat(footer): surface email; collapse phones to single primary
8ea8e6e feat(header): logo + lockup + lane-aware sub-label + nav rebuild
7cd066c feat(lib): add getSublabel() for lane-aware header sub-label
b91a9d6 feat(ui): add <Logo> component for header lockup + recurring marks
ad5e35f style(theme): replace placeholder terracotta with editorial teal
9874b31 assets: add Comfort Care Dental logo (Frame A canonical)
a87f0a3 refactor(routes): delete /services route subtree
2d679e6 feat(redirects): add P3.5 lane-migration + 410 entries
2402d94 feat(content): add dental-lane services (22) to complete catalog
9e833c5 fix(services): extend surgical-laser-therapy body to clear test minimum
a0848cd feat(content): rewrite services.ts — medical lane (10 services)
cf21eee fix(content): roster reduced to 5; bios swapped to flyer copy
5e81e46 chore(schemas): remove stale 'email currently null' comment
f0c71fb fix(content): correct practice info from real flyers
5d4d548 test(content): scaffold acceptance tests for audit-pass invariants
a47397d refactor(schemas): extend Service with lane + subcategory fields
7811753 docs(plans): pre-pitch audit pass implementation plan — 23 tasks
e7f1847 docs(p3.5): pre-pitch audit pass spec — brand, IA, content & hero rewrite
```

Read these commit messages before making any change to a related area — every one of them encodes a decision that was made deliberately. Especially watch out for the `fix(audit):` commits, which encode the client's specific corrections (microscope claim, Comprehensive Exam, Porcelain Veneers, hours, suite, etc.). Don't regress those.

---

*Engagement records: `docs/superpowers/specs/`, `docs/superpowers/plans/`, `docs/superpowers/decisions.md`. Brainstorm session artifacts: `.superpowers/brainstorm/` (gitignored).*
