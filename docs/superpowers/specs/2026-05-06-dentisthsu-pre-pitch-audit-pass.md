# Pre-Pitch Audit Pass — Brand, IA, Content & Hero Rewrite

**Date:** 2026-05-06
**Status:** Approved (brainstorm complete; awaiting user review of this spec)
**Phase:** P3.5 — accuracy audit pass between P3 (visual direction) and the pre-pitch deploy
**Owner:** Rob Guevarra
**Inputs:** Client annotations on deployed `ccd-redesign.vercel.app` screenshots; "Dental Flyer Revised.pdf" + "Medical Flyer Revised.pdf" (real practice marketing); attached practice logo SVG.

---

## 1. Why this exists

The deployed pitch site has accuracy and positioning gaps that will lose the meeting. The client's annotations identified them in three buckets:

1. **The practice is hybrid medical + dental** — but the site presents as a dental practice with a "specialty" sidecar. The taxonomy (`general / cosmetic / specialty / orthodontics`) is wrong.
2. **The hero copy reads transactional** ("Your time is the gift") instead of leading with comfort-in-care, which is the practice's actual positioning ("your comfort is our priority" — dental flyer; "We restore what matters most: your health, your comfort, your sleep" — medical flyer).
3. **Concrete factual errors** — wrong hours, missing suite/ZIP, false "microscope-level magnification" claim on composite fillings, an extra doctor on the roster, services advertised that the practice doesn't actually offer (orthodontics, pediatric, sedation, amalgam).

This spec fixes all three before the dentist sees the demo. It is intentionally a content/IA/brand pass — not a redesign of the visual system itself (the editorial Fraunces direction stays).

---

## 2. Decisions locked during brainstorming

| # | Decision | Choice |
|---|---|---|
| 1 | Positioning depth | **B — Two clear lanes.** Separate `/dental` and `/medical` landing pages. Lane-aware sub-label in the header. Same wordmark across both. |
| 2 | Logo + visual blend | **Soft hybrid.** Logo (deep ink, 28px) anchors the header lockup beside the "Comfort Care Dental" wordmark. Recurring quiet mark in blog end-marks, section dividers, favicon. Replace placeholder terracotta with editorial teal accent. |
| 3 | Umbrella brand name | **A — keep "Comfort Care Dental"** as the wordmark across all routes. Lane sub-label does the differentiation. |
| 4 | Service taxonomy | **32 services across 9 subcategories under 2 lanes.** Drop `general / cosmetic / specialty / orthodontics` entirely. |
| 5 | Hero copy direction | **A — "Comfort, restored."** Triple-meaning headline (restored teeth / sleep / comfort). Carries the umbrella promise. |
| 6 | Hero implementation | **Preserve `<AirwayHero>` component as-is.** Rewrite the three caption keyframes. Drop the "Sought-after, in Rancho Cucamonga" editorial section that follows (now redundant). |
| 7 | Roster | **5 doctors, not 6.** Drop Dr. Serena Hsu (not on either flyer). |
| 8 | Removed services | Drop ortho (×2 slugs), pediatric, sedation, amalgam, oral-hygiene. None appear in the practice's flyers or the client's audit list — "follow what's accurate." |
| 9 | Phone | `(909) 941-2811` is the single public phone. Drop the toll-free `(800) 365-8295` and the `(909) 558-8187` line from public surfaces. Both flyers list 941-2811. |

---

## 3. Brand architecture

### Wordmark + sub-label system

```
[Logo · 28px deep-ink]   COMFORT CARE DENTAL                           [Call (909) 941-2811]
                         <11px caps sub-label, lane-aware>
```

Sub-label values by route:
- `/`, `/about`, `/reviews`, `/contact`, `/financing`, `/blog/*`, `/request-appointment`: `EST. 1999 · RANCHO CUCAMONGA`
- `/dental`, `/dental/*`: `DENTAL PRACTICE`
- `/medical`, `/medical/*`: `OROFACIAL PAIN & ORAL MEDICINE`
- `/doctors`, `/doctors/*`, `/technology`: `EST. 1999 · RANCHO CUCAMONGA`
- `/admin/*`: no sub-label

The medical lane gets the teal accent applied to small chrome (subhead rules, link colors, divider strokes, the Why-card icon strokes). The dental lane stays warm (existing stone neutrals).

### Logo treatment

- **Source asset:** the user-provided SVG (moon + face profile + star + tooth). Place in `public/logo.svg`. Frame A and Frame B variants live in `/Users/robguevarra/Downloads/Dental/` for fallback if needed.
- **Color:** render via `currentColor` so it picks up the surrounding text color. Default usage: `--ink-950` (deep ink, not pure black).
- **Sizes:** 28px in the header lockup (24px on mobile); 16px as a recurring end-mark on blog posts and section dividers; full-size only on `/about` hero.
- **Alt text:** "Comfort Care Dental — practice mark."

### Color tokens (replaces the placeholder terracotta in `app/globals.css`)

```css
--accent-50:  #e8f1f0;   /* whisper, hover backgrounds */
--accent-200: #a9c8c5;   /* divider rules, borders */
--accent-600: #3f7a76;   /* links, small icons, medical-lane chrome */
--accent-900: #1f3d3b;   /* medical hero accent, strong emphasis */
```

These are a desaturated apothecary teal — drawn from the practice's flyer cyan but pulled toward gallery-grade. Applied SPARINGLY (links, small accents, medical-lane chrome). The dominant palette stays stone neutrals + warm cream.

---

## 4. Information architecture

### Sitemap (final)

```
/                                Home — AirwayHero (preserved) + rewritten captions
├── /dental                      Dental landing — 5 subcategory blocks + featured services
│   ├── /dental/[slug]           Service detail × 22
├── /medical                     Medical landing — 4 subcategory blocks + featured services
│   ├── /medical/[slug]          Service detail × 10. /medical/tmj is the wow page (TMJ signature page already built — relocated, not rebuilt).
├── /doctors                     5 doctors
│   └── /doctors/[slug]          Doctor detail (5 routes, was 6)
├── /technology                  Unchanged
├── /reviews                     Unchanged
├── /about                       Unchanged
├── /contact                     Updated: suite 120, ZIP 91701, hours, email surfaced
├── /financing                   Unchanged
├── /request-appointment         Unchanged
├── /blog                        Unchanged
└── /admin/*                     Unchanged
```

### Routes removed

| Removed | Reason |
|---|---|
| `/services` (and `?category=*` query) | Replaced by lane landings |
| `/services/orthodontics` | Service dropped |
| `/services/removable-orthodontics` | Service dropped |
| `/services/children-oral-healthcare` | Service dropped |
| `/services/sedation-dentistry` | Service dropped |
| `/services/oral-hygiene` | Folded into Preventive cleaning |
| `/services/amalgam-fillings` | Service dropped |
| `/services/fixed-bridges` | Merged into `/dental/crowns-and-bridges` |
| `/services/tmj` | Relocated to `/medical/tmj` |
| All other `/services/*` | Migrated to `/dental/*` or `/medical/*` |
| `/doctors/serena-hsu` | Doctor dropped |

Existing `content/redirects.ts` adds **~25 new internal-migration redirects** (every old `/services/*` → new lane URL) on top of the ~110 WordPress-era redirects already there.

### Top navigation (final)

`Dental · Medical · Doctors · Technology · Reviews · About · Contact` + phone CTA pinned right.

---

## 5. Service taxonomy

### Medical lane (`/medical`) — 10 services in 4 subcategories

```
TMJ & Orofacial Pain
  - tmj                              (relocated from /services/tmj — keep signature page)
  - orofacial-pain                   (relocated)
  - trigger-point-injections         NEW stub
  - prf-prp-injections               NEW stub

Oral Medicine & Pathology
  - oral-pathology                   (relocated)
  - biopsies                         NEW stub
  - oral-cancer-screening            NEW stub
  - oral-cancer-shields              NEW stub (radiation shields per medical flyer)

Sleep & Airway
  - sleep-apnea                      (relocated)

Surgical & Regenerative (medical-context)
  - surgical-laser-therapy           NEW stub
```

### Dental lane (`/dental`) — 14 services in 5 subcategories

```
Preventive Dentistry
  - professional-cleaning            (existing — copy expanded)
  - comprehensive-exam               NEW stub
  - scaling-root-planing             NEW stub (deep cleaning)
  - fluoride-sealants                NEW stub (combined)
  - occlusal-splints                 NEW stub (night guards)

Restorative Dentistry
  - composite-fillings               (existing — microscope claim removed)
  - direct-composite-veneers         NEW stub (esthetic-focused)
  - porcelain-veneers                (relocated from cosmetic)
  - crowns-and-bridges               RENAMED from crowns-caps + merged with fixed-bridges
  - dentures                         (existing)
  - teeth-whitening                  (relocated from cosmetic)

Endodontics
  - root-canal                       RENAMED from root-canal-therapy
  - apicoectomy                      NEW stub
  - root-canal-retreatment           NEW stub

Oral Surgery (dental-context)
  - extractions                      (existing — simple + surgical merged)
  - bone-grafting                    NEW stub
  - implants                         NEW stub (flyer lists; previously absent)

Periodontal & Surgical
  - periodontal-treatment            (existing — relocated)
  - crown-lengthening                NEW stub (flyer)
  - gingivectomy                     NEW stub
  - frenectomy                       NEW stub
  - alveoloplasty                    NEW stub
```

### Handling shared procedures

Surgical extractions, PRF/PRP, implants, and oral appliances are legitimately delivered in both medical and dental contexts. Resolution:

- **Single canonical detail page per slug** (no duplicate URLs).
- **Both lane indexes link to the same page** when relevant.
- **Detail page body includes a brief "When this is medical / When this is dental" framing block** for the four shared procedures — honors the dual-context without forking content.
- **Exception:** `oral-appliances` splits into two slugs (`sleep-apnea` for medical-side OSA appliances vs `occlusal-splints` for dental-side bruxism guards) because user intent diverges enough to warrant separate pages.

### Final counts

- **32 services total** across 9 subcategories: 22 dental + 10 medical.
- **19 new stub services** introduced by this audit pass: 13 dental + 6 medical.

### New stub copy contract

All 19 new stub services ship with **50–80 word bodies** for the pitch. Full long-form bodies are explicit P5/v2 work. Each stub follows the schema in `content/schemas.ts` and gets `summary` (≤140 chars) + `body` (50–80 words) populated.

---

## 6. Service-by-service copy fixes (the screenshot annotations)

| Service | Specific change |
|---|---|
| `professional-cleaning` (renamed from `cleaning`) | Body expansion: "Some patients need 3–4 cleanings a year — we calibrate the cadence to your risk profile. Includes patient education, hygiene maintenance coaching, fluoride applications, and sealants where indicated." |
| `composite-fillings` | **Drop the "microscope-level magnification" claim** (the practice does not have a microscope; the client flagged this as inaccurate). New body: "Tooth-colored composite restorations placed to stop the progression of dental caries and restore the tooth back to function. Modern adhesive composites bond to the tooth and reinforce it; done well, they last a decade or more." |
| `amalgam-fillings` | **DELETED** — route, content reference, nav reference, redirect entry. |
| `crowns-caps` → `crowns-and-bridges` | Rename slug. Merge `fixed-bridges` content in. New body: "Full-coverage restorations and multi-tooth bridges for teeth that need protection beyond a filling — designed and fitted using our 3Shape Trios digital scanner, restoring the tooth back to functionality." |
| `direct-composite-veneers` (NEW) | New stub. Body theme: esthetic-focused, single-visit, conservative, reversible. Sits under Restorative — paired alongside porcelain-veneers but framed as the conservative/budget alternative. |
| `comprehensive-exam` (NEW) | Separate from cleaning. CT scan + panoramic Xray + clinical exam (verbatim from dental flyer service list). |
| `fluoride-sealants` (NEW) | Combined preventive page covering both. |
| `occlusal-splints` (NEW) | Night guards / bite splints. Distinct from sleep-apnea oral appliance. |
| Doctor descriptions | Use the polished flyer copy for Drs. Huang, Sharobiem, Singh, Lim (more clinical-marketing register). Keep Dr. Hsu's existing scraped bio (richer). |

---

## 7. Home page

### Hero — `<AirwayHero>` with rewritten keyframes

The component, video file, scroll-scrub mechanics, per-word mask reveals, desktop split layout, and iOS warmup are all preserved as built. **Only the props change.**

```ts
// app/(marketing)/page.tsx

const HOME_KEYFRAMES: [AirwayHeroKeyframe, AirwayHeroKeyframe, AirwayHeroKeyframe] = [
  {
    eyebrow: 'Why patients stay',
    title: 'Comfort, restored.',
    italicize: [1],   // "restored."
    body: 'For sleep that actually rests you. For a jaw that doesn\'t ache. For a tooth fixed once and left alone.',
  },
  {
    eyebrow: 'What you\'re looking at',
    title: 'Sleep apnea, treatable.',
    italicize: [1],   // "treatable."
    body: 'A custom oral appliance opens the airway during sleep. No mask. No machine. Most patients adapt within two weeks. This is what medical-grade dentistry looks like.',
  },
  {
    eyebrow: 'Two practices, under one roof',
    title: 'Five doctors. Twenty-five years.',
    italicize: [3],   // "years."
    body: 'A USC Master\'s in Orofacial Pain, Oral Medicine, and Sleep Disorders. A board-certified oral surgeon. A board-certified endodontist. Sought after in Rancho Cucamonga since 1999.',
  },
];

// AirwayHero props
topEyebrow: <>Comfort Care Dental &middot; Dental + Medical &middot; Since 1999</>
fallbackHeading: <>Comfort,<br/><span className="italic">restored.</span></>
ariaLabel: 'Comfort Care Dental — two practices, one roof'
```

### Other home page edits

| Section | Change |
|---|---|
| Editorial positioning section ("Sought-after, in Rancho Cucamonga") | **DELETE** — redundant with F3's body. |
| "Four practices, under one roof." services overview | **REPLACE** with "Two practices, under one roof." — two large editorial cards. Card 1 (warm): 🦷 **Dental Practice** → `/dental` with sub-label "Family · Restorative · Cosmetic." Card 2 (teal accent): 🩺 **Medical Practice** → `/medical` with sub-label "TMJ · Sleep apnea · Orofacial pain." Card icons use the lucide stroke; do NOT use emojis in the actual component (emojis are forbidden per CLAUDE.md style). |
| "We invested early so you'd save the tooth." (technology) | Unchanged. |
| "Six doctors, trained at the practices that train other practices." | **"Five doctors, trained at the practices that train other practices."** (number swap) |
| Final CTA "Book a visit, or just say hello." | Unchanged. |
| `practiceInfo.phones[1]` reference at top of HomePage | Update — `practiceInfo` now exposes a single primary phone, see §9. |

---

## 8. Doctor roster

### Final 5 doctors

| Doctor | Credentials (from flyers) | Lane |
|---|---|---|
| Dr. Brien Hsu, DDS, MS | USC Master's in Orofacial Pain, Oral Medicine, Sleep Disorders. Board-certified Orofacial Pain + Dental Sleep Medicine. | Both — features as medical lead AND on dental |
| Dr. Robert Sharobiem, DDS, OMFS | Board-certified oral & maxillofacial surgeon. UCLA + Mount Sinai. AAOMS Humanitarian Award. | Both — surgical care spans medical + dental |
| Dr. Rachel Lim, DMD | Board-certified endodontist. Western Univ. Health Sciences + Columbia. | Dental only |
| Dr. Angela Huang, DMD | General dentist; cosmetic + restorative focus. UC Irvine + Temple. Implant + reconstructive surgery certified. | Dental only |
| Dr. Amandeep Singh, DMD | General dentist; periodontal focus. UC Irvine + Penn. | Dental only |

### Routes & data

- Update `content/doctors.ts`: remove Serena Hsu entry, swap bios for Huang/Sharobiem/Singh/Lim to flyer copy (verbatim from "Dental Flyer Revised.pdf" page 2).
- `/doctors` lists all 5.
- `/dental` features Hsu, Huang, Singh, Lim (and links Sharobiem for surgical work).
- `/medical` features Hsu and Sharobiem prominently with a "Plus three dental colleagues" link to `/doctors`.
- Delete `/doctors/serena-hsu` route. Add a 410 Gone entry in `content/redirects.ts`.

---

## 9. Practice facts corrections

Update `content/practice-info.ts`:

```ts
address: {
  street: '11458 Kenyon Way, Suite 120',
  city:   'Rancho Cucamonga',
  state:  'CA',
  zip:    '91701',
}

phones: [
  { tel: '+19099412811', number: '(909) 941-2811', label: 'main' },
  // Drop both (800) 365-8295 and (909) 558-8187
]

email: 'advancedcare@dentisthsu.com'

hours: [
  { day: 'Mon', open: '09:00', close: '18:00' },
  { day: 'Tue', open: '09:00', close: '18:00' },
  { day: 'Wed', open: '08:00', close: '17:00' },
  { day: 'Thu', open: '09:00', close: '18:00' },
  { day: 'Fri', closed: true },
  { day: 'Sat', closed: true },
  { day: 'Sun', closed: true },
]
```

Surface email in:
- Site footer (next to the phone)
- `/contact` (alongside address + hours)
- Structured-data JSON-LD (`telephone` + `email` fields)

---

## 10. Visual system updates

### Header lockup component

Update `components/site-header.tsx` and `components/wordmark.tsx`:

1. Add `<Logo />` component rendering `public/logo.svg` at 28px (24px mobile), `currentColor` fill.
2. Lockup: `[Logo] [Wordmark "COMFORT CARE DENTAL"] [Sub-label · lane-aware]`.
3. Sub-label is a server-resolved prop based on the current pathname (read in the layout, passed down). Use a `getSublabel(pathname)` helper.
4. Mobile collapses to: `[Logo] [Wordmark]` with sub-label tucked beneath the wordmark on a second line in the menu drawer.

### Color token swap

In `app/globals.css`:
1. Remove the placeholder terracotta `--accent-*` tokens.
2. Add the four teal tokens above (§3).
3. Audit and replace any current usages of `--accent-*` to ensure no surprise color shifts.
4. The medical lane landing page (`/medical/page.tsx`) uses `--accent-600` for sub-headers and rule lines, `--accent-50` for hover states. Dental lane stays default warm.

### Lane landing pages — visual treatment

`/dental` and `/medical` follow the same template (`docs/ia/page-templates.md` LandingHub) with these differences:

- **`/dental`**: warm — full-bleed editorial photo of clinic warmth (placeholder for pitch, Unsplash dental imagery), stone-50 backgrounds, no teal accent.
- **`/medical`**: cooler — abstract anatomical/medical illustration (start with placeholder gradient + small line-art stars echoing the logo's star, no real photography for pitch), `--accent-600` teal accent on subheads, slightly more clinical-restrained typography (less italic, more roman).

Both share: hero with breadcrumb-style heading ("Dental Practice" / "Medical Practice" + tagline), subcategory blocks listing services, featured doctors strip, final CTA matching home.

---

## 11. Scope — what ships before the pitch

**IN SCOPE for this audit pass:**
1. Brand: logo file + lockup + sub-label switching + teal token swap + deep-ink mark
2. IA rebuild: `/dental` + `/medical` landings, all service slug migrations, redirects added
3. Service catalog rebuild: 32 services across 9 subcategories (existing + 19 new stubs at 50–80 words each)
4. Home hero: AirwayHero captions rewritten + drop the redundant editorial section + replace "Four practices" with "Two practices" overview + "Six doctors" → "Five doctors"
5. Practice facts corrected (suite, ZIP, hours, email, phone reduction)
6. Roster reduced 6 → 5 (drop Serena Hsu)
7. Doctor bios: swap to flyer copy where it's tighter; keep Hsu's
8. All flyer-derived service copy improvements applied (cleaning expansion, microscope claim removed, crowns rename + functionality language, direct composite veneers added)
9. Footer surfaces email + phone

**DEFERRED to v2 (post-signing):**
- Long-form body copy on the 19 new stub service pages
- Real photography (medical lane uses gradient placeholders for pitch)
- Logo refinement / variants if needed
- Ortho / pediatric / sedation services if dentist confirms he wants them back
- "When this is medical / when this is dental" dual-context framing on the four shared procedures
- Real Resend email integration on `/request-appointment`
- Replacing Unsplash placeholders with real practice photography

---

## 12. Open questions for the dentist meeting

These do NOT block shipping. Add to `docs/audit/dentist-questions.md`:

1. **Confirm Dr. Serena Hsu drop.** She's not on either flyer; safer to drop than to misrepresent. Is she still on staff?
2. **Confirm ortho / pediatric / sedation removal.** None appear in the flyers or the audit list. Are these services the practice doesn't offer, or services we shouldn't market?
3. **Logo: Frame A vs Frame B.** Two PNG variants in `Downloads/Dental/`. Which is canonical? Which is alternate use?
4. **Friday/Saturday closure** — permanent (per flyer) or seasonal? Important for Google My Business + structured data.
5. **The `(800) 365-8295` toll-free and `(909) 558-8187` numbers** — still active? If so, do you want them surfaced anywhere (e.g. just on `/contact`)?

---

## 13. Acceptance criteria

The audit pass is done when:

- [ ] `pnpm build` clean — no TypeScript or build errors
- [ ] Header on every route shows lockup with correct lane-aware sub-label
- [ ] Logo SVG loads at 28px (24px mobile) in deep ink
- [ ] `/dental` and `/medical` landing pages render with all subcategories + featured doctors
- [ ] Service catalog has exactly 32 services across 9 subcategories — and zero of: amalgam, ortho ×2, pediatric, sedation, oral-hygiene
- [ ] All `/services/*` URLs redirect to their new lane URL (verify ~25 new redirects work)
- [ ] Home `<AirwayHero>` shows the three new keyframes with italics on `restored.`, `treatable.`, `years.`
- [ ] Home page does NOT contain the "Sought-after, in Rancho Cucamonga" section
- [ ] Home page services overview reads "Two practices, under one roof." with two cards linking to `/dental` and `/medical`
- [ ] Home page doctor strip says "Five doctors..."
- [ ] `/doctors` lists exactly 5 doctors (no Serena Hsu)
- [ ] `/contact` shows: 11458 Kenyon Way, Suite 120, Rancho Cucamonga, CA 91701; email advancedcare@dentisthsu.com; phone (909) 941-2811; correct hours
- [ ] Footer surfaces email and primary phone only — no toll-free, no second line
- [ ] `composite-fillings` body does NOT mention "microscope"
- [ ] `professional-cleaning` body mentions 3–4× / year cadence + fluoride + sealants
- [ ] `crowns-and-bridges` slug exists; `crowns-caps` and `fixed-bridges` redirect to it; body mentions "restore the tooth back to functionality"
- [ ] `direct-composite-veneers` exists with esthetic-focused framing
- [ ] All 19 new stub services have `summary` + 50–80 word `body`
- [ ] Teal token swap done in `app/globals.css`; no terracotta references remain
- [ ] `prefers-reduced-motion` fallback in `<AirwayHero>` still renders the new keyframes correctly
- [ ] Lighthouse mobile ≥ 95 across `/`, `/dental`, `/medical`, `/dental/composite-fillings`, `/medical/tmj`
- [ ] WCAG AA — focus rings, keyboard nav, contrast on teal links

---

## 14. Files touched (rough inventory for the implementation plan)

```
app/(marketing)/page.tsx                        Hero keyframes; replace services overview; doctor count
app/(marketing)/layout.tsx                      Pass lane sub-label down to header
app/(marketing)/services/                       DELETE entire subtree
app/(marketing)/dental/page.tsx                 NEW — lane landing
app/(marketing)/dental/[slug]/page.tsx          NEW — service detail
app/(marketing)/medical/page.tsx                NEW — lane landing
app/(marketing)/medical/[slug]/page.tsx         NEW — service detail
app/(marketing)/doctors/[slug]/page.tsx         Drop Serena route
app/(marketing)/contact/page.tsx                Updated facts
app/globals.css                                 Teal token swap

components/site-header.tsx                      Logo + sub-label
components/site-footer.tsx                      Email + single phone
components/wordmark.tsx                         Adjust for lockup
components/logo.tsx                             NEW
components/airway-hero.tsx                      Untouched (consumed via props)

content/practice-info.ts                        Suite, ZIP, hours, email, phone
content/services.ts                             FULL REWRITE — 24 services + 9 subcats + lane field
content/doctors.ts                              Drop Serena; bio swaps
content/redirects.ts                            ADD ~25 lane-migration redirects + Serena 410
content/schemas.ts                              ADD `lane: 'dental' | 'medical'` and `subcategory: string` fields on Service

public/logo.svg                                 NEW
```

---

## 15. Out of scope (explicit)

- Renaming "Comfort Care Dental" to "Comfort Care" or any other umbrella name
- Introducing a competing wordmark for the medical lane
- Visual rebrand beyond the teal-token swap and logo addition
- Adding ortho, pediatric, or sedation back
- Real photography
- Long-form bodies on the new stub service pages
- Multi-language

---

*Brainstorming session: this conversation, 2026-05-06. References used: client annotations on screenshots; Dental Flyer Revised.pdf; Medical Flyer Revised.pdf; attached logo SVG; existing `content/services.ts`, `content/practice-info.ts`, `content/doctors.ts`, `app/(marketing)/page.tsx`, `components/airway-hero.tsx`.*
