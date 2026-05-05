# dentisthsu.com Audit

**Audited:** 2026-05-05
**Practice:** Comfort Care Dental — Dr. Brien Hsu, DDS · Rancho Cucamonga, CA
**Pages audited:** 184 URLs mapped · 181 scraped textually · 9 unique service pages run through Lighthouse + axe deeply
**Auditor:** Rob Guevarra
**Source data:** [`source/`](../../source/)

---

## Executive summary

dentisthsu.com presents a 23-year-old practice with a respected lead clinician, a real team of six doctors, and substantive service expertise (TMJ, sleep apnea, advanced imaging via 3D Cone Beam CT, in-house Trios scanner) — none of which the site successfully communicates. The current property is a sprawling, neglected WordPress install with **96 URLs of intentional content buried under ~85 URLs of zombie demo pages, abandoned subdomains, lorem-ipsum theme content, family-blog posts hosted on a parallel Blogger subdomain, and indexed XML sitemap pages**. Every page audited fails our master spec performance target (mobile LCP 3.0–4.3s vs. <2.5s required). Every page audited fails WCAG 2.1 AA, with **46 violations (10 critical, 36 serious) across just 9 sampled pages** — a real ADA liability for a medical provider. There is no email address visible anywhere on the site. The redesign opportunity is significant: the dentist's services and credentials are genuinely strong, but the digital surface actively works against him.

**Top 5 leave-behind picks listed below.**

## Top 5 leave-behind picks

1. **[High] Your site has 184 URLs, ~85 of them zombie content** — `hello-world`, `lorem-simply-dummy-text-the-industry`, `latin-words-comined-handful-of-mode`, `blog-2-column`, `button`, `message-box`, `three-col-wide`, full XML sitemap pages crawled and indexed. *Implication: Google indexes these and dilutes your domain authority. Patients searching for you may land on a "Lorem ipsum dolor sit amet" page.*

2. **[Critical] Every page fails WCAG 2.1 AA — average 5+ violations per page, including critical issues like missing `lang` attribute on `<html>`, untitled iframes, missing image alt text, and insufficient color contrast.** *Implication: medical-practice ADA exposure is real (Doe v. Netflix, Robles v. Domino's set the bar). The new build will hit AA at minimum and document it as a defensible posture.*

3. **[High] Your service pages take 3.8–4.3 seconds to render on mobile (Largest Contentful Paint).** Google penalizes Core Web Vitals failures in search rankings. *Implication: every hour your site stays this slow, you're losing organic placement to faster competitor sites. The new build targets <2.5s LCP, which makes the loss recoverable.*

4. **[High] No email address appears anywhere across 181 scraped pages. Patients with non-urgent questions can only call.** *Implication: every patient who wanted to ask "is this insurance accepted?" or "what's a reasonable estimate for X?" without sitting on hold has bounced. Adding a contact form + an email address (with anti-spam) is a 30-minute v2 task that recovers them.*

5. **[Medium] You have at least four parallel WordPress installations** (`dentisthsu.com`, `2017.dentisthsu.com`, `www.familyblog.dentisthsu.com`, `www.blog.dentisthsu.com`), plus a Blogger-hosted personal blog the main site links into. *Implication: SEO equity is split across stale subdomains, your family stories are awkwardly co-mingled with practice content, and the maintenance surface is 4× what it should be. The new build consolidates onto one canonical domain with proper redirects.*

---

## 1. Information architecture

The site's structure is the most damaged dimension. dentisthsu.com is a 12+ year accumulation of WordPress installations, page-builder templates, and Blogger content, with no editorial gate.

### Findings

- **[High] 184 URLs but only ~30 are intentional, current, brand-positive content.** Source: [`source/sitemap.json`](../../source/sitemap.json). Intentional pages: home, ~12 service detail pages, contact, appointments, financing, doctor bios, FAQ. Everything else is one of the categories below.

- **[High] WordPress theme demo pages publicly indexed.** `lorem-simply-dummy-text-the-industry`, `latin-words-comined-handful-of-mode`, `it-uses-a-dictionary-of-over-200-latin-words`, `email-quotes-and-inclusion-conventions`, `research-paper-topics-tips-to-choosing-the-ideal-issue` — these are theme placeholder content that was never deleted. *Recommendation: delete in v2; 301-redirect to home.*

- **[High] Theme component-demo pages live in production.** `blog-2-column.md`, `blog-3-column.md`, `blog-4-column.md`, `blog-left-sidebar.md`, `blog-right-sidebar.md`, `both-sidebar-at-left.md`, `both-sidebar-at-right.md`, `button.md`, `message-box.md`, `image-gallery.md`, `three-col-wide.md`, `four-column-services.md`, `page-with-both-sidebar.md`, `page-with-left-sidebar.md`, `page-with-right-sidebar.md`, `wds-slider-preview.md` — 16+ pages that exist solely to demonstrate WordPress theme features. *Recommendation: not migrating; not relevant in the new build.*

- **[Medium] Default WordPress demo posts never deleted.** `hello-world`, `hello-world-2`, `hello-world-2-2` — the canonical "Hello world!" sample post and two duplicates. *Recommendation: a clean install signals "we maintain this." A 12-year-old `hello-world` post signals the opposite.*

- **[High] Four parallel WordPress installations.** Crawl returned root pages from `dentisthsu.com`, `2017.dentisthsu.com`, `www.familyblog.dentisthsu.com`, `www.blog.dentisthsu.com`. Each is its own WordPress site with its own templates, plugins, and indexed content. *Recommendation: v2 consolidates onto one canonical domain. 301 redirects from the legacy subdomains preserve SEO equity. Spin down the parallel installs.*

- **[Medium] XML sitemaps crawled and rendered as content pages.** `sitemap-index-xml`, `page-sitemap-xml`, `post-sitemap-xml`, `category-sitemap-xml`, `portfolio-sitemap-xml`, `team-group-sitemap-xml`, `team-member-sitemap-xml`, `testimonial-group-sitemap-xml`, `wds-slider-sitemap-xml`, `post-tag-sitemap-xml` — Yoast SEO's XML sitemaps somehow got configured to be HTML-indexable. *Recommendation: serve `Content-Type: application/xml` and exclude from `index` directives.*

- **[Medium] Each testimonial is its own URL.** 27+ pages: `testimonial-ali`, `testimonial-anon`, `testimonial-anthony-a`, `testimonial-baby-m`, `testimonial-cat-h`, `testimonial-d-j`, etc. *Recommendation: a single `/reviews` page with structured data; individual pages are thin and dilute domain.*

- **[Medium] Service pages exist in two parallel taxonomies.** `services/composite-fillings` AND `services-compositefillings-html`; `services/laser-dentistry` AND `services-laserdentistry-html`; same for sleep apnea, teeth whitening, root canals, veneers. The `-html` versions appear to be earlier WordPress permalink structures left in place when permalinks changed. *Recommendation: 301-redirect old to canonical.*

- **[Low] Section pages without clear purpose.** `section-dental`, `section-medical` exist as URLs but contain unclear content (likely mega-menu landing pages from an old design). *Recommendation: deprecated; redirect or delete.*

## 2. Content quality

The intentional content has substance — Dr. Hsu writes long-form pieces on technology adoption (3Shape Trios, i-CAT FLX 3D Cone Beam CT, deep bleaching, white fillings), volunteer work, and personal milestones. Voice is authentic. But it's poorly surfaced.

### Findings

- **[High] Lead clinician's expertise is buried.** Dr. Hsu's blog posts on 3D Cone Beam CT (2015), 3Shape Trios upgrade (2024), TMJ treatments, and over-treatment skepticism (`the-truth-about-white-fillings`, `dangers-of-whitening-toothpaste`) are genuine differentiation — most local dentists do not write substantive technology-adoption posts. *Recommendation: P3 surfaces these as "stories from the practice" or case-study content; P2 IA promotes them above the fold on the homepage.*

- **[Medium] Voice is trustworthy but inconsistent.** Some pages are first-person Dr. Hsu ("I asked my staff..."); others are generic third-person practice marketing copy ("Our office offers..."). *Recommendation: pick a voice (recommend first-person Dr. Hsu) and apply across all editorial pages.*

- **[High] Personal/family content awkwardly co-mingled with practice content.** `2011-12-november-30th-wind-storm-html`, `the-happiest-and-saddest-day-of-our-lives-entry-3`, `pre-labor-surprise-entry-1`, `hanna-hsu-update`, `2017-02-in-memory-of-dr-william-wei-hsu-html`, `childrens-hospital-los-angeles-cticu-entry-4`, `rough-night-at-the-hospital-entry-2` — these family-life narratives are genuinely moving but live alongside service detail pages without separation. *Recommendation: P2 splits practice and personal into clearly distinct sections; consider a `/about/family` namespace or moving personal posts to a separate domain.*

- **[Medium] Lorem ipsum still in production content.** Beyond the obvious zombie pages, body copy on `wds-slider-preview` and similar pages contains "Lorem ipsum dolor sit amet..." text that's publicly accessible.

- **[Low] FAQ exists but is shallow.** `faq.md` exists but is a stub — not surfacing the Q&A patterns visible in Dr. Hsu's blog posts. *Recommendation: P2 mines the blog for FAQ candidates.*

## 3. UX & conversion paths

### Findings

- **[High] No clear conversion path on the homepage.** Homepage CTA priorities are not visible. Sliders dominate above the fold. The phone number and address are present but not prominent. *Recommendation: master spec §2 utility-zone principle — phone CTA in header on every page, sticky on mobile, 18px+. P3 enforces.*

- **[High] No appointment-request form across 181 pages.** `appointments.md` exists but appears to direct users to call. The patient-friendly path "request a callback at a time that works for me" doesn't exist. *Recommendation: master spec §4 specifies a Server Action–backed request-appointment form going to Resend + Supabase. Pitch demo will include this working.*

- **[Medium] Patient forms are PDFs.** `patient-forms.md` and `contact-patientforms-html` link to PDF downloads. *Recommendation: v2 considers a digital intake flow; pitch demo can mock this as a teaser.*

- **[High] No visible mechanism for non-urgent inquiry.** No email, no contact form, no live-chat, no SMS opt-in. Phone-or-bounce. *Recommendation: see leave-behind pick #4.*

- **[Medium] Financing path is fragmented.** Three URLs exist: `financing.md`, `financing-easyfinancing-html`, `financing-financing-html`, `financing-index-html`. *Recommendation: consolidate to `/financing` with one clear page.*

## 4. Visual design

### Findings

- **[High] Visual hierarchy is dominated by sliders and theme widgets, not by content priority.** Homepage screenshots show a revslider hero with rotating banners (icons + tagline + CTA). Below it: more rotating widgets (testimonial slider, doctor slider). The result is a busy, "every-pixel-says-something" composition where nothing leads. *Recommendation: master spec §5 wow-zone principle: one cinematic hero, the rest is calm editorial layout. Replace sliders with intentional, scroll-revealed sections.*

- **[High] Typography is generic WordPress theme defaults.** Body sans-serif, basic weights, no custom display face, no clear scale. *Recommendation: P3 establishes a serif display + humanist sans body pairing per master spec §5; pre-locked at brand-canvas freedom.*

- **[High] Color palette: clinical blue + white + grey + occasional red accent.** This is the dental-industry default the master spec explicitly avoids. *Recommendation: P3 picks a warm, restrained palette (probably terracotta, deep teal, or oxblood as accent — locked in P3) with charcoal body text.*

- **[High] Photography quality is poor and inconsistent.** 612 image records totaling ~5MB across the site (~67KB average) — these are small WordPress thumbnails, not editorial photography. The dentist's portrait, when present, appears to be a small headshot, not a full-frame editorial portrait. *Recommendation: master spec §5 photography direction: dentist's actual portrait + clinic interior + editorial stock + light AI fill, color-graded as one shoot.*

- **[Medium] Layout consistency varies by template.** Service pages, blog posts, and home use different theme templates. *Recommendation: P2 inventories page templates and consolidates to ~6 archetypes.*

## 5. Mobile experience

### Findings

- **[High] Mobile screenshots show identical desktop layouts compressed into 375px.** Source: `source/screenshots/<slug>/mobile.png` for all 9 audited slugs. The site has minimal responsive treatment beyond CSS media queries — sliders shrink awkwardly, body type stays small, touch targets are likely undersized. *Recommendation: master spec §2 mobile-first principle; designed at 375px first.*

- **[High] No mobile-prominent phone CTA.** A persistent header phone link (`tel:` href) is missing or visually de-prioritized. *Recommendation: tap-to-call is a primary CTA in the new build's header on every page.*

- **[Medium] Touch target sizes likely below 44×44.** Inferred from screenshot inspection (text links in close vertical proximity, theme defaults). *Recommendation: P3 sets a 44×44 minimum and tests on iPhone SE.*

- **[Medium] Hamburger menu likely conceals primary nav on mobile.** Standard for WordPress themes; bad for older patient base. *Recommendation: bottom-tab CTA pattern for mobile (`Call`, `Directions`, `Hours`, `Request Appt`); hamburger-only-for-secondary.*

## 6. Performance (Lighthouse)

Source: `source/lighthouse/<slug>.json` — 9 unique slugs × mobile + desktop × 3-run medians.

### Findings

- **[High] Mobile LCP fails master spec target (<2.5s) on every audited page.** Service-page LCPs (median, 3-run): composite-fillings 4111ms, root-canal 4262ms, teeth-whitening 3963ms, oral-hygiene 3958ms, orthodontics 3817ms, sleep-apnea 3819ms, porcelain-veneers 4335ms, laser-dentistry 3939ms. Blog subdomain (zombie): 3002ms. *Recommendation: the new build's image pipeline (next/image AVIF/WebP, sized variants, priority on hero) and code-splitting will produce <2.5s LCP — deliverable target hard-locked in master spec §2 perf principle.*

- **[High] Mobile Performance score range 81–84.** None achieves the master spec target of ≥95. Best Practices scores 62–76 (low for any modern site). *Recommendation: Lighthouse 95+ across all marketing pages is a hard requirement of pitch sign-off.*

- **[High] Desktop performance is *worse* than mobile on every audited page.** Desktop performance scores range 64–73. This is unusual and indicates render-blocking JS / heavy slider scripts running synchronously on desktop. *Recommendation: P4 audits and removes render-blocking scripts.*

- **[Medium] CLS detected on the blog subdomain (0.15, threshold 0.10).** Cumulative layout shift indicates content jumping during load — typically slider widgets without dimensions. *Recommendation: explicit width/height on all images; reserve hero space.*

- **[Low] Total Blocking Time is low (<300ms across all pages).** This is the one perf metric where the existing site does OK — light interactive JS. *Recommendation: hold this baseline.*

## 7. Accessibility (axe-core + manual)

Source: `source/axe/<slug>.json` — 9 unique slugs scanned with WCAG 2A + 2AA + 2.1AA tags.

### Findings

- **[Critical] 46 axe violations across 9 audited pages (36 serious, 10 critical).** This is *just* the automated portion — manual keyboard testing would surface more. *Recommendation: master spec §2 accessibility principle: WCAG 2.1 AA hard requirement; axe-core run clean before pitch ship.*

- **[Critical] `html-has-lang` violation on 9 of 9 pages.** The `<html>` element has no `lang` attribute. Screen readers cannot determine the document language. Trivial fix, present on every page. *Recommendation: 1-line fix in v2; mention as "we noticed something every site should have but yours doesn't" in the pitch.*

- **[Serious] `frame-title` violation on 9 of 9 pages.** iframes (likely YouTube embeds, social widgets) have no accessible name. *Recommendation: every iframe gets a `title` attribute.*

- **[Serious] `image-alt` violation on 9 of 9 pages.** Decorative and content images lack alt text. *Recommendation: P2 content schema requires alt text; admin UI enforces.*

- **[Serious] `link-name` violation on 9 of 9 pages.** Links exist with no discernible accessible name (image-only links, icon links without aria-labels). *Recommendation: every link gets text or an `aria-label`.*

- **[Serious] `color-contrast` violation on 8 of 9 pages.** Body and link colors fail WCAG AA contrast against their backgrounds. *Recommendation: master spec §5 design principles include charcoal body on warm-light surface — contrast is built in.*

- **[Critical] Lighthouse mobile accessibility score on the blog subdomain is 51/100** (most other audited service pages 74–84). *Recommendation: subdomain consolidation per IA finding #5 makes this irrelevant in v2.*

## 8. SEO — technical

### Findings

- **[High] XML sitemaps are HTML-indexable.** See IA finding. Yoast SEO's XML sitemaps are being served with HTML-indexable headers, polluting Google's index of the site. *Recommendation: configure Yoast (or remove plugin in v2) to serve correct `Content-Type` and `X-Robots-Tag: noindex`.*

- **[High] No canonical strategy for the duplicate `/services/<x>` vs. `/services-<x>-html` taxonomies.** *Recommendation: P2 redirect map; current `-html` URLs 301 to canonical `/services/<x>`.*

- **[Medium] Multiple parallel subdomains share content.** Subdomain root pages each have their own indexed content pulling from similar themes. *Recommendation: consolidate to one canonical with subdomain 301s.*

- **[Medium] No schema.org structured data detected on audited pages.** No `Dentist`, `MedicalBusiness`, `Person` (doctor), or `Review` markup found in scraped page metadata. *Recommendation: master spec §4 stack includes schema.org markup — `Dentist` on home, `Person` on doctor pages, `Review` on testimonials.*

- **[Low] meta titles look reasonable on most service pages.** Titles include service name + practice name. Lengths 35–70 characters. *Recommendation: hold; content schema in P2 enforces this baseline.*

## 9. SEO — on-page

### Findings

- **[High] No clear keyword targeting per service page.** Service pages exist for veneers, whitening, root canals, sleep apnea, TMJ, etc., but there's no evidence of intentional keyword targeting in titles, H1s, or first paragraphs. *Recommendation: P2 builds a keyword map; one primary phrase per service page (e.g., "Sleep Apnea Treatment in Rancho Cucamonga, CA").*

- **[Medium] Internal linking is sparse and inconsistent.** Service pages don't cross-link to related services; blog posts don't link back to relevant service pages. *Recommendation: P2 IA includes a content cluster map.*

- **[High] Image alt text coverage is low.** From `source/image-index.json`, the majority of image records have empty `alt` strings. *Recommendation: P2 content schema requires alt text.*

- **[Medium] Heading hierarchy inconsistent.** Some pages skip from H1 to H3, others use multiple H1s. *Recommendation: enforce in component primitives in P4.*

## 10. Trust signals

### Findings

- **[High] No reviews surfaced on the homepage.** 27+ testimonial URLs exist as separate pages, but the homepage doesn't aggregate them. The dentist's actual Yelp/Google rating is invisible. *Recommendation: master spec §1 specifies a curated `reviews.json` strategy; pitch demo will surface 10–14 hand-picked 5★ reviews on the homepage.*

- **[High] Doctor credentials are not surfaced prominently.** Dr. Hsu has been in practice since 1999, has a CBCT accreditation, has a published Cone Beam CT adoption story, and runs a real team of six. None of this is above the fold on any page. *Recommendation: master spec §1 specifies a doctor/about cinematic treatment.*

- **[Medium] No insurance / financing transparency above the fold.** Financing exists across 4 URLs but isn't surfaced in primary nav. *Recommendation: P2 IA promotes "Financing" to top-level nav.*

- **[Medium] Address visible on contact page only.** Practice address (11458 Kenyon Way, Suite [#], Rancho Cucamonga) doesn't appear in the global footer or in schema.org markup. *Recommendation: address + hours + phone in global footer; `LocalBusiness` schema on every page.*

- **[Medium] Yelp + Facebook + Twitter accounts exist but are not linked.** Source: [`source/practice-info.json`](../../source/practice-info.json) — Yelp page (`comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga`), Facebook page, Twitter `@drbrienhsu`. None are linked from the main site footer. *Recommendation: link in footer; pull Google + Yelp 5★ reviews via curated JSON per master spec.*

- **[Critical] Practice name discrepancy: site brand is "dentisthsu.com" but Yelp lists the practice as "Comfort Care Dental Practice — Brien Hsu, DDS".** Two brand identities (the doctor's surname domain vs. the practice name) compete in the patient's mind. *Recommendation: P3 brand-direction work establishes a unified identity; the dentist already has full rebrand permission per decisions log.*

---

## Appendix: full page list

Source: [`source/sitemap.json`](../../source/sitemap.json) — 184 URLs.

Categorized for redirect-map planning in P2:

| Category | Count | Disposition |
|---|---|---|
| Intentional content pages (services, doctors, contact, FAQ, blog) | ~30 | Migrate, rewrite as needed |
| Service pages with `-html` suffix duplicates | ~15 | 301 to canonical, do not migrate |
| Theme demo pages (button, message-box, sidebar variants, lorem-ipsum) | ~20 | Delete; 410 Gone or 301 to home |
| Default WordPress posts (hello-world×3) | 3 | Delete |
| Per-testimonial pages | 27 | Consolidate to single `/reviews` page |
| XML sitemap pages indexed as HTML | 10 | Configure correct headers in WordPress until v2 launches |
| Subdomain root pages (4 parallel installs) | 4 | 301 to canonical dentisthsu.com |
| Personal/family blog content | ~12 | Decision: separate namespace or different domain |
| Portfolio/gallery pages | ~8 | Migrate; integrate into service detail pages |
| Author archive / category / tag pages | ~5 | Disposition per CMS architecture in P2 |
| Other (sitemaps, page-builder previews, misc) | rest | Audit individually in P2 |

---

## Notes for P2

P1 outputs for direct P2 consumption:
- Sitemap categorization above → starting point for redirect map
- IA findings #1–4 → primary IA design constraint
- Content quality findings → which pages survive the migration vs. get rewritten
- All Lighthouse + axe data → performance/accessibility budget targets to beat in P4
- Trust-signal findings → schema.org markup requirements + footer template
