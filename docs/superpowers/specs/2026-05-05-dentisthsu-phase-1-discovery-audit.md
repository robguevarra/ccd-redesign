# Phase 1 — Discovery & Audit (Detail Spec)

**Date:** 2026-05-05
**Phase window:** Wk 1 of engagement (5 working days, with overflow into early Wk 2 only if quality bar isn't met by Day 5)
**Parent spec:** [Master spec](2026-05-05-dentisthsu-redesign-master-spec.md)
**Status:** Approved (pre-implementation)

---

## 1. Phase scope & goals

P1 produces the source-of-truth artifacts that every later phase depends on. Without P1, P2 (IA) is guessing, P3 (visual direction) lacks a benchmark, and P4 (build) lacks real content. P1 is also the moment we discover the *non-obvious* problem with the current site that becomes a leave-behind talking point — see master spec §6 soft success criteria.

**Goal:** End Wk 1 with a complete picture of what dentisthsu.com is today, what's wrong with it, what the dentist's actual reference (TMJ Expert) does well, and what design principles we want to bring into P3 from our SOTY teacher (Aventura).

**Out of scope for P1:** sitemap redesign or content schema design (those are P2), visual direction work (P3), code (P4).

---

## 2. Deliverables

### 2.1 `source/` folder — scraped raw material

```
source/
├── practice-info.json         # global facts (address, phone, hours, doctors, social)
├── sitemap.json               # site map from Firecrawl /map
├── pages/
│   ├── index.md               # homepage as readable Markdown
│   ├── index.json             # structured fields (title, hero copy, CTAs, services list)
│   ├── about.md
│   ├── about.json
│   └── ...                    # one pair per crawled page
├── images/                    # gitignored — all source images by page
│   └── <slug>/<filename>
├── screenshots/               # gitignored — Playwright mobile + desktop captures
│   └── <slug>/{mobile,desktop}.png
├── lighthouse/                # gitignored — perf JSON per audited page
│   └── <slug>.json
└── axe/                       # gitignored — accessibility JSON per audited page
    └── <slug>.json
```

Indexes (`practice-info.json`, `sitemap.json`, `pages/*.md` + `*.json`) are committed. Heavy binaries and machine-output JSON (`images/`, `screenshots/`, `lighthouse/`, `axe/`) are gitignored.

### 2.2 `docs/audit/audit.md`

10-dimension audit. Each dimension contains **≥3 findings** (relaxed to ≥2 only if Day 5 hits with sections still empty — see §5 acceptance criteria). Each finding includes:

- **Severity:** high / medium / low
- **Evidence:** screenshot reference or quoted page content
- **Recommendation:** what we'd do in v2

The 10 dimensions:

1. Information architecture
2. Content quality
3. UX & conversion paths
4. Visual design
5. Mobile experience
6. Performance (Lighthouse mobile + desktop)
7. Accessibility (axe-core + manual keyboard pass)
8. SEO — technical (meta, structured data, canonicals, sitemap.xml, robots.txt, schema.org)
9. SEO — on-page (keyword targeting, internal linking, image alt text)
10. Trust signals (reviews placement, credentials, location/hours visibility)

**Top 5 findings flagged for the leave-behind PDF** — chosen on Day 4 collaboratively with user.

### 2.3 `docs/audit/competitive-teardown.md`

Two reference sites, two structures (intentionally asymmetric — see §3.4):

- **TMJ Expert (per-site, deep)** — client's actual reference. 8–12 annotated screenshots. Sections: *what works*, *what we'll honor*, *what we'll improve*.
- **Aventura (per-dimension)** — our SOTY teacher. Cross-cuts by dimension: typography, color, motion, photography, IA, micro-interactions, layout grid. Each dimension cites screenshots.
- **Synthesis section** — 5–8 design principles to bring into P3, distilled from both teardowns.

### 2.4 `docs/audit/asset-inventory.md`

Every image catalogued. Per-row fields: page, source URL, local path, alt text, pixel dimensions, file size, **verdict** (use / regrade / replace), notes. Summary at top with total count and verdict breakdown by category.

Verdict logic governed by master spec §5 photography direction:

- Dentist's actual portrait or clinic interior → **use** or **regrade**
- Generic stock smiles, icon-set thumbnails, fabricated patient photos → **replace**

### 2.5 `docs/audit/dentist-questions.md`

Open questions to bring to the pitch meeting itself. Examples: "Is the practice's brand direction warmer or more clinical?", "Are these specific services still current?", "Is there any photography you'd want preserved?". At least 5 questions. Lets us flip the pitch from monologue to conversation — high-leverage trust signal.

---

## 3. Approach & methodology

### 3.1 Tooling

| Tool | Use |
|---|---|
| **Firecrawl SDK** (`@mendable/firecrawl-js`) | Site map (`/map`) + per-page scrape (`/scrape`) returning markdown + structured JSON |
| **Playwright** | Mobile + desktop full-page screenshots; accessibility scans; competitive teardown captures |
| **axe-core** | Accessibility audit run programmatically per page |
| **Lighthouse CI** | Performance audit per page (mobile + desktop); 3 runs per page, median taken |
| **Node fetch + `sharp`** | Image download with metadata extraction (dimensions, format, file size) |

API key for Firecrawl is in `.env.local` (gitignored).

### 3.2 Pipeline

A small Node + TypeScript pipeline at `scripts/p1-discovery/`. Each script is independently re-runnable; results are cached so re-runs only fetch what's missing.

| # | Script | Output |
|---|---|---|
| 01 | `01-discover.ts` | Firecrawl `/map` on dentisthsu.com → `source/sitemap.json` |
| 02 | `02-scrape.ts` | Firecrawl `/scrape` per URL → `source/pages/*.md` + `*.json` |
| 03 | `03-extract-globals.ts` | Cross-cutting facts (address, phone, hours, social, doctor names) → `source/practice-info.json` |
| 04 | `04-images.ts` | Download images per page → `source/images/<slug>/` |
| 05 | `05-screenshots.ts` | Playwright mobile + desktop full-page captures → `source/screenshots/<slug>/` |
| 06 | `06-lighthouse.ts` | Lighthouse on top-12 audited pages → `source/lighthouse/<slug>.json` |
| 07 | `07-axe.ts` | axe-core on top-12 audited pages → `source/axe/<slug>.json` |

A `scripts/p1-discovery/run-all.ts` orchestrator runs them in sequence with progress logging.

### 3.3 Audit production

Audit doc is hand-authored with reference to the mechanical outputs:

- **IA findings** ← `sitemap.json` + intuition
- **Content quality** ← `pages/*.md`
- **Performance** ← `lighthouse/*.json`
- **Accessibility** ← `axe/*.json`
- **Mobile** ← `screenshots/*/mobile.png` + manual real-device pass on iPhone SE
- **Trust signals, conversion paths** ← manual page-by-page review

### 3.4 Competitive teardown production

- **TMJ Expert (per-site, deep)** — chosen because this is the client's actual reference. We must surface *exactly* what about it appealed to him, what we'll honor, what we'll improve. The dentist will recognize specific TMJ Expert moments in our pitch and feel heard. Playwright sweep of the 8–12 most relevant pages, working outward from the URL the dentist supplied.
- **Aventura (per-dimension)** — chosen because this is our SOTY teacher, not a client reference. Dimension-by-dimension extraction gives us design principles to bring into P3, not a list of moves to mimic. Playwright sweep of homepage + 5–6 internal pages; motion analysis via screen recording.

This asymmetry is deliberate and is the structural rule of the teardown doc.

### 3.5 Asset inventory production

After `04-images.ts` and `05-screenshots.ts` complete, manual classification pass. Each image gets a verdict per master spec §5 photography direction.

---

## 4. Schedule (Wk 1, day-by-day)

| Day | Work |
|---|---|
| **Mon** | Build pipeline (scripts 01–07). Run discovery + scrape. Verify outputs. |
| **Tue** | Image download + screenshots. Lighthouse + axe runs. Begin asset inventory pass. |
| **Wed** | `audit.md` — IA, content, UX, visual, mobile dimensions. |
| **Thu** | `audit.md` — performance, a11y, SEO (technical + on-page), trust signals. Write `dentist-questions.md`. Surface top-5 leave-behind candidates to user. |
| **Fri** | Competitive teardown (TMJ Expert per-site, Aventura per-dimension, synthesis). User review of all five docs. |

If anything slips into Mon of Wk 2, P2 starts in parallel — we don't wait. Master spec §6 risk: "Pitch meeting moves up" mitigated by per-phase minimum-viable cuts; for P1 the MVP cut is **scraped content + audit only** (drop teardown depth, drop dentist-questions doc).

---

## 5. Acceptance criteria

P1 ships when **all** of these are true:

- [ ] `source/sitemap.json` populated
- [ ] All scraped pages saved to `source/pages/` as `.md` + `.json` pairs
- [ ] `source/practice-info.json` populated
- [ ] All images downloaded to `source/images/`
- [ ] All audited (top-12) pages screenshotted (mobile + desktop)
- [ ] Lighthouse + axe outputs present for all audited pages
- [ ] `audit.md`: every one of 10 dimensions has **≥3 findings** (relaxed to ≥2 only if Day 5 hits with sections still empty)
- [ ] `audit.md`: top-5 leave-behind picks marked
- [ ] `competitive-teardown.md`: TMJ Expert per-site complete (8–12 annotated screenshots)
- [ ] `competitive-teardown.md`: Aventura per-dimension complete (7 dimensions cross-cut)
- [ ] `competitive-teardown.md`: synthesis section with 5–8 design principles
- [ ] `asset-inventory.md`: every image catalogued with verdict + summary
- [ ] `dentist-questions.md`: at least 5 open questions for the meeting
- [ ] User signs off on all five docs

---

## 6. Risks specific to P1

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| dentisthsu.com blocks Firecrawl | Low | Medium | Fall back to Playwright direct scrape with rotating UA |
| Site is largely image-of-text (no real content extractable) | Medium | High | Detected Day 1; pivot to manual transcription with OCR (`tesseract.js`) |
| Aventura / TMJ Expert have anti-scraping measures | Low | Low | Manual Playwright screenshot capture is sufficient; we don't need their text |
| Lighthouse mobile scores wildly inconsistent | Medium | Low | Run 3× per page; take median |
| Audit findings overflow time budget | High | Medium | Cap each dimension at top-5 findings; deeper ones go to a backlog |
| Top-5 leave-behind picks unclear | Medium | Medium | Surface to user end of Day 4 for collaborative pick |
| Firecrawl free-tier rate limits hit on full crawl | Medium | Low | Pause + resume from cache; or upgrade to paid tier briefly for the crawl |

---

## 7. Handoff to P2

P1 outputs that P2 (IA + Content Strategy) directly consumes:

| P1 output | P2 input |
|---|---|
| `source/sitemap.json` | Sitemap redesign starting point + redirect map authoring |
| `source/practice-info.json` | Content schema for services, doctors, contact |
| `source/pages/*.json` | Page template inventory |
| `audit.md` IA section | Redirect map (which old URLs need to land where) |
| `audit.md` content quality section | Content rewrite vs. preserve decisions |
| `competitive-teardown.md` synthesis | Direct input to **P3 visual direction**, not P2 |

---

## 8. Document conventions for this spec

- This spec is the source of truth for P1 execution. Material changes during the phase append a row to `docs/superpowers/decisions.md` and update this doc.
- Phase ships when §5 acceptance criteria are met and user signs off.
- Once P1 ships, this doc moves to read-only status — future changes require a new dated spec.
