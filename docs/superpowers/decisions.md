# Decisions Log

Append-only log of material decisions made on the dentisthsu redesign engagement. Newest entries at the top. Each entry: date, scope, decision, rationale.

---

## 2026-05-05 — P2 deliverables shipped

**Scope:** Phase 2 (IA + Content Strategy) acceptance.
**Decision:** All P2 §11 acceptance criteria met. Five IA documents committed under [`docs/ia/`](../ia/) and three typed code files under [`content/`](../../content/), all type-checked clean against `tsconfig.json`.

**Locked decisions carried forward:**

- **Brand name:** "Comfort Care Dental" (replaces dentisthsu.com / Hsu's Dental Practice — dual identities resolved). Domain stays `dentisthsu.com`. Logo + wordmark designed in P3.
- **Sitemap:** ~17 marketing routes + 4 admin routes. Added `/technology` page (audit found Dr. Hsu's strongest differentiator — CBCT, Trios, Zeiss microscope — was buried). 27+ testimonial URLs collapsed into single `/reviews` page.
- **Service taxonomy:** 4 categories — General Dentistry (12 services), Cosmetic (2), Specialty (4 incl. TMJ as wow-zone signature), Orthodontics (2). ~20 services total.
- **Page templates:** 6 public templates (Home / Service / Doctor / Editorial / Utility / Blog) + 1 admin template.
- **CMS scope:** `blog_posts` only editable via admin. Services, doctors, technology, reviews remain code-versioned (MDX/JSON). Single dentist account for the demo.
- **Content schemas:** 8 TypeScript types in `content/schemas.ts` covering Service, Doctor, BlogPost, Review, AppointmentRequest, PracticeInfo, MediaAsset, Redirect.
- **Practice info:** populated from curated P1 facts. Address `11458 Kenyon Way, Rancho Cucamonga, CA 91730` (zip flagged for confirmation). 3 phones (toll-free + 2 local). Real socials (Facebook, Yelp, Twitter @drbrienhsu). Email = `null` per audit finding.
- **Redirect map:** ~110 rules in `content/redirects.ts`. Service slug normalization (16), page consolidation (~50), 410 Gone for zombie content (~40), subdomain consolidation handled at DNS level (3).

**Key carry-forward issues:**
- Suite number on the practice address still TBD (audit found "Suite" but no number).
- Saturday hours guessed at 8–13:00; needs confirmation.
- Personal/family blog content disposition deferred to v2 — pitch redirects them to `/about` for now.

**Reference:** [docs/ia/](../ia/), [content/](../../content/), [P2 detail spec](specs/2026-05-05-dentisthsu-phase-2-ia-content-strategy.md), [P2 plan](../plans/2026-05-05-phase-2-ia-content-strategy.md)

---

## 2026-05-05 — P3 visual phase: invoke `ui-ux-pro-max` skill

**Scope:** Future P3 (Visual & Brand Direction) execution.
**Decision:** When P3 begins, invoke the `ui-ux-pro-max` skill (installed in `~/.claude/plugins/cache/ui-ux-pro-max-skill/`). It provides 161 color palettes, 57 font pairings, 50+ visual styles, and design-system patterns — directly aligned with P3 outputs (mood board, type pairing, color palette, motion language, hero comps, logo direction).
**Rationale:** Skill explicitly skips backend / content-architecture work, so P2 was wrong phase. P3 is its sweet spot. The skill's `brand` and `design-system` sub-skills are also direct fits.
**Why this is logged:** so a future session reading the decisions log knows to invoke it at the right moment without re-discovering the question.

---

## 2026-05-05 — P1 deliverables shipped

**Scope:** Phase 1 (Discovery & Audit) acceptance.
**Decision:** All P1 §5 acceptance criteria met. Pipeline produced 184-URL sitemap, 181 scraped page pairs, 511 downloaded images with metadata, 18 mobile+desktop screenshots, 9 Lighthouse JSONs (3-run medians, mobile + desktop), 9 axe-core WCAG 2.1AA scans, 26 competitive-teardown screenshots (TMJ Expert + Aventura). Five hand-authored markdown deliverables landed: `audit.md` (10 dimensions, 46+ findings, top-5 leave-behind picks), `competitive-teardown.md` (TMJ Expert per-site + Aventura per-dimension + 5 design principles for P3), `asset-inventory.md` (221 unique images bucketed; manual curation pending), `dentist-questions.md` (14 open questions across 5 categories for the pitch meeting), plus 4 authoring templates in `docs/audit/_templates/`.

**Headline findings to carry into P2/P3:**
- 184 URLs but only ~30 are intentional content; ~85 are zombie demo/lorem/sitemap-XML/parallel-WordPress-install pages
- All audited pages fail master spec performance target (mobile LCP 3.0–4.3s vs. <2.5s required)
- 46 axe accessibility violations across 9 audited pages (10 critical + 36 serious); every page fails WCAG 2.1 AA
- Practice has 3 phone numbers, 1 verifiable street address (11458 Kenyon Way, Rancho Cucamonga), 0 published emails, parallel WordPress installs at multiple subdomains
- Practice name discrepancy: site brand "dentisthsu.com" vs. Yelp listing "Comfort Care Dental Practice"
- Real photography is sparse (only 1 image heuristically classified as "use" for v2)
- TMJ Expert's gallery/case-study format is the dentist's clearest reference; honor it as the signature service detail page in v2

**Rationale:** P1 succeeded on its primary purpose — surface non-obvious findings the dentist hasn't seen. The audit doc's top-5 leave-behind picks each combine high severity, non-obviousness, and a clean 30-second explanation, satisfying master spec [§6 soft success criteria](specs/2026-05-05-dentisthsu-redesign-master-spec.md#success-criteria--soft-what-makes-the-pitch-likely-to-win).

**Reference:** [docs/audit/](../audit/), [P1 detail spec](specs/2026-05-05-dentisthsu-phase-1-discovery-audit.md)

**Known caveats / not blockers:**
- Lighthouse + axe + screenshot data was captured against the original 96-URL crawl. The expanded 184-URL sitemap (discovered during Task 13's smoke-test re-run) was textually scraped but not re-Lighthoused. Acceptable: the curated top-12 audited subset still represents the priority service-page surface; new pages discovered in the rescrape are mostly zombie WordPress demos that wouldn't have been included anyway.
- Asset inventory verdict counts (1 use / 106 regrade / 114 replace) are heuristic. Manual curation in P3 will reclassify upward (more "use" candidates exist than the heuristic caught).
- TMJ Expert's site has long-polling tracking scripts; Playwright `networkidle` strategy didn't resolve. Captures used `waitUntil: 'commit'` + 8s settle. Two TMJ Expert page captures (about-desktop, contact-desktop) failed all retries — itself an audit observation about their performance.

---

## 2026-05-05 — P1 detail spec approved

**Scope:** Phase 1 (Discovery & Audit) execution.
**Decision:** P1 spec adopted with these locked choices:
- Scraping: Firecrawl SDK (`@mendable/firecrawl-js`) — full site crawl via `/map` then `/scrape` per URL
- Audit scope: every page crawled; all 10 audit dimensions covered
- Asset capture: download all images locally + Playwright mobile/desktop screenshots of top-12 pages; binaries gitignored, indexes committed
- Acceptance: 5-day time-box + minimum 3 findings per audit dimension (relaxed to 2 only if Day 5 hits with sections empty)
- Bonus deliverable: `dentist-questions.md` — open questions for the pitch meeting itself
**Reference:** [docs/superpowers/specs/2026-05-05-dentisthsu-phase-1-discovery-audit.md](specs/2026-05-05-dentisthsu-phase-1-discovery-audit.md)

---

## 2026-05-05 — Reference site framing correction

**Scope:** Competitive teardown structure (P1).
**Decision:** Aventura is **our** SOTY teacher (introduced by the engagement owner), not a client reference. TMJ Expert is the **client's** actual reference. Teardown structure reflects this asymmetry: TMJ Expert is analyzed **per-site** (deep, so the dentist sees his reference understood and honored); Aventura is analyzed **per-dimension** (extracts design principles for P3, not moves to mimic).
**Rationale:** Conflating the two would risk delivering a pitch that ignores what the client actually pointed at. The asymmetric structure is also a useful structural rule for the teardown doc.
**Why this is logged:** Earlier in brainstorming I (the assistant) mistakenly called both sites "client references." This entry locks the correct framing so future sessions don't repeat the mistake.

---

## 2026-05-05 — Project framing locked

**Scope:** Master spec, all sections.
**Decision:** Adopt master spec v1 as approved. Engagement is a 4–6 week pitch site, not a delivered production build. Stack: Next.js 15 + Supabase + Vercel + Resend (Approach A). Visual direction: editorial calm, dual-audience (wow zone vs. utility zone), full rebrand permission. Phases P1–P5 with hard decision gates at end of Wk 1, 2, 4, 5.
**Rationale:** Bundles seven loose subsystems into a coherent engagement shape. Decision gates prevent late-stage scope creep on a tight pitch timeline.
**Reference:** [docs/superpowers/specs/2026-05-05-dentisthsu-redesign-master-spec.md](specs/2026-05-05-dentisthsu-redesign-master-spec.md)

---

## 2026-05-05 — Brand canvas: blank slate, full rebrand

**Scope:** P3 Visual & Brand Direction.
**Decision:** Treat brand as blank canvas. P3 produces logo direction + wordmark alongside type/color/motion.
**Rationale:** Practice owner has no existing brand we need to honor. Removing this constraint lets P3 reach the visual ceiling we're targeting.

---

## 2026-05-05 — Reviews handled via curated JSON + admin stub

**Scope:** Reviews feature.
**Decision:** Ship curated reviews from the dentist's actual Google + Yelp pages as `content/reviews.json` in the repo. Add a non-functional "Connect Google Business Profile" placeholder to the admin UI to signal the v2 integration path.
**Rationale:** Google Places API only returns 5 most recent reviews (not filterable by rating); Yelp API returns truncated excerpts only. Curated JSON gives full design control today; the admin stub sells the v2 story.

---

## 2026-05-05 — CMS demo: real Supabase, working admin login

**Scope:** P4 + P5.
**Decision:** Build a real `/admin` route with Supabase Auth. Hand the dentist a demo username/password during the pitch meeting; let him create a draft blog post live and watch it appear on the site within 10s.
**Rationale:** Show, don't tell. Working CMS is the closer move that differentiates from agencies pushing static templates.

---

## 2026-05-05 — Booking: request-appointment form only, no PMS API

**Scope:** Booking surface.
**Decision:** Ship a Server Action–backed request-appointment form that writes to Supabase + emails via Resend. No real Weave/OpenDental integration.
**Rationale:** Practice uses Weave + OpenDental but APIs aren't accessible to us pre-engagement. Request form covers the conversion goal; real integration deferred to v2.
