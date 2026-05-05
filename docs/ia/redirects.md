# Redirect Map (human-readable mirror)

**Date:** 2026-05-05
**Source of truth:** [`content/redirects.ts`](../../content/redirects.ts) — typed array consumed by `vercel.ts` in P4
**Source spec:** [P2 spec §8](../superpowers/specs/2026-05-05-dentisthsu-phase-2-ia-content-strategy.md#8-301--410-redirect-map)

This is a markdown mirror of `content/redirects.ts` for human review. **`content/redirects.ts` is the canonical source.** If this file diverges, the TypeScript file wins.

## Categories

1. **Service slug normalization** — old WordPress permalinks (`-html` legacy) → canonical slugs (16 rules)
2. **Page consolidation** — testimonials, doctors, financing, contact, technology, portfolio (~50 rules)
3. **Zombie / theme-demo deletion** — 410 Gone for content that should never have been live (~40 rules)
4. **Subdomain consolidation** — handled at DNS / Vercel domain level (3 subdomains)

**Total rules in the map:** ~110 entries.

## Status code conventions

- **301** — permanent redirect; transfers SEO equity. Used for any URL whose old content has a clear replacement.
- **410** — Gone. Used for theme-demo / lorem-ipsum / zombie content with no replacement. Tells crawlers "intentionally removed; do not retain in index."

## Service slug normalization (16 rules)

| From | To | Note |
|---|---|---|
| `/services-compositefillings-html` | `/services/composite-fillings` | WP permalink legacy |
| `/services-rootcanaltherapy-html` | `/services/root-canal-therapy` | |
| `/services-pediatricoralhealthcare-html` | `/services/children-oral-healthcare` | Slug + naming |
| `/services-porcelainveneers-html` | `/services/porcelain-veneers` | |
| `/services-sleepapneatreatment-html` | `/services/sleep-apnea` | Slug + simplification |
| `/services-teethextractions-html` | `/services/tooth-extractions` | |
| `/services-removableorthodontics-html` | `/services/removable-orthodontics` | |
| `/services-fixedbridges-html` | `/services/fixed-bridges` | |
| `/services-laserdentistry-html` | `/services/periodontal-treatment` | Laser dentistry consolidates into periodontal |
| `/services-orthodontics-html` | `/services/orthodontics` | |
| `/services-oralhygiene-html` | `/services/oral-hygiene` | |
| `/services-periodontaltreatment-html` | `/services/periodontal-treatment` | |
| `/services-implants-html` | `/services/dental-implants` | New service in v2 IA |
| `/services-onlays-html` | `/services/crowns-caps` | Onlays merge into crowns category |
| `/services-dentures-html` | `/services/dentures` | |
| `/services-sedationdentistry-html` | `/services/sedation-dentistry` | |

## Page consolidation (selected highlights)

| Pattern | Target | Status | Count |
|---|---|---|---|
| `/testimonial-*`, `/testimonial_group/*` | `/reviews` | 301 | ~28 |
| `/doctors-dr-<slug>`, `/about-our-dentist-brien-hsu-dds` | `/doctors/<slug>` | 301 | 7 |
| `/aboutus-*`, `/our-team` | `/about` or `/doctors` | 301 | ~6 |
| `/financing-*`, `/images-carecredit2-pdf` | `/financing` | 301 | 4 |
| `/contact-directions-html`, `/contact-patientforms-html`, `/patient-forms`, `/appointments` | `/contact` or `/request-appointment` | 301 | 4 |
| Technology / equipment pages (CBCT, Trios, Zeiss) | `/technology` | 301 | 7 |
| `/portfolio-*` | `/services/<related>` (case-by-case) | 301 | ~9 |
| Personal/family blog content | `/about` | 301 | ~10 |
| Volunteer / community content | `/about` | 301 | 4 |
| WordPress archive pages | `/blog` | 301 | 6 |

See `content/redirects.ts` for the complete rule set.

## 410 Gone (zombie deletion — selected)

| Category | Examples | Count |
|---|---|---|
| WordPress default posts | `/hello-world`, `/hello-world-2`, `/hello-world-2-2` | 3 |
| Lorem-ipsum / placeholder text | `/lorem-simply-dummy-text-the-industry`, `/it-uses-a-dictionary-of-over-200-latin-words`, `/latin-words-comined-handful-of-mode`, `/email-quotes-and-inclusion-conventions`, `/research-paper-topics-tips-to-choosing-the-ideal-issue` | 5 |
| Theme component demos | `/button`, `/message-box`, `/three-col-wide`, `/four-column-services`, `/three-column-services`, `/two-column-services`, `/blog-2-column`, `/blog-3-column`, `/blog-4-column`, `/blog-html`, `/blog-left-sidebar`, `/blog-right-sidebar`, `/blog-right-sidebar-2`, `/both-sidebar-at-left`, `/both-sidebar-at-right`, `/page-with-both-sidebar`, `/page-with-left-sidebar`, `/page-with-right-sidebar`, `/left-sidebar`, `/image-gallery`, `/case-study`, `/general-service`, `/wds-slider-preview` | ~22 |
| Unhelpful section pages | `/section-dental`, `/section-medical`, `/personal-blog` | 3 |
| Yoast XML sitemaps indexed as HTML | `/sitemap-index-xml`, `/page-sitemap-xml`, `/post-sitemap-xml`, `/category-sitemap-xml`, `/portfolio-sitemap-xml`, `/team-group-sitemap-xml`, `/team-member-sitemap-xml`, `/testimonial-group-sitemap-xml`, `/testimonial-sitemap-xml`, `/wds-slider-sitemap-xml`, `/post-tag-sitemap-xml` | 11 |
| Numeric ID stubs | `/1691-2`, `/2121-2`, `/2249-2` | 3 |

## Subdomain consolidation

These are configured at the **DNS / Vercel domain layer**, not in `vercel.ts`. Listed here for documentation:

| Subdomain | Action | Disposition |
|---|---|---|
| `https://2017.dentisthsu.com/*` | 301 to `https://dentisthsu.com/` | Spin down WordPress install post-launch |
| `https://www.blog.dentisthsu.com/*` | 301 to `https://dentisthsu.com/` | Spin down (Blogger-hosted; deprecate) |
| `https://www.familyblog.dentisthsu.com/*` | 301 to `https://dentisthsu.com/` | Spin down |

## Validation

When `vercel.ts` is wired up in P4, P5 launch QA includes:

1. Random sample of 20 redirects: confirm each old URL → 301/410 → correct destination
2. Run `curl -I` on each old URL; assert `Location` header on 301s, `410` status on Gones
3. Test cross-domain redirects from each subdomain root
