# Dual-Identity System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the dental + medical duality land in the first 2 seconds on `/`, with both logos visible, a header toggle for switching lanes, and a `data-lane`-driven re-theming mechanic that runs whenever the patient enters or leaves a lane.

**Architecture:** Three coordinated changes share one mechanic — the **logo morph**. (1) A new `<TwinMarkColdOpen>` section renders above the AirwayHero on `/`, showing both logos with editorial restraint. (2) The `<SiteHeader>` gains a `<LaneToggle>` segmented control with multi-channel active state (fill + color + text label) designed for older patients. (3) A `data-lane` attribute on each themed island (header, footer, page content) drives CSS-variable re-theming via cascade; no global state, no cookies, derived from the URL.

**Tech Stack:** Next.js 16 (App Router), TypeScript strict, Tailwind CSS v4 (`@theme` block), Framer Motion 12, Vitest 3. Package manager: pnpm 10.

**Reference spec:** [`docs/superpowers/specs/2026-05-16-dentisthsu-dual-identity-system.md`](../specs/2026-05-16-dentisthsu-dual-identity-system.md)

**File map:**

| File | Status | Responsibility |
|---|---|---|
| `lib/lane.ts` | new | `getLane(pathname): 'dental' \| 'medical' \| 'neutral'` |
| `lib/__tests__/lane.test.ts` | new | Vitest cases for the resolver |
| `app/globals.css` | modify | Add `[data-lane="dental" \| "medical"]` CSS-variable scopes |
| `app/(marketing)/dental/layout.tsx` | new | Server Component wrapping children in `<div data-lane="dental">` |
| `app/(marketing)/medical/layout.tsx` | new | Server Component wrapping children in `<div data-lane="medical">` |
| `components/site-header.tsx` | modify | Sets `data-lane` on its `<header>` root; renders `<LaneToggle>` |
| `components/site-footer.tsx` | modify | Converts to Client Component; sets `data-lane` on `<footer>` root |
| `components/lane-toggle.tsx` | new | Segmented Dental/Medical button group with `aria-current` |
| `components/logo.tsx` | modify | Adds `lane` prop; renders mark with cross-fade morph on change |
| `components/twin-mark-cold-open.tsx` | new | Frame 0 editorial diptych with six micro-interactions |
| `app/(marketing)/page.tsx` | modify | Renders `<TwinMarkColdOpen>` as first child, before `<AirwayHero>` |

---

## Task 1: `getLane()` resolver + tests

**Files:**
- Create: `lib/lane.ts`
- Test: `lib/__tests__/lane.test.ts`

This is the single source of truth for "which lane is this pathname in?" — used by the header, footer, route-segment layouts, the toggle's `aria-current`, and the Logo's morph trigger.

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/lane.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { getLane } from '../lane';

describe('getLane', () => {
  test('dental routes resolve to "dental"', () => {
    expect(getLane('/dental')).toBe('dental');
    expect(getLane('/dental/composite-fillings')).toBe('dental');
    expect(getLane('/dental/crowns-bridges')).toBe('dental');
  });

  test('medical routes resolve to "medical"', () => {
    expect(getLane('/medical')).toBe('medical');
    expect(getLane('/medical/tmj')).toBe('medical');
    expect(getLane('/medical/sleep-apnea')).toBe('medical');
  });

  test('home, about, doctors, blog, contact resolve to "neutral"', () => {
    expect(getLane('/')).toBe('neutral');
    expect(getLane('/about')).toBe('neutral');
    expect(getLane('/doctors')).toBe('neutral');
    expect(getLane('/doctors/dr-brien-hsu')).toBe('neutral');
    expect(getLane('/blog')).toBe('neutral');
    expect(getLane('/blog/some-post')).toBe('neutral');
    expect(getLane('/contact')).toBe('neutral');
    expect(getLane('/technology')).toBe('neutral');
    expect(getLane('/reviews')).toBe('neutral');
    expect(getLane('/financing')).toBe('neutral');
    expect(getLane('/request-appointment')).toBe('neutral');
  });

  test('admin routes resolve to "neutral"', () => {
    expect(getLane('/admin')).toBe('neutral');
    expect(getLane('/admin/login')).toBe('neutral');
    expect(getLane('/admin/dashboard')).toBe('neutral');
    expect(getLane('/admin/posts/new')).toBe('neutral');
  });

  test('lane match is prefix-strict — /dental-x is NOT dental', () => {
    expect(getLane('/dental-clinic')).toBe('neutral');
    expect(getLane('/medical-team')).toBe('neutral');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test lib/__tests__/lane.test.ts`
Expected: FAIL with "Failed to load … Cannot find module '../lane'" or similar.

- [ ] **Step 3: Implement the resolver**

Create `lib/lane.ts`:

```ts
/**
 * Resolves the current practice lane from the pathname. Used to drive the
 * `data-lane` attribute on themed islands (header, footer, route content)
 * and the `aria-current` state of the header's lane toggle.
 *
 * Pure function; safe to call from server or client. The lane is derived
 * from the URL — no cookie, no client state.
 *
 * See: docs/superpowers/specs/2026-05-16-dentisthsu-dual-identity-system.md §2.4
 */
export type Lane = 'dental' | 'medical' | 'neutral';

export function getLane(pathname: string): Lane {
  // Prefix match is strict on segment boundary: '/dental-clinic' must NOT
  // resolve to dental. We check that the next char (if any) is '/' or end.
  if (matchesSegment(pathname, '/dental')) return 'dental';
  if (matchesSegment(pathname, '/medical')) return 'medical';
  return 'neutral';
}

function matchesSegment(pathname: string, prefix: string): boolean {
  if (!pathname.startsWith(prefix)) return false;
  const next = pathname.charAt(prefix.length);
  return next === '' || next === '/';
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test lib/__tests__/lane.test.ts`
Expected: PASS — all 5 test cases pass.

- [ ] **Step 5: Commit**

```bash
git add lib/lane.ts lib/__tests__/lane.test.ts
git commit -m "feat(lib): add getLane resolver for dual-identity routing

Pure pathname → 'dental' | 'medical' | 'neutral' mapping. Strict segment
matching so '/dental-clinic' is NOT a dental route. Drives the data-lane
attribute on themed islands and aria-current on the header toggle.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: CSS `data-lane` palette scopes

**Files:**
- Modify: `app/globals.css`

Tailwind v4 uses a `@theme` block for design tokens. We add two new selectors *after* the `@theme` block that override `--color-accent-*` values for descendants of a `[data-lane]` ancestor. Neutral lane uses the existing values (no override needed — falls through to `@theme` defaults).

- [ ] **Step 1: Verify current globals.css before editing**

Run: `cat app/globals.css | head -45`
Expected: should match the existing file showing `@theme` block with `--color-accent-50` through `--color-accent-950`.

- [ ] **Step 2: Add lane-scoped palette overrides**

Modify `app/globals.css`. Add the following block immediately after the closing `}` of the `@theme` block (around line 40), *before* the `html { scroll-behavior: smooth; }` rule:

```css
/* ─────────── Lane-scoped accent palettes ───────────
 * Drives the dual-identity re-theme. The neutral lane (home, about, doctors,
 * blog, contact, admin, etc.) uses the @theme defaults above — apothecary
 * teal. The /dental route segment swaps to warm-stone accents; /medical
 * stays on teal but is set explicitly here so any future divergence has
 * a clean place to live.
 *
 * Applied via wrapper divs in app/(marketing)/dental/layout.tsx and
 * app/(marketing)/medical/layout.tsx, and via the data-lane attribute set
 * on <SiteHeader> and <SiteFooter> roots from usePathname().
 *
 * See: docs/superpowers/specs/2026-05-16-dentisthsu-dual-identity-system.md §2.4
 */
[data-lane="dental"] {
  --color-accent-50:  #f5ede1;
  --color-accent-200: #d8c4a4;
  --color-accent-600: #8a6a3a;
  --color-accent-900: #4a3920;
  --color-accent-950: #2a2010;
}

[data-lane="medical"] {
  /* Explicit teal — matches @theme defaults but locked here so a future
     medical-side palette tuning has one place to land. */
  --color-accent-50:  #e8f1f0;
  --color-accent-200: #a9c8c5;
  --color-accent-600: #356a66;
  --color-accent-900: #1f3d3b;
  --color-accent-950: #0e2421;
}
```

- [ ] **Step 3: Verify the file parses**

Run: `pnpm build 2>&1 | head -20`
Expected: Build either completes or fails for unrelated reasons. If it fails on CSS parsing, fix syntax before proceeding. (Full build not required — just enough to verify the parser accepts the change. If the build is slow, run `pnpm typecheck` instead — TypeScript ignores CSS but a syntax error would manifest differently.)

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat(theme): add lane-scoped accent palette overrides

Adds [data-lane='dental'] and [data-lane='medical'] CSS-variable scopes
so themed islands re-theme on lane change via cascade. Dental flips to
warm-stone accents; medical locks in current teal for future tuning.
Neutral lane (home + everything else) falls through to @theme defaults.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Route-segment layouts for `/dental` and `/medical`

**Files:**
- Create: `app/(marketing)/dental/layout.tsx`
- Create: `app/(marketing)/medical/layout.tsx`

Each layout is a Server Component that wraps `children` in a `data-lane`-attributed div. The `contents` class makes the wrapper layout-transparent so it doesn't disrupt grid/flex behavior in the children.

- [ ] **Step 1: Create `app/(marketing)/dental/layout.tsx`**

```tsx
/**
 * Route-segment layout for /dental and all descendants. Wraps children in
 * a data-lane="dental" div so the warm-stone accent palette resolves via
 * the cascade defined in app/globals.css.
 *
 * Server Component — no JS shipped. The `contents` class makes the wrapper
 * layout-transparent so existing grid/flex inside service pages is unaffected.
 *
 * See: docs/superpowers/specs/2026-05-16-dentisthsu-dual-identity-system.md §2.4
 */
export default function DentalLaneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-lane="dental" className="contents">
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create `app/(marketing)/medical/layout.tsx`**

```tsx
/**
 * Route-segment layout for /medical and all descendants. Wraps children in
 * a data-lane="medical" div so the teal accent palette resolves via the
 * cascade defined in app/globals.css.
 *
 * Server Component — no JS shipped. The `contents` class makes the wrapper
 * layout-transparent so existing grid/flex inside service pages is unaffected.
 *
 * See: docs/superpowers/specs/2026-05-16-dentisthsu-dual-identity-system.md §2.4
 */
export default function MedicalLaneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-lane="medical" className="contents">
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Verify the dev server renders both routes with the attribute**

Run: `pnpm dev` in one terminal.
In a separate terminal: `curl -s http://localhost:3000/dental | grep -o 'data-lane="dental"' | head -1`
Expected: `data-lane="dental"`

Then: `curl -s http://localhost:3000/medical | grep -o 'data-lane="medical"' | head -1`
Expected: `data-lane="medical"`

Stop the dev server (`Ctrl-C`).

- [ ] **Step 4: Run typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add "app/(marketing)/dental/layout.tsx" "app/(marketing)/medical/layout.tsx"
git commit -m "feat(routing): add data-lane wrapper layouts for /dental and /medical

Server Components that wrap children in a data-lane-attributed div. The
'contents' class keeps the wrapper layout-transparent so existing grids
inside service pages render identically. Drives the CSS-variable cascade
from Task 2.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: SiteHeader self-themes via `data-lane`

**Files:**
- Modify: `components/site-header.tsx`

The header lives in `app/(marketing)/layout.tsx`, structurally outside the per-segment layouts from Task 3. So it must theme itself by reading `usePathname()` and applying `data-lane` to its own `<header>` root.

- [ ] **Step 1: Add the `data-lane` attribute to `<header>` root**

In `components/site-header.tsx`, the file already imports `usePathname()` and `getSublabel`. Add the import for `getLane`, then add `data-lane` to the `<header>` element.

Find this import block near the top of the file:

```tsx
import { getSublabel } from '@/lib/sublabel';
```

Add immediately after it:

```tsx
import { getLane } from '@/lib/lane';
```

Then find the existing computation:

```tsx
const resolvedSublabel = sublabel ?? getSublabel(pathname);
```

Add immediately after it:

```tsx
const lane = getLane(pathname);
```

Then find this `<header>` opening tag:

```tsx
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b backdrop-blur-md',
```

Add `data-lane={lane}` as a sibling attribute:

```tsx
    <header
      data-lane={lane}
      className={cn(
        'sticky top-0 z-40 w-full border-b backdrop-blur-md',
```

- [ ] **Step 2: Verify the attribute renders**

Run: `pnpm dev`
In a browser, navigate to `http://localhost:3000/dental`. Open DevTools → Elements. The `<header>` should have `data-lane="dental"`. Navigate to `/medical` — the same `<header>` should now have `data-lane="medical"`. Navigate to `/` — it should have `data-lane="neutral"`.

Stop the dev server.

- [ ] **Step 3: Run typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/site-header.tsx
git commit -m "feat(header): self-theme via data-lane from usePathname

The header sits outside route-segment layouts, so it derives its own lane
from the pathname and writes data-lane to its root. CSS variables cascade
to all descendants (toggle, logo, sub-label, hover states) without any
prop drilling.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: SiteFooter self-themes via `data-lane`

**Files:**
- Modify: `components/site-footer.tsx`

The footer is currently a Server Component. It can't call `usePathname()`. Two options: (a) convert to Client Component, (b) wrap a thin Client wrapper around the footer's root. We choose (a) — the footer renders only `practiceInfo` and `<Link>`s; there's nothing server-only inside, and converting is simpler than refactoring the rendering into a child.

- [ ] **Step 1: Mark SiteFooter as a Client Component**

In `components/site-footer.tsx`, add as the very first line of the file:

```tsx
'use client';
```

- [ ] **Step 2: Import `usePathname` and `getLane`**

Find this existing import block at the top:

```tsx
import Link from 'next/link';
import { practiceInfo } from '@/content/practice-info';
import { Wordmark } from './wordmark';
```

Replace it with:

```tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { practiceInfo } from '@/content/practice-info';
import { getLane } from '@/lib/lane';
import { Wordmark } from './wordmark';
```

- [ ] **Step 3: Resolve the lane inside the component and apply to `<footer>`**

Find the function body opener:

```tsx
export function SiteFooter() {
  const dayLabel = (day: string) => day.slice(0, 3);
  const primaryPhone = practiceInfo.phones[0];
```

Add the lane resolution:

```tsx
export function SiteFooter() {
  const pathname = usePathname();
  const lane = getLane(pathname);
  const dayLabel = (day: string) => day.slice(0, 3);
  const primaryPhone = practiceInfo.phones[0];
```

Then find the opening `<footer>` tag:

```tsx
    <footer className="bg-stone-900 text-stone-200 mt-32">
```

Add `data-lane={lane}`:

```tsx
    <footer data-lane={lane} className="bg-stone-900 text-stone-200 mt-32">
```

- [ ] **Step 4: Verify the attribute renders on each lane**

Run: `pnpm dev`. Visit `/dental` — DevTools should show `<footer data-lane="dental">`. Visit `/medical` — `data-lane="medical"`. Visit `/` — `data-lane="neutral"`. Stop dev server.

- [ ] **Step 5: Run typecheck and tests**

Run: `pnpm typecheck && pnpm test`
Expected: typecheck passes, all existing Vitest tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/site-footer.tsx
git commit -m "feat(footer): self-theme via data-lane from usePathname

Converts SiteFooter to a Client Component so it can read usePathname.
The footer renders only practiceInfo + Links; no server-only behavior is
lost. data-lane on the <footer> root drives accent cascade to all child
text colors and hover states.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: `<LaneToggle>` component

**Files:**
- Create: `components/lane-toggle.tsx`

The segmented Dental/Medical button group. Each option is a real `<Link>` so middle-click works. Active state is multi-channel (filled background + inverted text + semi-bold weight + `aria-current="page"`), designed for older patients. 40px+ tap targets. Visible focus ring.

- [ ] **Step 1: Create the component**

Create `components/lane-toggle.tsx`:

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { getLane, type Lane } from '@/lib/lane';

interface LaneToggleProps {
  /** Light = on a stone-50 background (default). Dark = on hero overlay. */
  variant?: 'light' | 'dark';
  className?: string;
}

interface LaneOption {
  lane: Exclude<Lane, 'neutral'>;
  href: string;
  label: string;
  glyph: string;
  hoverHint: string;
}

const OPTIONS: ReadonlyArray<LaneOption> = [
  {
    lane: 'dental',
    href: '/dental',
    label: 'Dental',
    glyph: 'D',
    hoverHint: 'Switch to the dental side',
  },
  {
    lane: 'medical',
    href: '/medical',
    label: 'Medical',
    glyph: 'M',
    hoverHint: 'Switch to the medical side',
  },
];

/**
 * Segmented Dental/Medical button group in the header. Each option is a real
 * <Link> so middle-click opens in a new tab. Active state uses fill + color
 * + weight + aria-current — three independent channels so color-blind and
 * older-patient users still read the active lane unambiguously.
 *
 * Tap targets: 40px high minimum (meets WCAG 2.1 AAA target size).
 * Focus ring: 2px solid outline at offset 3px, visible on keyboard tab.
 *
 * See: docs/superpowers/specs/2026-05-16-dentisthsu-dual-identity-system.md §2.2
 */
export function LaneToggle({ variant = 'light', className }: LaneToggleProps) {
  const pathname = usePathname();
  const currentLane = getLane(pathname);

  return (
    <div
      role="group"
      aria-label="Practice lane"
      className={cn(
        'inline-flex items-center gap-1 rounded-full p-1 border',
        variant === 'light'
          ? 'bg-stone-100/80 border-stone-200'
          : 'bg-stone-100/10 border-stone-100/20',
        className,
      )}
    >
      {OPTIONS.map((opt) => {
        const active = currentLane === opt.lane;
        return (
          <Link
            key={opt.lane}
            href={opt.href}
            aria-current={active ? 'page' : undefined}
            title={opt.hoverHint}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 min-h-10 text-sm font-medium',
              'transition-colors transition-transform duration-200',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
              variant === 'light'
                ? 'focus-visible:outline-stone-900'
                : 'focus-visible:outline-stone-50',
              active
                ? variant === 'light'
                  ? 'bg-stone-900 text-stone-50 font-semibold'
                  : 'bg-stone-50 text-stone-900 font-semibold'
                : variant === 'light'
                ? 'text-stone-600 hover:text-stone-900'
                : 'text-stone-300 hover:text-stone-50',
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold',
                active
                  ? variant === 'light'
                    ? 'bg-stone-50 text-stone-900'
                    : 'bg-stone-900 text-stone-50'
                  : 'bg-transparent border border-current',
              )}
            >
              {opt.glyph}
            </span>
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Write a Vitest unit test for active-state attribution**

Create `components/__tests__/lane-toggle.test.tsx`:

```tsx
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LaneToggle } from '../lane-toggle';

// Mock next/navigation: usePathname returns whatever we set.
const usePathnameMock = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => usePathnameMock(),
}));

describe('LaneToggle', () => {
  test('on /dental, the Dental link is aria-current="page"', () => {
    usePathnameMock.mockReturnValue('/dental');
    render(<LaneToggle />);
    expect(screen.getByRole('link', { name: /dental/i })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: /medical/i })).not.toHaveAttribute(
      'aria-current',
    );
  });

  test('on /medical/tmj, the Medical link is aria-current="page"', () => {
    usePathnameMock.mockReturnValue('/medical/tmj');
    render(<LaneToggle />);
    expect(screen.getByRole('link', { name: /medical/i })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: /dental/i })).not.toHaveAttribute(
      'aria-current',
    );
  });

  test('on /, neither link is aria-current', () => {
    usePathnameMock.mockReturnValue('/');
    render(<LaneToggle />);
    expect(screen.getByRole('link', { name: /dental/i })).not.toHaveAttribute(
      'aria-current',
    );
    expect(screen.getByRole('link', { name: /medical/i })).not.toHaveAttribute(
      'aria-current',
    );
  });

  test('the group has accessible label "Practice lane"', () => {
    usePathnameMock.mockReturnValue('/');
    render(<LaneToggle />);
    expect(screen.getByRole('group')).toHaveAttribute(
      'aria-label',
      'Practice lane',
    );
  });
});
```

- [ ] **Step 3: Verify the testing-library deps are present**

Run: `pnpm ls @testing-library/react @testing-library/jest-dom 2>/dev/null || echo "missing"`

If "missing" appears, install them:

```bash
pnpm add -D @testing-library/react @testing-library/jest-dom jsdom
```

Then ensure `vitest.config.ts` (or `vite.config.ts`) sets `environment: 'jsdom'`. If neither config file exists, create `vitest.config.ts` at the repo root:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
  },
});
```

If a config already exists, ensure `environment: 'jsdom'` is set for tests that render React. If only some tests need jsdom, use the `// @vitest-environment jsdom` pragma at the top of the test file instead.

- [ ] **Step 4: Run the test**

Run: `pnpm test components/__tests__/lane-toggle.test.tsx`
Expected: PASS — all 4 cases.

- [ ] **Step 5: Run the full test suite**

Run: `pnpm test`
Expected: PASS — all existing + new tests.

- [ ] **Step 6: Commit**

```bash
git add components/lane-toggle.tsx "components/__tests__/lane-toggle.test.tsx" vitest.config.ts package.json pnpm-lock.yaml
git commit -m "feat(header): add LaneToggle segmented control

Dental/Medical toggle with multi-channel active state (fill + color +
font-weight + aria-current). Each option is a real <Link> so middle-click
opens in a new tab. 40px tap targets, 2px focus-visible outline, role=group
with accessible label. Tests cover aria-current per pathname.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Wire `<LaneToggle>` into `<SiteHeader>`

**Files:**
- Modify: `components/site-header.tsx`

The toggle sits in the desktop header next to the Request/Call CTAs, and gets its own row directly below the brand row on mobile. The existing hamburger drawer is unchanged.

- [ ] **Step 1: Import LaneToggle**

In `components/site-header.tsx`, find the existing import block at the top. Add:

```tsx
import { LaneToggle } from './lane-toggle';
```

(Place it alphabetically near `./logo` and `./wordmark`.)

- [ ] **Step 2: Insert the toggle into the desktop CTA cluster**

Find this block:

```tsx
        <div className="flex items-center gap-3">
          <Link
            href="/request-appointment"
            className={cn(
```

Insert the toggle as the first child of the flex container, before the Request link:

```tsx
        <div className="flex items-center gap-3">
          <LaneToggle
            variant={variant}
            className="hidden md:inline-flex"
          />
          <Link
            href="/request-appointment"
            className={cn(
```

- [ ] **Step 3: Add the mobile toggle row beneath the brand row**

Find this closing of the top header bar:

```tsx
          </button>
        </div>
      </div>

      {/* ─────────── Mobile drawer ─────────── */}
```

Insert the mobile toggle row immediately before the mobile-drawer comment:

```tsx
          </button>
        </div>
      </div>

      {/* ─────────── Mobile toggle row (md hidden) ─────────── */}
      <div
        className={cn(
          'md:hidden border-t flex items-stretch',
          variant === 'light'
            ? 'border-stone-200/60'
            : 'border-ink-700/40',
        )}
      >
        <LaneToggle variant={variant} className="m-2 flex-1 justify-center" />
      </div>

      {/* ─────────── Mobile drawer ─────────── */}
```

Note: the existing mobile drawer is positioned with `top-[68px]`. After this change the header is taller on mobile (the new toggle row adds ~56px). Update the drawer's top offset.

Find:

```tsx
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden fixed inset-x-0 top-[68px] bg-stone-50 transition-[opacity,transform] duration-300 ease-out',
```

Change `top-[68px]` to `top-[124px]`:

```tsx
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden fixed inset-x-0 top-[124px] bg-stone-50 transition-[opacity,transform] duration-300 ease-out',
```

Also find the inline `style` setting drawer height:

```tsx
        style={{ height: 'calc(100svh - 68px)' }}
```

Change to:

```tsx
        style={{ height: 'calc(100svh - 124px)' }}
```

- [ ] **Step 4: Adjust the `LaneToggle` mobile layout so both options fill the row**

The default LaneToggle has `inline-flex` and content-sized children. On the mobile row we want each button to take half the available width. Override via `className` prop already added on the mobile instance. But we also need each `<Link>` inside to flex evenly. Patch the LaneToggle to accept this.

Open `components/lane-toggle.tsx`. Find:

```tsx
    <div
      role="group"
      aria-label="Practice lane"
      className={cn(
        'inline-flex items-center gap-1 rounded-full p-1 border',
```

Change `inline-flex` to `flex`:

```tsx
    <div
      role="group"
      aria-label="Practice lane"
      className={cn(
        'flex items-center gap-1 rounded-full p-1 border',
```

And in each `<Link>`'s className, find:

```tsx
              'inline-flex items-center gap-2 rounded-full px-4 min-h-10 text-sm font-medium',
```

Change to:

```tsx
              'inline-flex flex-1 justify-center items-center gap-2 rounded-full px-4 min-h-10 text-sm font-medium',
```

Where the toggle should be content-sized (desktop), wrap it externally with `w-auto` if needed — but the mobile row's `flex-1` on the toggle container is what we'll exploit. Test next step.

- [ ] **Step 5: Verify in dev server**

Run: `pnpm dev`. Visit `http://localhost:3000/` on a desktop browser. The header should show the brand on the left, the LaneToggle pill + Request/Call CTAs on the right. Visit `/dental` — the Dental option should be the filled active button. Visit `/medical` — Medical fills.

Now in DevTools, toggle device toolbar → iPhone SE width (375px). The mobile header should show: brand row, then a second row below it containing the LaneToggle stretched to fill, then the hamburger toggle to the right. Tap the hamburger — the drawer should open *below* the toggle row (not overlapping it).

Stop dev server.

- [ ] **Step 6: Run typecheck and tests**

Run: `pnpm typecheck && pnpm test`
Expected: pass.

- [ ] **Step 7: Commit**

```bash
git add components/site-header.tsx components/lane-toggle.tsx
git commit -m "feat(header): wire LaneToggle into desktop CTA cluster and mobile row

Desktop: toggle sits left of Request/Call. Mobile: dedicated full-width
toggle row below the brand row. Drawer offset adjusted from 68px to 124px
to account for the new row height. LaneToggle's flex internals updated so
mobile children stretch evenly via flex-1.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Extend `<Logo>` with `lane` prop + cross-fade morph

**Files:**
- Modify: `components/logo.tsx`

The logo gains a `lane` prop that selects which mark to render. For Phase 1 (no medical SVG yet) we render the same image, color-inverted for the medical lane via a CSS filter. The morph animation is a 350ms cross-fade + subtle scale, implemented with Framer Motion's `AnimatePresence`. When the real medical SVG arrives, this component is the only file that changes.

- [ ] **Step 1: Update Logo to consume the `lane` prop and animate the swap**

Replace the entire contents of `components/logo.tsx`:

```tsx
'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import type { Lane } from '@/lib/lane';
import { cn } from '@/lib/cn';

interface LogoProps {
  /** Pixel size — applied to both width and height (logo is square). Default 28. */
  size?: number;
  /** Mobile size (≤640px). Default 24. */
  mobileSize?: number;
  className?: string;
  /** When true, the logo is decorative beside a wordmark — alt is empty. */
  decorative?: boolean;
  /**
   * Which practice mark to render. Defaults to 'neutral' = the canonical
   * dental mark. 'medical' renders the same asset color-inverted as a
   * Phase 1 placeholder; will swap to a real medical SVG in Phase 2 without
   * any change at the call site.
   */
  lane?: Lane;
}

const MORPH_TRANSITION = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as const,
};

/**
 * Comfort Care Dental practice mark. Renders the canonical dental mark for
 * neutral + dental lanes; renders the color-inverted variant for the medical
 * lane (Phase 1 placeholder). The swap animates as a cross-fade + scale.
 *
 * See: docs/superpowers/specs/2026-05-16-dentisthsu-dual-identity-system.md §2.3
 */
export function Logo({
  size = 28,
  mobileSize = 24,
  className,
  decorative = false,
  lane = 'neutral',
}: LogoProps) {
  // For medical we invert the existing dental mark using a CSS filter.
  // When the real medical SVG arrives, replace this with a true asset
  // selection: `const src = lane === 'medical' ? '/logo-medical.svg' : '/logo.webp';`
  const isMedical = lane === 'medical';

  return (
    <span
      className={cn('relative inline-block select-none', className)}
      style={{ width: size, height: size }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={isMedical ? 'medical' : 'dental'}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={MORPH_TRANSITION}
          className="absolute inset-0"
        >
          <Image
            src="/logo.webp"
            alt={decorative ? '' : 'Comfort Care Dental'}
            width={size}
            height={size}
            sizes={`(max-width: 640px) ${mobileSize}px, ${size}px`}
            style={{
              width: size,
              height: size,
              filter: isMedical ? 'invert(1)' : 'none',
            }}
            className="inline-block"
            priority
          />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
```

- [ ] **Step 2: Pass `lane` from SiteHeader into Logo**

In `components/site-header.tsx`, find the Logo usage:

```tsx
          <Logo size={28} mobileSize={24} decorative />
```

Update it to pass the resolved lane:

```tsx
          <Logo size={28} mobileSize={24} decorative lane={lane} />
```

(`lane` is the const computed in Task 4 step 1.)

- [ ] **Step 3: Verify the morph on lane navigation**

Run: `pnpm dev`. Open `http://localhost:3000/`. Click "Dental" in the header toggle. The logo should cross-fade + slightly scale during the route change. Click "Medical" — the logo inverts (now light-on-dark inside its bounding box, which on the light header background reads as a flipped mark). Click home/about/etc. — logo returns to the canonical dental mark.

The animation is subtle by design. If reduced-motion is on (DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce), the morph should be instant (no scale/fade) — Framer Motion respects reduced-motion when configured, but our setup currently doesn't gate it. We add the gate next.

- [ ] **Step 4: Gate the morph behind `prefers-reduced-motion`**

In `components/logo.tsx`, import `useReducedMotion` from Framer Motion. Find the import line:

```tsx
import { AnimatePresence, motion } from 'framer-motion';
```

Change to:

```tsx
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
```

Inside the function body, after the `isMedical` computation, add:

```tsx
  const reduced = useReducedMotion();
```

Then change the `transition` prop on `<motion.span>` to:

```tsx
          transition={reduced ? { duration: 0 } : MORPH_TRANSITION}
```

And also update the `initial`/`animate`/`exit` to skip the scale step under reduced motion:

```tsx
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
```

- [ ] **Step 5: Verify reduced-motion in dev**

Open DevTools → Rendering → Emulate CSS prefers-reduced-motion → reduce. Reload `/`. Click Dental/Medical — the logo should swap instantly (no fade-scale).

Disable the emulation. Reload — the morph should animate again.

Stop dev server.

- [ ] **Step 6: Run typecheck and tests**

Run: `pnpm typecheck && pnpm test`
Expected: pass.

- [ ] **Step 7: Commit**

```bash
git add components/logo.tsx components/site-header.tsx
git commit -m "feat(logo): cross-fade morph between lanes; reduced-motion gated

Phase 1: medical lane renders the canonical dental mark inverted via CSS
filter. Phase 2 will swap in a true medical SVG with one asset import
change. The 350ms cross-fade + 0.85→1 scale is gated behind useReducedMotion;
reduced-motion users get an instant swap with no scale component.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: `<TwinMarkColdOpen>` component

**Files:**
- Create: `components/twin-mark-cold-open.tsx`

The 100vh Frame 0 section. Editorial diptych. Vertical-stack on mobile, side-by-side ≥ 768px. Six micro-interactions, all gated behind reduced-motion.

This task is the largest in the plan. We split it into focused sub-steps: scaffolded layout first, then micro-interactions added one by one.

- [ ] **Step 1: Scaffold the component with static layout (no animations yet)**

Create `components/twin-mark-cold-open.tsx`:

```tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Logo } from './logo';

interface ColdOpenHalf {
  lane: 'dental' | 'medical';
  href: string;
  eyebrow: string;
  /** Provisional copy per spec §2.1; revise before pitch. */
  title: { lead: string; emphasis: string };
  cta: string;
  /** Placeholder photo until real photography lands. */
  photo: { src: string; alt: string };
}

const HALVES: readonly [ColdOpenHalf, ColdOpenHalf] = [
  {
    lane: 'dental',
    href: '/dental',
    eyebrow: 'FAMILY · RESTORATIVE · COSMETIC',
    title: {
      lead: 'For the family you bring back',
      emphasis: 'every six months.',
    },
    cta: 'Enter dental',
    photo: {
      src: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1200&q=75&auto=format',
      alt: '',
    },
  },
  {
    lane: 'medical',
    href: '/medical',
    eyebrow: 'OROFACIAL PAIN · ORAL MEDICINE',
    title: {
      lead: 'For pain everyone told you was',
      emphasis: 'permanent.',
    },
    cta: 'Enter medical',
    photo: {
      src: 'https://images.unsplash.com/photo-1551601651-2f51c8d76f8a?w=1200&q=75&auto=format',
      alt: '',
    },
  },
];

/**
 * Frame 0 cold open — the first 100svh on /. Editorial diptych showing both
 * practices, both logos, both CTAs above the fold. Sits above the AirwayHero.
 *
 * Desktop: two halves side-by-side, separated by a 1px hairline divider.
 * Mobile: vertical stack.
 *
 * Each half is a clickable Link to /dental or /medical. CTAs are also
 * tappable separately for clarity. Photos lazy-load with LQIP blur.
 *
 * See: docs/superpowers/specs/2026-05-16-dentisthsu-dual-identity-system.md §2.1
 */
export function TwinMarkColdOpen() {
  return (
    <section
      aria-label="Comfort Care Dental — two practices, one roof"
      className="relative min-h-[100svh] grid grid-cols-1 md:grid-cols-2"
    >
      {HALVES.map((half, i) => (
        <Link
          key={half.lane}
          href={half.href}
          data-lane={half.lane}
          className={cn(
            'group relative flex flex-col justify-between p-8 md:p-14 min-h-[50svh] md:min-h-[100svh] overflow-hidden',
            half.lane === 'dental'
              ? 'bg-stone-100 text-stone-900'
              : 'bg-[var(--color-ink-teal)] text-stone-50',
            // Hairline divider: right border on first half (desktop only),
            // top border on second half (mobile only).
            i === 0
              ? 'md:border-r border-stone-300/40'
              : 'border-t md:border-t-0 border-stone-300/20',
          )}
        >
          {/* Top: logo + eyebrow + title */}
          <div className="relative z-10">
            <Logo lane={half.lane} size={48} mobileSize={40} decorative />
            <p className="mt-6 text-[10px] tracking-[0.24em] uppercase opacity-75">
              {half.eyebrow}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl leading-[1.05] tracking-tight max-w-[18ch]">
              {half.title.lead}{' '}
              <span className="italic font-light">{half.title.emphasis}</span>
            </h2>
          </div>

          {/* Middle: editorial photo */}
          <div className="relative my-8 md:my-12 aspect-[4/3] md:aspect-auto md:flex-1 overflow-hidden bg-stone-200/30">
            <Image
              src={half.photo.src}
              alt={half.photo.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
              priority={i === 0}
            />
          </div>

          {/* Bottom: CTA */}
          <div className="relative z-10">
            <span
              className={cn(
                'inline-flex items-center gap-2 text-sm md:text-base font-medium',
                'relative after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px',
                'after:origin-left after:scale-x-0 after:bg-current group-hover:after:scale-x-100',
                'after:transition-transform after:duration-300',
              )}
            >
              {half.cta}
              <ArrowRight
                className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </span>
          </div>
        </Link>
      ))}

      {/* Scroll cue — centered at bottom, only on desktop where both halves
          can share it. Pulses opacity; hidden under reduced-motion via CSS. */}
      <div
        aria-hidden="true"
        className="hidden md:flex absolute inset-x-0 bottom-6 justify-center pointer-events-none"
      >
        <div className="cold-open-scroll-cue h-8 w-px bg-stone-400/50" />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add scroll-cue pulse animation to globals.css**

In `app/globals.css`, append at the bottom of the file:

```css
/* Scroll cue pulse for the Frame 0 cold open. */
@keyframes cold-open-cue-pulse {
  0%, 100% { opacity: 0.4; transform: scaleY(1); }
  50%      { opacity: 0.9; transform: scaleY(1.15); }
}
.cold-open-scroll-cue {
  animation: cold-open-cue-pulse 3s ease-in-out infinite;
  transform-origin: top center;
}
@media (prefers-reduced-motion: reduce) {
  .cold-open-scroll-cue { animation: none; opacity: 0.6; }
}
```

- [ ] **Step 3: Verify the static layout renders**

Run: `pnpm dev`. Visit `http://localhost:3000/`. The cold open should *not yet* be on the home page (we wire it in Task 10). For now, temporarily render it on a scratch route to verify the component compiles.

Create `app/(marketing)/_scratch-cold-open/page.tsx`:

```tsx
import { TwinMarkColdOpen } from '@/components/twin-mark-cold-open';

export default function ScratchPage() {
  return <TwinMarkColdOpen />;
}
```

Visit `http://localhost:3000/_scratch-cold-open`. Both halves should render with both logos, eyebrows, titles, photos (grayscale → color on hover), and CTAs. On mobile (DevTools 375px) the layout stacks vertically.

Stop dev server. Delete the scratch file:

```bash
rm -rf "app/(marketing)/_scratch-cold-open"
```

(The directory name starts with `_` so Next.js would already ignore it from the build; deleting keeps the tree clean.)

- [ ] **Step 4: Add the stagger entry animation (Framer Motion)**

Open `components/twin-mark-cold-open.tsx`. Find the imports:

```tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Logo } from './logo';
```

Add Framer Motion imports:

```tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { Logo } from './logo';
```

Inside the `TwinMarkColdOpen` function body (before `return`), add:

```tsx
  const reduced = useReducedMotion();

  const fadeUp = reduced
    ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };
```

Wrap each `<Link>`'s top block (logo + eyebrow + title) inside a `motion.div` with a staggered delay. Find this block inside the `HALVES.map`:

```tsx
          <div className="relative z-10">
            <Logo lane={half.lane} size={48} mobileSize={40} decorative />
            <p className="mt-6 text-[10px] tracking-[0.24em] uppercase opacity-75">
```

Change the outer `<div>` to `<motion.div>` with the fadeUp props, adding a per-half delay:

```tsx
          <motion.div
            className="relative z-10"
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ ...fadeUp.transition, delay: reduced ? 0 : i * 0.2 }}
          >
            <Logo lane={half.lane} size={48} mobileSize={40} decorative />
            <p className="mt-6 text-[10px] tracking-[0.24em] uppercase opacity-75">
```

Don't forget to close it as `</motion.div>` instead of `</div>`. Find the closing tag of this section (the one just before the `<div className="relative my-8 ...">` photo block):

```tsx
            </h2>
          </div>
```

Change to:

```tsx
            </h2>
          </motion.div>
```

Do the same for the CTA `<div>` at the bottom of each half — wrap it in a `motion.div` with a slightly longer delay so it lands after the title:

```tsx
          <motion.div
            className="relative z-10"
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ ...fadeUp.transition, delay: reduced ? 0 : i * 0.2 + 0.3 }}
          >
            <span
              className={cn(
```

Close as `</motion.div>`.

- [ ] **Step 5: Add the hairline divider entry animation**

The divider currently lives as a `border-r` / `border-t` Tailwind class. To animate it, replace it with an absolutely-positioned `<motion.div>`.

In the `HALVES.map` `<Link>` className, remove the divider border classes:

```tsx
            i === 0
              ? 'md:border-r border-stone-300/40'
              : 'border-t md:border-t-0 border-stone-300/20',
```

Change to (no border):

```tsx
            // hairline divider rendered separately below
            '',
```

(You can also just drop the conditional entirely. The classnames must remain syntactically valid.)

Then inside the `<section>` but outside the `.map`, add the animated divider — desktop is a vertical 1px line at 50%; mobile is a horizontal 1px line at 50%:

Find:

```tsx
      {/* Scroll cue — centered at bottom, only on desktop where both halves
          can share it. Pulses opacity; hidden under reduced-motion via CSS. */}
      <div
        aria-hidden="true"
        className="hidden md:flex absolute inset-x-0 bottom-6 justify-center pointer-events-none"
```

Insert immediately before it:

```tsx
      {/* Hairline divider — draws on entry. Vertical on md+, horizontal below. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute z-[1] bg-stone-300/40 hidden md:block md:left-1/2 md:top-0 md:bottom-0 md:w-px"
        style={{ transformOrigin: 'center' }}
        initial={reduced ? false : { scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.4, ease: 'easeOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute z-[1] bg-stone-300/40 md:hidden left-0 right-0 top-1/2 h-px"
        style={{ transformOrigin: 'center' }}
        initial={reduced ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.4, ease: 'easeOut' }}
      />

      {/* Scroll cue — centered at bottom, only on desktop where both halves
          can share it. Pulses opacity; hidden under reduced-motion via CSS. */}
```

- [ ] **Step 6: Add the hover half-lift micro-interaction**

In each `<Link>`'s className, add the hover scale class:

Find the existing classNames for the Link:

```tsx
          className={cn(
            'group relative flex flex-col justify-between p-8 md:p-14 min-h-[50svh] md:min-h-[100svh] overflow-hidden',
            half.lane === 'dental'
              ? 'bg-stone-100 text-stone-900'
              : 'bg-[var(--color-ink-teal)] text-stone-50',
            // hairline divider rendered separately below
            '',
          )}
```

Add transition + hover scale. We want a subtle 1.5% scale on the focused/hovered half. We also want the *opposite* half to dim — Tailwind's `group/peer` can't easily reach across siblings of the same level, so we'll use a parent-group approach: wrap the section's `.map` body in a `group/diptych` and have each half respond to its own hover *and* to its sibling's hover.

Actually simpler: apply `motion-safe:hover:scale-[1.015]` to the half itself, and rely on a separate CSS rule to dim the unhovered sibling. The latter is a nice-to-have; ship the lift now, skip the sibling-dim for now (out of scope for v1; can be added later if it looks too symmetric).

Update the Link className:

```tsx
          className={cn(
            'group relative flex flex-col justify-between p-8 md:p-14 min-h-[50svh] md:min-h-[100svh] overflow-hidden',
            'transition-transform duration-300 ease-out motion-safe:hover:scale-[1.015] motion-safe:focus-within:scale-[1.015]',
            half.lane === 'dental'
              ? 'bg-stone-100 text-stone-900'
              : 'bg-[var(--color-ink-teal)] text-stone-50',
            '',
          )}
```

`motion-safe:` is the Tailwind utility for "only when prefers-reduced-motion isn't set." This keeps the lift gated behind reduced-motion automatically.

- [ ] **Step 7: Verify all micro-interactions in dev**

Run: `pnpm dev`. Re-create the scratch route from step 3 if it's no longer present (or wait — we wire to `/` in Task 10). For now, temporarily test by rendering `<TwinMarkColdOpen />` in `app/(marketing)/page.tsx` at the very top (we will finalize this in Task 10).

Open `app/(marketing)/page.tsx`. Find the existing JSX root:

```tsx
  return (
    <>
      <AirwayHero
```

Insert temporarily:

```tsx
  return (
    <>
      <TwinMarkColdOpen />
      <AirwayHero
```

And add the import at the top of `app/(marketing)/page.tsx`:

```tsx
import { TwinMarkColdOpen } from '@/components/twin-mark-cold-open';
```

(If the import already exists from a prior task attempt, leave it.)

Reload `http://localhost:3000/`. You should see:
- Both halves render full-viewport with both logos
- Stagger entry: dental side appears first, then medical, then the divider draws, then CTAs land
- Hovering a half: 1.5% lift, photo goes color
- CTA underline draws on hover
- Scroll cue pulses below

Test reduced-motion via DevTools → Rendering → prefers-reduced-motion: reduce. Reload. All animations should be inert; final state should render immediately. Photos should NOT animate to color on hover (the transition still works via CSS but very fast — acceptable; the explicit reduced-motion override on `motion-safe:` keeps the half-lift from running).

Stop dev server.

- [ ] **Step 8: Run typecheck and tests**

Run: `pnpm typecheck && pnpm test`
Expected: pass.

- [ ] **Step 9: Commit**

```bash
git add components/twin-mark-cold-open.tsx app/globals.css "app/(marketing)/page.tsx"
git commit -m "feat(home): TwinMarkColdOpen — Frame 0 above the AirwayHero

The 100svh editorial diptych. Both logos and both audience promises in
first paint. Desktop: side-by-side halves with vertical hairline divider.
Mobile: vertical stack with horizontal divider. Micro-interactions:
stagger entry (logo → eyebrow → title → CTA at 200ms offset), hairline
draw on entry, hover lift (1.5%) gated via motion-safe, grayscale photo
to color on hover, scroll-cue pulse. All animations gated behind
prefers-reduced-motion.

Photos are Unsplash placeholders pending real photography. Copy is
provisional per spec §2.1.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Wire `<TwinMarkColdOpen>` into the home page properly

**Files:**
- Modify: `app/(marketing)/page.tsx`

Task 9 step 7 already inserted `<TwinMarkColdOpen />` at the top of the home page for testing. This task verifies the placement is final and tightens the visual handoff to the AirwayHero.

- [ ] **Step 1: Confirm the JSX order**

Open `app/(marketing)/page.tsx`. Verify the JSX root looks like:

```tsx
  return (
    <>
      <TwinMarkColdOpen />
      <AirwayHero
        topEyebrow={<>Comfort Care Dental &middot; Dental + Medical &middot; Since 1999</>}
```

If `<TwinMarkColdOpen />` is missing or out of order, add it as the first child of the fragment.

- [ ] **Step 2: Remove the now-redundant top eyebrow from AirwayHero**

The AirwayHero currently carries `topEyebrow={<>Comfort Care Dental · Dental + Medical · Since 1999</>}`. With the cold open above it, this becomes redundant — the cold open is itself the "two practices" statement. Drop the top eyebrow so the AirwayHero reads as the specialty deep-dive.

Find:

```tsx
      <AirwayHero
        topEyebrow={<>Comfort Care Dental &middot; Dental + Medical &middot; Since 1999</>}
        keyframes={HOME_KEYFRAMES}
```

Change to:

```tsx
      <AirwayHero
        keyframes={HOME_KEYFRAMES}
```

(Verify `AirwayHero`'s `topEyebrow` prop is optional — open `components/airway-hero.tsx` and check the interface. If it's required, leave the prop in place and re-raise this question; the spec doesn't mandate the change, it's a cleanup.)

- [ ] **Step 3: Smoke-test the home page**

Run: `pnpm dev`. Visit `http://localhost:3000/`.

- Page loads with the cold open first (100svh)
- Scrolling down, the AirwayHero begins normally
- WhyPatientsStay carousel still pins as expected
- "Two practices, under one roof" lane chooser still renders
- Doctor strip, technology, reviews, final CTA — all unchanged

Mobile (375px DevTools):
- Cold open stacks vertically
- Both halves above the fold (or one + most-of-second; iPhone SE is borderline)
- Toggle row visible directly under header brand row
- Hamburger menu opens drawer below the toggle row

Stop dev server.

- [ ] **Step 4: Run typecheck and tests**

Run: `pnpm typecheck && pnpm test`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add "app/(marketing)/page.tsx"
git commit -m "feat(home): final wiring of TwinMarkColdOpen above AirwayHero

Cold open is now the first child of the home fragment; AirwayHero's
redundant 'Dental + Medical' top eyebrow removed since the cold open
carries that statement. AirwayHero reads as the specialty deep-dive
one scroll below.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Final verification — type, test, lighthouse, manual checklist

**Files:** (none modified — verification only)

- [ ] **Step 1: Run full type check**

Run: `pnpm typecheck`
Expected: zero errors.

If errors: fix them inline and re-run before proceeding. Common issues to look for: `Lane` type imported from wrong path, `data-lane` attribute missing from a JSX type definition (it's a `data-*` so should be permitted automatically).

- [ ] **Step 2: Run full Vitest suite**

Run: `pnpm test`
Expected: all tests pass, including the existing 37 + new tests added in Tasks 1 and 6.

- [ ] **Step 3: Build the production bundle**

Run: `pnpm build`
Expected: build completes; sitemap regenerates; no warnings about missing data on `/dental` or `/medical` route segments.

- [ ] **Step 4: Lighthouse mobile spot-check on `/`**

Run: `pnpm start` (using the production build from step 3).
In another terminal: `npx lighthouse http://localhost:3000/ --preset=desktop --only-categories=performance --quiet --chrome-flags="--headless" --output=json --output-path=./lighthouse-home-after.json 2>/dev/null`

Or run Lighthouse from Chrome DevTools manually (Lighthouse panel → Mobile → Performance only → Analyze page load).

**Acceptance:** LCP ≤ baseline + 200ms. CLS unchanged.

If there's no recorded baseline, take one from `git checkout main` before this branch's first commit, then `pnpm build && pnpm start` and Lighthouse there. Switch back to this branch and compare.

If LCP regresses by more than 200ms: investigate the cold-open photos. Check:
- Are they served WebP? (Unsplash URLs with `&fm=webp` or via the `next/image` Image component, which already negotiates format.)
- Is the LCP element the cold-open photo? (Probably yes on mobile.) If so, set `priority` on the dental photo only and lazy-load the medical photo until the user scrolls.

- [ ] **Step 5: Manual verification checklist**

Run: `pnpm dev`. On a real device or DevTools at iPhone SE viewport, walk through the spec §4.3 checklist:

- [ ] Frame 0 renders both logos on first paint (no FOUC) on `/`
- [ ] Both half-CTAs are tappable (44px+) on iPhone SE simulator
- [ ] Hairline divider draws on entry; pulse cue appears under both halves
- [ ] First-scroll handoff: halves stay visible during scroll (note: the §2.5 "halves converge inward" effect is *not* implemented in this plan — it's deferred; the simpler unscroll is fine for v1)
- [ ] Header toggle: dental active on `/dental`, medical active on `/medical`, neither on `/`
- [ ] Header toggle: keyboard tab reaches both buttons; focus ring visible; Enter navigates
- [ ] Logo morph plays on toggle click (and on lane-chooser click, footer link click)
- [ ] Re-theme: accent eyebrow on `/dental/composite-fillings` is warm-stone; on `/medical/tmj` is teal
- [ ] `prefers-reduced-motion`: all motion disabled; final state renders correctly
- [ ] No new layout shift introduced

For any failure: file a follow-up task, do not close out the plan.

Note: the §2.5 "first-scroll handoff" micro-interaction (halves converge 5% toward center while fading) was descoped to keep this plan bite-sized. The scroll cue pulse and hover lift cover most of the awwwards register. If you want the converge effect, file a follow-up: it would require a scroll listener using Framer Motion's `useScroll` + `useTransform` against the cold-open section's rect, mapping scroll progress 0–1 to translate-x of each half.

- [ ] **Step 6: Final commit if any fixes were made above**

```bash
# Only if step 4 or 5 surfaced fixes you made along the way.
git add -A
git commit -m "fix(home): post-verification adjustments to cold open

[Describe specific fixes; e.g. 'priority on dental photo only to keep LCP
within budget'; or 'fix focus-ring on LaneToggle in dark variant'.]

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Plan complete

Acceptance criteria from spec §7:

1. ✅ On `/`, the first 100svh shows the twin-mark cold open. (Task 9 + 10)
2. ✅ Header on every route renders Dental/Medical toggle, keyboard-accessible, WCAG-AA contrast. (Task 7)
3. ✅ Navigating between `/dental` and `/medical` plays the logo morph + flips the accent. (Task 4, 5, 8)
4. ✅ Reduced-motion users see final state without animation. (Task 8 step 4, Task 9 step 6)
5. ✅ `lib/lane.test.ts` passes; existing tests still pass. (Task 1, Task 11)
6. ✅ Lighthouse LCP stays within +200ms. (Task 11 step 4)
7. ✅ No new external dependencies beyond `@testing-library/*` for tests. (Task 6 step 3)
8. ✅ Medical-logo asset swap is one file change in the future. (Task 8 step 1 comment)

Out-of-scope items deferred (per spec §6):
- True SVG path morph for medical logo (asset-dependent)
- `/story` cinematic explainer route
- First-scroll handoff converge animation (Task 11 step 5 note)
- Audience-mode cookie persistence
- Re-themed AirwayHero captions per lane
