# Decisions Log

Append-only log of material decisions made on the dentisthsu redesign engagement. Newest entries at the top. Each entry: date, scope, decision, rationale.

---

## 2026-05-19 — Admin CMS scope expansion + multi-user auth + WYSIWYG editor

**Scope:** Admin/CMS surface area; P5 polish phase.

**Decision:** Extended the previously-locked "blog only" CMS scope (this file, entry below from 2026-05-05) to also cover **patient forms**, the **appointment-request inbox**, and **doctor profiles**. Added **multi-user staff auth** with two roles (`owner`, `editor`) and an invite-only signup flow gated by a `staff_users` allowlist table. Replaced the plain Markdown textarea in the blog editor with a **Tiptap WYSIWYG editor** that round-trips to Markdown so the existing schema and renderer remain unchanged. Dropped the `/patient-forms → /contact` 301 redirect and restored `/patient-forms` as a real public page (discoverable via mobile drawer, footer, contact-page card, and the request-appointment success state — no desktop top-nav slot).

**Mid-flight refinements before pitch:**

- **Invite-via-email** replaced with **owner sets the password directly** at `/admin/users/invite`. No email is sent — the owner shares the password with the teammate via a secure channel. Backed by `auth.admin.createUser({ email_confirm: true, ... })`.
- **Forgot password** flow added: `/admin/login` → `/admin/forgot-password` → Supabase magic link → `/admin/auth/callback` (PKCE) → `/admin/reset-password`. Branded email template at [docs/supabase-email-templates/password-reset.html](../supabase-email-templates/password-reset.html); pasted manually into Supabase Studio.
- **Auto-slug** on post + doctor editors (auto-syncs from title/name; locks once user types in the slug field manually).
- **Draft preview** for blog posts: `?preview=1` query bypasses the published-only filter when the caller is an active staff member; rendered with a "Draft preview" banner. Public requests still 404 on drafts.
- **Unified save toasts** across all admin editors (`components/admin/toast.tsx`).
- **RLS hardening**: `is_active_staff()` SECURITY DEFINER gates all writes to `doctors`, `patient_forms`, `blog_posts`, and Storage object mutations. Middleware is the primary gate; this is defense in depth.
- **Bug fix**: checkbox+hidden form pattern was broken (FormData.get returns FIRST value). Replaced with single-checkbox + `formData.has()` server-side.

**Out of scope (deferred):** Online fillable patient forms; per-staff write restrictions; approval workflow; edit-history audit log; tables/code blocks/in-bio image upload in the editor; drag-and-drop reordering; blur-data-URL generation for admin-uploaded portraits.

**Pre-push manual steps for the engagement owner:**

1. Set `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` + Vercel (Production + Preview).
2. Paste [docs/supabase-email-templates/password-reset.html](../supabase-email-templates/password-reset.html) into Supabase Studio → Authentication → Email Templates → "Reset Password".
3. Sign in to `/admin/login` as `robneil@gmail.com` (seeded owner) and exercise: invite a teammate, edit a doctor, upload a patient form, change an inquiry's status, preview a draft post.

**Reference:** [Design spec](specs/2026-05-19-admin-cms-expansion-design.md), [Implementation plan](plans/2026-05-19-admin-cms-expansion.md). Implementation across ~85 commits between `f78ab1e` (pre-work `main`) and the head at merge time.

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

---

## 2026-05-29 — Contract won → production; Weave Text Connect integrated, admin-toggled

**Scope:** Project framing + new feature (Weave Text Connect).
**Decision:** The pitch succeeded and the practice signed. The site is now the production build. Integrated **Weave Text Connect** ("Text us") in two surfaces — the site-wide floating `widget.js` bubble and on-brand inline buttons on `/contact` and `/request-appointment` — both governed by a single admin setting. Added a `site_settings` singleton table + `/admin/settings` page (owner + front_office only) with: master on/off, per-surface toggles, a scheduler (`always` or `business_hours` derived from `practiceInfo.hours`), holiday/closure blackout dates, and an off-hours behavior (hide vs. swap to "Call us"). Schedule is evaluated client-side in the practice timezone so it flips without a redeploy. The earlier "no third-party widget that brands itself" and "no Weave integration" exclusions were **pitch-era guardrails and are now retired**.
**Rationale:** It's the practice's own Weave account and their explicit request. The scheduler exists because Weave texts land in the front desk's inbox — auto-hiding "Text us" outside staffed hours stops patients texting into silence. Front office can manage it because they're the ones answering. Kept `/contact` and `/request-appointment` separate (the appointment form is the primary CTA, linked from ~12 places + the header); merging them would have cost a redirect + broad link churn for little gain.
**Artifacts:** `lib/weave.ts` (+ tests), `components/weave/*`, `app/admin/settings/*`, `supabase/migrations/2026-05-29_create_site_settings.sql`, queries `getWeaveConfig` / `readWeaveConfigForAdmin`.

---

## 2026-05-29 — Weave v2: drop floating widget, embed Text Connect in a modal, simplify admin

**Scope:** Weave Text Connect (refinement of the same-day decision above).
**Decision:** Removed the site-wide floating `widget.js` bubble entirely (code + config + admin option) at the practice's request. The single surface is now an on-brand, prominent **"Text us" button** (solid dark pill) on `/contact` and `/request-appointment`. Clicking it opens an **in-page modal that embeds Weave's hosted Text Connect page via iframe** — patients complete the text flow without leaving the site. Verified Weave's page sets no `X-Frame-Options`/CSP frame restriction, so embedding works; a "Open in a new tab" fallback link is shown in case a browser ever blocks the embed. Simplified the admin `/admin/settings` page to three things: on/off, when-to-show (always / office hours), and days-off (blackout dates), with the widget ID tucked under "Advanced". Dropped per-surface toggles and the off-hours "show Call us" option (off-hours simply hides the button).
**Rationale:** Owner found the original admin too complex and didn't want a self-branding floating bubble; the modal keeps patients on-site, which the floating widget already half-did but with extra chrome. Schedule gating is retained (same inbox-coverage rationale).
**Config shape (simplified):** `{ enabled, widgetId, schedule:{mode, blackoutDates}, timezone }`. Migration `2026-05-29_simplify_weave_config.sql` trims the column default + existing row; `normalizeWeaveConfig` ignores legacy keys.
**Note:** Front-office access to `/admin/settings` is correct in code (role check allows owner + front_office); an earlier "click does nothing" was a stale Next client-router cache — resolved by a hard refresh.

---

## 2026-05-29 — Office hours are now admin-editable (one source of truth)

**Scope:** New "Office hours" section on `/admin/settings`.
**Decision:** Moved office hours out of the hard-coded `content/practice-info.ts` const into the `site_settings` table (new `hours` jsonb column, migration `2026-05-29_add_office_hours.sql`, seeded from the old values). Owners + front office edit them via a 7-day editor on the settings page (each day: open/close time pickers + a "Closed" checkbox). One save updates **everywhere hours appear**: the site footer, the Contact page, the schema.org `OpeningHoursSpecification` (Google), and the Weave business-hours scheduler — which now reads the same DB hours instead of the static const. `content/practice-info.ts` remains the seed/fallback (`DEFAULT_OFFICE_HOURS`) when the row can't be read.
**Rationale:** The practice asked to manage hours themselves and have it reflect site-wide. Keeping the scheduler on the same source avoids the footer/contact and the "Text us" availability drifting apart.
**Artifacts:** `lib/office-hours.ts` (+ shared by `lib/weave.ts`), `getOfficeHours`/`readOfficeHoursForAdmin` queries, `updateOfficeHours` action, `app/admin/settings/office-hours-form.tsx`. `isWeaveLiveNow(config, now, hours)` gained an hours param (defaults to the seed).

---

## 2026-06-03 — "See all services" navigation: disclosure panels under Dental/Medical + /services index

**Scope:** Primary navigation / service discoverability (doctor request: "see all services at a glance").
**Decision:** Built a research-backed hybrid (deep-research pass over NN/g, Baymard, W3C WAI-ARIA APG, WCAG 2.2):
- **Header (desktop):** each lane (Dental, Medical) is now a link **plus a separate caret disclosure button** that opens a full-width panel of that lane's services, grouped by subcategory, with **"View all [Lane] services"** as the first link. This is the WAI-ARIA "disclosure navigation with top-level links" pattern — deliberately NOT a split button (a label that both navigates and opens a panel; NN/g flags that as confusing + touch-hostile). The lane link still navigates + re-themes; opening the panel does nothing thematic.
- **Mobile:** Dental/Medical accordions in the drawer, same "View all" first, large tap targets.
- **New `/services` page:** both lanes at a glance, grouped — the literal "see everything" view + SEO/findability win. Added to sitemap.
- **A11y:** click/keyboard only (no hover), Esc closes + returns focus to the caret, click-outside / focus-out close, `aria-expanded`/`aria-controls`, disclosure (not `menu`) role. Panel entrance animates transform only (never opacity) so it can never render translucent if the animation is throttled/skipped; gated behind `prefers-reduced-motion`.
**Rationale:** ~32 services across 2 lanes / 9 subcategories — too many for a linear dropdown; a 2-D grouped panel lets users see rather than remember (NN/g). The dedicated page backstops discoverability and SEO.
**Artifacts:** `components/lane-services-menu.tsx`, `components/mobile-lane-accordions.tsx`, `content/services.ts` (getLaneServiceGroups/serviceHref), `app/(marketing)/services/page.tsx`, header wiring in `components/site-header.tsx`, `app/globals.css` keyframe.

---

## 2026-06-16 — Client content update: Before/After gallery, doctor bios + new doctor, hours, service rewrites + new procedures

**Scope:** Practice-supplied June 2026 batch (new page, doctor data, office hours, Word-doc service revisions, new procedures, illustrations). Branch `claude/suspicious-fermi-04fe43`.

**Before & After Smiles (`/before-after`):** New marketing page — editorial hero + responsive grid of **interactive before/after sliders** (one `BeforeAfterSlider` client component per case; draggable handle via pointer capture, full keyboard support with `role="slider"` + arrows/Home/End, reduced-motion safe). Six real patient pairs supplied by the practice, optimized to WebP with LQIP blur placeholders; display names are **first name + last initial** for privacy. Added **"Smile Gallery"** to the header nav + sitemap. One source pair (Susan H.) had a portrait "before" vs. landscape "after" — handled with an aspect-locked `object-cover` box so the wipe still aligns. Data in `content/before-after.ts`; component in `components/before-after/`.

**Doctors (live Supabase data, not just the repo seed):** The `doctors` table is the runtime source of truth (`content/doctors.ts` is seed only), so every doctor edit was applied to **both** the seed file and the production DB.
- Replaced the five associate bios with the practice's **original published bios** (from `source/pages/doctors-dr-*.md`), with the redundant self-name that opened each bio removed (the name is already the page heading).
- Added **Dr. Serena Hsu** (orthodontist & dentofacial orthopedist) with the practice-provided bio + professional headshot.
- Removed a leftover **`test` / "Dr. Test"** row that was live in production.
- **`joinedYear` is now optional** (schema + nullable DB column, migration `2026-06-16_doctors_joined_year_nullable.sql`). Serena's join year wasn't provided, so it's `NULL` and the profile **omits** the "With the practice since …" line rather than inventing a year. The admin doctor editor no longer requires the field. (Also removed the stale `/doctors/dr-serena-hsu` → 410 redirect from `content/redirects.ts`.)

**Office hours:** Footer now renders **12-hour** times via `formatDayHours` (was raw 24h). Added an optional per-day **`note`** on `BusinessHours` that displays instead of the hours/"Closed" label; **Friday is set to "Inquire for appointments."** Wired through the schema, `normalizeOfficeHours`, footer, contact page, structured data (note-days advertise no hours), and the `/admin/settings` office-hours editor (new optional note field). Applied to the live `site_settings.hours`.

**Services — Word-doc content revisions + new procedures (catalog 32 → 38):** Service bodies render from `content/services.ts` (file-based, not DB).
- Revised ~20 dental + medical bodies per the supplied docs. Interpretation rule: the doc prose is authoritative and the "REMOVED LAST PARAGRAPH/SENTENCE" annotations are already reflected in it — in practice these trimmed the promotional "Dr. X performs …" closing paragraphs.
- New procedures: **Onlays** (dental/restorative) + **Arthrocentesis, Neuropathic Pain, Custom-Fit Orthotic Device, Osteonecrosis, Tongue-Tie Release** (medical). Rewrote **Biopsies**.
- Renames: **Oral Cancer Shields → "Custom Radiation Shields"** (slug kept) and **Surgical Laser Therapy → "Laser Photobiomodulation & Muscle Therapy"** (new slug `laser-photobiomodulation` + illustration file rename + 301 redirect documented).
- Generated 6 educational illustrations (Higgsfield, `nano_banana_pro`) matching the existing clinical-render style and registered the slugs in `SERVICE_ILLUSTRATION_SLUGS`.

**Verification:** `tsc --noEmit` clean; 61/61 vitest tests pass (catalog/roster/redirect invariants updated to match). All surfaces confirmed in a local preview.

**Note on redirects:** `content/redirects.ts` is currently documentation + tested data only — it is **not** wired into `next.config.ts` or middleware. So the old `/medical/surgical-laser-therapy` path 404s rather than 301-ing (acceptable for a fresh site with no real inbound traffic to it). Worth wiring up if/when legacy URLs matter.

**Artifacts:** `app/(marketing)/before-after/page.tsx`, `components/before-after/before-after-slider.tsx`, `content/before-after.ts`, `public/images/before-after/*`, `content/doctors.ts`, `content/doctors-blur.ts`, `public/images/doctors/dr-serena-hsu.webp`, `content/services.ts`, `content/service-images.ts`, `public/images/services/educational/{onlays,arthrocentesis,neuropathic-pain,custom-orthotic-device,osteonecrosis,tongue-tie-release}.png` + `laser-photobiomodulation.png`, `lib/office-hours.ts`, `components/site-footer.tsx`, `app/admin/settings/{office-hours-form,actions}.ts(x)`, `supabase/migrations/2026-06-16_doctors_joined_year_nullable.sql`.
