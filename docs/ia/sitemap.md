# Sitemap (post-redesign)

**Date:** 2026-05-05
**Source:** [P2 spec §3](../superpowers/specs/2026-05-05-dentisthsu-phase-2-ia-content-strategy.md#3-sitemap-the-new-ia)
**Predecessor data:** [`source/sitemap.json`](../../source/sitemap.json) (184 old URLs)

## Routes

```
PUBLIC (indexable)
/                              Home — wow zone
/about                         Practice story — 1999 origin, philosophy, community
/doctors                       Team overview — all 6 doctors
/doctors/<slug>                Per-doctor bio (6 pages)
/services                      Services overview — 4 categories
/services/<slug>               Service detail (~13 services)
/services/tmj                  ⭐ Wow-zone signature — long-scroll case-study format
/technology                    NEW — CBCT, Trios, Zeiss microscope (differentiator)
/reviews                       Curated 5★ reviews (Google/Yelp/Facebook)
/blog                          Blog index
/blog/<slug>                   Blog post (Supabase-driven)
/contact                       Hours, address, directions, phones
/request-appointment           Form — Server Action → Resend + Supabase
/financing                     CareCredit, payment plans, insurance

ADMIN (noindex, nofollow)
/admin/login                   Supabase Auth
/admin/dashboard               Recent appointment requests + post list
/admin/posts                   Post list
/admin/posts/new               New-post editor
/admin/posts/[id]              Edit post
```

**~17 marketing routes + 4 admin routes.** Down from 184 URLs in the audit's old sitemap.

## IA changes vs. old site

| Change | Old | New | Rationale |
|---|---|---|---|
| New page added | — | `/technology` | Audit surfaced Dr. Hsu's strongest differentiator (CBCT 2014, Trios 2024, Zeiss microscope, CBCT accreditation) was buried |
| 27+ testimonial URLs collapsed | `/testimonial-<name>` × 27 | `/reviews` | Per master spec curated-JSON strategy; testimonial-per-URL was a thin-content anti-pattern |
| Doctors split into team + per-doctor | `/doctors-dr-<name>` × 6 | `/doctors` (overview) + `/doctors/<slug>` × 6 | Doctor team is real; index page warranted |
| Services taxonomy clarified | mixed `/services-<x>-html` + `/services/<x>` | single canonical `/services/<slug>` | Audit found duplicate taxonomy from old WordPress permalink structure |
| Personal blog separated | `/2011-..-html` + Blogger subdomain | Blog content scoped to practice; family content moved to v2 decision (deferred) | Audit content-quality finding #3 |
| Theme demo / lorem / hello-world pages | ~85 zombie URLs | (deleted; 410 Gone or 301 to home) | Audit IA finding #1 |
| Subdomain installs | `2017.dentisthsu.com`, `www.blog`, `www.familyblog` | (spun down; 301 to canonical) | Audit IA finding |

## Wow-zone roster (master spec §5)

These three surfaces get the cinematic treatment. Everything else is utility-first.

1. `/` — full-viewport scroll-choreographed hero with 3D
2. `/services` — animated grid reveal, large editorial photography
3. `/services/tmj` — long-scroll narrative with pinned visuals (signature service detail)

Optional 4th: a cinematic portrait section on `/about` or `/doctors/dr-brien-hsu`.

## Route file convention (Next.js App Router)

```
app/
├── (marketing)/
│   ├── page.tsx                              # /
│   ├── about/page.tsx
│   ├── doctors/{page.tsx,[slug]/page.tsx}
│   ├── services/{page.tsx,[slug]/page.tsx}
│   ├── technology/page.tsx
│   ├── reviews/page.tsx
│   ├── blog/{page.tsx,[slug]/page.tsx}
│   ├── contact/page.tsx
│   ├── request-appointment/page.tsx
│   └── financing/page.tsx
└── admin/
    ├── login/page.tsx
    ├── dashboard/page.tsx
    └── posts/{page.tsx,new/page.tsx,[id]/page.tsx}
```
