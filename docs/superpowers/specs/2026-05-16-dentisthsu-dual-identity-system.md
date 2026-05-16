# Dual-Identity System — Cold Open + Twin-Mark Header + Logo Morph

**Date:** 2026-05-16
**Status:** Approved (brainstorming session)
**Scope:** Reshape how Comfort Care Dental's dental + medical duality lands on the deployed pitch site. Adds a Frame 0 cold open on `/`, a twin-mark header lockup with a Dental/Medical toggle, and a single `data-lane`-driven re-theming mechanic that re-skins chrome on lane change.
**Predecessors:** [Pre-pitch audit-pass spec](2026-05-06-dentisthsu-pre-pitch-audit-pass.md) (established the dental/medical IA, sub-label switching, lane chooser). This spec extends the same duality with louder presence and a signature mechanic.

---

## 1. Why

Today the duality is real but quiet. The header carries one unified `<Logo>` with a 10px sub-label that swaps per route. The hero (AirwayHero) is specialty-narrowed to TMJ / sleep apnea — patients don't learn the practice is *also* dental until scroll position ~70vh, when they hit the "Two practices, under one roof" lane chooser.

Client feedback (2026-05-16): "this is not just a dental site but a medical site also. When [patients] come to visit the site, if they're a medical patient, they know this site caters to medical. If they're dental, they'll know this is for dental also." Client will deliver a second logo for the medical side.

The fix is **not a separate pre-landing page** — that adds intro tax for pain-driven traffic and breaks the master spec wow-zone rule. The fix is to extend `/`'s scroll arc with a cold-open Frame 0 above the AirwayHero, make the header carry both marks always, and introduce a single signature interaction — the **logo morph** — deployed in both surfaces.

---

## 2. What ships

Three coordinated changes that share one mechanic.

### 2.1 Frame 0 — Twin-Mark Cold Open

A new 100vh editorial diptych at the top of `/`, above the AirwayHero. Both logos appear in the first paint. Both audience promises land before the patient scrolls.

**Layout (desktop ≥ 768px):**

```
┌──────────────────────────────────┬──────────────────────────────────┐
│ [Dental mark, 56px]              │              [Medical mark, 56px]│
│                                  │                                  │
│ FAMILY · RESTORATIVE · COSMETIC  │   OROFACIAL PAIN · ORAL MEDICINE │
│                                  │                                  │
│ For the family you bring back    │   For pain everyone told you was │
│ every six months.                │                       permanent. │
│                                  │                                  │
│ [grayscale editorial photo,      │   [grayscale editorial photo,    │
│  warm-stone tint]                │    teal-ink tint]                │
│                                  │                                  │
│ Enter dental →                   │                Enter medical →   │
└──────────────────────────────────┴──────────────────────────────────┘
                          ↓ (pulse, then disappears on scroll)
```

A 1px hairline divides the halves vertically. Each half is a real `<Link>` to `/dental` and `/medical` respectively — clickable anywhere in the half, not just the CTA.

**Layout (mobile < 768px):**

Vertical stack. Dental half top, medical half bottom. Both reach the 44px tap-target minimum on every interactive element. Both halves above the fold on iPhone 13+ (target: 50svh per half, 100svh total with header consuming ~12svh).

**Copy (locked):**

| Half | Eyebrow | Title | Body | CTA |
|---|---|---|---|---|
| Dental | `FAMILY · RESTORATIVE · COSMETIC` | "For the family you bring back every six months." | (none — title carries it) | "Enter dental →" |
| Medical | `OROFACIAL PAIN · ORAL MEDICINE` | "For pain everyone told you was permanent." | (none — title carries it) | "Enter medical →" |

The titles are deliberately patient-direct. Italic on the second clause where the editorial register suits it (`every six months.` and `permanent.`), matching the existing Fraunces treatment elsewhere on the site.

**Background treatment:** dental half uses warm-stone gradient (`#f5f3ee → #ede4d4`), medical half uses ink-teal gradient (`#0a2520 → #06231f`). Existing `--color-ink-teal` and `--color-stone-50/200` tokens are reused; no new palette additions required.

**Photography:** one editorial photograph per half, grayscale by default, color on hover. Placeholders ship as Unsplash references until real photography from the v2 photo session. Each photo occupies the lower 40% of its half. Both photos lazy-load with LQIP blur to protect LCP.

### 2.2 Twin-Mark Header Lockup

The header (`components/site-header.tsx`) replaces the current single-`<Logo>` + wordmark lockup with:

```
[ CC logo · "Comfort Care" wordmark · sub-label ]          [ Dental | Medical toggle ]
```

The brand block on the left is unchanged. The new element on the right is a **segmented two-button toggle**:

- Each button: 40px tall, glyph (16px square) + text label ("Dental" / "Medical"), real `<Link>` to `/dental` and `/medical`.
- Active state is **multi-channel**: filled background pill, inverted text/glyph color, semi-bold weight. Not opacity-only.
- Inactive state is muted (60% text contrast, transparent background) but still WCAG AA legible — never falls below 4.5:1 contrast.
- Focus ring: 2px solid outline at `outline-offset: 3px`. Visible on keyboard tab.
- ARIA: each button is a real link, but additionally annotated with `aria-current="page"` when its lane matches the active route. The container is `role="group"` with `aria-label="Practice lane"`.

**Older-patient UX considerations** (per decision):
- Text labels alongside glyphs, not glyphs alone.
- Tap targets ≥ 40px on mobile, ≥ 36px on desktop.
- Active state distinguished by fill + color + weight (three independent channels) — color-blindness safe.
- Tooltip on hover/focus: "Switch to medical side" / "Switch to dental side."

**Sub-label** (existing `getSublabel()` helper, unchanged):
- `/dental` → `DENTAL PRACTICE`
- `/medical` → `OROFACIAL PAIN & ORAL MEDICINE`
- other routes → `EST. 1999 · RANCHO CUCAMONGA`

**Mobile (< 768px):** the toggle compresses into a dedicated row directly below the brand row. Two buttons, full-width-split, 40px tall. Mobile hamburger drawer (existing) keeps its current structure.

### 2.3 The Logo Morph — Signature Interaction

Triggered on every lane navigation. When the user clicks the medical button on `/dental` (or any link that leads to `/medical/*`, including the Frame 0 medical half, the existing lane chooser, footer links), the brand-block logo mark animates from the active lane's mark to the new lane's mark.

**Choreography (~350ms total):**

1. Outgoing mark scales `1 → 0.85` and fades opacity `1 → 0` (180ms ease-out).
2. At 120ms (overlap), incoming mark enters from `scale(0.85)` and fades in to full opacity (230ms ease-out).
3. Accent color CSS variable cross-fades over the full 350ms.
4. Sub-label text re-types: outgoing fades out (120ms), incoming fades in (180ms) — actual content swap happens at the midpoint, not a typewriter.

**Asset strategy:**

- **Phase 1 (now, no medical SVG yet):** the placeholder medical mark is the dental mark color-inverted (white-on-dark vs. dark-on-light). The morph runs as a cross-fade with a color shift. Still feels intentional; not yet awwwards-grade.
- **Phase 2 (when client delivers medical SVG):** if the medical SVG arrives with comparable path complexity to dental, upgrade the morph to true SVG path interpolation (Framer Motion's `path` motion or a small Flubber-style helper). Same component, same trigger. The Phase 1 cross-fade remains the fallback path for `prefers-reduced-motion` or browsers without SMIL support.

**Where the morph runs:**
- Header lockup (every lane navigation).
- Frame 0 cold open — on first paint, the marks ghost-in staggered (the entry animation in §3.3). When the user clicks into a half, the cold open lifts off the page entirely (first-scroll handoff), so the morph itself doesn't fire there — the entry sequence covers it.

### 2.4 The `data-lane` Re-theming Mechanic

A `data-lane` attribute drives all lane-aware chrome. Because `<SiteHeader>` and `<SiteFooter>` live in `(marketing)/layout.tsx` — structurally **outside** the route-segment layouts for `/dental` and `/medical` — we apply `data-lane` at the **themed-island level**, not at a single root wrapper. Each island self-themes by reading the lane from `usePathname()`.

**Three themed islands** each carry their own `data-lane`:

1. **`<SiteHeader>`** — already a Client Component; calls `getLane(usePathname())` and sets `data-lane` on its own `<header>` root.
2. **`<SiteFooter>`** — converted to a Client Component (or kept as Server Component with a thin Client wrapper around the data-lane attribute); same pattern.
3. **Page content area** — themed by `app/(marketing)/dental/layout.tsx` and `app/(marketing)/medical/layout.tsx` (new Server Components) wrapping `children` in `<div data-lane="dental \| medical" className="contents">`. The `contents` class keeps the div layout-less.

Everywhere else (`/`, `/about`, `/doctors`, `/blog`, `/admin/*`) the islands resolve `getLane` to `'neutral'` and don't set `data-lane`, so CSS falls through to `:root` defaults — preserving the current site theme exactly.

**Why this pattern:** each island is fully SSR-correct on direct landings (the header's pathname is available server-side via `headers()` if needed, or via client hydration matching the route). No FOUC, no middleware, no global state. The cost is touching three components instead of one — but each touch is mechanically identical (one attribute set).

```css
/* globals.css */
:root {
  /* Current "neutral" values — these stay as today's defaults */
  --color-accent-50:  #e8f1f0;
  --color-accent-200: #98c1bd;
  --color-accent-600: #356a66;
  --color-accent-900: #0a2520;
  --color-surface:    #f5f3ee;
  --color-ink:        #1a1410;
}

[data-lane="dental"] {
  --color-accent-50:  #f5ede1;
  --color-accent-200: #d4c2a8;
  --color-accent-600: #8a6a3a;
  --color-accent-900: #4a3920;
}

[data-lane="medical"] {
  --color-accent-50:  #e8f1f0;
  --color-accent-200: #98c1bd;
  --color-accent-600: #356a66;
  --color-accent-900: #0a2520;
}
```

CSS variables cascade — every descendant of the `data-lane` wrapper resolves these locally. The header (which sits *above* the marketing layout in the tree, inside `app/(marketing)/layout.tsx`) needs to read the lane separately for its toggle's `aria-current` state; it uses `usePathname()` + `getLane()` for that. The header's own theming follows the page below it via a wrapping technique: we render the toggle and brand in a container marked with the resolved lane so the morph + accent stay synced.

**Why not `<html>`?** Setting `data-lane` on `<html>` would require either middleware (overkill for one attribute), a workaround through `headers()`, or a client-side effect that causes FOUC on direct landings. Wrapping at the route-segment level is fully server-rendered, has no extra runtime cost, and scopes the cascade exactly where it's needed.

**What this re-themes for free** (every consumer of these vars already exists in the codebase):

| Element | Source file | Current behavior | Re-themed behavior |
|---|---|---|---|
| Eyebrow text | multiple | `var(--color-accent-600)` | flips warm/teal per lane |
| Footer headings & hover | `components/site-footer.tsx` | `var(--color-accent-200)` | flips |
| Doctor card backgrounds | `app/(marketing)/page.tsx` | `var(--color-accent-900)` | flips |
| Mobile drawer active state | `components/site-header.tsx` | `var(--color-accent-600)` | flips |
| Lane chooser hover | `app/(marketing)/page.tsx` | `var(--color-accent-50)` | flips |
| Technology eyebrow & link hover | `app/(marketing)/page.tsx` | `var(--color-accent-600/900)` | flips |
| Review stars & "via X" | `app/(marketing)/page.tsx` | `var(--color-accent-600)` | flips |

**What does NOT re-theme** (per decision):
- Hero copy (AirwayHero captions stay specialty-narrowed regardless of lane — they read fine in either context).
- Nav item order (Dental still appears before Medical in nav regardless of active lane).
- Logo wordmark text ("Comfort Care" — single brand, both lanes).
- Section structure on `/`.

### 2.5 Micro-interactions on Frame 0

Six shipped, gated behind `prefers-reduced-motion`:

1. **Staggered entry** — dental mark fade-in at 0ms (translateY 12px → 0), medical at +200ms, hairline divider scale-x 0 → 1 at +400ms, wordmark/CTAs at +500ms. Total: ~700ms.
2. **Half-hover lift** — `scale(1.015)` on the active half, opposite half dims to 92% opacity. Touch equivalent: tap-and-hold gives a 200ms press-down state, then releases on tap-up.
3. **Editorial photo grayscale → color** — 700ms ease on hover/focus.
4. **Scroll-cue pulse** — thin vertical rule at center-bottom, opacity 0.4 ↔ 0.9 over 3s, infinite. Disappears (transitions opacity to 0 over 250ms) the moment any scroll is detected.
5. **First-scroll handoff** — as user begins scrolling, both halves translate inward 5% toward center while opacity fades to 0. Done over the first 100vh of scroll. Visual rhyme: two-into-one before the AirwayHero begins.
6. **CTA underline draw** — `transform: scale-x` from 0 to 1 over 250ms on hover/focus.

Under `prefers-reduced-motion: reduce`: all animations skipped. Marks, divider, wordmark, photos render in their final state on first paint. No pulse. No lift. CTA underline is present statically without transition. Photos remain at their default color treatment (decision: respect the user's preference even at the cost of some signal; grayscale is fine if they opt out).

---

## 3. Architecture

### 3.1 New files

| Path | Purpose |
|---|---|
| `components/twin-mark-cold-open.tsx` | The Frame 0 section. Client component (needs `prefers-reduced-motion` + scroll listener for the handoff). |
| `components/lane-toggle.tsx` | The header's segmented Dental/Medical button group. Client component (needs `usePathname()` for `aria-current`). |
| `lib/lane.ts` | `getLane(pathname): 'dental' \| 'medical' \| 'neutral'` — pathname → lane mapping. Server-safe. |
| `lib/__tests__/lane.test.ts` | Vitest. Asserts: `/dental` → `'dental'`, `/dental/anything` → `'dental'`, `/medical` → `'medical'`, `/` → `'neutral'`, `/about` → `'neutral'`, `/admin/*` → `'neutral'`. |
| `app/(marketing)/dental/layout.tsx` | Server Component. Wraps `children` in `<div data-lane="dental" className="contents">`. |
| `app/(marketing)/medical/layout.tsx` | Server Component. Wraps `children` in `<div data-lane="medical" className="contents">`. |

### 3.2 Modified files

| Path | Change |
|---|---|
| `components/site-header.tsx` | Replaces the right-side CTA cluster (Request / Call) with: `<LaneToggle />` + the Request/Call CTAs. Sets `data-lane={getLane(pathname)}` on its `<header>` root. The `<Logo>` instance morphs in sync with the toggle's `aria-current`. Mobile: toggle moves to its own row below brand. The hamburger drawer is unchanged. |
| `components/site-footer.tsx` | Adds `data-lane={getLane(pathname)}` on its `<footer>` root so footer accents/hovers re-theme with the page. Converted to a Client Component if not already, or wrapped in a thin Client themer. |
| `components/logo.tsx` | Adds a `lane` prop. Renders the dental mark when `lane="dental" \| "neutral"`, the inverted mark when `lane="medical"`. Wraps the mark in a Framer Motion component so the swap animates as a cross-fade + scale. When the medical SVG arrives, this becomes a true SVG path swap. |
| `app/(marketing)/page.tsx` | Renders `<TwinMarkColdOpen />` as the first child, *before* `<AirwayHero />`. |
| `app/globals.css` | Adds `[data-lane="dental"]` and `[data-lane="medical"]` rules. Existing `:root` defaults preserve the current neutral palette unchanged. |
| `lib/sublabel.ts` | No change — already route-aware, no new logic needed. |

### 3.3 Data flow

```
Request URL → Next.js routes to the matching segment layout
                ├── /dental/* → app/(marketing)/dental/layout.tsx renders <div data-lane="dental">
                ├── /medical/* → app/(marketing)/medical/layout.tsx renders <div data-lane="medical">
                └── everything else → no wrapper; falls through to :root defaults

Initial paint (SSR) → globals.css resolves --color-accent-* per data-lane scope
                      <TwinMarkColdOpen> (on /) renders ghost-in entry
                      No FOUC: server already chose the right palette

Client navigation → React Router updates the tree
                     The data-lane wrapper enters/exits as the new route mounts
                     CSS variables update via cascade → all themed surfaces re-flow
                     <Logo> in header reads usePathname() → morph animation triggers
                     Sub-label re-resolves via getSublabel(pathname)
                     LaneToggle's aria-current updates → active state flips
```

No new state. No cookies. No client-side store. The lane is a derived value from the URL.

### 3.4 Component contracts

**`<TwinMarkColdOpen />`**

```ts
// No props — the section is self-contained.
// Reads dental + medical copy/photo from a local constant in the file.
// Renders a <section> with min-height: 100svh.
// Two <Link>s, one per half.
// All micro-interactions live inside.
```

**`<LaneToggle />`**

```ts
interface LaneToggleProps {
  variant?: 'light' | 'dark';  // matches the existing SiteHeader.variant
  className?: string;
}
// Renders two <Link>s in a role="group" container.
// Each link has aria-current="page" when its lane matches usePathname().
// Active styling driven by aria-current selector in CSS — no JS state.
```

**`<Logo />` (extended)**

```ts
interface LogoProps {
  size?: number;
  mobileSize?: number;
  decorative?: boolean;
  lane?: 'dental' | 'medical' | 'auto';  // 'auto' = read from data-lane
  morphTransition?: boolean;              // default true; disabled under reduced-motion
}
// When lane changes (detected via Framer Motion's layout animation),
// the mark cross-fades + scales. Currently the dental mark in two variants
// (default + inverted); Phase 2 swaps in a true medical SVG.
```

**`getLane(pathname: string)`**

```ts
export type Lane = 'dental' | 'medical' | 'neutral';

export function getLane(pathname: string): Lane {
  if (pathname.startsWith('/dental')) return 'dental';
  if (pathname.startsWith('/medical')) return 'medical';
  return 'neutral';
}
```

### 3.5 Error handling

Limited surface area. The cases that need handling:

- **`data-lane` attribute missing or unexpected value:** `globals.css` `:root[data-lane="neutral"]` rules also apply to `:root:not([data-lane])` as a fallback. Site renders correctly even if attribute fails to set.
- **Logo morph triggers during a route change that fails:** the morph is decoupled from navigation success — Framer animates on the prop change; if Next.js navigation fails, the user sees the morph but stays on the current page. Acceptable.
- **Medical logo SVG (Phase 2) malformed or fails to load:** the `<Logo>` component falls back to the inverted dental mark. No visual regression.
- **`prefers-reduced-motion: reduce` enabled mid-session:** `<TwinMarkColdOpen>` listens to `MediaQueryList.change`; on flip, animations either skip remaining frames or render in their final state.

No new server-side error surfaces. No new database calls. No new API endpoints.

---

## 4. Testing

Following the existing Vitest scaffold in `content/__tests__/` and `lib/__tests__/`.

### 4.1 New unit tests

`lib/__tests__/lane.test.ts`:

- `getLane('/dental')` → `'dental'`
- `getLane('/dental/composite-fillings')` → `'dental'`
- `getLane('/medical')` → `'medical'`
- `getLane('/medical/tmj')` → `'medical'`
- `getLane('/')` → `'neutral'`
- `getLane('/about')` → `'neutral'`
- `getLane('/doctors/dr-brien-hsu')` → `'neutral'`
- `getLane('/admin/login')` → `'neutral'`

### 4.2 Existing tests that must continue to pass

- `lib/__tests__/sublabel.test.ts` — sub-label routing is unchanged.
- `content/__tests__/*` — content invariants are untouched.

### 4.3 Manual verification checklist (pre-pitch)

- [ ] Frame 0 renders both logos on first paint (no FOUC) on `/`
- [ ] Both half-CTAs are tappable (44px+) on iPhone SE simulator
- [ ] Hairline divider draws on entry; pulse cue appears under both halves
- [ ] First-scroll handoff: halves converge inward before fading; AirwayHero appears as expected
- [ ] Header toggle: dental active on `/dental`, medical active on `/medical`, neither on `/`
- [ ] Header toggle: keyboard tab reaches both buttons; focus ring visible; Enter navigates
- [ ] Logo morph plays on toggle click (and on lane-chooser click, footer click)
- [ ] Re-theme: accent eyebrow on `/dental/composite-fillings` is warm-stone; on `/medical/tmj` is teal
- [ ] `prefers-reduced-motion`: all motion disabled; final state renders correctly
- [ ] No layout shift introduced (CLS check via Lighthouse)
- [ ] LCP on `/` mobile ≥ existing baseline (we're adding 100vh above hero — need to verify the Frame 0 hero image doesn't push the LCP element off-screen below 2.5s)

---

## 5. Performance considerations

Adding 100vh above the AirwayHero introduces real LCP risk. Two mitigations are non-negotiable:

1. **Frame 0 photos** must ship as WebP, sized to render width (no oversized assets), with LQIP blur placeholders. Both photos are below-the-fold on viewports ≥ 1024px (the title text is the LCP candidate, not the photo); above-the-fold on mobile.
2. **No video or Lottie in Frame 0.** The entry animations are all CSS transforms + opacity, which compose on the GPU and don't compete for main-thread time.
3. **Logo morph** runs only on user interaction (toggle/nav click), not on first paint. No LCP impact.

Baseline measurement: Lighthouse mobile on `/` before merging this change. Re-measure after merge. Acceptance: LCP ≤ baseline + 200ms; CLS unchanged.

---

## 6. Out of scope (deferred)

- **True SVG path morph for the medical logo.** Requires the client to deliver the medical SVG. We ship the cross-fade fallback; upgrade when the asset lands.
- **Audience-mode cookie persistence across visits.** Discussed and rejected. Lane is derived from the URL only; this keeps state simple, SEO clean, and avoids "wrong-mode" bugs on shared links.
- **A separate `/story` cinematic explainer route.** Discussed as Option Z; deferred. Ship Frame 0 first; revisit only if the dentist asks for a deeper story page during the pitch meeting.
- **Animated lane-specific page transitions.** The morph runs on the header logo; we are *not* doing a full-page color-wash transition between `/dental` and `/medical`. Calmer is better here.
- **Re-themed AirwayHero captions per lane.** Captions stay specialty-narrowed regardless of lane (per decision §2.4).

---

## 7. Acceptance criteria

1. On `/`, the first 100svh shows the twin-mark cold open with both logos, both eyebrows, both titles, both CTAs, and one editorial photo per half.
2. The header on every route renders a Dental/Medical toggle on the right side. The toggle is keyboard-accessible, screen-reader-described, and meets 4.5:1 contrast in every state.
3. Navigating between `/dental` and `/medical` plays the logo morph in the header (≤ 400ms) and flips the accent color across all themed surfaces.
4. `prefers-reduced-motion` users see the cold open in its final state with no animation; they still see the morph as an instant cross-fade with no scale/translate component.
5. `lib/lane.test.ts` passes; all existing tests (`pnpm vitest --run`) continue to pass.
6. Lighthouse mobile LCP on `/` stays within +200ms of the pre-change baseline.
7. No new external dependencies. (Framer Motion is already in the bundle.)
8. The component is structured to accept the real medical-logo SVG without restructuring — only the asset import in `components/logo.tsx` changes when the asset arrives.

---

## 8. Asset dependencies for the client meeting

These items are noted in `docs/audit/dentist-questions.md` and should be raised:

- **Medical logo SVG.** Editable. Comparable path complexity to the dental mark so true path interpolation is viable in Phase 2. PNG is acceptable as a fallback (we keep the cross-fade morph).
- **Editorial photography for Frame 0.** One image per half. Dental half: family/return-visit register (parent with child, returning patient). Medical half: more clinical, restrained (jaw detail, an adult patient at consult, the Zeiss microscope environment). Until delivered, we use Unsplash placeholders.

---

## 9. References

- [HANDOFF.md §6 — Current home page architecture](../../HANDOFF.md#6-current-home-page-architecture)
- [Pre-pitch audit-pass spec](2026-05-06-dentisthsu-pre-pitch-audit-pass.md)
- [Master spec §1 — Project framing](2026-05-05-dentisthsu-redesign-master-spec.md)
- [components/site-header.tsx](../../components/site-header.tsx)
- [components/logo.tsx](../../components/logo.tsx)
- [lib/sublabel.ts](../../lib/sublabel.ts)
- [app/(marketing)/page.tsx](../../app/(marketing)/page.tsx)
- Brainstorm artifacts: `.superpowers/brainstorm/52334-1778910866/content/` (gitignored)
