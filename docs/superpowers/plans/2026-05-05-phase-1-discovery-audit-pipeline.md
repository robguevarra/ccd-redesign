# Phase 1 — Discovery & Audit Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Wk 1 discovery pipeline that scrapes dentisthsu.com, runs Lighthouse + axe + Playwright captures across audited pages, and produces five hand-authored markdown deliverables: `audit.md`, `competitive-teardown.md`, `asset-inventory.md`, `dentist-questions.md`, plus the committed `source/` indexes.

**Architecture:** A small, sequential Node + TypeScript pipeline at `scripts/p1-discovery/` orchestrating Firecrawl SDK (scrape), Playwright (screenshots + competitive teardown captures), Lighthouse CI (perf), and axe-core (accessibility). Pure helpers in `scripts/p1-discovery/lib/` are TDD'd with Vitest; SDK orchestration scripts are smoke-tested only. Audit/teardown/inventory are hand-authored markdown produced from pipeline outputs, using committed templates.

**Tech Stack:** Node 24 LTS · pnpm · TypeScript 5 strict · `tsx` · Vitest · `@mendable/firecrawl-js` · Playwright · `lighthouse` (programmatic API) · `@axe-core/playwright` · `sharp` · `zod` (env validation).

**Spec:** [docs/superpowers/specs/2026-05-05-dentisthsu-phase-1-discovery-audit.md](../specs/2026-05-05-dentisthsu-phase-1-discovery-audit.md)

---

## File Structure

```
package.json                                          # pnpm workspace root + scripts
pnpm-lock.yaml
tsconfig.json                                         # strict TS for scripts
.env.local                                            # FIRECRAWL_API_KEY (already exists)
.env.example                                          # committed template

scripts/p1-discovery/
├── lib/
│   ├── env.ts                                        # zod-validated env loader
│   ├── paths.ts                                      # source/ folder path helpers
│   ├── slugify.ts                                    # URL → slug converter
│   ├── audited-pages.ts                              # picks the curated top-12 for L+axe
│   ├── firecrawl-client.ts                           # configured Firecrawl SDK instance
│   ├── logger.ts                                     # progress logger w/ timestamps
│   └── __tests__/
│       ├── slugify.test.ts                           # TDD'd
│       ├── audited-pages.test.ts                     # TDD'd
│       └── paths.test.ts                             # TDD'd
├── 01-discover.ts                                    # Firecrawl /map → source/sitemap.json
├── 02-scrape.ts                                      # Firecrawl /scrape → source/pages/*
├── 03-extract-globals.ts                             # → source/practice-info.json
├── 04-images.ts                                      # download → source/images/<slug>/
├── 05-screenshots.ts                                 # Playwright → source/screenshots/<slug>/
├── 06-lighthouse.ts                                  # Lighthouse → source/lighthouse/<slug>.json
├── 07-axe.ts                                         # axe-core → source/axe/<slug>.json
└── run-all.ts                                        # orchestrator

source/                                               # outputs; partial gitignore
├── sitemap.json                                      # committed
├── practice-info.json                                # committed
├── pages/<slug>.{md,json}                            # committed
├── images/                                           # gitignored
├── screenshots/                                      # gitignored
├── lighthouse/                                       # gitignored
└── axe/                                              # gitignored

docs/audit/
├── _templates/
│   ├── audit.template.md                             # 10-dimension scaffold
│   ├── competitive-teardown.template.md              # asymmetric structure
│   ├── asset-inventory.template.md                   # table scaffold
│   └── dentist-questions.template.md                 # 5+ open-question scaffold
├── audit.md                                          # authored Days 3–4
├── competitive-teardown.md                           # authored Day 5
├── asset-inventory.md                                # authored Day 2
└── dentist-questions.md                              # authored Day 4
```

---

## Task 1: Project scaffold (Node + pnpm + TypeScript + Vitest)

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.env.example`
- Create: `.npmrc`
- Modify: `.gitignore` (already exists; add a couple of source-folder entries)

- [ ] **Step 1: Verify Node 24 LTS is available**

Run: `node --version`
Expected: `v24.x.x`. If not, install via `nvm install 24 && nvm use 24` and re-run.

- [ ] **Step 2: Verify pnpm is installed**

Run: `pnpm --version`
Expected: `9.x` or `10.x`. If missing: `npm i -g pnpm@latest`.

- [ ] **Step 3: Create `.npmrc` to pin shamefully-hoist for tools that expect flat node_modules**

```
# .npmrc
auto-install-peers=true
strict-peer-dependencies=false
```

- [ ] **Step 4: Initialize `package.json`**

Create `package.json`:

```json
{
  "name": "dentisthsu-redesign",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=24" },
  "packageManager": "pnpm@10.0.0",
  "scripts": {
    "p1:discover": "tsx scripts/p1-discovery/01-discover.ts",
    "p1:scrape": "tsx scripts/p1-discovery/02-scrape.ts",
    "p1:globals": "tsx scripts/p1-discovery/03-extract-globals.ts",
    "p1:images": "tsx scripts/p1-discovery/04-images.ts",
    "p1:screenshots": "tsx scripts/p1-discovery/05-screenshots.ts",
    "p1:lighthouse": "tsx scripts/p1-discovery/06-lighthouse.ts",
    "p1:axe": "tsx scripts/p1-discovery/07-axe.ts",
    "p1:run-all": "tsx scripts/p1-discovery/run-all.ts",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "@axe-core/playwright": "^4.10.0",
    "@types/node": "^24.0.0",
    "@mendable/firecrawl-js": "^1.20.0",
    "lighthouse": "^12.3.0",
    "playwright": "^1.49.0",
    "sharp": "^0.34.0",
    "tsx": "^4.19.0",
    "typescript": "^5.7.0",
    "vitest": "^3.0.0",
    "zod": "^3.24.0"
  }
}
```

- [ ] **Step 5: Create `tsconfig.json` with strict settings**

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2023", "DOM"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": false,
    "allowImportingTsExtensions": false,
    "noEmit": true
  },
  "include": ["scripts/**/*.ts"],
  "exclude": ["node_modules", "source"]
}
```

- [ ] **Step 6: Create `.env.example` (committed)**

```
# Copy to .env.local and fill in real values.
FIRECRAWL_API_KEY=fc-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- [ ] **Step 7: Append source-folder entries to `.gitignore`**

Append to existing `.gitignore`:

```
# P1 discovery — heavy binaries gitignored, indexes committed
source/images/
source/screenshots/
source/lighthouse/
source/axe/
```

- [ ] **Step 8: Install dependencies**

Run: `pnpm install`
Expected: `Done in <N>s.` and a new `pnpm-lock.yaml` file. If `sharp` errors on install, run `pnpm install --ignore-scripts && pnpm rebuild sharp`.

- [ ] **Step 9: Install Playwright browsers**

Run: `pnpm exec playwright install chromium`
Expected: Chromium binary downloaded.

- [ ] **Step 10: Verify TypeScript compiles**

Run: `pnpm exec tsc --noEmit`
Expected: no errors (no source files yet means clean exit).

- [ ] **Step 11: Verify Vitest runs**

Run: `pnpm test`
Expected: `No test files found` — that's the success state at this point.

- [ ] **Step 12: Commit**

```bash
git add .
git commit -m "feat(p1): project scaffold — Node 24 + pnpm + TS strict + Vitest + Playwright"
```

---

## Task 2: TDD `slugify(url)` helper

**Files:**
- Create: `scripts/p1-discovery/lib/slugify.ts`
- Test: `scripts/p1-discovery/lib/__tests__/slugify.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `scripts/p1-discovery/lib/__tests__/slugify.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { slugify } from '../slugify';

describe('slugify', () => {
  it('reduces the homepage to "index"', () => {
    expect(slugify('https://dentisthsu.com/')).toBe('index');
    expect(slugify('https://dentisthsu.com')).toBe('index');
  });

  it('uses the path for inner pages', () => {
    expect(slugify('https://dentisthsu.com/about')).toBe('about');
    expect(slugify('https://dentisthsu.com/about/')).toBe('about');
  });

  it('replaces nested slashes with hyphens', () => {
    expect(slugify('https://dentisthsu.com/services/tmj-treatment'))
      .toBe('services-tmj-treatment');
  });

  it('strips query strings and fragments', () => {
    expect(slugify('https://dentisthsu.com/contact?utm=x#section')).toBe('contact');
  });

  it('lowercases and replaces unsafe chars', () => {
    expect(slugify('https://dentisthsu.com/Dr%20Hsu/About-Us')).toBe('dr-hsu-about-us');
  });

  it('throws on non-URL input', () => {
    expect(() => slugify('not a url')).toThrow();
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `pnpm test slugify`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `slugify`**

Create `scripts/p1-discovery/lib/slugify.ts`:

```typescript
export function slugify(url: string): string {
  const parsed = new URL(url); // throws if invalid
  let path = parsed.pathname.replace(/\/+$/, '').replace(/^\/+/, '');
  if (path === '') return 'index';
  path = decodeURIComponent(path);
  return path
    .toLowerCase()
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `pnpm test slugify`
Expected: 6/6 pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/p1-discovery/lib/slugify.ts scripts/p1-discovery/lib/__tests__/slugify.test.ts
git commit -m "feat(p1): slugify(url) helper with tests"
```

---

## Task 3: Path helpers + env loader

**Files:**
- Create: `scripts/p1-discovery/lib/paths.ts`
- Create: `scripts/p1-discovery/lib/env.ts`
- Test: `scripts/p1-discovery/lib/__tests__/paths.test.ts`

- [ ] **Step 1: Write the failing path tests**

Create `scripts/p1-discovery/lib/__tests__/paths.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { sourcePaths } from '../paths';

describe('sourcePaths', () => {
  it('returns absolute paths under source/', () => {
    const p = sourcePaths('about');
    expect(p.pageMarkdown).toMatch(/source\/pages\/about\.md$/);
    expect(p.pageJson).toMatch(/source\/pages\/about\.json$/);
    expect(p.imageDir).toMatch(/source\/images\/about$/);
    expect(p.screenshotDir).toMatch(/source\/screenshots\/about$/);
    expect(p.lighthouseJson).toMatch(/source\/lighthouse\/about\.json$/);
    expect(p.axeJson).toMatch(/source\/axe\/about\.json$/);
  });

  it('returns globals for the practice-info file', () => {
    expect(sourcePaths().sitemapJson).toMatch(/source\/sitemap\.json$/);
    expect(sourcePaths().practiceInfoJson).toMatch(/source\/practice-info\.json$/);
  });
});
```

- [ ] **Step 2: Run tests and confirm they fail**

Run: `pnpm test paths`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `paths.ts`**

Create `scripts/p1-discovery/lib/paths.ts`:

```typescript
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '../../..');
const SOURCE = resolve(ROOT, 'source');

export function sourcePaths(slug?: string) {
  return {
    root: ROOT,
    source: SOURCE,
    sitemapJson: resolve(SOURCE, 'sitemap.json'),
    practiceInfoJson: resolve(SOURCE, 'practice-info.json'),
    pageMarkdown: slug ? resolve(SOURCE, 'pages', `${slug}.md`) : undefined,
    pageJson: slug ? resolve(SOURCE, 'pages', `${slug}.json`) : undefined,
    imageDir: slug ? resolve(SOURCE, 'images', slug) : undefined,
    screenshotDir: slug ? resolve(SOURCE, 'screenshots', slug) : undefined,
    lighthouseJson: slug ? resolve(SOURCE, 'lighthouse', `${slug}.json`) : undefined,
    axeJson: slug ? resolve(SOURCE, 'axe', `${slug}.json`) : undefined,
  };
}
```

- [ ] **Step 4: Run tests and confirm they pass**

Run: `pnpm test paths`
Expected: 2/2 pass.

- [ ] **Step 5: Implement `env.ts` (no test — direct usage)**

Create `scripts/p1-discovery/lib/env.ts`:

```typescript
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';
import { sourcePaths } from './paths';

config({ path: resolve(sourcePaths().root, '.env.local') });

const schema = z.object({
  FIRECRAWL_API_KEY: z.string().startsWith('fc-', 'FIRECRAWL_API_KEY must start with "fc-"'),
});

export const env = schema.parse(process.env);
```

- [ ] **Step 6: Add `dotenv` dep**

Run: `pnpm add -D dotenv`
Expected: `dotenv` appears in `package.json` devDependencies.

- [ ] **Step 7: Smoke-test env loader**

Run: `pnpm exec tsx -e "import('./scripts/p1-discovery/lib/env').then(m => console.log('OK:', m.env.FIRECRAWL_API_KEY.slice(0,5)))"`
Expected: `OK: fc-a0`

- [ ] **Step 8: Commit**

```bash
git add scripts/p1-discovery/lib/paths.ts scripts/p1-discovery/lib/env.ts scripts/p1-discovery/lib/__tests__/paths.test.ts package.json pnpm-lock.yaml
git commit -m "feat(p1): paths + zod-validated env loader"
```

---

## Task 4: TDD `selectAuditedPages` — picks the curated top-12 for Lighthouse + axe

**Files:**
- Create: `scripts/p1-discovery/lib/audited-pages.ts`
- Test: `scripts/p1-discovery/lib/__tests__/audited-pages.test.ts`

The audit covers all crawled pages textually, but Lighthouse + axe are expensive and only run on a curated subset. This helper picks that subset deterministically: homepage first, then service pages, then doctor/about/contact, then blog index, then 1–2 sample blog posts, capped at 12.

- [ ] **Step 1: Write the failing tests**

Create `scripts/p1-discovery/lib/__tests__/audited-pages.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { selectAuditedPages } from '../audited-pages';

describe('selectAuditedPages', () => {
  const sample = [
    'https://dentisthsu.com/',
    'https://dentisthsu.com/about',
    'https://dentisthsu.com/doctor',
    'https://dentisthsu.com/contact',
    'https://dentisthsu.com/services',
    'https://dentisthsu.com/services/general',
    'https://dentisthsu.com/services/tmj',
    'https://dentisthsu.com/services/sleep-apnea',
    'https://dentisthsu.com/blog',
    'https://dentisthsu.com/blog/post-1',
    'https://dentisthsu.com/blog/post-2',
    'https://dentisthsu.com/blog/post-3',
    'https://dentisthsu.com/privacy',
    'https://dentisthsu.com/terms',
    'https://dentisthsu.com/sitemap',
  ];

  it('always includes the homepage first', () => {
    const picked = selectAuditedPages(sample);
    expect(picked[0]).toBe('https://dentisthsu.com/');
  });

  it('caps the result at 12', () => {
    const picked = selectAuditedPages(sample);
    expect(picked.length).toBeLessThanOrEqual(12);
  });

  it('prefers service pages over policy pages', () => {
    const picked = selectAuditedPages(sample);
    expect(picked).toContain('https://dentisthsu.com/services/tmj');
    expect(picked).not.toContain('https://dentisthsu.com/privacy');
  });

  it('includes at most 2 blog posts', () => {
    const picked = selectAuditedPages(sample);
    const posts = picked.filter((u) => /\/blog\/[^/]+/.test(u));
    expect(posts.length).toBeLessThanOrEqual(2);
  });

  it('returns sample input unchanged in priority order when ≤12 high-priority', () => {
    const small = sample.slice(0, 5);
    expect(selectAuditedPages(small).length).toBe(small.length);
  });
});
```

- [ ] **Step 2: Run tests and confirm they fail**

Run: `pnpm test audited-pages`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `audited-pages.ts`**

Create `scripts/p1-discovery/lib/audited-pages.ts`:

```typescript
const PRIORITY_PATTERNS: Array<{ pattern: RegExp; weight: number }> = [
  { pattern: /^\/$/, weight: 100 },
  { pattern: /^\/services\/[^/]+$/, weight: 90 },
  { pattern: /^\/services\/?$/, weight: 85 },
  { pattern: /^\/doctor\/?$/, weight: 80 },
  { pattern: /^\/about\/?$/, weight: 75 },
  { pattern: /^\/contact\/?$/, weight: 70 },
  { pattern: /^\/request-appointment\/?$/, weight: 70 },
  { pattern: /^\/blog\/?$/, weight: 60 },
  { pattern: /^\/blog\/[^/]+$/, weight: 40 },
];

const EXCLUDE = /^\/(privacy|terms|sitemap|404|search|tag|category|author)/;

export function selectAuditedPages(urls: string[], cap = 12): string[] {
  const scored = urls
    .map((url) => {
      const path = new URL(url).pathname;
      if (EXCLUDE.test(path)) return null;
      const match = PRIORITY_PATTERNS.find((p) => p.pattern.test(path));
      return match ? { url, weight: match.weight, path } : null;
    })
    .filter((x): x is { url: string; weight: number; path: string } => x !== null)
    .sort((a, b) => b.weight - a.weight);

  // Cap blog posts at 2.
  const result: string[] = [];
  let blogPostCount = 0;
  for (const item of scored) {
    if (/^\/blog\/[^/]+$/.test(item.path)) {
      if (blogPostCount >= 2) continue;
      blogPostCount++;
    }
    result.push(item.url);
    if (result.length >= cap) break;
  }
  return result;
}
```

- [ ] **Step 4: Run tests and confirm they pass**

Run: `pnpm test audited-pages`
Expected: 5/5 pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/p1-discovery/lib/audited-pages.ts scripts/p1-discovery/lib/__tests__/audited-pages.test.ts
git commit -m "feat(p1): selectAuditedPages — curated top-12 picker for Lighthouse + axe"
```

---

## Task 5: Firecrawl client + logger helpers (no TDD — direct integration)

**Files:**
- Create: `scripts/p1-discovery/lib/firecrawl-client.ts`
- Create: `scripts/p1-discovery/lib/logger.ts`

- [ ] **Step 1: Implement the Firecrawl client wrapper**

Create `scripts/p1-discovery/lib/firecrawl-client.ts`:

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';
import { env } from './env';

export const firecrawl = new FirecrawlApp({ apiKey: env.FIRECRAWL_API_KEY });
```

- [ ] **Step 2: Implement the logger**

Create `scripts/p1-discovery/lib/logger.ts`:

```typescript
function ts() {
  return new Date().toISOString().slice(11, 19);
}

export const log = {
  info: (msg: string) => console.log(`[${ts()}] ${msg}`),
  ok: (msg: string) => console.log(`[${ts()}] ✓ ${msg}`),
  warn: (msg: string) => console.warn(`[${ts()}] ⚠ ${msg}`),
  err: (msg: string) => console.error(`[${ts()}] ✗ ${msg}`),
  step: (n: number | string, msg: string) => console.log(`[${ts()}] [${n}] ${msg}`),
};
```

- [ ] **Step 3: Smoke test that Firecrawl client loads and is authenticated**

Run:
```bash
pnpm exec tsx -e "
import('./scripts/p1-discovery/lib/firecrawl-client').then(async ({firecrawl}) => {
  const r = await firecrawl.mapUrl('https://example.com', { limit: 5 });
  console.log('STATUS:', r.success ? 'OK' : 'FAIL', 'COUNT:', r.success ? r.links?.length : 'n/a');
});
"
```
Expected: `STATUS: OK COUNT: <some number>`. If FAIL, check `FIRECRAWL_API_KEY` in `.env.local`.

- [ ] **Step 4: Commit**

```bash
git add scripts/p1-discovery/lib/firecrawl-client.ts scripts/p1-discovery/lib/logger.ts
git commit -m "feat(p1): firecrawl client + logger helpers"
```

---

## Task 6: `01-discover.ts` — site map via Firecrawl `/map`

**Files:**
- Create: `scripts/p1-discovery/01-discover.ts`

- [ ] **Step 1: Implement the discovery script**

Create `scripts/p1-discovery/01-discover.ts`:

```typescript
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { firecrawl } from './lib/firecrawl-client';
import { sourcePaths } from './lib/paths';
import { log } from './lib/logger';

const TARGET = 'https://dentisthsu.com';

async function main() {
  log.step('01', `Mapping ${TARGET} via Firecrawl /map`);
  const result = await firecrawl.mapUrl(TARGET, { limit: 500 });

  if (!result.success) {
    log.err(`Map failed: ${result.error ?? 'unknown error'}`);
    process.exit(1);
  }

  const links = result.links ?? [];
  log.ok(`Discovered ${links.length} URLs`);

  const out = sourcePaths().sitemapJson;
  await mkdir(dirname(out), { recursive: true });
  await writeFile(
    out,
    JSON.stringify(
      { target: TARGET, discoveredAt: new Date().toISOString(), count: links.length, urls: links },
      null,
      2,
    ),
  );
  log.ok(`Wrote ${out}`);
}

main().catch((e) => {
  log.err(String(e));
  process.exit(1);
});
```

- [ ] **Step 2: Run and verify**

Run: `pnpm p1:discover`
Expected: log lines ending with `✓ Wrote …/source/sitemap.json`. Open `source/sitemap.json` and confirm a `urls` array with the dentisthsu.com pages.

- [ ] **Step 3: Commit**

```bash
git add scripts/p1-discovery/01-discover.ts source/sitemap.json
git commit -m "feat(p1): 01-discover — Firecrawl site map"
```

---

## Task 7: `02-scrape.ts` — per-URL scrape with markdown + structured data

**Files:**
- Create: `scripts/p1-discovery/02-scrape.ts`

- [ ] **Step 1: Implement the scrape script**

Create `scripts/p1-discovery/02-scrape.ts`:

```typescript
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { dirname } from 'node:path';
import { firecrawl } from './lib/firecrawl-client';
import { sourcePaths } from './lib/paths';
import { slugify } from './lib/slugify';
import { log } from './lib/logger';

type Sitemap = { urls: string[] };

async function fileExists(p: string): Promise<boolean> {
  try { await access(p); return true; } catch { return false; }
}

async function main() {
  const sitemap = JSON.parse(await readFile(sourcePaths().sitemapJson, 'utf8')) as Sitemap;
  log.step('02', `Scraping ${sitemap.urls.length} URLs`);

  for (let i = 0; i < sitemap.urls.length; i++) {
    const url = sitemap.urls[i]!;
    const slug = slugify(url);
    const paths = sourcePaths(slug);
    if (!paths.pageMarkdown || !paths.pageJson) continue;

    if (await fileExists(paths.pageMarkdown)) {
      log.info(`[${i + 1}/${sitemap.urls.length}] cache hit: ${slug}`);
      continue;
    }

    log.step(`${i + 1}/${sitemap.urls.length}`, `scraping ${url}`);
    const r = await firecrawl.scrapeUrl(url, { formats: ['markdown', 'links'] });
    if (!r.success) {
      log.warn(`scrape failed for ${url}: ${r.error ?? 'unknown'}`);
      continue;
    }

    await mkdir(dirname(paths.pageMarkdown), { recursive: true });
    await writeFile(paths.pageMarkdown, r.markdown ?? '');
    await writeFile(
      paths.pageJson,
      JSON.stringify(
        {
          url,
          slug,
          scrapedAt: new Date().toISOString(),
          metadata: r.metadata ?? {},
          links: r.links ?? [],
        },
        null,
        2,
      ),
    );
    log.ok(`wrote ${slug}.md + ${slug}.json`);
  }
}

main().catch((e) => { log.err(String(e)); process.exit(1); });
```

- [ ] **Step 2: Run and verify**

Run: `pnpm p1:scrape`
Expected: log lines for each URL, ending with success. Verify `source/pages/index.md` and `source/pages/index.json` exist and contain meaningful content.

- [ ] **Step 3: Commit (excluding any heavy outputs)**

```bash
git add scripts/p1-discovery/02-scrape.ts source/pages/
git commit -m "feat(p1): 02-scrape — per-URL Firecrawl /scrape with markdown + JSON"
```

---

## Task 8: `03-extract-globals.ts` — practice-info.json

**Files:**
- Create: `scripts/p1-discovery/03-extract-globals.ts`

- [ ] **Step 1: Implement the extraction script**

Create `scripts/p1-discovery/03-extract-globals.ts`:

```typescript
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { sourcePaths } from './lib/paths';
import { log } from './lib/logger';

interface PageJson {
  url: string;
  slug: string;
  metadata: Record<string, unknown>;
  links: string[];
}

const PHONE_RE = /\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/;
const ADDRESS_HINTS = /\b(\d{1,5}\s+\w[\w\s.,'-]+(Avenue|Ave|Street|St|Blvd|Boulevard|Road|Rd|Drive|Dr|Lane|Ln|Way|Suite|Ste)\b)/i;
const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

async function main() {
  const pagesDir = sourcePaths().source + '/pages';
  const files = (await readdir(pagesDir)).filter((f) => f.endsWith('.md'));
  log.step('03', `Extracting globals from ${files.length} pages`);

  const candidates = {
    phones: new Set<string>(),
    addresses: new Set<string>(),
    emails: new Set<string>(),
    socials: new Set<string>(),
  };

  for (const f of files) {
    const md = await readFile(`${pagesDir}/${f}`, 'utf8');
    md.match(new RegExp(PHONE_RE, 'g'))?.forEach((p) => candidates.phones.add(p.trim()));
    md.match(new RegExp(EMAIL_RE, 'g'))?.forEach((e) => candidates.emails.add(e.toLowerCase()));
    const addr = md.match(ADDRESS_HINTS);
    if (addr) candidates.addresses.add(addr[1]!.trim());

    const slug = f.replace(/\.md$/, '');
    const json = JSON.parse(await readFile(`${pagesDir}/${slug}.json`, 'utf8')) as PageJson;
    for (const l of json.links) {
      if (/(facebook|instagram|x\.com|twitter|youtube|linkedin|yelp|google)/i.test(l)) {
        candidates.socials.add(l);
      }
    }
  }

  const out = {
    target: 'https://dentisthsu.com',
    extractedAt: new Date().toISOString(),
    phones: [...candidates.phones],
    addresses: [...candidates.addresses],
    emails: [...candidates.emails],
    socials: [...candidates.socials],
    notes: 'Automated extraction. Verify and curate manually before consuming downstream.',
  };

  await writeFile(sourcePaths().practiceInfoJson, JSON.stringify(out, null, 2));
  log.ok(`Wrote practice-info.json — ${out.phones.length} phones, ${out.addresses.length} addresses, ${out.emails.length} emails, ${out.socials.length} socials`);
}

main().catch((e) => { log.err(String(e)); process.exit(1); });
```

- [ ] **Step 2: Run and verify**

Run: `pnpm p1:globals`
Expected: log lines, `practice-info.json` exists with at least one phone and one address found. Eyeball the output — manually clean up later.

- [ ] **Step 3: Commit**

```bash
git add scripts/p1-discovery/03-extract-globals.ts source/practice-info.json
git commit -m "feat(p1): 03-extract-globals — phones/addresses/emails/socials"
```

---

## Task 9: `04-images.ts` — download every image referenced in scraped pages

**Files:**
- Create: `scripts/p1-discovery/04-images.ts`

- [ ] **Step 1: Implement the image download script**

Create `scripts/p1-discovery/04-images.ts`:

```typescript
import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises';
import { dirname, basename, extname } from 'node:path';
import sharp from 'sharp';
import { sourcePaths } from './lib/paths';
import { log } from './lib/logger';

const MD_IMG = /!\[([^\]]*)\]\(([^)]+)\)/g;

async function fileExists(p: string): Promise<boolean> {
  try { await access(p); return true; } catch { return false; }
}

interface ImageRecord {
  page: string;
  sourceUrl: string;
  localPath: string;
  alt: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

async function main() {
  const pagesDir = sourcePaths().source + '/pages';
  const files = (await readdir(pagesDir)).filter((f) => f.endsWith('.md'));
  const inventory: ImageRecord[] = [];

  for (const f of files) {
    const slug = f.replace(/\.md$/, '');
    const md = await readFile(`${pagesDir}/${f}`, 'utf8');
    const dir = sourcePaths(slug).imageDir!;
    await mkdir(dir, { recursive: true });

    const matches = [...md.matchAll(MD_IMG)];
    log.step('04', `${slug}: ${matches.length} images`);

    for (const m of matches) {
      const [, alt = '', src = ''] = m;
      if (!/^https?:/.test(src)) continue;
      const filename = basename(new URL(src).pathname) || `image${extname(src) || '.jpg'}`;
      const local = `${dir}/${filename}`;
      let bytes: number | undefined;
      let width: number | undefined;
      let height: number | undefined;
      let format: string | undefined;

      if (!(await fileExists(local))) {
        try {
          const res = await fetch(src);
          if (!res.ok) { log.warn(`fetch failed ${src} (${res.status})`); continue; }
          const buf = Buffer.from(await res.arrayBuffer());
          await writeFile(local, buf);
          bytes = buf.byteLength;
        } catch (e) {
          log.warn(`download error ${src}: ${String(e)}`);
          continue;
        }
      }

      try {
        const meta = await sharp(local).metadata();
        width = meta.width; height = meta.height; format = meta.format;
        if (bytes === undefined) bytes = (await readFile(local)).byteLength;
      } catch { /* non-image or corrupted; skip metadata */ }

      inventory.push({ page: slug, sourceUrl: src, localPath: local, alt, width, height, format, bytes });
    }
  }

  const out = `${sourcePaths().source}/image-index.json`;
  await writeFile(out, JSON.stringify({ generatedAt: new Date().toISOString(), images: inventory }, null, 2));
  log.ok(`Wrote ${out} — ${inventory.length} image records`);
}

main().catch((e) => { log.err(String(e)); process.exit(1); });
```

- [ ] **Step 2: Run and verify**

Run: `pnpm p1:images`
Expected: per-page log lines, `source/image-index.json` written, `source/images/<slug>/` populated.

- [ ] **Step 3: Commit (image-index.json only; image files are gitignored)**

```bash
git add scripts/p1-discovery/04-images.ts source/image-index.json
git commit -m "feat(p1): 04-images — download + metadata extraction"
```

---

## Task 10: `05-screenshots.ts` — Playwright mobile + desktop full-page captures

**Files:**
- Create: `scripts/p1-discovery/05-screenshots.ts`

- [ ] **Step 1: Implement the screenshot script**

Create `scripts/p1-discovery/05-screenshots.ts`:

```typescript
import { readFile, mkdir } from 'node:fs/promises';
import { chromium, devices } from 'playwright';
import { sourcePaths } from './lib/paths';
import { slugify } from './lib/slugify';
import { selectAuditedPages } from './lib/audited-pages';
import { log } from './lib/logger';

async function main() {
  const sitemap = JSON.parse(await readFile(sourcePaths().sitemapJson, 'utf8')) as { urls: string[] };
  const targets = selectAuditedPages(sitemap.urls);
  log.step('05', `Capturing ${targets.length} pages on mobile + desktop`);

  const browser = await chromium.launch();
  for (const url of targets) {
    const slug = slugify(url);
    const dir = sourcePaths(slug).screenshotDir!;
    await mkdir(dir, { recursive: true });

    for (const variant of [
      { name: 'mobile', context: devices['iPhone 14'] },
      { name: 'desktop', context: { viewport: { width: 1440, height: 900 } } },
    ]) {
      const ctx = await browser.newContext(variant.context);
      const page = await ctx.newPage();
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
        await page.screenshot({ path: `${dir}/${variant.name}.png`, fullPage: true });
        log.ok(`${slug} ${variant.name}`);
      } catch (e) {
        log.warn(`${slug} ${variant.name} failed: ${String(e)}`);
      } finally {
        await ctx.close();
      }
    }
  }
  await browser.close();
}

main().catch((e) => { log.err(String(e)); process.exit(1); });
```

- [ ] **Step 2: Run and verify**

Run: `pnpm p1:screenshots`
Expected: per-page mobile+desktop captures land in `source/screenshots/<slug>/`. Open one on disk to confirm full-page rendering.

- [ ] **Step 3: Commit**

```bash
git add scripts/p1-discovery/05-screenshots.ts
git commit -m "feat(p1): 05-screenshots — Playwright mobile + desktop captures"
```

---

## Task 11: `06-lighthouse.ts` — Lighthouse on audited pages

**Files:**
- Create: `scripts/p1-discovery/06-lighthouse.ts`

- [ ] **Step 1: Implement the Lighthouse runner**

Create `scripts/p1-discovery/06-lighthouse.ts`:

```typescript
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { sourcePaths } from './lib/paths';
import { slugify } from './lib/slugify';
import { selectAuditedPages } from './lib/audited-pages';
import { log } from './lib/logger';

async function runLH(url: string, port: number, formFactor: 'mobile' | 'desktop') {
  const flags = { port, output: 'json' as const, logLevel: 'error' as const, formFactor };
  const config = formFactor === 'mobile' ? undefined : { extends: 'lighthouse:default', settings: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false } } };
  const result = await lighthouse(url, flags, config as never);
  if (!result) throw new Error('lighthouse returned undefined');
  return JSON.parse(result.report as string);
}

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

async function main() {
  const sitemap = JSON.parse(await readFile(sourcePaths().sitemapJson, 'utf8')) as { urls: string[] };
  const targets = selectAuditedPages(sitemap.urls);
  log.step('06', `Lighthouse on ${targets.length} pages × 2 form factors × 3 runs`);

  const chrome = await launch({ chromeFlags: ['--headless=new'] });
  try {
    for (const url of targets) {
      const slug = slugify(url);
      const out = sourcePaths(slug).lighthouseJson!;
      await mkdir(dirname(out), { recursive: true });

      const results: { mobile: any[]; desktop: any[] } = { mobile: [], desktop: [] };
      for (const ff of ['mobile', 'desktop'] as const) {
        for (let i = 0; i < 3; i++) {
          try {
            results[ff].push(await runLH(url, chrome.port, ff));
            log.ok(`${slug} ${ff} run ${i + 1}/3`);
          } catch (e) {
            log.warn(`${slug} ${ff} run ${i + 1} failed: ${String(e)}`);
          }
        }
      }

      const summary = (runs: any[]) => ({
        runs: runs.length,
        scores: {
          performance: median(runs.map((r) => Math.round((r.categories?.performance?.score ?? 0) * 100))),
          accessibility: median(runs.map((r) => Math.round((r.categories?.accessibility?.score ?? 0) * 100))),
          bestPractices: median(runs.map((r) => Math.round((r.categories?.['best-practices']?.score ?? 0) * 100))),
          seo: median(runs.map((r) => Math.round((r.categories?.seo?.score ?? 0) * 100))),
        },
        metrics: {
          lcpMs: median(runs.map((r) => r.audits?.['largest-contentful-paint']?.numericValue ?? 0)),
          fcpMs: median(runs.map((r) => r.audits?.['first-contentful-paint']?.numericValue ?? 0)),
          cls: median(runs.map((r) => r.audits?.['cumulative-layout-shift']?.numericValue ?? 0)),
          tbtMs: median(runs.map((r) => r.audits?.['total-blocking-time']?.numericValue ?? 0)),
        },
      });

      await writeFile(out, JSON.stringify({ url, generatedAt: new Date().toISOString(), mobile: summary(results.mobile), desktop: summary(results.desktop) }, null, 2));
      log.ok(`wrote ${out}`);
    }
  } finally {
    await chrome.kill();
  }
}

main().catch((e) => { log.err(String(e)); process.exit(1); });
```

- [ ] **Step 2: Add `chrome-launcher` dep**

Run: `pnpm add -D chrome-launcher`
Expected: `chrome-launcher` appears in devDependencies.

- [ ] **Step 3: Run and verify**

Run: `pnpm p1:lighthouse`
Expected: per-page log lines for 6 runs each (3 mobile + 3 desktop), `source/lighthouse/<slug>.json` written. Inspect one and confirm score medians look reasonable.

- [ ] **Step 4: Commit**

```bash
git add scripts/p1-discovery/06-lighthouse.ts package.json pnpm-lock.yaml
git commit -m "feat(p1): 06-lighthouse — 3-run median per page × mobile + desktop"
```

---

## Task 12: `07-axe.ts` — accessibility scans on audited pages

**Files:**
- Create: `scripts/p1-discovery/07-axe.ts`

- [ ] **Step 1: Implement the axe runner**

Create `scripts/p1-discovery/07-axe.ts`:

```typescript
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { sourcePaths } from './lib/paths';
import { slugify } from './lib/slugify';
import { selectAuditedPages } from './lib/audited-pages';
import { log } from './lib/logger';

async function main() {
  const sitemap = JSON.parse(await readFile(sourcePaths().sitemapJson, 'utf8')) as { urls: string[] };
  const targets = selectAuditedPages(sitemap.urls);
  log.step('07', `axe-core on ${targets.length} pages`);

  const browser = await chromium.launch();
  try {
    for (const url of targets) {
      const slug = slugify(url);
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
        const r = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();

        const summary = {
          url,
          generatedAt: new Date().toISOString(),
          counts: {
            violations: r.violations.length,
            incomplete: r.incomplete.length,
            passes: r.passes.length,
            inapplicable: r.inapplicable.length,
          },
          violations: r.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            helpUrl: v.helpUrl,
            nodes: v.nodes.length,
          })),
        };

        const out = sourcePaths(slug).axeJson!;
        await mkdir(dirname(out), { recursive: true });
        await writeFile(out, JSON.stringify(summary, null, 2));
        log.ok(`${slug}: ${summary.counts.violations} violations`);
      } catch (e) {
        log.warn(`${slug} failed: ${String(e)}`);
      } finally {
        await ctx.close();
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => { log.err(String(e)); process.exit(1); });
```

- [ ] **Step 2: Run and verify**

Run: `pnpm p1:axe`
Expected: per-page logs with violation counts, `source/axe/<slug>.json` written for each.

- [ ] **Step 3: Commit**

```bash
git add scripts/p1-discovery/07-axe.ts
git commit -m "feat(p1): 07-axe — WCAG 2.1 AA scans per audited page"
```

---

## Task 13: `run-all.ts` orchestrator

**Files:**
- Create: `scripts/p1-discovery/run-all.ts`

- [ ] **Step 1: Implement the orchestrator**

Create `scripts/p1-discovery/run-all.ts`:

```typescript
import { spawn } from 'node:child_process';
import { log } from './lib/logger';

const STEPS: Array<{ name: string; script: string }> = [
  { name: '01-discover', script: 'scripts/p1-discovery/01-discover.ts' },
  { name: '02-scrape', script: 'scripts/p1-discovery/02-scrape.ts' },
  { name: '03-extract-globals', script: 'scripts/p1-discovery/03-extract-globals.ts' },
  { name: '04-images', script: 'scripts/p1-discovery/04-images.ts' },
  { name: '05-screenshots', script: 'scripts/p1-discovery/05-screenshots.ts' },
  { name: '06-lighthouse', script: 'scripts/p1-discovery/06-lighthouse.ts' },
  { name: '07-axe', script: 'scripts/p1-discovery/07-axe.ts' },
];

function run(script: string): Promise<number> {
  return new Promise((resolve) => {
    const p = spawn('pnpm', ['exec', 'tsx', script], { stdio: 'inherit' });
    p.on('exit', (code) => resolve(code ?? 0));
  });
}

async function main() {
  for (const step of STEPS) {
    log.info(`==== ${step.name} ====`);
    const code = await run(step.script);
    if (code !== 0) {
      log.err(`${step.name} exited with code ${code} — halting`);
      process.exit(code);
    }
  }
  log.ok('All P1 discovery steps complete.');
}

main().catch((e) => { log.err(String(e)); process.exit(1); });
```

- [ ] **Step 2: Smoke-test (do NOT re-run end-to-end here; cache will short-circuit)**

Run: `pnpm p1:run-all`
Expected: every step logs `cache hit` or runs quickly. No new failures.

- [ ] **Step 3: Commit**

```bash
git add scripts/p1-discovery/run-all.ts
git commit -m "feat(p1): run-all orchestrator"
```

---

## Task 14: Authoring templates for the five deliverables

**Files:**
- Create: `docs/audit/_templates/audit.template.md`
- Create: `docs/audit/_templates/competitive-teardown.template.md`
- Create: `docs/audit/_templates/asset-inventory.template.md`
- Create: `docs/audit/_templates/dentist-questions.template.md`

- [ ] **Step 1: Create `audit.template.md`**

Create `docs/audit/_templates/audit.template.md`:

````markdown
# dentisthsu.com Audit

**Audited:** YYYY-MM-DD
**Pages audited:** N (full crawl) · top-12 deeply (Lighthouse + axe)
**Auditor:** Rob Guevarra

## Executive summary

*(One paragraph. Most-load-bearing finding(s) up top. End with: "Top 5 leave-behind picks listed below.")*

## Top 5 leave-behind picks

1. *(Severity: High/Medium/Low) — finding title — one-line implication*
2.
3.
4.
5.

---

## 1. Information architecture

*(Sitemap notes, dental/medical taxonomy clarity, dead-ends, orphan pages.)*

### Findings (≥3)

- **[H/M/L] <title>** — <evidence (screenshot/quote)> — <recommendation>

## 2. Content quality

## 3. UX & conversion paths

## 4. Visual design

## 5. Mobile experience

## 6. Performance (Lighthouse)

*(Cite `source/lighthouse/<slug>.json` medians per page.)*

## 7. Accessibility (axe-core + manual)

*(Cite `source/axe/<slug>.json`; flag highest-impact violations.)*

## 8. SEO — technical

## 9. SEO — on-page

## 10. Trust signals

---

## Appendix: full page list

*(Pulled from `source/sitemap.json`.)*
````

- [ ] **Step 2: Create `competitive-teardown.template.md`**

Create `docs/audit/_templates/competitive-teardown.template.md`:

````markdown
# Competitive Teardown

**Authored:** YYYY-MM-DD

> **Structural rule:** TMJ Expert is the **client's** reference and is analyzed **per-site** (deep). Aventura is **our** SOTY teacher and is analyzed **per-dimension** (extracts principles, not moves to mimic).

---

## TMJ Expert (per-site, deep)

> Client reference. Goal: surface what about it appealed to the dentist; what we'll honor; what we'll improve.

### What works

- *(annotated screenshot reference)* — *(why)*

### What we'll honor in our pitch

- 

### What we'll improve

- 

---

## Aventura (per-dimension)

> Our SOTY teacher. Goal: extract design principles for P3.

### Typography

### Color

### Motion

### Photography

### Information architecture

### Micro-interactions

### Layout grid

---

## Synthesis: design principles for P3

*(5–8 bullets, each phrased as a directive we can hand a designer.)*

1. 
2. 
3. 
4. 
5. 
````

- [ ] **Step 3: Create `asset-inventory.template.md`**

Create `docs/audit/_templates/asset-inventory.template.md`:

````markdown
# Asset Inventory

**Generated:** YYYY-MM-DD
**Source:** `source/image-index.json`

## Summary

| Verdict | Count |
|---|---|
| Use | |
| Regrade | |
| Replace | |
| **Total** | |

## Inventory

| Page | Source URL | Local Path | Alt | Dimensions | Bytes | Verdict | Notes |
|---|---|---|---|---|---|---|---|

> **Verdict logic** (per master spec §5):
> - Dentist's actual portrait or clinic interior → **use** or **regrade**
> - Generic stock smiles, icon-set thumbnails, fabricated patient photos → **replace**
````

- [ ] **Step 4: Create `dentist-questions.template.md`**

Create `docs/audit/_templates/dentist-questions.template.md`:

````markdown
# Open Questions for the Pitch Meeting

**Authored:** YYYY-MM-DD
**Purpose:** Flip the pitch from monologue to conversation. Bring this list; ask 3–5 of these to make him feel heard before walking through the demo.

## Brand & voice

1. 

## Services & current offerings

1. 

## Patients & differentiation

1. 

## Photography & assets

1. 

## Logistics & v2 expectations

1. 
````

- [ ] **Step 5: Commit**

```bash
git add docs/audit/_templates/
git commit -m "docs(p1): authoring templates for audit/teardown/inventory/questions"
```

---

## Task 15: Author `audit.md` — dimensions 1–5 (IA, content, UX, visual, mobile)

**Files:**
- Create: `docs/audit/audit.md` (copy from template, fill sections 1–5)

> **This is hand-authored work, not code.** The template gives you the scaffold; the inputs are `source/sitemap.json`, `source/pages/*.md`, `source/screenshots/*/mobile.png`, and direct browsing. Goal for this task: ≥3 findings per dimension, each with severity / evidence / recommendation.

- [ ] **Step 1: Copy template to `docs/audit/audit.md` and fill the executive-summary header**

Run: `cp docs/audit/_templates/audit.template.md docs/audit/audit.md`

Fill in: today's date, page count from `source/sitemap.json`, leave Top 5 placeholder for now (filled at end of Day 4).

- [ ] **Step 2: Author dimension 1 — Information architecture**

Open `source/sitemap.json`. Note: total page count, dental-vs-medical balance, dead-end / orphan / zombie pages (e.g., empty WP tag archives). Write ≥3 findings.

- [ ] **Step 3: Author dimension 2 — Content quality**

Skim each `source/pages/*.md`. Flag: voice/tone inconsistencies, thin pages (<200 words), duplicate content, factual gaps (no fees? no insurance info?), outdated copyright dates.

- [ ] **Step 4: Author dimension 3 — UX & conversion paths**

Trace the path from `/` → "I want an appointment" on both the live site and the screenshots. Count clicks. Note friction points. Write ≥3 findings.

- [ ] **Step 5: Author dimension 4 — Visual design**

Review `source/screenshots/*/desktop.png`. Note: typography (font families, sizes, hierarchy), color palette, layout consistency, photography quality vs. master spec §5 standard.

- [ ] **Step 6: Author dimension 5 — Mobile experience**

Review `source/screenshots/*/mobile.png`. Note: tap target sizes, font scaling issues, horizontal scroll, hamburger menu UX, sticky-CTA presence. Open the live site on real iPhone SE if available; record findings.

- [ ] **Step 7: Commit Day 3 progress**

```bash
git add docs/audit/audit.md
git commit -m "docs(p1): audit dimensions 1–5"
```

---

## Task 16: Author `audit.md` — dimensions 6–10 (perf, a11y, SEO×2, trust)

**Files:**
- Modify: `docs/audit/audit.md`

- [ ] **Step 1: Author dimension 6 — Performance**

Open each `source/lighthouse/<slug>.json`. Pull the median scores + Core Web Vitals (LCP, CLS, TBT). Write findings citing the worst pages and the largest opportunities (heaviest images, render-blocking JS, etc).

- [ ] **Step 2: Author dimension 7 — Accessibility**

Open each `source/axe/<slug>.json`. Group violations by `impact` (critical/serious/moderate/minor). Cite the highest-impact rule names with affected pages.

- [ ] **Step 3: Author dimension 8 — SEO (technical)**

For each `source/pages/*.json`, check `metadata` for: title length, description length, presence of canonical, og: tags. Look for sitemap.xml, robots.txt, schema.org markup. Note Core Web Vitals SEO impact from Task 16 Step 1.

- [ ] **Step 4: Author dimension 9 — SEO (on-page)**

Skim `source/pages/*.md` for: keyword targeting (does each service page target a unique query?), internal linking density, alt text coverage from `source/image-index.json`, heading hierarchy.

- [ ] **Step 5: Author dimension 10 — Trust signals**

Per page (live site + screenshots): doctor credentials, reviews placement, location/hours/phone visibility, before/after gallery, accreditations.

- [ ] **Step 6: Surface Top 5 leave-behind candidates**

Re-read all findings. Pick 5 that combine **high severity + non-obvious + easy to explain in 30 seconds**. Fill the "Top 5 leave-behind picks" section. **Pause and surface to user for collaborative final pick.**

- [ ] **Step 7: Commit Day 4 progress**

```bash
git add docs/audit/audit.md
git commit -m "docs(p1): audit dimensions 6–10 + top-5 candidates"
```

---

## Task 17: Author `dentist-questions.md`

**Files:**
- Create: `docs/audit/dentist-questions.md` (from template)

- [ ] **Step 1: Copy template**

Run: `cp docs/audit/_templates/dentist-questions.template.md docs/audit/dentist-questions.md`

- [ ] **Step 2: Author at least 5 questions**

Distribute across the 5 sections (brand & voice, services, patients, photography, logistics). Each question should: be open-ended, target something the audit surfaced, and prompt a story/preference rather than a yes/no. Examples:

- "When you look at TMJ Expert, what specifically do you wish was different about your current site?"
- "Are there services on dentisthsu.com that you'd actually like to retire or de-emphasize?"
- "Who's the patient that walks out of your office happiest? — describe them."
- "Is there a photo or moment from the practice you'd want preserved into the new site?"
- "What's the one thing your current site does that you'd never want to lose?"

- [ ] **Step 3: Commit**

```bash
git add docs/audit/dentist-questions.md
git commit -m "docs(p1): dentist-questions for the pitch meeting"
```

---

## Task 18: Author `asset-inventory.md`

**Files:**
- Create: `docs/audit/asset-inventory.md` (from template)

- [ ] **Step 1: Copy template + fill summary**

Run: `cp docs/audit/_templates/asset-inventory.template.md docs/audit/asset-inventory.md`

- [ ] **Step 2: Generate the inventory table from `source/image-index.json`**

For each entry, classify the verdict using master spec §5 logic:

- Doctor portrait, clinic interior, real staff photo → **use** or **regrade**
- Stock smile, icon thumbnail, generic dental clipart → **replace**
- Logos (the practice's own) → **regrade** if low-res

Reasonable to use `pnpm exec tsx -e ...` to script the table generation from `image-index.json` if there are >50 images. Verdict still requires human eyeballing.

- [ ] **Step 3: Fill summary counts**

Total + verdict breakdown.

- [ ] **Step 4: Commit**

```bash
git add docs/audit/asset-inventory.md
git commit -m "docs(p1): asset-inventory with verdicts"
```

---

## Task 19: Author `competitive-teardown.md` — TMJ Expert (per-site, deep)

**Files:**
- Create: `docs/audit/competitive-teardown.md` (from template — TMJ Expert section)

- [ ] **Step 1: Capture TMJ Expert pages**

Use Playwright manually (not part of the pipeline; this is manual research). Open 8–12 pages working outward from the URL the dentist supplied (`tmjexpert.com/gallery/tmj-cases/tmj-treatments/02/`): home, about, the supplied gallery page, neighboring case studies, treatment detail, contact.

Save annotated screenshots to `source/teardowns/tmj-expert/<n>.png`. (Create the dir.)

- [ ] **Step 2: Copy template + write TMJ Expert section**

Run: `cp docs/audit/_templates/competitive-teardown.template.md docs/audit/competitive-teardown.md`

For TMJ Expert: write the three sub-sections (*what works*, *what we'll honor*, *what we'll improve*) referencing screenshots inline via relative paths.

- [ ] **Step 3: Commit**

```bash
git add docs/audit/competitive-teardown.md source/teardowns/tmj-expert/
git commit -m "docs(p1): teardown — TMJ Expert per-site (8–12 screenshots)"
```

---

## Task 20: Author `competitive-teardown.md` — Aventura (per-dimension) + synthesis

**Files:**
- Modify: `docs/audit/competitive-teardown.md`

- [ ] **Step 1: Capture Aventura pages**

Open homepage + 5–6 internal pages of `aventuradentalarts.com`. Save screenshots to `source/teardowns/aventura/<n>.png`. Capture short screen recordings of any signature motion moments to `source/teardowns/aventura/motion-<n>.mp4` (QuickTime screen recording is fine).

- [ ] **Step 2: Author per-dimension sections**

Cross-cut by dimension. Each dimension cites specific screenshots/recordings:

- **Typography** — fonts, scale jumps, weight contrasts
- **Color** — palette, where dark surfaces are used, accent strategy
- **Motion** — categories present, duration patterns, scroll-driven moments
- **Photography** — content types, lighting, color grading, hand/instrument macros
- **Information architecture** — primary nav, services taxonomy, depth of nesting
- **Micro-interactions** — hover states, button choreography, form feedback
- **Layout grid** — symmetric vs. asymmetric, container widths, gutter patterns

- [ ] **Step 3: Author the Synthesis section — 5–8 design principles for P3**

These are the directives P3 will execute against. Examples of the form (not actual content):

- *"Pair a high-contrast serif display face with a humanist sans body; keep the type scale aggressive (≥1.4 ratio between H1 and body)."*
- *"Reserve dark surfaces strictly for hero / wow zones; the rest of the site lives on warm-light."*
- *"Use one signature motion moment per page maximum; never chain multi-step animations on utility pages."*

- [ ] **Step 4: Commit**

```bash
git add docs/audit/competitive-teardown.md source/teardowns/aventura/
git commit -m "docs(p1): teardown — Aventura per-dimension + synthesis"
```

---

## Task 21: Acceptance check + user sign-off

**Files:** none — verification-only

- [ ] **Step 1: Walk the §5 acceptance checklist**

Open the [P1 spec §5](../specs/2026-05-05-dentisthsu-phase-1-discovery-audit.md#5-acceptance-criteria) and verify each box:

- [ ] `source/sitemap.json` populated
- [ ] All scraped pages saved as `.md` + `.json` pairs
- [ ] `source/practice-info.json` populated
- [ ] All images downloaded
- [ ] All audited (top-12) pages screenshotted (mobile + desktop)
- [ ] Lighthouse + axe outputs present for all audited pages
- [ ] `audit.md`: every dimension has ≥3 findings (or ≥2 with note)
- [ ] `audit.md`: top-5 leave-behind picks marked
- [ ] `competitive-teardown.md`: TMJ Expert per-site complete
- [ ] `competitive-teardown.md`: Aventura per-dimension complete
- [ ] `competitive-teardown.md`: synthesis with 5–8 principles
- [ ] `asset-inventory.md`: every image catalogued with verdict + summary
- [ ] `dentist-questions.md`: at least 5 open questions

- [ ] **Step 2: Append decisions-log entry**

Append to `docs/superpowers/decisions.md`:

```markdown
## YYYY-MM-DD — P1 deliverables shipped

**Scope:** P1 acceptance.
**Decision:** All P1 §5 acceptance criteria met. P1 deliverables ready for user review.
**Reference:** [docs/audit/](audit/)
```

- [ ] **Step 3: Update CLAUDE.md status table**

Modify `CLAUDE.md` current-state table:

```diff
- | Phase 1 implementation plan | ⏳ Next — to be produced via the writing-plans skill |
+ | Phase 1 implementation plan | ✅ Executed YYYY-MM-DD |
+ | Phase 1 deliverables | ✅ Shipped — `docs/audit/` |
```

- [ ] **Step 4: Surface to user for sign-off**

Tell the user: P1 deliverables are complete; ask them to review the four `docs/audit/*.md` files plus the `source/` indexes. Wait for explicit approval before considering P1 closed.

- [ ] **Step 5: Final commit**

```bash
git add docs/superpowers/decisions.md CLAUDE.md
git commit -m "docs(p1): P1 acceptance checklist + decisions-log entry"
```

---

## Self-review notes

**Spec coverage:**
- §2.1 `source/` folder — covered by Tasks 6, 7, 8, 9, 10, 11, 12 (output paths + file types match spec exactly).
- §2.2 `audit.md` (10 dimensions, ≥3 findings, top-5) — Tasks 14, 15, 16.
- §2.3 `competitive-teardown.md` (TMJ per-site, Aventura per-dimension, synthesis) — Tasks 19, 20.
- §2.4 `asset-inventory.md` — Task 18.
- §2.5 `dentist-questions.md` — Task 17.
- §3.1 tooling stack — Task 1 dependencies match (`@mendable/firecrawl-js`, Playwright, `axe-core`, Lighthouse, `sharp`).
- §3.2 pipeline scripts 01–07 + run-all — Tasks 6, 7, 8, 9, 10, 11, 12, 13.
- §4 schedule — Day 1: Tasks 1–8; Day 2: Tasks 9–13; Day 3: Tasks 14–15; Day 4: Tasks 16–17; Day 5: Tasks 18–21.
- §5 acceptance — Task 21 walks the full checklist.
- §6 risks — mitigations are baked into scripts (`--cache hit` skip in `02-scrape`, 3-run median in `06-lighthouse`, manual Playwright fallback for teardown captures).
- §7 P2 handoff — outputs from §2.1 are durable, no further action needed in P1.

**Placeholder scan:** No "TBD", "TODO", or "fill in later" outside of the markdown templates themselves (which are templates by design). Every code step contains complete code. Every command is exact.

**Type consistency:** `slugify` returns `string` everywhere. `selectAuditedPages(urls: string[], cap?: number): string[]`. `sourcePaths(slug?: string)` is consistent across consumers. `firecrawl.scrapeUrl` and `mapUrl` calls use the SDK's actual return shape (`success`, `links`, `markdown`, `metadata`). `runLH` returns parsed Lighthouse JSON; consumers index via documented categories.
