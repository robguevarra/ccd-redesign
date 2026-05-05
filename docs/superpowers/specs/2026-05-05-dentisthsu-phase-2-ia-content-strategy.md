# Phase 2 — Information Architecture + Content Strategy (Detail Spec)

**Date:** 2026-05-05
**Phase window:** Wks 1.5–2 of engagement
**Parent spec:** [Master spec](2026-05-05-dentisthsu-redesign-master-spec.md)
**Predecessor:** [P1 Discovery & Audit](2026-05-05-dentisthsu-phase-1-discovery-audit.md) — shipped 2026-05-05
**Status:** Approved (pre-implementation)

---

## 1. Phase scope & goals

P2 turns the audit's findings into a coherent IA, content model, and routing plan. Every later phase consumes P2's outputs:

- **P3** uses page templates + sitemap to scope visual direction work
- **P4** uses content schemas (TypeScript types) to scaffold Supabase tables and React component props
- **P5** uses the redirect map to migrate SEO equity at launch

**Goal:** end Wk 2 with a sitemap, content schemas (TypeScript), redirect map, page-template inventory, and admin-CMS scope decision — all signed off — so P3 starts with a fully-defined surface to design against.

**Out of scope for P2:** picking fonts/colors (P3), implementing schemas in code (P4), Supabase project setup (P4), filling MDX content from scraped sources (P4).

---

## 2. Brand direction (locked)

| Item | Decision |
|---|---|
| Primary brand name | **Comfort Care Dental** (was: dentisthsu.com / Hsu's Dental Practice — dual identities resolved) |
| Doctor framing | Dr. Brien Hsu = lead clinician; surfaced on `/about` and `/doctors/dr-brien-hsu`, not as the primary brand |
| Domain | `dentisthsu.com` retained for SEO equity and existing patient recognition |
| Pitch demo URL | `dentisthsu-redesign.vercel.app` |
| Tagline (working) | *Considered dentistry, in Rancho Cucamonga since 1999.* — finalized in P3 |
| Logo / wordmark | Designed in P3 (full rebrand permission per [decisions log 2026-05-05](../decisions.md#2026-05-05--brand-canvas-blank-slate-full-rebrand)) |

**Rationale:** the Yelp-listed "Comfort Care Dental Practice" framing is warmer, more patient-first, and resolves the brand-identity split that the audit flagged as a top-5 leave-behind point.

---

## 3. Sitemap (the new IA)

```
/                              Home — wow zone
/about                         Practice story — 1999 origin, philosophy, community/volunteer work
/doctors                       Team overview — all 6 doctors
/doctors/<slug>                Per-doctor bio (6 pages)
/services                      Services overview (4 categories visible)
/services/<slug>               Service detail (~13 services)
/services/tmj                  ⭐ Wow-zone signature service — long-scroll case-study format
/technology                    NEW — CBCT, Trios, Zeiss microscope; differentiator surface
/reviews                       Curated 5★ from Google/Yelp/Facebook (JSON-driven)
/blog                          Blog index (chronological + tag filter)
/blog/<slug>                   Blog post (Supabase-driven via admin CMS)
/contact                       Location, hours, directions, phones — utility-first
/request-appointment           Form (Server Action → Resend + Supabase)
/financing                     Payment plans + CareCredit + insurance accepted
/admin/login                   Supabase Auth login
/admin/dashboard               Recent appointment requests + post list (single-doctor view)
/admin/posts                   Post editor (rich-text + media library)
/admin/posts/new               New-post route
/admin/posts/[id]              Edit-post route
```

**~17 marketing routes + 4 admin routes.** Down from 184 URLs in the audit's old sitemap.

### IA changes vs. old site

| Change | Old | New | Rationale |
|---|---|---|---|
| New page added | — | `/technology` | Audit surfaced Dr. Hsu's strongest differentiator (CBCT 2014, Trios 2024, Zeiss microscope, CBCT accreditation) was buried |
| 27+ testimonial URLs collapsed | `/testimonial-<name>` × 27 | `/reviews` | Per master spec curated-JSON strategy; testimonial-per-URL was a thin-content anti-pattern |
| Doctors split into team + per-doctor | `/doctors-dr-<name>` × 6 | `/doctors` (overview) + `/doctors/<slug>` × 6 | Doctor team is real; index page warranted |
| Services taxonomy clarified | mixed `/services-<x>-html` + `/services/<x>` | single canonical `/services/<slug>` | Audit found duplicate taxonomy from old WordPress permalink structure |
| Personal blog separated | `/2011-..-html` + Blogger subdomain | Blog content scoped to practice; family content moved to v2 decision (deferred) | Audit content-quality finding #3 |
| Theme demo / lorem / hello-world pages | ~85 zombie URLs | (deleted; 410 Gone or 301 to home) | Audit IA finding #1 |

---

## 4. Service taxonomy (locked)

Four categories. Service-detail pages live at `/services/<slug>` regardless of category — category is a filter/group on the overview page, not a URL prefix.

| Category | Services (slug) | Notes |
|---|---|---|
| **General Dentistry** | cleaning, composite-fillings, amalgam-fillings, crowns-caps, fixed-bridges, dentures, root-canal-therapy, oral-hygiene, tooth-extractions, sedation-dentistry, children-oral-healthcare, periodontal-treatment | 12 services |
| **Cosmetic** | porcelain-veneers, teeth-whitening | 2 services (deep bleaching folded into teeth-whitening per audit) |
| **Specialty** | tmj ⭐, sleep-apnea, oral-pathology, orofacial-pain | 4 services; TMJ is the wow-zone signature |
| **Orthodontics** | orthodontics, removable-orthodontics | 2 services |

**~20 unique services.** Each gets a `services/<slug>.mdx` file in P4. The `tmj` service detail page uses the long-scroll case-study template variant (per master spec §5 wow-moment roster).

---

## 5. Page-template inventory

Six templates total. Two have variants. This is the surface P3 designs against.

| # | Template | Used by | Wow zone? | Variants |
|---|---|---|---|---|
| 1 | **Home** | `/` | ✅ Full | — |
| 2 | **Service** | `/services`, `/services/<slug>` | TMJ only | overview · detail · **detail-signature** (TMJ) |
| 3 | **Doctor** | `/doctors`, `/doctors/<slug>` | — | overview · detail |
| 4 | **Editorial** | `/about`, `/technology`, `/reviews` | — | — |
| 5 | **Utility** | `/contact`, `/request-appointment`, `/financing` | — | form-driven · content + form |
| 6 | **Blog** | `/blog`, `/blog/<slug>` | — | index · post |
| 7 | **Admin** | `/admin/*` | — | login · dashboard · editor |

(Admin counts as a 7th template but is hidden from public IA.)

---

## 6. Content schemas (TypeScript → Supabase tables)

Seven schemas. Storage strategy splits between Supabase (CMS-editable) and code (MDX/JSON in repo).

| Schema | Storage | Editable via admin | Reason |
|---|---|---|---|
| `services` | MDX in `content/services/<slug>.mdx` | No (code) | Updated quarterly at most; version-controlled is correct |
| `doctors` | MDX in `content/doctors/<slug>.mdx` | No (code) | Updated annually; bios are content-engineered |
| `blog_posts` | Supabase `blog_posts` table | **Yes** ⭐ | The CMS "wow" demo for the pitch |
| `reviews` | `content/reviews.json` (curated) | No | Per master spec curated strategy; v2 connects Google Places API |
| `appointment_requests` | Supabase `appointment_requests` table | View-only in admin | Form intake destination |
| `practice_info` | TS const `content/practice-info.ts` | No | Hours / phones / address / socials — code-editable singleton |
| `media_assets` | Supabase Storage + `media_assets` table | Used by admin during post creation | Admin-uploaded blog imagery |

### TypeScript type definitions

These types serve as the contract between the Supabase schema, MDX frontmatter validators, and React component props. Detailed shape (will be implemented in `content/schemas.ts` during P2 execution):

```ts
// content/schemas.ts (overview — full implementation in P2 execution)

export type ServiceCategory = 'general' | 'cosmetic' | 'specialty' | 'orthodontics';

export interface Service {
  slug: string;
  name: string;
  category: ServiceCategory;
  summary: string;        // 1-2 sentences, used on overview cards
  hero?: { src: string; alt: string };
  signature?: boolean;    // true only for TMJ — flips template variant
  technologyRefs?: string[];   // ['cbct','trios','zeiss-microscope'] — surfaces in `/technology`
  body: string;           // MDX rendered content
}

export interface Doctor {
  slug: string;           // 'dr-brien-hsu'
  name: string;
  title: string;          // 'DDS', 'Lead Clinician', etc.
  portrait: { src: string; alt: string };
  short: string;          // 1-paragraph blurb for /doctors index
  bio: string;            // MDX long-form
  specialties: string[];
  joinedYear: number;     // 1999 for Brien Hsu
  isLead: boolean;
}

export interface BlogPost {
  id: string;             // uuid
  slug: string;
  title: string;
  status: 'draft' | 'published';
  publishedAt: string | null;  // ISO timestamp
  authorDoctorSlug: string;
  hero: { src: string; alt: string } | null;
  excerpt: string;
  bodyMdx: string;        // raw MDX from editor
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  source: 'google' | 'yelp' | 'facebook';
  authorName: string;
  authorInitial: string;  // 'M.B.' format for privacy if requested
  rating: 5;              // we curate only 5-stars
  body: string;
  sourceUrl: string;
  featured: boolean;      // shown on /
  order: number;          // sort order for /reviews
}

export interface AppointmentRequest {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  preferredTime: 'morning' | 'afternoon' | 'either';
  notes: string | null;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

export interface PracticeInfo {
  brandName: string;       // 'Comfort Care Dental'
  legalName: string;       // 'Brien Hsu, DDS'
  address: { street: string; city: string; state: string; zip: string };
  hours: Array<{ day: string; open: string; close: string; closed?: boolean }>;
  phones: Array<{ label: string; number: string; tel: string }>;
  email: string | null;     // currently null per audit; v2 candidate
  socials: { facebook?: string; yelp?: string; twitter?: string; google?: string };
  taxIdEnabledForFinancing: boolean;
}

export interface MediaAsset {
  id: string;
  storagePath: string;    // Supabase Storage key
  publicUrl: string;
  alt: string | null;
  width: number;
  height: number;
  format: 'avif' | 'webp' | 'jpeg' | 'png';
  bytes: number;
  uploadedBy: string;     // doctor slug
  createdAt: string;
}
```

### Supabase table outline (full DDL in P4)

```
blog_posts(id pk, slug unique, title, status enum, published_at, author_doctor_slug,
           hero_path, excerpt, body_mdx, tags text[], created_at, updated_at)
appointment_requests(id pk, name, phone, email, preferred_time enum, notes,
                     status enum, created_at)
media_assets(id pk, storage_path, public_url, alt, width, height, format,
             bytes, uploaded_by, created_at)
```

RLS policies, indexes, and full DDL belong to P4. P2 only locks the type contract.

---

## 7. URL plan (canonical rules)

- All routes lowercase-hyphen, no trailing slashes, no `.html` suffix
- Canonical: `https://dentisthsu.com/<path>`
- Pitch demo: `dentisthsu-redesign.vercel.app/<path>`
- Admin: `/admin/*` is `noindex` + `nofollow`
- Static routes use Next.js App Router file conventions: `app/(marketing)/services/[slug]/page.tsx`, etc.

### Route groups

```
app/
├── (marketing)/             # marketing pages, public, indexed
│   ├── page.tsx                                  # /
│   ├── about/page.tsx
│   ├── doctors/{page.tsx,[slug]/page.tsx}
│   ├── services/{page.tsx,[slug]/page.tsx}
│   ├── technology/page.tsx
│   ├── reviews/page.tsx
│   ├── blog/{page.tsx,[slug]/page.tsx}
│   ├── contact/page.tsx
│   ├── request-appointment/page.tsx
│   └── financing/page.tsx
└── admin/                   # admin pages, protected, noindex
    ├── login/page.tsx
    ├── dashboard/page.tsx
    └── posts/{page.tsx,new/page.tsx,[id]/page.tsx}
```

---

## 8. 301 / 410 redirect map

Implemented in P4 via `vercel.ts` route config. The map below is the source of truth.

| From (pattern) | To | Status | Reason |
|---|---|---|---|
| `/services-<x>-html` | `/services/<x>` | 301 | Old WordPress permalink |
| `/services-rootcanaltherapy-html` | `/services/root-canal-therapy` | 301 | Slug normalization |
| `/services-pediatricoralhealthcare-html` | `/services/children-oral-healthcare` | 301 | Slug + naming |
| `/services-porcelainveneers-html` | `/services/porcelain-veneers` | 301 | Slug normalization |
| `/services-sleepapneatreatment-html` | `/services/sleep-apnea` | 301 | Slug + simplification |
| `/services-teethextractions-html` | `/services/tooth-extractions` | 301 | Slug normalization |
| `/services-removableorthodontics-html` | `/services/removable-orthodontics` | 301 | Slug normalization |
| `/services-fixedbridges-html` | `/services/fixed-bridges` | 301 | Slug normalization |
| `/services-compositefillings-html` | `/services/composite-fillings` | 301 | Slug normalization |
| `/services-laserdentistry-html` | (deprecated; merged into `/services/oral-hygiene` or `/services/periodontal-treatment`) | 301 | Service consolidation |
| `/services-orthodontics-html` | `/services/orthodontics` | 301 | Slug normalization |
| `/services-oralhygiene-html` | `/services/oral-hygiene` | 301 | Slug normalization |
| `/services-periodontaltreatment-html` | `/services/periodontal-treatment` | 301 | Slug normalization |
| `/services-implants-html` | `/services/dental-implants` (new) | 301 | Adding implants service |
| `/services-onlays-html` | `/services/crowns-caps` | 301 | Onlays merge into crowns category |
| `/services-dentures-html` | `/services/dentures` | 301 | Slug normalization |
| `/services-sedationdentistry-html` | `/services/sedation-dentistry` | 301 | Slug normalization |
| `/testimonial-<name>`, `/testimonial_group/*`, `/testimonial-sitemap-xml` | `/reviews` | 301 | 27+ pages collapsed |
| `/aboutus-*`, `/about-our-dentist-brien-hsu-dds` | `/doctors/dr-brien-hsu` | 301 | Doctor-specific |
| `/aboutus-associates-html`, `/our-team` | `/doctors` | 301 | Team-page consolidation |
| `/doctors-dr-<slug>` | `/doctors/dr-<slug>` | 301 | URL structure |
| `/financing-*` | `/financing` | 301 | Page consolidation |
| `/contact-directions-html`, `/contact-patientforms-html` | `/contact` | 301 | Page consolidation |
| `/portfolio*` | `/services/<related>` (case-by-case in P4) | 301 | Galleries fold into service detail |
| `/category/*`, `/tag/*`, `/author/*` | `/blog` | 301 | WP archive consolidation |
| `/hello-world*`, `/lorem-*`, `/it-uses-a-dictionary-of-over-200-latin-words`, `/latin-words-comined-handful-of-mode`, `/email-quotes-and-inclusion-conventions`, `/research-paper-topics-*`, `/dangers-of-whitening-toothpaste` (if not migrating), `/button`, `/message-box`, `/three-col-wide`, `/four-column-services`, `/two-column-services`, `/three-column-services`, `/blog-2-column`, `/blog-3-column`, `/blog-4-column`, `/blog-html`, `/blog-left-sidebar`, `/blog-right-sidebar*`, `/both-sidebar-at-*`, `/page-with-*`, `/left-sidebar`, `/image-gallery`, `/case-study`, `/general-service`, `/wds-slider-preview`, `/section-dental`, `/section-medical`, `/personal-blog`, `/cbct-accreditation` (if not migrating to `/technology`), `/i-cat-flx-3d-cone-beam-computed-tomography-cbct-system` (merge into `/technology`) | `/` | **410 Gone** preferred (or 301 to `/`) | Theme demo / lorem / WordPress chrome / consolidated |
| `/sitemap-index-xml`, `/page-sitemap-xml`, `/post-sitemap-xml`, `/category-sitemap-xml`, `/portfolio-sitemap-xml`, `/team-group-sitemap-xml`, `/team-member-sitemap-xml`, `/testimonial-group-sitemap-xml`, `/wds-slider-sitemap-xml`, `/post-tag-sitemap-xml` | (none — serve real `/sitemap.xml`) | **410 Gone** | Yoast XML pages indexed as HTML |
| `https://2017.dentisthsu.com/*`, `https://www.blog.dentisthsu.com/*`, `https://www.familyblog.dentisthsu.com/*` | `https://dentisthsu.com/` | 301 + spin-down | Parallel WordPress installs |
| Personal blog posts (`/2011-12-november-30th-wind-storm-html`, `/the-happiest-and-saddest-day-of-our-lives-entry-3`, `/pre-labor-surprise-entry-1`, `/hanna-hsu-update`, `/2017-02-in-memory-of-dr-william-wei-hsu-html`, `/childrens-hospital-los-angeles-cticu-entry-4`, `/rough-night-at-the-hospital-entry-2`, `/in-memory-of-dr-william-wei-hsu`, `/memories-about-children-dentistry`) | (deferred decision — see [open question](#open-questions)) | TBD in v2 | Personal/family content separation |
| `/faq` | `/faq` (preserve) | 200 | Maintain if FAQ rebuilt; 301 to `/contact` if not |
| `/3shape-trios`, `/zeiss-dental-microscope`, `/i-cat-flx-3d-cone-beam-computed-tomography-cbct-system`, `/2019-10-3-shape-html`, `/2015-11-3d-cone-beam-ct-technology-html`, `/new-technology-in-preparation-for-2024` | `/technology` | 301 | Technology-page consolidation |
| `/covid-19-vaccination`, `/san-bernardino-free-outreach-clinic`, `/2017-02-give-kids-smile-ada-foundation-html`, `/2014-04-giving-back-to-volunteers-html` | `/about` (community section) | 301 | Volunteer/community content folds into about |

The full implementation lives in `content/redirects.ts` exported as a typed array, consumed by `vercel.ts` `redirects` config in P4.

---

## 9. Admin / CMS scope (locked)

For the pitch demo:

- **Editable content type:** `blog_posts` only.
- **Doctor accounts:** single account (Dr. Brien Hsu) for the demo. No multi-user, no roles. Deferred to v2.
- **Editor stack:** Tiptap (rich text in React) — content stored as MDX-compatible markdown in Supabase.
- **Workflow:** draft → publish → ISR revalidation via `revalidateTag('blog')` → live within 5 seconds.
- **Media library:** uploads go to Supabase Storage; URLs inserted directly into post body.
- **Auth:** Supabase Auth (email + password). Demo credentials handed to the dentist during the pitch meeting.
- **Dashboard:** `/admin/dashboard` shows recent appointment requests + post list. Read-only on requests.

**Explicitly out of scope (deferred to v2):**
- Editing services, doctors, technology, reviews
- Multi-user / role-based access
- Approval workflows / comments
- Real-time collaborative editing
- Post scheduling / future-dated publish
- Comment moderation
- Post analytics

---

## 10. Open questions (deferred to client meetings or v2)

These are P2 questions that *don't* block the pitch but should be answered post-signing. Captured here so they don't get lost. (Mirrored from `dentist-questions.md` where applicable.)

1. **Personal/family content disposition.** The audit found 9–12 personal blog posts (childrens-hospital-cticu, in-memory-of-dr-william-wei-hsu, hanna-hsu-update, etc.) that don't belong on a practice site. Three options for v2: (a) separate namespace `/family/`, (b) different domain entirely, (c) curated migration to `/about/community`. **Default for the pitch demo:** redirect to `/about` (community section); revisit post-signing.

2. **Brand name confirmation.** "Comfort Care Dental" is the recommended primary brand based on Yelp + audit framing. Confirmation in the pitch meeting itself per `dentist-questions.md` Q1.

3. **Faq scope.** Current `/faq` is a stub. Three options: rebuild from blog content, fold into `/services/<slug>` accordions, or remove. **Default for pitch:** keep at `/faq` redirect-target only, rebuild post-signing.

---

## 11. Acceptance criteria

P2 ships when ALL of these are true:

- [ ] `docs/ia/sitemap.md` — sitemap committed in markdown form (mirrors §3 above)
- [ ] `docs/ia/page-templates.md` — 6-template inventory with variant notes (mirrors §5)
- [ ] `docs/ia/redirects.md` — human-readable redirect map (mirrors §8)
- [ ] `content/schemas.ts` — TypeScript types per §6 (committed; `pnpm exec tsc --noEmit` clean)
- [ ] `content/redirects.ts` — typed array of redirect rules consumable by `vercel.ts` in P4
- [ ] `content/practice-info.ts` — populated from `source/practice-info.json` curated facts (Comfort Care Dental brand, real address, real phones, real socials)
- [ ] `docs/ia/services-taxonomy.md` — 4-category taxonomy with all 20 services listed (mirrors §4)
- [ ] `docs/ia/admin-scope.md` — CMS scope decision (mirrors §9)
- [ ] User signs off on all documents

---

## 12. Handoff to P3

P2 outputs that P3 (Visual & Brand Direction) directly consumes:

| P2 output | P3 input |
|---|---|
| Sitemap (§3) | Page-by-page design surface |
| Page templates (§5) | Templates to design against (6 needed) |
| Brand direction (§2) | Logo direction + brand wordmark scope |
| Service taxonomy (§4) | Services overview page layout (4 categories, ~20 services) |
| Wow-zone roster (master spec §5 + P2 §3) | TMJ signature page + home + services overview = 3 cinematic surfaces |

P2 outputs that P4 (Front-end Build) consumes:

| P2 output | P4 input |
|---|---|
| `content/schemas.ts` | Supabase migrations + React prop types |
| `content/redirects.ts` | `vercel.ts` `redirects` config |
| `content/practice-info.ts` | Global footer + schema.org markup |
| Admin scope (§9) | `/admin/*` route implementation budget |

---

## 13. Document conventions for this spec

- This spec is the source of truth for P2 execution.
- Material changes during the phase append a row to `docs/superpowers/decisions.md`.
- Once P2 ships, this doc moves to read-only status — future changes require a new dated spec.
- The **brand name** decision in §2 is the most likely thing to change during the pitch meeting — explicitly contingent on Q1 of `dentist-questions.md`.
