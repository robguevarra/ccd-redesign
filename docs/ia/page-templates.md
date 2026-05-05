# Page Template Inventory

**Date:** 2026-05-05
**Source:** [P2 spec §5](../superpowers/specs/2026-05-05-dentisthsu-phase-2-ia-content-strategy.md#5-page-template-inventory)

Six public templates plus one admin template. P3 designs against this inventory.

## Templates

### 1. Home

**Used by:** `/`
**Wow zone:** ✅ Full

The closer page. Single template, single instance. Cinematic hero (potentially 3D), services overview with editorial photography, doctor introduction, reviews highlight reel, request-appointment CTA, technology highlight strip, blog teaser. Per master spec §5 wow-moment roster.

### 2. Service

**Used by:** `/services`, `/services/<slug>`, `/services/tmj`
**Wow zone:** TMJ only

Three variants:

| Variant | Route | Wow zone |
|---|---|---|
| `overview` | `/services` | No — utility-led grid of category-grouped service cards |
| `detail` | `/services/<slug>` (most) | No — content-heavy page with hero photo, body, related services |
| `detail-signature` | `/services/tmj` | **Yes** — long-scroll case-study format with pinned visuals; honors TMJ Expert reference |

Selection logic: variant is `detail-signature` when the `Service.signature === true` in `content/schemas.ts`, else `detail`.

### 3. Doctor

**Used by:** `/doctors`, `/doctors/<slug>`
**Wow zone:** No

Two variants:

| Variant | Route |
|---|---|
| `overview` | `/doctors` — 6-doctor team grid with portraits + short bios |
| `detail` | `/doctors/<slug>` — full editorial bio with portrait, education, specialties, philosophy |

### 4. Editorial

**Used by:** `/about`, `/technology`, `/reviews`
**Wow zone:** No (but visually rich)

Long-form content-driven pages with substantial photography. Single template covers all three because they share structure: hero, narrative body, supporting imagery, optional CTA.

### 5. Utility

**Used by:** `/contact`, `/request-appointment`, `/financing`
**Wow zone:** No — utility-first, accessibility-conscious

Two variants:

| Variant | Route |
|---|---|
| `form-driven` | `/request-appointment` — primary purpose is the form |
| `content-plus-form` | `/contact`, `/financing` — content first, contact form below |

All utility pages: 18px+ body, 44×44 minimum tap targets, persistent phone CTA, no hover-only interactions, motion gated behind `prefers-reduced-motion`.

### 6. Blog

**Used by:** `/blog`, `/blog/<slug>`
**Wow zone:** No

Two variants:

| Variant | Route |
|---|---|
| `index` | `/blog` — chronological + tag filter |
| `post` | `/blog/<slug>` — Supabase-rendered MDX with hero, body, author, related posts |

### 7. Admin (hidden)

**Used by:** `/admin/login`, `/admin/dashboard`, `/admin/posts/*`
**Wow zone:** No — clean, productivity-focused

Three variants: `login`, `dashboard`, `editor`. Hidden from public IA via `noindex` + `nofollow`. Per [admin scope doc](admin-scope.md), only blog post editing is in pitch scope.

## Why six (and not more or fewer)

- More than six templates fragments the design system — by P4 we'd be maintaining ~10 component sets.
- Fewer than six forces all utility pages to use the same template as the home, which compromises mobile-first usability.
- Six is the count Aventura uses (per P1 teardown) — and Aventura's IA was the structural reference for our shallow IA principle.
