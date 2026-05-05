# Dentisthsu.com Redesign — Master Spec

**Date:** 2026-05-05
**Status:** Approved (pre-implementation)
**Engagement type:** Pitch site to win the practice owner
**Timeline:** 4–6 weeks to pitch day
**Primary author:** Rob Guevarra (`robneil@gmail.com`)

---

## 1. Project framing & goals

### What this project is

A pitch website — a live, deployed reimagining of [dentisthsu.com](https://dentisthsu.com/) — built to win an engagement with the practice owner. It is **not** a delivered production site. It is a pre-sale artifact whose job is to demonstrate so much craft and strategic thinking that the owner cannot reasonably hire anyone else.

### Primary success metric

The dentist signs the engagement after seeing the demo.

### Secondary outcome

Whatever we produce in the pitch becomes the foundation for v2 if we win. So phases that look like "pitch theater" — audit doc, IA, content schema, design system — are also real artifacts that survive into the production build. **Nothing we make should be throwaway.**

### Deliverables on pitch day

1. A Vercel-deployed demo URL the dentist can click through on his own time.
2. A live admin login (`/admin`) where he can create a draft blog post during the pitch meeting and watch it appear on the site within 10 seconds.
3. A 1–2 page leave-behind PDF: audit findings, design rationale, engagement scope/price for v2.
4. A Loom walkthrough video.

### What the dentist will judge it on

- "Does this look more impressive than what my friends/competitors have?"
- "Does this person *get* my practice — services, patients, brand?"
- "Will my actual patients be able to use this?"
- "Is this real, or is this a magic trick that falls apart in v2?"

The build must answer "yes" to all four.

### Reference points

- [aventuradentalarts.com](https://aventuradentalarts.com/) — visual ceiling and motion language anchor
- [tmjexpert.com/gallery/tmj-cases/tmj-treatments/02/](https://tmjexpert.com/gallery/tmj-cases/tmj-treatments/02/) — long-scroll narrative case-study reference (client-supplied)

---

## 2. Design principles

When two principles conflict, the lower-numbered principle wins. Principles 1 and 2 are equal-priority constraints, not preferences.

### 1. Dual-audience design — split the experience

The site has two audiences with opposite needs:

- **The owner (pitch audience)** wants to feel impressed. This is the room where the contract gets signed.
- **Patients (end users)** are mostly older, less tech-savvy. They land here to find phone, hours, address, or to request an appointment.

**Resolution:** the cinematic treatment is a *zone*, not a *style*. The hero/landing experience is "wow tier." Every functional page (services, doctor, contact, request appointment, location) is **utility-first**: 18px+ body baseline, 16px+ on inputs, prominent phone CTA in header at all times, large tap targets (44×44 minimum), no hover-only interactions, no microscopic icons. Older patients should never need to navigate through cinematic content to do something useful.

### 2. Mobile-first, not mobile-last

Every screen is designed at 375px first, scaled up to desktop. Tap-to-call is a primary feature. Homepage is tested on a real iPhone SE before any feature ships.

### 3. Accessibility is leverage, not friction

WCAG AA contrast ratios. Full keyboard navigation. Visible focus rings (never removed). All images alt-texted. All motion gated behind `prefers-reduced-motion`. For a medical practice, this is also a liability lever and a sales talking point.

### 4. Performance is part of the design

Target: Lighthouse mobile ≥ 95 across all pages. LCP < 2.5s. FCP < 1.5s. Effects don't ship if they break this budget. Images optimized aggressively (AVIF/WebP, sized variants, lazy below-fold). Animations code-split.

### 5. Real over decorative

Editorial photography. Real reviews (curated from the dentist's actual Google + Yelp pages). Real services language scraped from the practice. No generic stock smiles, icon-set thumbnails, or fabricated testimonials. Placeholders are explicitly marked as such.

### 6. The "wow" zone is small and intentional

Cinematic treatment lives in 2–3 specific surfaces only. Everywhere else is *quietly* well-designed — confident typography, generous spacing, calm color, restrained motion. SOTY-tier sites win because the wow moments are *rare and strong*.

---

## 3. Phase plan (4–6 week engagement)

| Phase | Window | Output |
|---|---|---|
| **P1 · Discovery & Audit** | Wk 1 (+ overflow into early Wk 2) | `source/`, `audit.md`, `competitive-teardown.md`, `asset-inventory.md` |
| **P2 · IA + Content Strategy** | Wk 1.5–2 | `sitemap.md`, `content-schemas.ts`, `redirects.md`, page-template inventory |
| **P3 · Visual & Brand Direction** | Wk 2 | Design tokens, mood board, 2 hero comps, motion language doc, logo direction |
| **P4 · Front-end Build** | Wk 2.5–5 | The Next.js codebase + Supabase schema |
| **P5 · Launch + Pitch Polish** | Wk 5–6 | Live URL, Loom walkthrough, leave-behind PDF, Lighthouse report |

### Decision gates (hard locks)

- **End of Wk 1:** audit findings reviewed before IA begins.
- **End of Wk 2:** visual direction picked from 2 hero comps. No more aesthetic churn after this point.
- **End of Wk 4:** feature freeze. Wk 5 is polish, performance, and accessibility only — no new features even if tempted.
- **End of Wk 5:** production deploy locked. No changes after this.

### Phase outputs survive into v2

Every artifact above is meant to be reusable in the production build if we win. Audit informs IA. IA informs schema. Schema is the Supabase table definitions. Design tokens become the runtime CSS. Codebase is the codebase.

---

## 4. Stack & architecture

### Architecture: Static-first marketing + live admin (Approach A)

Marketing pages render via SSG/ISR. Admin publish triggers revalidation via cache tags. Form submissions handled by Server Actions.

### Front-end

- **Next.js 15** — App Router, RSC, Server Actions
- **TypeScript** — strict mode, end-to-end types from Supabase schema → React props via generated types
- **Tailwind CSS v4** — with custom design token layer in `app/styles/tokens.css`
- **shadcn/ui** — primitive base, used selectively, heavily restyled. Not "shadcn-default look."
- **Framer Motion** — component-level animations (page transitions, scroll-reveals, in-view)
- **Lenis** — smooth scrolling
- **GSAP + ScrollTrigger** — scoped to hero only, for choreographed scroll-driven moments
- **react-three-fiber + drei** — only if a specific hero design calls for 3D. Gated behind `prefers-reduced-motion`. Static fallback always exists.

### Data layer

- **Supabase** — Postgres + Auth + Storage
- **Initial tables** (refined in P2): `blog_posts`, `services`, `doctors`, `appointment_requests`, `media_assets`
- **Auth:** single dentist account for the admin demo. No multi-user, no roles. (v2.)
- **RLS** enabled on every table from day one
- **Generated TypeScript types** via `supabase gen types typescript` in CI

### Rendering strategy

| Surface | Strategy |
|---|---|
| Marketing pages (`/`, `/services/*`, `/doctor`, `/about`, `/contact`, `/request-appointment`) | SSG + ISR with cache tags |
| Blog index + post pages | ISR, revalidated on publish via `revalidateTag()` from admin |
| Admin (`/admin/*`) | Dynamic SSR, protected by middleware checking Supabase Auth session |
| Reviews section | Static JSON in repo (`content/reviews.json`), imported at build. Swappable to Places API in v2. |

### Form handling

- Request-appointment form → Server Action → writes to Supabase `appointment_requests` + sends email via **Resend**
- Honeypot + rate-limit (Vercel Edge Config or Upstash)
- Inline success state, no redirect, with "we'll call you within 1 business day" promise

### Image pipeline

- All images through `next/image` with AVIF + WebP fallbacks
- Hero images: explicit width/height + `priority`
- Below-fold: lazy by default
- Storage: Supabase Storage for CMS-uploaded media; static editorial images in `/public/images/`
- Source images target: 2× rendered size, ≤ 200KB after optimization

### Hosting / deploy

- **Vercel** (Hobby tier sufficient for the pitch)
- `main` branch = production demo URL
- PR previews for any iteration
- Pitch URL: a Vercel subdomain like `dentisthsu-redesign.vercel.app`

### Observability

- Vercel Analytics (Web Vitals)
- A simple `/admin/dashboard` showing recent appointment requests + most-viewed blog posts

### Out of stack (deliberate exclusions)

- No Sanity / Contentful / Strapi — Supabase is the CMS
- No Storybook for the pitch — design system tokens documented in a single MDX page instead
- No Playwright e2e — manual cross-device QA is enough for the pitch
- No i18n library
- No state management library (Zustand/Redux) — RSC + URL state + small `useState` islands

---

## 5. Visual & motion direction

This sets constraints for Phase 3 — it does not pick fonts and colors yet.

### Visual character

- **Editorial calm**, not "tech startup." *Kinfolk* / *Cereal* magazine reference, not a SaaS landing page.
- **Warm and human**, not clinical-cold. Deliberately avoid the dental-industry default of white + sterile blue + stock smiling teeth.
- **Confidence through restraint.** One serif headline face + one humanist sans body, big size jumps in type scale, very few rules but the ones we have are consistent.

### Brand canvas

**Blank canvas — full rebrand permission.** P3 produces a logo direction + brand wordmark alongside type/color/motion.

### Type system principles

- **Display:** serif with character (Reckless / GT Sectra / Tiempos Headline tier; open-source equivalents: Source Serif 4, Fraunces). Used at 48–96px in wow zones.
- **Body:** humanist sans with great small-size legibility (Inter, General Sans, or open: Geist Sans). Body baseline 18px, never below 16px.
- Tabular numerals for phone numbers, hours, addresses.
- Line-height: 1.5 body, 1.05–1.15 display.

### Color system principles

- Light surface as default — high-contrast for older readers.
- Single restrained accent color used sparingly. Probably terracotta, deep teal, or oxblood. Locked in P3.
- Charcoal (~`#1a1a1a`) instead of pure black for body text.
- Separate dark surface palette reserved for the hero / wow zone only.

### Motion language

Three categories:

1. **Cinematic** — wow zone only. Scroll-choreographed, 600–1200ms, custom cubic-bezier easing. May include 3D, parallax, scroll-pinning.
2. **Considered** — section-level reveals on utility pages. Fade + 8–12px translate, 250–400ms, ease-out. One trigger per section, no chains.
3. **Functional** — hover/focus/active feedback, loading states, form validation. < 200ms, immediate.

`prefers-reduced-motion` disables categories 1 and 2 entirely. Category 3 stays. **No autoplay on page entry** — motion fires on scroll-into-view or interaction.

### 3D / R3F usage

- One signature use only — most likely homepage hero
- Possibility: slowly rotating abstract dental form (tooth, arch, instrument shape) in matcap material with a single moving light
- Lazy-loaded via `<Suspense>` so it doesn't block first paint
- Static fallback image for reduced-motion + low-end devices
- Bundle budget: ≤ 200KB gzipped JS + ≤ 300KB textures total

### Photography direction

- **Dentist's actual portrait + clinic interior shots** = doctor page, about page (credibility)
- **Editorial stock** = hero supporting imagery, services backgrounds, blog headers
- **Light AI fill** (Midjourney / Flux) = abstract close-ups (instruments, hands, light, water) where editorial stock falls short
- Color-grade pass on all three sources to feel like one shoot

### Layout grid

- 12-column desktop (1280px container, 80px gutters)
- 8pt spacing unit
- Asymmetric layouts allowed in wow zone; strict symmetric grids in utility zone

### Wow-moment roster (locked)

1. **Homepage hero** — full-viewport scroll-choreographed sequence with 3D
2. **Services overview** — animated grid reveal, large editorial photography
3. **Signature service detail page** — likely TMJ (per client reference). Long-scroll narrative with pinned visuals.
4. *Maybe* a doctor/about cinematic portrait section

Everything else — service detail pages, contact, request appointment, blog index, blog post, location, hours — is utility zone.

---

## 6. Out of scope, risks, success criteria

### Out of scope for the pitch (may return in v2)

- Real PMS integration (OpenDental, Weave, Dentrix) — even read-only
- Live Google Places / Yelp review API integration
- Multi-user staff authentication, roles, permissions
- HIPAA-compliant patient data handling — no PHI passes through the pitch site
- Spanish or any non-English locale
- E-commerce (no merch, membership, payment processing)
- Live chat / chatbot
- Patient portal / records access
- SMS notifications
- Marketing automation (HubSpot, Mailchimp) integration
- Analytics beyond Vercel Web Vitals
- A/B testing infrastructure
- Sanity / Contentful / any CMS other than Supabase
- E2E test suites
- Storybook / Chromatic
- Internationalized URLs

### Out of scope, period

- Aggressive lead-gen patterns (countdown timers, exit-intent pop-ups, "limited time" CTAs) — wrong tone for a medical practice
- Any third-party widget that brands itself on the page (Trustindex, Birdeye, Podium chat)

### Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Hero 3D piece blows performance budget | Medium | High | Bundle budget enforced as CI check; static fallback always exists |
| Visual direction lock slips past Wk 2 | Medium | High | Hard decision gate; only 2 hero comps offered, not 3+ |
| Scraping dentisthsu.com is blocked / hostile | Low | Medium | Fall back to manual content extraction page-by-page |
| Dentist's existing photography is too weak | High | Low | Direction principle accommodates — editorial stock + AI fill the gap |
| Supabase Auth flow rough in admin demo | Medium | High | Stand it up Wk 3, not Wk 5 |
| Lighthouse mobile drops below 95 | Medium | Medium | Wk 5 reserved entirely for performance |
| Pitch meeting moves up | Medium | High | Each phase has a "minimum viable" cut documented in Phase 1 spec |

### Success criteria — hard requirements

If any of these miss, we did not ship the pitch:

- Live Vercel deployment at a public URL
- Working `/admin` login; dentist creates + publishes a draft live during the meeting; appears on site within 10 seconds
- Lighthouse mobile: Performance ≥ 95, Accessibility = 100, Best Practices ≥ 95, SEO ≥ 95 — across all marketing pages
- WCAG AA compliant (axe-core run clean) on every shipped page
- Working request-appointment form: submission → Supabase row + email in < 5 seconds
- Mobile QA on real iPhone SE + a real Android (Samsung A-series tier)
- Loom walkthrough recorded
- Leave-behind PDF prepared

### Success criteria — soft (what makes the pitch likely to win)

- Hero produces a verbal "wow" within 5 seconds of the dentist opening the URL
- Dentist asks "wait, can my patients actually use this?" and the answer is demonstrably yes
- Leave-behind PDF gets shown to a spouse/business partner without you in the room
- Audit reveals at least one *non-obvious* problem with the current site that the dentist hadn't seen

### Decision-gate change management

- Changes inside a phase: author makes the call, logged in `decisions.md`
- Changes that cross phases: require explicit pause and re-spec; not allowed mid-phase
- Changes after Wk 4 feature freeze: blocked unless they prevent a hard requirement from missing

---

## Appendices

- **A.** Phase 1 detail spec — [2026-05-05-dentisthsu-phase-1-discovery-audit.md](2026-05-05-dentisthsu-phase-1-discovery-audit.md)
- **B.** Decisions log — `docs/superpowers/decisions.md`
- **C.** Brainstorm artifacts — `.superpowers/brainstorm/35820-1777937674/content/`

---

## Document conventions

- This doc is **living**. Material changes update the doc and append a row in `decisions.md`.
- Each subsequent phase gets its own detail spec under `docs/superpowers/specs/`.
- The CLAUDE.md at the project root indexes this doc and orients new sessions.
