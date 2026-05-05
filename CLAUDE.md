# Project: Dentisthsu.com Redesign — Pitch Site

> Read this file first in any new Claude Code session. It orients you to the project state, where artifacts live, and what's been decided.

## What this project is

A **pitch website** — a live, deployed reimagining of [dentisthsu.com](https://dentisthsu.com/) — built to win an engagement with the practice owner. It is *not* a delivered production site. The deliverable is a Vercel demo URL + working `/admin` login + a leave-behind PDF + Loom walkthrough.

**Engagement timeline:** 4–6 weeks to pitch day.
**Engagement owner:** Rob Guevarra (`robneil@gmail.com`).
**Reference visual ceiling:** [aventuradentalarts.com](https://aventuradentalarts.com/), [tmjexpert.com](https://tmjexpert.com/gallery/tmj-cases/tmj-treatments/02/).

## Read these docs before doing anything else

1. **Master spec** — [docs/superpowers/specs/2026-05-05-dentisthsu-redesign-master-spec.md](docs/superpowers/specs/2026-05-05-dentisthsu-redesign-master-spec.md)
   The single source of truth for project framing, design principles, phase plan, stack, visual direction, scope, and success criteria.
2. **Decisions log** — [docs/superpowers/decisions.md](docs/superpowers/decisions.md)
   Running log of decisions made mid-phase. Append, never edit history.
3. **Phase detail specs** — [docs/superpowers/specs/](docs/superpowers/specs/)
   Each phase (P1–P5) has its own detail spec. Open the one for the current phase.

## Current project state

| Item | Status |
|---|---|
| Master spec | ✅ Written, approved 2026-05-05 |
| Phase 1 detail spec | ✅ Written, approved 2026-05-05 — [P1 spec](docs/superpowers/specs/2026-05-05-dentisthsu-phase-1-discovery-audit.md) |
| Phase 1 implementation plan | ⏳ Next — to be produced via the writing-plans skill |
| Phase 2–5 detail specs | ⛔ Not started |
| Code | ⛔ Not started — implementation begins after the P1 plan exists |
| Vercel project | ⛔ Not created yet |
| Supabase project | ⛔ Not created yet |
| Firecrawl API key | ✅ In `.env.local` (gitignored) |

## Stack (locked)

- **Front-end:** Next.js 15 (App Router, RSC), TypeScript strict, Tailwind v4, shadcn/ui (selectively restyled), Framer Motion, Lenis, targeted GSAP, react-three-fiber if a hero needs 3D
- **Data:** Supabase (Postgres + Auth + Storage)
- **Hosting:** Vercel (Hobby tier)
- **Email:** Resend
- **CMS:** Supabase-backed `/admin` route. No Sanity / Contentful / etc.
- **Pitch URL:** `dentisthsu-redesign.vercel.app` (Vercel subdomain, not the dentist's domain)

## Non-negotiables

These come straight from the master spec — do not relitigate without explicit user direction:

1. **Dual-audience design.** Cinematic treatment is a *zone* (homepage hero, services overview, signature service page) — every utility page is patient-friendly: 18px+ body, prominent phone CTA, large tap targets, no hover-only interactions.
2. **Mobile-first.** Designed at 375px first; tested on real iPhone SE before shipping.
3. **Accessibility.** WCAG AA, full keyboard nav, visible focus rings, all motion gated behind `prefers-reduced-motion`.
4. **Performance.** Lighthouse mobile ≥ 95 across all pages. LCP < 2.5s. FCP < 1.5s.
5. **Real over decorative.** Editorial photography, real reviews (curated), real services language scraped from the practice. No generic stock.
6. **Wk 4 feature freeze is sacred.** Wk 5 is polish/perf/a11y only.

## Working conventions

- All specs live under `docs/superpowers/specs/` with `YYYY-MM-DD-<topic>.md` naming.
- Decisions log: `docs/superpowers/decisions.md`. Append a row for any material decision.
- Brainstorm artifacts (visual companion mockups, etc.): `.superpowers/brainstorm/`. Add to `.gitignore` if not already.
- New phase = new detail spec, not edits to the master.
- Master spec changes require an explicit decision-log entry referencing the change.

## What's intentionally out of scope (don't add these without asking)

- Real PMS integration (OpenDental, Weave, Dentrix)
- Live Google Places / Yelp API
- Multi-user staff auth, roles, permissions
- HIPAA-compliant patient data handling — no PHI on the pitch site
- Multi-language (English only)
- E-commerce, live chat, SMS, patient portal
- Any third-party widget that brands itself on the page

## How to resume in a new session

1. Read this file.
2. Read the master spec.
3. Read the most recent decisions-log entries.
4. Find the active phase detail spec.
5. Continue from where the user left off.
