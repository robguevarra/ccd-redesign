# Decisions Log

Append-only log of material decisions made on the dentisthsu redesign engagement. Newest entries at the top. Each entry: date, scope, decision, rationale.

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
