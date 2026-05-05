# Competitive Teardown

**Authored:** 2026-05-05
**Captures:** [`source/teardowns/`](../../source/teardowns/) — 12 TMJ Expert PNGs (mobile + desktop) · 12 Aventura PNGs (mobile + desktop)
**Capture script:** [`scripts/p1-discovery/08-teardown-captures.ts`](../../scripts/p1-discovery/08-teardown-captures.ts)

> **Structural rule** (per [decisions log](../superpowers/decisions.md)): TMJ Expert is the **client's** reference and is analyzed **per-site** (deep) — we surface what about it appealed to him so he feels heard. Aventura is **our** SOTY teacher and is analyzed **per-dimension** — we extract design principles for P3, not moves to copy.

---

## TMJ Expert (per-site, deep)

> Reference URL the dentist supplied: [`tmjexpert.com/gallery/tmj-cases/tmj-treatments/02/`](https://tmjexpert.com/gallery/tmj-cases/tmj-treatments/02/). The gallery page format is the *thing* that resonated with him — not necessarily the whole site.

### Pages captured

| Page | Local |
|---|---|
| Home | `01-home-{mobile,desktop}.png` |
| Gallery — TMJ Treatments / Patient 02 (the dentist's reference) | `02-gallery-tmj-treatments-02-{mobile,desktop}.png` |
| Gallery — TMJ Treatments / Patient 01 | `03-gallery-tmj-treatments-01-{mobile,desktop}.png` |
| TMJ overview | `04-tmj-{mobile,desktop}.png` |
| About | `05-about-mobile.png` (desktop timed out repeatedly) |
| Services | `06-services-{mobile,desktop}.png` |
| Contact | `07-contact-mobile.png` (desktop timed out) |
| Blog | `08-blog-{mobile,desktop}.png` |

> Note: TMJ Expert's site has aggressive anti-bot / long-polling scripts — Playwright's `networkidle` strategy never resolved. Captures used `waitUntil: 'commit'` + 8s settle. Two pages (about-desktop, contact-desktop) failed all retries; this is also itself a finding (their tracking-script load is long enough to hurt mobile UX).

### What works

- **Authoritative-clinical positioning.** The wordmark ("THE TMJ EXPERT") + the marble-texture hero treatment + the doctor portrait reads as "premium, specialist, established." This is the opposite of generic dental brochure-ware. *(Reference: `01-home-desktop.png`.)*

- **The gallery page format is genuinely good.** The patient case-study layout — Patient 01 → Prev/Next navigation → Before/After photo pair → patient thumbnails carousel below — turns clinical evidence into editorial content. Each patient becomes a story you can scroll through. The dentist's reference URL is specifically *Patient 02*, and the structure repeats per patient. *(Reference: `02-gallery-tmj-treatments-02-desktop.png`.)*

- **Real patient photography.** B&A pairs are full-frame portraits, not awkward close-ups. The patient looks like a person, not a case. This is the credibility unit — proof that the practice does what it claims. *(Reference: `02-gallery-tmj-treatments-02-desktop.png`.)*

- **Lead-magnet integration is well-executed.** "7 Questions to Ask Before You Choose a TMJ Expert" downloadable PDF appears as a modal on the gallery page. Title is specific (not "Subscribe to our newsletter"), the value-exchange is clear (PDF for email), and the form is minimal (Full Name + Email + Submit). *(Reference: gallery captures.)*

- **Phone CTA is persistent in the header on every page.** `(818) 647-9301` always visible. "Schedule Consultation — In Person & Virtual" CTA is also persistent. Both are above the fold without being aggressive.

- **Accessibility statement at the bottom of every page.** Cites ADA compliance posture and provides an accommodation contact. This is rare on dental sites and is itself a trust signal.

### What we'll honor in our pitch

These are concrete moves we'll bring forward into our redesign for Dr. Hsu:

1. **The case-study/gallery page pattern.** Patient case studies become a first-class content type in our master spec [§5 wow-moment roster](../superpowers/specs/2026-05-05-dentisthsu-redesign-master-spec.md#wow-moment-roster) — a *signature service detail page* (likely TMJ for Dr. Hsu, since he writes about it and the dentist himself referenced this page). Long-scroll narrative, pinned visuals, before/after pairs.

2. **Persistent phone-CTA in the header.** Already a master spec utility-zone principle. Our pitch enforces it on every utility page.

3. **The lead-magnet pattern.** A downloadable PDF with a specific question-driven title (not generic) tied to a service the practice differentiates on. For Dr. Hsu we could build "5 Questions to Ask Before Your Sleep Apnea Treatment" or "What to Expect from a 3D-Imaging Dental Consult" — content he could write in 30 minutes that captures intent-loaded leads.

4. **The accessibility statement.** Pitch ships with a footer-linked accessibility statement; reinforces master spec [§2 a11y principle](../superpowers/specs/2026-05-05-dentisthsu-redesign-master-spec.md#3-accessibility-is-leverage-not-friction) as a deliverable, not a footnote.

### What we'll improve

These are weaknesses in TMJ Expert that we explicitly do *better* — they become differentiation points in the pitch:

1. **Page-load speed is poor.** Multiple pages timed out in our automated capture under both `networkidle` (45s) and `load` (30s) waits. The site has long-polling tracking scripts that delay render. *Our build hits Lighthouse 95+ and sub-2.5s LCP — see master spec [§4 perf principle](../superpowers/specs/2026-05-05-dentisthsu-redesign-master-spec.md#4-performance-is-part-of-the-design).*

2. **Modal lead-magnet on first visit can feel intrusive.** On the very page the dentist linked us, a modal pops up immediately. We honor the lead-magnet pattern but place it inline / on scroll-trigger rather than entry-blocking.

3. **The hero treatment is static.** TMJ Expert's home is a photograph + wordmark — confident, but motionless. *Our wow-zone treatment can earn the same authority + add motion that the dentist hasn't seen on competitor sites.*

4. **Visual identity is "professional medical authority" — appropriate for a TMJ specialist, but Dr. Hsu's positioning is broader.** He runs a 6-doctor general + cosmetic + medical practice with a deep technology-adoption story. *We want a brand that says "advanced, considered, and human" — slightly warmer than TMJ Expert's clinical posture.*

5. **The case studies are anonymous patient names ("Patient 02").** This is HIPAA-safe and probably necessary for them. *We can do the same for clinical evidence pages, AND complement with named, photo-attributed patient testimonials (curated from Dr. Hsu's existing Yelp + Google reviews) for a warmer trust signal — see master spec [§ reviews integration](../superpowers/specs/2026-05-05-dentisthsu-redesign-master-spec.md#rendering-strategy).*

---

## Aventura (per-dimension)

> Source: [aventuradentalarts.com](https://aventuradentalarts.com). Captured 6 URLs × mobile + desktop. Two URL paths (`/services/`, `/team/`) returned 404s with a beautifully-designed error page — that itself is reference material. Real content lives at unobserved URLs (the home page + cosmetic-dentistry page surfaced enough design vocabulary).

### Typography

- **Italic serif display dominates.** "Premium *Esthetic* Dentistry", "Our Services", "*Esthetic* Dentistry", "*Restorative* Dentistry", "*Preventive* Care", "*Beyond* the Smile" — each section header pairs an italic serif word with roman serif. Creates editorial movement without animation.
- **Display sizes are aggressive.** Hero header reads ~56–72px on mobile (extreme for a small viewport). The visual confidence is the message.
- **Body copy is humanist sans, generous tracking.** Subtitle ("Designing smiles that are as healthy as they are beautiful") is around 18–20px on mobile, paired with the heavier serif display for clear hierarchy.
- **Numerals get the same serif treatment.** The 404 page renders "404" at extreme size in light-weight serif — even error states are typographic events.

**Principle for P3:** pair a **high-contrast serif display face** with a **humanist sans body**. Italic accents inside the serif are how you create movement on static pages without animation. Use the type scale aggressively — at least 1.4× ratio between display and body, and don't fear 60–90px display sizes in the wow zone.

### Color

- **Dark hero, light body.** Hero is black/near-black with off-white type. Service-card area is warm-light off-white. The dark surface is reserved for "wow zone" — the rest is calm and readable.
- **Single muted accent.** The pill buttons and "Learn More →" links use a deep dark grey (close to black) on light, and inverse on dark — no traditional "CTA color." Restraint is the differentiator.
- **404 page demonstrates the system clearly.** Light surface + a single black radial gradient in the upper-right quadrant + a giant light-grey "404" — the entire palette is two grays + an off-white background, and it still feels deliberate and sophisticated.

**Principle for P3:** light surface as default for utility pages; dark surfaces *strictly* in the wow zone. **Single restrained accent color**, used sparingly. Avoid the dental-industry default (clinical white + sterile blue + red CTA).

### Motion

- *(Static captures don't reveal motion behavior; assessment based on common SOTY-tier patterns and what's structurally implied by the layout.)*
- The vertical stacking of full-bleed sections strongly implies scroll-driven section reveal.
- The B&W → color image treatments per service card suggest hover/scroll-triggered color reveals or parallax.
- The typographic italic emphasis (paired with roman) implies that letterforms could be the motion vehicle (e.g., italic words slide in or fade independently).

**Principle for P3:** **categorize motion** — cinematic for the wow zone, considered for utility, functional for feedback (master spec [§5 motion language](../superpowers/specs/2026-05-05-dentisthsu-redesign-master-spec.md#motion-language)). One signature motion moment per page. No autoplay on entry; gate everything behind `prefers-reduced-motion`.

### Photography

- **Editorial B&W everywhere.** The four service cards on the home page (Esthetic, Restorative, Preventive, Beyond the Smile) all use full-frame B&W portraits — a man with glasses, a woman with books, a person mid-procedure, a dental impression close-up. Magazine quality. *Not* stock smiles.
- **Subjects are people, not products.** Even "Beyond the Smile" (which on most sites would be a clinical product shot) is photographed editorially.
- **Photography is the hierarchy.** Section dividers are images, not graphics. Each image carries narrative weight before any copy is read.

**Principle for P3:** the master spec [§5 photography direction](../superpowers/specs/2026-05-05-dentisthsu-redesign-master-spec.md#photography-direction) (option E — Dr. Hsu's actual portrait + clinic + editorial stock + AI fill) goes into production aiming for **editorial B&W or unified color-grade** across all sources. Photography decisions in P3 lock the direction (B&W vs. warm color grade) before P4 ships.

### Information architecture

- **Aggressive minimalism.** Home → service cards (4 categories) → "About Us" pill → contact form section. That's effectively the entire navigable surface from the home page.
- **Pill-button "Learn More →" CTAs after each service card.** No mega-menu, no service taxonomy in the header, no breadcrumbs visible.
- **Form embedded in the home page itself.** The "Ready to book or just have questions?" form lives mid-scroll on the home page rather than on a dedicated `/contact`. Reduces friction.

**Principle for P3 / P2:** keep the IA shallow. Marketing pages collapse to ~6 templates. A primary CTA appears on the home page itself in addition to in the global header.

### Micro-interactions

- **Pill buttons with directional arrows** (`→`) are the visual signature for any link off the page. Consistent across "Learn More" CTAs, the "About Us" button, the form submit, and the "Back to Homepage" link on 404.
- **Form interaction is single-column, no clutter.** Each input gets its own row with a clear label embedded as placeholder. Submit is a black pill.
- **No visual loading spinners or progress affordances visible.** Form acknowledgement is a static "We'll call you back as soon as possible. Thank you for getting in touch." block — implies the interaction is fast enough that no spinner is needed.

**Principle for P3:** establish a **single button vocabulary** (probably a pill with directional arrow) and use it everywhere a link leaves the current section. Form submission states are inline acknowledgements, not redirects.

### Layout grid

- **Single-column on mobile, single-or-two-column on desktop.** The home page on desktop appears to maintain a strict single-column for hero + form + service cards stacked, with each section being full-bleed.
- **Negative space is the layout.** Generous whitespace between sections. Type sizes are large enough that the page is mostly air.
- **Sections are self-contained.** Each section has its own typographic event, its own image, its own CTA. No section "leaks into" the next visually.

**Principle for P3:** `8pt` spacing unit, `1280px` max container, generous section padding (`128px+` between major sections on desktop). Mobile-first single-column, scaling up to asymmetric two-column only in the wow zone.

---

## Synthesis: design principles for P3

Five principles distilled from the teardowns above. Each is phrased as a directive a designer can execute against. Together they constitute the **non-negotiable visual brief** P3 inherits.

1. **Confidence through restraint.** One serif display face + one humanist sans body. Single muted accent color. Two surface palettes (warm-light for utility; dark for wow zone). Aggressive type scale (≥1.4× ratio). Reject the dental-industry default of clinical-blue + sterile-white + stock smiles.

2. **Photography is hierarchy, not decoration.** Every page hero leads with a unified-grade photograph (B&W or warm-color, picked early in P3). Section dividers are images, not rules or shapes. The doctor's portrait is the credibility anchor on `/about` and `/doctor`. Photography drives narrative; copy supports.

3. **Motion is a budget, not a default.** Three categories — cinematic (wow zone only), considered (section reveals on utility pages), functional (button/form feedback). One signature moment per page. Everything gated behind `prefers-reduced-motion`. No autoplay on entry.

4. **Honor the case-study pattern from TMJ Expert.** A dedicated long-scroll signature service detail page (likely `/services/tmj` or `/services/sleep-apnea`) with patient case studies — before/after photography, patient narratives (named or anonymized), pinned visuals as you scroll. This is the wow-zone landing surface that closes the pitch on Dr. Hsu's domain expertise.

5. **The IA collapses to ~6 page templates.** Home, services overview, service detail (with the signature template variant for the wow-zone service), doctor/about, contact + request appointment, blog index/post. Pill-button vocabulary across all CTAs. Phone-CTA persistent in header. Embedded inline contact form on the home page in addition to `/contact`. Accessibility statement linked from footer on every page.

---

## Open questions surfaced

These come out of the teardown and feed into the [dentist-questions](dentist-questions.md) doc:

- **Which TMJ Expert moment specifically resonated** — the gallery format? the authoritative positioning? the lead-magnet PDF? the patient case studies? Without his answer we'll honor the gallery format by default; with his answer we know what to anchor on.
- **Photography direction — B&W or warm-color grade?** Aventura is B&W. P3 needs to lock this before P4 begins shooting/curating, because it changes everything downstream.
- **Lead-magnet topic for v2.** TMJ Expert's "7 Questions to Ask" is content Dr. Hsu could write in an hour. Worth proposing as a v2 deliverable in the pitch deck.
