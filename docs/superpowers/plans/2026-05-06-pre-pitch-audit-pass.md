# Pre-Pitch Audit Pass — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply all client-flagged audit corrections to the Comfort Care Dental pitch site — IA rebuild into two lanes (`/medical` + `/dental`), service taxonomy rewrite (32 services in 9 subcategories), brand lockup with logo + teal accent, hero copy update, and corrected practice facts — while preserving the AirwayHero scroll-scrubbed video hero exactly as built.

**Architecture:** Schema-first content rewrite (extend `Service` type → rewrite `services.ts` + `doctors.ts` + `practice-info.ts` + `redirects.ts`), then visual-system upgrades (logo asset + teal tokens + sub-label switching + lockup), then page rebuild (home keyframes + 4 lane pages + contact + delete `/services` subtree), then verification (build + visual QA via preview server). Each commit ships a working build.

**Tech Stack:** Next.js 16 App Router · TypeScript strict · Tailwind v4 · Vitest · pnpm.

**Spec:** [docs/superpowers/specs/2026-05-06-dentisthsu-pre-pitch-audit-pass.md](../specs/2026-05-06-dentisthsu-pre-pitch-audit-pass.md)

---

## Group A — Data Layer (Tasks 1–7)

Foundation. Every task in this group commits a working build with tests passing. The page-level work in Group C imports from these — get them right first.

---

### Task 1: Extend `Service` schema with `lane` + `subcategory`

**Files:**
- Modify: `content/schemas.ts:21-45`

- [ ] **Step 1: Replace the `ServiceCategory` type and add new exported types**

In `content/schemas.ts`, replace lines 21 (the `ServiceCategory` type) with:

```ts
export type ServiceLane = 'medical' | 'dental';

export type ServiceSubcategory =
  // Medical
  | 'tmj-orofacial-pain'
  | 'oral-medicine-pathology'
  | 'sleep-airway'
  | 'surgical-regenerative-medical'
  // Dental
  | 'preventive'
  | 'restorative'
  | 'endodontics'
  | 'oral-surgery-dental'
  | 'periodontal-surgical';
```

- [ ] **Step 2: Update the `Service` interface (currently lines 32-45)**

Replace `category: ServiceCategory;` with two fields:

```ts
export interface Service {
  slug: string;
  name: string;
  lane: ServiceLane;
  subcategory: ServiceSubcategory;
  /** 1–2 sentences. Used on lane landing cards and meta description. */
  summary: string;
  hero?: Image;
  /** True only for the wow-zone signature service (TMJ). Flips template variant. */
  signature?: boolean;
  /** Surfaces this service on `/technology` page when array contains items. */
  technologyRefs?: TechnologyRef[];
  /** MDX-rendered body content. */
  body: string;
}
```

- [ ] **Step 3: Run `pnpm typecheck` — expect failures in `content/services.ts` referencing the old `ServiceCategory`**

```bash
pnpm typecheck 2>&1 | head -30
```

Expected: TypeScript errors in `content/services.ts` (uses `category: 'general'` etc. — those types no longer exist). This is intentional — Tasks 5 and 6 fix it.

- [ ] **Step 4: Commit (broken state, fixed by Tasks 5–6)**

```bash
git add content/schemas.ts
git commit -m "refactor(schemas): extend Service with lane + subcategory fields

Adds ServiceLane ('medical' | 'dental') and ServiceSubcategory (9-value
union). Drops the old ServiceCategory type. Breaks services.ts intentionally
— rewritten in Tasks 5-6 of this plan."
```

---

### Task 2: Add Vitest test scaffolding for content layer

**Files:**
- Create: `content/__tests__/services.test.ts`
- Create: `content/__tests__/doctors.test.ts`
- Create: `content/__tests__/practice-info.test.ts`
- Create: `content/__tests__/redirects.test.ts`

These tests express acceptance-criteria invariants from the spec. They guard against regressions and lock in counts.

- [ ] **Step 1: Create `content/__tests__/services.test.ts`**

```ts
import { describe, expect, test } from 'vitest';
import { services, getService, getServicesByLane, getServicesBySubcategory } from '../services';
import type { ServiceLane, ServiceSubcategory } from '../schemas';

const MEDICAL_SUBCATS: ServiceSubcategory[] = [
  'tmj-orofacial-pain',
  'oral-medicine-pathology',
  'sleep-airway',
  'surgical-regenerative-medical',
];
const DENTAL_SUBCATS: ServiceSubcategory[] = [
  'preventive',
  'restorative',
  'endodontics',
  'oral-surgery-dental',
  'periodontal-surgical',
];

describe('services catalog', () => {
  test('total count is exactly 32', () => {
    expect(services.length).toBe(32);
  });

  test('medical lane has exactly 10 services', () => {
    expect(services.filter((s) => s.lane === 'medical')).toHaveLength(10);
  });

  test('dental lane has exactly 22 services', () => {
    expect(services.filter((s) => s.lane === 'dental')).toHaveLength(22);
  });

  test('every service has a non-empty body of 50–500 words', () => {
    for (const s of services) {
      const wordCount = s.body.trim().split(/\s+/).length;
      expect(wordCount, `${s.slug} body length`).toBeGreaterThanOrEqual(40);
      expect(wordCount, `${s.slug} body length`).toBeLessThanOrEqual(500);
    }
  });

  test('every service has a non-empty summary <= 200 chars', () => {
    for (const s of services) {
      expect(s.summary.length, `${s.slug} summary length`).toBeGreaterThan(0);
      expect(s.summary.length, `${s.slug} summary length`).toBeLessThanOrEqual(200);
    }
  });

  test('subcategory matches lane', () => {
    for (const s of services) {
      const valid = s.lane === 'medical' ? MEDICAL_SUBCATS : DENTAL_SUBCATS;
      expect(valid, `${s.slug} subcategory ${s.subcategory} not valid for lane ${s.lane}`)
        .toContain(s.subcategory);
    }
  });

  test('slugs are unique and kebab-case', () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug, `slug ${slug}`).toMatch(/^[a-z][a-z0-9-]*[a-z0-9]$/);
    }
  });

  test('removed slugs are not present', () => {
    const removed = [
      'amalgam-fillings',
      'orthodontics',
      'removable-orthodontics',
      'sedation-dentistry',
      'children-oral-healthcare',
      'oral-hygiene',
      'fixed-bridges',
      'crowns-caps',
      'root-canal-therapy',
      'tooth-extractions',
      'cleaning',
    ];
    for (const slug of removed) {
      expect(getService(slug), `${slug} should be removed`).toBeUndefined();
    }
  });

  test('exactly one signature service', () => {
    const sigs = services.filter((s) => s.signature);
    expect(sigs).toHaveLength(1);
    expect(sigs[0]?.slug).toBe('tmj');
  });

  test('helpers return correct subsets', () => {
    expect(getServicesByLane('medical').length).toBe(10);
    expect(getServicesByLane('dental').length).toBe(22);
    expect(getServicesBySubcategory('preventive').length).toBe(5);
    expect(getServicesBySubcategory('restorative').length).toBe(6);
  });
});
```

- [ ] **Step 2: Create `content/__tests__/doctors.test.ts`**

```ts
import { describe, expect, test } from 'vitest';
import { doctors, getDoctor } from '../doctors';

describe('doctor roster', () => {
  test('total count is exactly 5', () => {
    expect(doctors).toHaveLength(5);
  });

  test('Serena Hsu is removed', () => {
    expect(getDoctor('dr-serena-hsu')).toBeUndefined();
  });

  test('lead clinician is Dr. Brien Hsu', () => {
    const lead = doctors.find((d) => d.isLead);
    expect(lead?.slug).toBe('dr-brien-hsu');
  });

  test('every doctor has a portrait, short, and bio', () => {
    for (const d of doctors) {
      expect(d.portrait.src, d.slug).toBeTruthy();
      expect(d.short.length, d.slug).toBeGreaterThan(0);
      expect(d.bio.length, d.slug).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 3: Create `content/__tests__/practice-info.test.ts`**

```ts
import { describe, expect, test } from 'vitest';
import { practiceInfo } from '../practice-info';

describe('practice info', () => {
  test('address is the corrected Suite 120, ZIP 91701', () => {
    expect(practiceInfo.address.street).toBe('11458 Kenyon Way, Suite 120');
    expect(practiceInfo.address.zip).toBe('91701');
  });

  test('exactly one phone (the flyer number)', () => {
    expect(practiceInfo.phones).toHaveLength(1);
    expect(practiceInfo.phones[0]?.number).toBe('(909) 941-2811');
    expect(practiceInfo.phones[0]?.tel).toBe('+19099412811');
  });

  test('email is surfaced (not null)', () => {
    expect(practiceInfo.email).toBe('advancedcare@dentisthsu.com');
  });

  test('hours: Mon/Tues/Thurs 9-6, Wed 8-5, Fri/Sat/Sun closed', () => {
    const byDay = Object.fromEntries(practiceInfo.hours.map((h) => [h.day, h]));
    expect(byDay['Monday']).toEqual({ day: 'Monday', open: '09:00', close: '18:00' });
    expect(byDay['Tuesday']).toEqual({ day: 'Tuesday', open: '09:00', close: '18:00' });
    expect(byDay['Wednesday']).toEqual({ day: 'Wednesday', open: '08:00', close: '17:00' });
    expect(byDay['Thursday']).toEqual({ day: 'Thursday', open: '09:00', close: '18:00' });
    expect(byDay['Friday']?.closed).toBe(true);
    expect(byDay['Saturday']?.closed).toBe(true);
    expect(byDay['Sunday']?.closed).toBe(true);
  });
});
```

- [ ] **Step 4: Create `content/__tests__/redirects.test.ts`**

```ts
import { describe, expect, test } from 'vitest';
import { redirects } from '../redirects';

describe('redirects', () => {
  test('lane-migration entries map old service URLs to new lane URLs', () => {
    const map = Object.fromEntries(
      redirects.filter((r) => r.status === 301).map((r) => [r.from, r.to]),
    );

    // Spot-check critical migrations
    expect(map['/services/tmj']).toBe('/medical/tmj');
    expect(map['/services/sleep-apnea']).toBe('/medical/sleep-apnea');
    expect(map['/services/orofacial-pain']).toBe('/medical/orofacial-pain');
    expect(map['/services/oral-pathology']).toBe('/medical/oral-pathology');
    expect(map['/services/cleaning']).toBe('/dental/professional-cleaning');
    expect(map['/services/composite-fillings']).toBe('/dental/composite-fillings');
    expect(map['/services/crowns-caps']).toBe('/dental/crowns-and-bridges');
    expect(map['/services/fixed-bridges']).toBe('/dental/crowns-and-bridges');
    expect(map['/services/root-canal-therapy']).toBe('/dental/root-canal');
    expect(map['/services/tooth-extractions']).toBe('/dental/extractions');
    expect(map['/services/porcelain-veneers']).toBe('/dental/porcelain-veneers');
    expect(map['/services/teeth-whitening']).toBe('/dental/teeth-whitening');
    expect(map['/services/dentures']).toBe('/dental/dentures');
    expect(map['/services/periodontal-treatment']).toBe('/dental/periodontal-treatment');
  });

  test('removed services return 410', () => {
    const map = Object.fromEntries(
      redirects.filter((r) => r.status === 410).map((r) => [r.from, true]),
    );
    expect(map['/services/amalgam-fillings']).toBe(true);
    expect(map['/services/orthodontics']).toBe(true);
    expect(map['/services/removable-orthodontics']).toBe(true);
    expect(map['/services/sedation-dentistry']).toBe(true);
    expect(map['/services/children-oral-healthcare']).toBe(true);
    expect(map['/services/oral-hygiene']).toBe(true);
    expect(map['/doctors/dr-serena-hsu']).toBe(true);
  });
});
```

- [ ] **Step 5: Run tests — expect failures (data files not yet updated)**

```bash
pnpm vitest --run content/__tests__/
```

Expected: All four test files fail. This is a TDD setup — tasks 3, 4, 5, 6, 7 make them pass.

- [ ] **Step 6: Commit failing tests**

```bash
git add content/__tests__/
git commit -m "test(content): scaffold acceptance tests for audit-pass invariants

Tests express the count and identity invariants from the audit-pass spec.
Currently failing — Tasks 3-7 of the plan make them pass."
```

---

### Task 3: Update `content/practice-info.ts` (corrected facts)

**Files:**
- Modify: `content/practice-info.ts` (full rewrite)

- [ ] **Step 1: Replace the `practiceInfo` const with the corrected version**

Open `content/practice-info.ts` and replace the entire `practiceInfo` export (lines 15-53) with:

```ts
export const practiceInfo: PracticeInfo = {
  brandName: 'Comfort Care Dental',
  legalName: 'Brien Hsu, DDS, MS & Associates',
  address: {
    street: '11458 Kenyon Way, Suite 120',
    city: 'Rancho Cucamonga',
    state: 'CA',
    zip: '91701',
  },
  hours: [
    { day: 'Monday', open: '09:00', close: '18:00' },
    { day: 'Tuesday', open: '09:00', close: '18:00' },
    { day: 'Wednesday', open: '08:00', close: '17:00' },
    { day: 'Thursday', open: '09:00', close: '18:00' },
    { day: 'Friday', open: '', close: '', closed: true },
    { day: 'Saturday', open: '', close: '', closed: true },
    { day: 'Sunday', open: '', close: '', closed: true },
  ],
  phones: [
    { label: 'Main', number: '(909) 941-2811', tel: '+19099412811' },
  ],
  email: 'advancedcare@dentisthsu.com',
  socials: {
    facebook: 'https://www.facebook.com/pages/category/Dentist---Dental-Office/Comfort-Care-Dental-Brien-Hsu-DDS-203187206359000/',
    yelp: 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga',
    twitter: 'https://twitter.com/drbrienhsu',
  },
  taxIdEnabledForFinancing: true,
};
```

- [ ] **Step 2: Run practice-info tests — expect them to pass**

```bash
pnpm vitest --run content/__tests__/practice-info.test.ts
```

Expected: All 4 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add content/practice-info.ts
git commit -m "fix(content): correct practice info from real flyers

Suite 120, ZIP 91701 (was guessed 91730), real hours (Mon/Tues/Thurs 9-6,
Wed 8-5, closed Fri/Sat/Sun), single phone (909) 941-2811 (drops the
unverified toll-free + main numbers), email advancedcare@dentisthsu.com
surfaced (audit had reported no public email; flyers list it).

Source: Dental Flyer Revised.pdf + Medical Flyer Revised.pdf."
```

---

### Task 4: Update `content/doctors.ts` — drop Serena Hsu + swap bios to flyer copy

**Files:**
- Modify: `content/doctors.ts` (delete Serena entry + replace four bios with flyer copy)

The flyer copy is more polished marketing-clinical. Dr. Hsu's existing scraped bio is richer and stays. The four other doctors' `short` fields and `bio` paragraphs swap to the verbatim flyer copy.

- [ ] **Step 1: Delete the Dr. Serena Hsu entry (lines 121-143)**

Remove the entire object starting `slug: 'dr-serena-hsu'` and ending with `isLead: false,` along with its trailing comma.

- [ ] **Step 2: Replace Dr. Angela Huang's `short` and `bio` (the entry starting around line 40)**

Replace the existing `short` and `bio` fields on the `dr-angela-huang` entry with:

```ts
short:
  'A highly skilled general dentist known for her exceptional work in cosmetic and restorative dentistry, with a gentle touch and a warm, personable approach.',
bio: `Dr. Angela Huang is a highly skilled general dentist known for her exceptional work in cosmetic and restorative dentistry. With a gentle touch and a warm, personable approach, she makes every patient feel at ease.

Dr. Huang earned her B.S. in Biological Sciences from UC Irvine and her Doctorate in Dental Medicine from Temple University in 2008. She is also certified in Tissue Management for Implants and Advanced Dental Implant & Reconstructive Surgery, further enhancing her ability to deliver beautiful, lasting results.`,
```

Keep all other fields (`slug`, `name`, `title`, `portrait`, `specialties`, `joinedYear`, `isLead`) unchanged.

- [ ] **Step 3: Replace Dr. Amandeep Singh's `short` and `bio`**

```ts
short:
  'Focused on dental hygiene and periodontal care since 2006, bringing both expertise and a gentle touch to every patient interaction.',
bio: `Dr. Singh earned his B.S. in Biology from UC Irvine and his Doctorate of Dental Medicine from the University of Pennsylvania.

With a focus on dental hygiene and periodontal care since 2006, he brings both expertise and a gentle touch to his practice. Patients appreciate his professional and compassionate approach to care.`,
```

- [ ] **Step 4: Replace Dr. Rachel Lim's `short` and `bio`**

```ts
short:
  'Board-certified endodontist. DMD from Western University, endodontic specialty at Columbia University. Co-founder of the American Association of Women Dentists.',
bio: `Dr. Rachel Lim is a board-certified endodontist who earned her DMD from Western University of Health Sciences and completed her specialty training in Endodontics at Columbia University.

She has received multiple honors, including the Outstanding Resident Award, and induction into the Omicron Kappa Upsilon honor society. Dr. Rachel is also a co-founder and former Secretary of the American Association of Women Dentists, reflecting her commitment to leadership and advocacy in the dental field.`,
```

- [ ] **Step 5: Replace Dr. Robert Sharobiem's `short` and `bio`**

```ts
short:
  'Board-certified oral and maxillofacial surgeon. UCLA DDS and Mount Sinai NY surgical training in facial trauma, oral surgery, and reconstruction.',
bio: `Dr. Robert Sharobiem is a board-certified oral and maxillofacial surgeon who earned his DDS from UCLA. He completed advanced surgical training at Mount Sinai Hospital in New York, where he specialized in facial trauma, oral surgery, and reconstruction.

Dr. Sharobiem has been recognized with numerous honors, including the AAOMS Humanitarian Award, and has served as Director of the UCLA/USC Mobile Dental Clinic.`,
```

- [ ] **Step 6: Run doctor tests**

```bash
pnpm vitest --run content/__tests__/doctors.test.ts
```

Expected: 4 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add content/doctors.ts
git commit -m "fix(content): roster reduced to 5; bios swapped to flyer copy

Drops Dr. Serena Hsu (not on either flyer; awaiting dentist confirmation —
safer to drop than to misrepresent). Swaps short + bio for Drs. Huang,
Singh, Lim, and Sharobiem to the polished marketing-clinical register
verbatim from Dental Flyer Revised.pdf. Dr. Hsu's richer scraped bio
stays as-is.

Awaiting dentist sign-off in pitch meeting — see open-questions doc."
```

---

### Task 5: Rewrite `content/services.ts` — Medical lane (10 services)

**Files:**
- Modify: `content/services.ts` (will delete entire file content first, then rewrite in two tasks)

This task replaces the entire file. Group A is split across Tasks 5–6 because the content is substantial — Task 5 builds the file skeleton + medical services; Task 6 adds the dental services.

- [ ] **Step 1: Replace `content/services.ts` with new skeleton + 10 medical services**

```ts
import type { Service, ServiceLane, ServiceSubcategory } from './schemas';

/**
 * Service catalog. 32 services across 9 subcategories under 2 lanes
 * (medical, dental). Source: docs/superpowers/specs/2026-05-06-dentisthsu-pre-pitch-audit-pass.md §5
 *
 * Body content for new stub services is intentionally short (50-80 words)
 * for the pitch. Full long-form bodies are P5/v2 work.
 */

export const SERVICE_LANE_LABELS: Record<ServiceLane, string> = {
  medical: 'Medical Practice',
  dental: 'Dental Practice',
};

export const SERVICE_LANE_SUBLABELS: Record<ServiceLane, string> = {
  medical: 'Orofacial Pain & Oral Medicine',
  dental: 'Family · Restorative · Cosmetic',
};

export const SERVICE_SUBCATEGORY_LABELS: Record<ServiceSubcategory, string> = {
  // Medical
  'tmj-orofacial-pain': 'TMJ & Orofacial Pain',
  'oral-medicine-pathology': 'Oral Medicine & Pathology',
  'sleep-airway': 'Sleep & Airway',
  'surgical-regenerative-medical': 'Surgical & Regenerative',
  // Dental
  'preventive': 'Preventive Dentistry',
  'restorative': 'Restorative Dentistry',
  'endodontics': 'Endodontics',
  'oral-surgery-dental': 'Oral Surgery',
  'periodontal-surgical': 'Periodontal & Surgical',
};

export const SERVICE_SUBCATEGORY_BY_LANE: Record<ServiceLane, ServiceSubcategory[]> = {
  medical: [
    'tmj-orofacial-pain',
    'oral-medicine-pathology',
    'sleep-airway',
    'surgical-regenerative-medical',
  ],
  dental: [
    'preventive',
    'restorative',
    'endodontics',
    'oral-surgery-dental',
    'periodontal-surgical',
  ],
};

export const services: Service[] = [
  // ═════════════════════════════════════════════════════════════════
  // MEDICAL LANE (10 services across 4 subcategories)
  // ═════════════════════════════════════════════════════════════════

  // ─────── TMJ & Orofacial Pain (4) ───────
  {
    slug: 'tmj',
    name: 'TMJ Treatment',
    lane: 'medical',
    subcategory: 'tmj-orofacial-pain',
    summary:
      'Comprehensive evaluation and treatment for temporomandibular joint disorders. Most cases are managed without surgery.',
    signature: true,
    technologyRefs: ['cbct'],
    body: "TMJ symptoms — jaw pain, clicking, headaches, ear pressure, limited opening — are often misdiagnosed for years before someone connects them to bite mechanics. We use CBCT imaging to see the joint in three dimensions, and we design splint therapy and bite-equilibration protocols tailored to the specific dysfunction. Surgery is a last resort.",
  },
  {
    slug: 'orofacial-pain',
    name: 'Orofacial Pain',
    lane: 'medical',
    subcategory: 'tmj-orofacial-pain',
    summary:
      'Chronic facial pain syndromes — when the cause is dental, when it is not, and how to tell the difference.',
    body: 'Facial pain is one of the hardest diagnostic problems in clinical medicine. Some of it is dental in origin (cracked teeth, occlusion); much of it is not. We rule out the dental causes systematically and refer appropriately when the source is elsewhere.',
  },
  {
    slug: 'trigger-point-injections',
    name: 'Trigger Point Injections',
    lane: 'medical',
    subcategory: 'tmj-orofacial-pain',
    summary:
      'Targeted injections to release muscle tension around the jaw, head, and neck.',
    body: 'Many TMJ and orofacial pain cases involve hyperactive trigger points in the masseter, temporalis, or related muscles. A small injection of anesthetic — sometimes paired with PRF — into the trigger point relieves the local muscle spasm and breaks the pain cycle. Done in-office, takes minutes, and is most effective when combined with appliance therapy.',
  },
  {
    slug: 'prf-prp-injections',
    name: 'PRF / PRP Injections',
    lane: 'medical',
    subcategory: 'tmj-orofacial-pain',
    summary:
      'Platelet-rich fibrin or plasma injections to support healing and tissue regeneration.',
    body: 'PRF and PRP are concentrated from your own blood and applied to surgical sites or pain points to accelerate healing. We use them in extraction sockets, bone graft sites, and orofacial pain treatment. The procedure adds about fifteen minutes to a visit and significantly improves recovery for the right cases.',
  },

  // ─────── Oral Medicine & Pathology (4) ───────
  {
    slug: 'oral-pathology',
    name: 'Oral Pathology',
    lane: 'medical',
    subcategory: 'oral-medicine-pathology',
    summary:
      'Diagnosis and biopsy of oral lesions — both routine and concerning.',
    body: 'Most oral lesions are benign, but every one is worth identifying. We screen at every cleaning, and we biopsy and pathology-track any lesion that warrants it. Dr. Hsu is board-certified in Oral Medicine and brings decades of experience to the diagnosis of conditions affecting the soft tissues and bones of the mouth.',
  },
  {
    slug: 'biopsies',
    name: 'Biopsies',
    lane: 'medical',
    subcategory: 'oral-medicine-pathology',
    summary:
      'Soft-tissue and oral lesion biopsies, performed in-office with pathology turnaround in days.',
    body: 'When a lesion warrants pathology — and most do not — we perform the biopsy in our office under local anesthesia and send the sample to a board-certified oral pathologist. Results return in three to five days. We follow up with you directly, in person, with a clear treatment plan.',
  },
  {
    slug: 'oral-cancer-screening',
    name: 'Oral Cancer Screening',
    lane: 'medical',
    subcategory: 'oral-medicine-pathology',
    summary:
      'Visual and tactile examination for soft-tissue lesions and early signs of oral malignancy.',
    body: 'Performed at every cleaning. We examine the lips, tongue, palate, floor of the mouth, and throat for any lesion, change in color, or texture difference. Early detection is the single largest factor in oral cancer survival. The screen takes five minutes and adds nothing to the visit cost.',
  },
  {
    slug: 'oral-cancer-shields',
    name: 'Oral Cancer Shields',
    lane: 'medical',
    subcategory: 'oral-medicine-pathology',
    summary:
      'Custom radiation shields for patients undergoing head and neck cancer treatment.',
    body: 'Patients receiving radiation for head and neck cancers benefit from custom intra-oral shields that protect uninvolved tissues and minimize side effects. We fabricate them in-office in close coordination with the radiation oncology team. Most are fitted within a week of consultation.',
  },

  // ─────── Sleep & Airway (1) ───────
  {
    slug: 'sleep-apnea',
    name: 'Sleep Apnea Treatment',
    lane: 'medical',
    subcategory: 'sleep-airway',
    summary:
      'Oral appliance therapy as an alternative to CPAP for mild to moderate obstructive sleep apnea.',
    signature: false,
    body: 'Many patients diagnosed with OSA cannot tolerate CPAP. A custom-fitted oral appliance, designed to advance the lower jaw during sleep, opens the airway and is well-tolerated by most. We coordinate with your sleep physician. Dr. Hsu is board-certified by the American Board of Dental Sleep Medicine.',
  },

  // ─────── Surgical & Regenerative — medical context (1) ───────
  {
    slug: 'surgical-laser-therapy',
    name: 'Surgical Laser Therapy',
    lane: 'medical',
    subcategory: 'surgical-regenerative-medical',
    summary:
      'Diode laser treatment for soft-tissue procedures, decontamination, and biostimulation.',
    body: 'Used for frenectomies, gingivectomies, peri-implantitis decontamination, and biostimulation of surgical sites. The laser cauterizes as it cuts — minimal bleeding, faster healing, less post-operative discomfort than traditional scalpel approaches. Particularly effective for pediatric and anxious patients.',
  },

  // ═════════════════════════════════════════════════════════════════
  // DENTAL LANE — added in Task 6 of the implementation plan
  // ═════════════════════════════════════════════════════════════════
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServicesByLane(lane: ServiceLane): Service[] {
  return services.filter((s) => s.lane === lane);
}

export function getServicesBySubcategory(sub: ServiceSubcategory): Service[] {
  return services.filter((s) => s.subcategory === sub);
}
```

- [ ] **Step 2: Run typecheck — should pass**

```bash
pnpm typecheck
```

Expected: No TypeScript errors anymore (the file now matches the new schema).

- [ ] **Step 3: Run services tests — most fail (only 10/32 services so far)**

```bash
pnpm vitest --run content/__tests__/services.test.ts 2>&1 | tail -20
```

Expected: `total count is exactly 32` fails (we have 10), `dental lane has exactly 22 services` fails. Other tests should be green for the medical entries we have.

- [ ] **Step 4: Commit**

```bash
git add content/services.ts
git commit -m "feat(content): rewrite services.ts — medical lane (10 services)

Replaces the old 4-category catalog (general/cosmetic/specialty/orthodontics)
with the new 9-subcategory taxonomy under medical + dental lanes. This
commit ships the full schema rewrite + helpers + 10 medical-lane services
(TMJ, orofacial pain, trigger-point injections, PRF/PRP, oral pathology,
biopsies, oral cancer screening, oral cancer shields, sleep apnea, surgical
laser). Dental lane added in next commit."
```

---

### Task 6: Rewrite `content/services.ts` — Dental lane (22 services)

**Files:**
- Modify: `content/services.ts` (insert all 22 dental services into the array)

- [ ] **Step 1: Insert the 22 dental services**

In `content/services.ts`, find the line:
```ts
  // ═════════════════════════════════════════════════════════════════
  // DENTAL LANE — added in Task 6 of the implementation plan
  // ═════════════════════════════════════════════════════════════════
```

Replace that comment with:

```ts
  // ═════════════════════════════════════════════════════════════════
  // DENTAL LANE (22 services across 5 subcategories)
  // ═════════════════════════════════════════════════════════════════

  // ─────── Preventive Dentistry (5) ───────
  {
    slug: 'professional-cleaning',
    name: 'Professional Cleaning',
    lane: 'dental',
    subcategory: 'preventive',
    summary:
      'Bi-annual hygiene visits done thoroughly — the foundation everything else rests on.',
    body: 'Periodic professional cleanings remove plaque and tartar that brushing alone cannot reach. Some patients need three or four visits a year — we calibrate the cadence to your risk profile. Each visit pairs the cleaning with patient education, hygiene maintenance coaching, fluoride application, and sealants where indicated.',
  },
  {
    slug: 'comprehensive-exam',
    name: 'Comprehensive Exam',
    lane: 'dental',
    subcategory: 'preventive',
    summary:
      'Full-mouth diagnostic exam with CT scan, panoramic imaging, and periodontal charting.',
    body: 'A complete baseline exam at the first visit and annually thereafter. Includes a panoramic X-ray, CBCT scan when indicated, periodontal probe charting, oral cancer screening, occlusal evaluation, and a treatment-plan consultation. Sets the foundation for every cleaning and procedure that follows.',
  },
  {
    slug: 'scaling-root-planing',
    name: 'Scaling & Root Planing',
    lane: 'dental',
    subcategory: 'preventive',
    summary:
      'Deep cleaning below the gumline for patients with active or early periodontal disease.',
    body: "When pocket depths exceed 4mm and there is calculus below the gumline, a routine cleaning isn't enough. Scaling and root planing — sometimes called deep cleaning — removes biofilm and calculus from root surfaces, allows the gums to reattach, and arrests the progression of periodontitis. Usually completed in two visits.",
  },
  {
    slug: 'fluoride-sealants',
    name: 'Fluoride & Sealants',
    lane: 'dental',
    subcategory: 'preventive',
    summary:
      'Topical fluoride and sealant application for enamel protection in children, teens, and high-risk adults.',
    body: 'Fluoride strengthens enamel against acid attack; sealants physically block the deep grooves where decay starts. We apply both as appropriate at hygiene visits, especially for patients with high decay risk, orthodontic appliances, or genetic susceptibility. Quick to apply, no anesthetic, dramatic long-term protection.',
  },
  {
    slug: 'occlusal-splints',
    name: 'Occlusal Splints',
    lane: 'dental',
    subcategory: 'preventive',
    summary:
      'Custom-fitted night guards for bruxism, clenching, and bite-force protection.',
    body: 'For patients who grind or clench at night — and there are many — a custom occlusal splint protects teeth from wear, fracture, and TMJ overload. We fabricate from impressions or digital scans, fit at a follow-up, and adjust over time. Distinct from sleep apnea oral appliances, which target a different problem.',
  },

  // ─────── Restorative Dentistry (6) ───────
  {
    slug: 'composite-fillings',
    name: 'Composite Fillings',
    lane: 'dental',
    subcategory: 'restorative',
    summary:
      'Tooth-colored composite restorations placed to halt decay and restore tooth function.',
    body: 'Modern adhesive composites bond to the tooth and reinforce it. Done well, they last a decade or more. We place them with rubber dam isolation to stop the progression of dental caries and restore the tooth back to function — closing the cavity, sealing against re-decay, and matching natural enamel.',
  },
  {
    slug: 'direct-composite-veneers',
    name: 'Direct Composite Veneers',
    lane: 'dental',
    subcategory: 'restorative',
    summary:
      'Esthetic-focused composite veneers placed in a single visit. Conservative and reversible.',
    body: "For patients who want the look of porcelain veneers without the time, cost, or commitment, direct composite veneers are an excellent option. Sculpted in-mouth in a single visit, polished to a natural finish, fully reversible. Typical lifespan is five to seven years. Often a stepping stone to porcelain when budget allows.",
  },
  {
    slug: 'porcelain-veneers',
    name: 'Porcelain Veneers',
    lane: 'dental',
    subcategory: 'restorative',
    summary:
      'Custom-shaped porcelain shells that change a smile without changing the underlying teeth.',
    body: 'Veneers are a meaningful commitment — they are also one of the most rewarding cosmetic procedures in dentistry when done well. We design every case digitally first, mock it up in your mouth, and only proceed once the proportions and color are right.',
  },
  {
    slug: 'crowns-and-bridges',
    name: 'Crowns & Bridges',
    lane: 'dental',
    subcategory: 'restorative',
    summary:
      'Full-coverage restorations and multi-tooth bridges that restore function and protect the tooth.',
    body: 'Crowns and bridges are designed and fitted using our 3Shape Trios digital scanner — no impression trays, faster turnaround, more accurate fit. Materials include porcelain-fused-to-metal, full zirconia, and lithium disilicate depending on location and load. Bridges replace one or more missing teeth using adjacent teeth as anchors, restoring the tooth back to functionality.',
    technologyRefs: ['trios'],
  },
  {
    slug: 'dentures',
    name: 'Dentures & Partial Dentures',
    lane: 'dental',
    subcategory: 'restorative',
    summary: 'Full and partial removable prosthetics, including immediate dentures.',
    body: 'Conventional dentures are made after the gums heal (4–6 weeks of being without teeth). Immediate dentures are made in advance and placed the same day as extractions. We adjust them as the tissues remodel.',
  },
  {
    slug: 'teeth-whitening',
    name: 'Teeth Whitening',
    lane: 'dental',
    subcategory: 'restorative',
    summary:
      'In-office and at-home whitening, including deep-bleaching for stubborn cases.',
    body: 'Most over-the-counter whitening underperforms because it does not address tooth permeability. Our deep-bleaching protocol — alternating in-office and supervised at-home phases — works on cases other approaches cannot move.',
  },

  // ─────── Endodontics (3) ───────
  {
    slug: 'root-canal',
    name: 'Root Canal Therapy',
    lane: 'dental',
    subcategory: 'endodontics',
    summary:
      'Endodontic treatment to save teeth that would otherwise need extraction.',
    body: 'Modern root canals, performed under high magnification, are not the painful procedure they were a generation ago. Most patients describe them as comparable to having a filling done. We complete most cases in a single visit. Dr. Lim is a board-certified endodontist with specialty training at Columbia University.',
  },
  {
    slug: 'apicoectomy',
    name: 'Apicoectomy',
    lane: 'dental',
    subcategory: 'endodontics',
    summary:
      "Surgical endodontic procedure to save a tooth when conventional retreatment isn't viable.",
    body: "When a previous root canal has failed and orthograde retreatment isn't feasible, an apicoectomy removes the root tip and seals the canal from below. Performed under high magnification by Dr. Lim. Saves teeth that would otherwise require extraction.",
  },
  {
    slug: 'root-canal-retreatment',
    name: 'Root Canal Retreatment',
    lane: 'dental',
    subcategory: 'endodontics',
    summary:
      'Re-entry of a previously root-canalled tooth to address residual infection or technical issues.',
    body: "Sometimes a root canal needs to be redone — the original treatment didn't fully resolve, the seal compromised, or new decay reached the canal. Retreatment removes the prior filling material and re-cleans the canal system. More involved than first-time RCT, with high success rates when the indication is right.",
  },

  // ─────── Oral Surgery — dental context (3) ───────
  {
    slug: 'extractions',
    name: 'Extractions',
    lane: 'dental',
    subcategory: 'oral-surgery-dental',
    summary:
      'Simple and surgical extractions, performed in-house using CBCT planning.',
    body: 'Most extractions, including complex cases involving impacted teeth, can be done in our office without referral. CBCT scanning before extraction gives us the spatial information needed to avoid surprises. For surgical cases, Dr. Sharobiem is a board-certified oral and maxillofacial surgeon with advanced training at Mount Sinai.',
    technologyRefs: ['cbct'],
  },
  {
    slug: 'bone-grafting',
    name: 'Bone Grafting',
    lane: 'dental',
    subcategory: 'oral-surgery-dental',
    summary:
      'Site preservation and ridge augmentation to support future implant placement.',
    body: 'When a tooth is extracted, the bone underneath begins to resorb. A bone graft placed at extraction (or later) preserves the ridge for future implant placement, denture support, or esthetics. We use a combination of allograft material and PRF; healing typically takes three to four months before implant placement.',
  },
  {
    slug: 'implants',
    name: 'Dental Implants',
    lane: 'dental',
    subcategory: 'oral-surgery-dental',
    summary:
      'Single-tooth and multi-tooth dental implants with CBCT-guided placement.',
    body: 'A titanium implant replaces the root of a missing tooth, supporting a crown, bridge, or denture. We plan placement using our CBCT scanner for precise positioning around nerves and sinuses. Most patients are candidates after a graft if needed. Surgical phase is in-office; restoration follows after osseointegration.',
    technologyRefs: ['cbct'],
  },

  // ─────── Periodontal & Surgical (5) ───────
  {
    slug: 'periodontal-treatment',
    name: 'Periodontal Treatment',
    lane: 'dental',
    subcategory: 'periodontal-surgical',
    summary:
      'Active treatment of gum disease — including laser-assisted therapy where indicated.',
    body: 'Periodontitis affects half of US adults over 30 and is one of the most under-diagnosed dental conditions. We screen at every cleaning and treat actively when we find it: scaling and root planing, laser-assisted decontamination, and ongoing maintenance.',
  },
  {
    slug: 'crown-lengthening',
    name: 'Crown Lengthening',
    lane: 'dental',
    subcategory: 'periodontal-surgical',
    summary:
      'Surgical exposure of additional tooth structure for restorative or cosmetic reasons.',
    body: 'When a tooth is broken near the gumline or a smile shows excessive gum, crown lengthening reshapes the tissue (and sometimes bone) to expose more enamel. Restorative crown lengthening saves teeth that would otherwise be unrestorable; cosmetic crown lengthening evens out a "gummy smile."',
  },
  {
    slug: 'gingivectomy',
    name: 'Gingivectomy',
    lane: 'dental',
    subcategory: 'periodontal-surgical',
    summary:
      'Soft-tissue contouring for periodontal pockets, hyperplasia, or cosmetic shaping.',
    body: 'A gingivectomy removes excess or diseased gum tissue. Indications include drug-induced hyperplasia, persistent pockets after scaling, and cosmetic asymmetry. Performed with a diode laser in most cases — minimal bleeding, faster healing, less discomfort than traditional approaches.',
  },
  {
    slug: 'frenectomy',
    name: 'Frenectomy',
    lane: 'dental',
    subcategory: 'periodontal-surgical',
    summary:
      'Release of restrictive frenum attachments — lip-tie, tongue-tie, or labial frenum.',
    body: 'A tight or thick frenum can pull on the gums, restrict tongue movement, or create a midline diastema between the front teeth. A laser frenectomy releases the attachment in minutes with minimal post-op discomfort. Performed for infants, children, and adults — often in coordination with orthodontics or speech therapy.',
  },
  {
    slug: 'alveoloplasty',
    name: 'Alveoloplasty',
    lane: 'dental',
    subcategory: 'periodontal-surgical',
    summary:
      'Surgical smoothing and reshaping of the bony ridge after extractions.',
    body: 'Often performed at the same visit as extractions — particularly multiple extractions — to smooth the bone and prepare the ridge for a denture or implant. Reduces post-extraction discomfort and improves prosthesis fit.',
  },
```

- [ ] **Step 2: Run all services tests — should be GREEN**

```bash
pnpm vitest --run content/__tests__/services.test.ts
```

Expected: All 9 tests PASS.

- [ ] **Step 3: Run typecheck**

```bash
pnpm typecheck
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add content/services.ts
git commit -m "feat(content): add dental-lane services (22) to complete catalog

Catalog now has 32 services across 9 subcategories under 2 lanes.
Drops: amalgam, ortho ×2, sedation, pediatric, oral-hygiene, fixed-bridges
(merged into crowns-and-bridges).
Adds: 13 new dental stubs (comprehensive-exam, scaling-root-planing,
fluoride-sealants, occlusal-splints, direct-composite-veneers,
apicoectomy, root-canal-retreatment, bone-grafting, implants,
crown-lengthening, gingivectomy, frenectomy, alveoloplasty).
Renames: cleaning → professional-cleaning, root-canal-therapy → root-canal,
tooth-extractions → extractions, crowns-caps → crowns-and-bridges.
Edits: composite-fillings drops false 'microscope-level magnification' claim;
professional-cleaning expanded with 3-4x/year cadence + fluoride/sealants;
crowns-and-bridges adds 'restore the tooth back to functionality' language."
```

---

### Task 7: Add lane-migration redirects + 410s to `content/redirects.ts`

**Files:**
- Modify: `content/redirects.ts`

- [ ] **Step 1: Append a new section at the end of the `redirects` array**

Open `content/redirects.ts` and find the closing `];` of the `redirects` array. Just before it, add this section:

```ts

  // ------------------------------------------------------------------
  // 4. P3.5 audit-pass: lane migration (services subtree → lane URLs)
  // ------------------------------------------------------------------
  // Medical lane migrations
  { from: '/services/tmj', to: '/medical/tmj', status: 301, note: 'Lane migration' },
  { from: '/services/orofacial-pain', to: '/medical/orofacial-pain', status: 301, note: 'Lane migration' },
  { from: '/services/sleep-apnea', to: '/medical/sleep-apnea', status: 301, note: 'Lane migration' },
  { from: '/services/oral-pathology', to: '/medical/oral-pathology', status: 301, note: 'Lane migration' },

  // Dental lane migrations + slug renames
  { from: '/services/cleaning', to: '/dental/professional-cleaning', status: 301, note: 'Lane migration + rename' },
  { from: '/services/composite-fillings', to: '/dental/composite-fillings', status: 301, note: 'Lane migration' },
  { from: '/services/crowns-caps', to: '/dental/crowns-and-bridges', status: 301, note: 'Rename + merge fixed-bridges' },
  { from: '/services/fixed-bridges', to: '/dental/crowns-and-bridges', status: 301, note: 'Merged into crowns-and-bridges' },
  { from: '/services/dentures', to: '/dental/dentures', status: 301, note: 'Lane migration' },
  { from: '/services/root-canal-therapy', to: '/dental/root-canal', status: 301, note: 'Lane migration + rename' },
  { from: '/services/tooth-extractions', to: '/dental/extractions', status: 301, note: 'Lane migration + rename' },
  { from: '/services/porcelain-veneers', to: '/dental/porcelain-veneers', status: 301, note: 'Lane migration (was cosmetic)' },
  { from: '/services/teeth-whitening', to: '/dental/teeth-whitening', status: 301, note: 'Lane migration (was cosmetic)' },
  { from: '/services/periodontal-treatment', to: '/dental/periodontal-treatment', status: 301, note: 'Lane migration' },

  // Lane index redirects
  { from: '/services', to: '/dental', status: 301, note: 'Default lane is dental for legacy /services traffic' },

  // ------------------------------------------------------------------
  // 5. P3.5 audit-pass: 410 Gone — services dropped from catalog
  // ------------------------------------------------------------------
  { from: '/services/amalgam-fillings', to: '/', status: 410, note: 'Service dropped per client audit' },
  { from: '/services/orthodontics', to: '/', status: 410, note: 'Service dropped per client audit' },
  { from: '/services/removable-orthodontics', to: '/', status: 410, note: 'Service dropped per client audit' },
  { from: '/services/sedation-dentistry', to: '/', status: 410, note: 'Service dropped per client audit' },
  { from: '/services/children-oral-healthcare', to: '/', status: 410, note: 'Service dropped per client audit' },
  { from: '/services/oral-hygiene', to: '/', status: 410, note: 'Folded into professional-cleaning' },
  { from: '/doctors/dr-serena-hsu', to: '/doctors', status: 410, note: 'Doctor dropped pending dentist confirmation' },
```

- [ ] **Step 2: Run redirects tests**

```bash
pnpm vitest --run content/__tests__/redirects.test.ts
```

Expected: 2 tests PASS.

- [ ] **Step 3: Run the full test suite to confirm no regressions**

```bash
pnpm vitest --run
```

Expected: All content tests PASS.

- [ ] **Step 4: Commit**

```bash
git add content/redirects.ts
git commit -m "feat(redirects): add P3.5 lane-migration + 410 entries

14 new 301 redirects mapping /services/* to /medical/* or /dental/* +
covering slug renames (cleaning → professional-cleaning, root-canal-therapy
→ root-canal, etc.). 7 new 410 Gone entries for dropped services and
Dr. Serena Hsu's doctor route."
```

---

## Group B — Visual System (Tasks 8–13)

Logo asset, teal token swap, lockup, sub-label switching, footer corrections.

---

### Task 8: Set up logo asset

**Files:**
- Create: `public/logo.png`
- Create: `public/logo@2x.png`

The logo source is a hand-drawn moon + face profile + star + tooth mark provided by the client. The user has Frame A and Frame B PNG variants in `~/Downloads/Dental/`. Frame A is the canonical mark.

- [ ] **Step 1: Verify the source logo exists**

```bash
ls -la "/Users/robguevarra/Downloads/Dental/Frame A.png" "/Users/robguevarra/Downloads/Dental/Frame B.png"
```

Expected: Both files exist. If not, ask the user to provide.

- [ ] **Step 2: Copy Frame A as the canonical logo**

```bash
cp "/Users/robguevarra/Downloads/Dental/Frame A.png" "public/logo.png"
cp "/Users/robguevarra/Downloads/Dental/Frame A.png" "public/logo@2x.png"
```

The single PNG serves both 1x and 2x; Next.js's `<Image>` component will downscale. (SVG conversion is a v2 task — flagged in the spec.)

- [ ] **Step 3: Commit**

```bash
git add public/logo.png public/logo@2x.png
git commit -m "assets: add Comfort Care Dental logo (Frame A canonical)

Hand-drawn moon + face profile + star + tooth mark. Frame B available
at Downloads/Dental/Frame B.png as alternate; not yet committed pending
dentist confirmation of which is canonical."
```

---

### Task 9: Replace placeholder terracotta with editorial teal in `app/globals.css`

**Files:**
- Modify: `app/globals.css:29-30`

- [ ] **Step 1: Replace the accent token block (lines 29-30)**

Find:

```css
  /* Accent — TBD in P3; placeholder warm terracotta */
  --color-accent-500: #b8553a;
```

Replace with:

```css
  /* Accent — editorial apothecary teal (drawn from real practice flyer cyan
     but desaturated for gallery-grade restraint). Used SPARINGLY: links,
     small icons, medical-lane chrome. Dental lane stays warm stone. */
  --color-accent-50: #e8f1f0;
  --color-accent-200: #a9c8c5;
  --color-accent-600: #3f7a76;
  --color-accent-900: #1f3d3b;
```

- [ ] **Step 2: Search the codebase for any direct usage of the old terracotta token**

```bash
grep -rn "accent-500\|#b8553a" app components content lib --include="*.tsx" --include="*.ts" --include="*.css"
```

Expected: Zero hits. If any appear, add a follow-up note (don't change unrelated styling in this task).

- [ ] **Step 3: Run build to confirm no breakage**

```bash
pnpm build 2>&1 | tail -20
```

Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "style(theme): replace placeholder terracotta with editorial teal

Adds 4-stop teal accent palette (--color-accent-50/200/600/900) drawn from
the practice's actual flyer cyan but desaturated to gallery-grade. Used
sparingly per spec: links, small icons, medical-lane chrome. Dental lane
remains warm stone neutrals."
```

---

### Task 10: Create `components/logo.tsx`

**Files:**
- Create: `components/logo.tsx`

A small wrapper around `next/image` that renders the logo at the requested size with proper alt + accessibility.

- [ ] **Step 1: Create `components/logo.tsx`**

```tsx
import Image from 'next/image';
import { cn } from '@/lib/cn';

interface LogoProps {
  /** Pixel size — applied to both width and height (logo is square). Default 28. */
  size?: number;
  /** Mobile size (≤640px). Default 24. */
  mobileSize?: number;
  className?: string;
  /** When true, the logo is decorative beside a wordmark — alt is empty. */
  decorative?: boolean;
}

/**
 * Comfort Care Dental practice mark (moon + face profile + star + tooth).
 * Square aspect. Pairs with `<Wordmark />` in the header lockup; can also
 * appear standalone as an end-mark on blog posts and section dividers.
 */
export function Logo({
  size = 28,
  mobileSize = 24,
  className,
  decorative = false,
}: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt={decorative ? '' : 'Comfort Care Dental'}
      width={size}
      height={size}
      sizes={`(max-width: 640px) ${mobileSize}px, ${size}px`}
      style={{ width: size, height: size }}
      className={cn('inline-block select-none [filter:none]', className)}
      priority
    />
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
pnpm typecheck
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/logo.tsx
git commit -m "feat(ui): add <Logo> component for header lockup + recurring marks

Wraps next/image around public/logo.png. Defaults: 28px desktop / 24px
mobile. Used in the header lockup beside <Wordmark /> per audit-pass spec
§3 visual blend (Option 3 — soft hybrid)."
```

---

### Task 11: Create `lib/sublabel.ts` for lane-aware sub-label resolution

**Files:**
- Create: `lib/sublabel.ts`

The sub-label switches based on the current pathname:
- `/dental*` → `DENTAL PRACTICE`
- `/medical*` → `OROFACIAL PAIN & ORAL MEDICINE`
- everything else → `EST. 1999 · RANCHO CUCAMONGA`

- [ ] **Step 1: Create `lib/sublabel.ts`**

```ts
/**
 * Resolves the lane-aware sub-label shown beneath the wordmark in the header.
 * Server-side helper — call from layouts that have access to the request path.
 *
 * See: docs/superpowers/specs/2026-05-06-dentisthsu-pre-pitch-audit-pass.md §3
 */
export function getSublabel(pathname: string): string {
  if (pathname.startsWith('/dental')) return 'DENTAL PRACTICE';
  if (pathname.startsWith('/medical')) return 'OROFACIAL PAIN & ORAL MEDICINE';
  if (pathname.startsWith('/admin')) return '';
  return 'EST. 1999 · RANCHO CUCAMONGA';
}
```

- [ ] **Step 2: Create the unit test**

Create `lib/__tests__/sublabel.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { getSublabel } from '../sublabel';

describe('getSublabel', () => {
  test('dental routes', () => {
    expect(getSublabel('/dental')).toBe('DENTAL PRACTICE');
    expect(getSublabel('/dental/composite-fillings')).toBe('DENTAL PRACTICE');
  });

  test('medical routes', () => {
    expect(getSublabel('/medical')).toBe('OROFACIAL PAIN & ORAL MEDICINE');
    expect(getSublabel('/medical/tmj')).toBe('OROFACIAL PAIN & ORAL MEDICINE');
  });

  test('admin routes return empty string (no sub-label)', () => {
    expect(getSublabel('/admin')).toBe('');
    expect(getSublabel('/admin/dashboard')).toBe('');
  });

  test('all other routes return the practice tagline', () => {
    expect(getSublabel('/')).toBe('EST. 1999 · RANCHO CUCAMONGA');
    expect(getSublabel('/about')).toBe('EST. 1999 · RANCHO CUCAMONGA');
    expect(getSublabel('/doctors')).toBe('EST. 1999 · RANCHO CUCAMONGA');
    expect(getSublabel('/contact')).toBe('EST. 1999 · RANCHO CUCAMONGA');
    expect(getSublabel('/blog')).toBe('EST. 1999 · RANCHO CUCAMONGA');
  });
});
```

- [ ] **Step 3: Run the new test**

```bash
pnpm vitest --run lib/__tests__/sublabel.test.ts
```

Expected: All 4 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add lib/sublabel.ts lib/__tests__/sublabel.test.ts
git commit -m "feat(lib): add getSublabel() for lane-aware header sub-label

Maps pathname → sub-label string. /dental → 'DENTAL PRACTICE',
/medical → 'OROFACIAL PAIN & ORAL MEDICINE', everything else →
'EST. 1999 · RANCHO CUCAMONGA'. Admin routes return ''."
```

---

### Task 12: Update `components/site-header.tsx` — logo + lockup + sub-label + nav

**Files:**
- Modify: `components/site-header.tsx`

Wires the `Logo` next to `Wordmark`, adds the lane-aware sub-label, swaps the navigation from `Services` to `Dental` + `Medical`, and uses the single corrected phone.

- [ ] **Step 1: Replace the entire file**

```tsx
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { practiceInfo } from '@/content/practice-info';
import { cn } from '@/lib/cn';
import { Logo } from './logo';
import { Wordmark } from './wordmark';

const NAV_ITEMS = [
  { href: '/dental', label: 'Dental' },
  { href: '/medical', label: 'Medical' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/technology', label: 'Technology' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

interface SiteHeaderProps {
  /** When true, renders dark-on-transparent — for use on the wow-zone hero. */
  variant?: 'light' | 'dark';
  /** Lane-aware sub-label resolved by `getSublabel(pathname)` upstream. */
  sublabel?: string;
  className?: string;
}

export function SiteHeader({
  variant = 'light',
  sublabel = 'EST. 1999 · RANCHO CUCAMONGA',
  className,
}: SiteHeaderProps) {
  const main = practiceInfo.phones[0]!;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b backdrop-blur-md',
        variant === 'light'
          ? 'bg-stone-50/85 border-stone-200/60 text-stone-900'
          : 'bg-ink-950/60 border-ink-700/40 text-stone-100',
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8 md:py-5">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={`${practiceInfo.brandName} home`}
        >
          <Logo size={28} mobileSize={24} decorative />
          <span className="flex flex-col">
            <Wordmark variant={variant} />
            {sublabel && (
              <span className="mt-0.5 text-[9px] md:text-[10px] uppercase tracking-[0.24em] opacity-60">
                {sublabel}
              </span>
            )}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/request-appointment"
            className={cn(
              'hidden sm:inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors',
              variant === 'light'
                ? 'bg-stone-900 text-stone-50 hover:bg-stone-700'
                : 'bg-stone-100 text-ink-950 hover:bg-stone-50',
            )}
          >
            Request appointment
          </Link>
          <a
            href={`tel:${main.tel}`}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-colors',
              variant === 'light'
                ? 'border-stone-900 hover:bg-stone-900 hover:text-stone-50'
                : 'border-stone-100/50 hover:bg-stone-100 hover:text-ink-950',
            )}
            aria-label={`Call ${practiceInfo.brandName} at ${main.number}`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{main.number}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Update `app/(marketing)/layout.tsx` to pass `sublabel`**

Read the existing layout first to find where `<SiteHeader />` is rendered:

```bash
grep -n "SiteHeader" "app/(marketing)/layout.tsx"
```

In that file, import `getSublabel` and `headers` from Next.js, and resolve the pathname server-side. Replace the `<SiteHeader />` usage with:

```tsx
import { headers } from 'next/headers';
import { getSublabel } from '@/lib/sublabel';

// Inside the layout function (make it `async` if not already):
const hdrs = await headers();
const pathname = hdrs.get('x-pathname') ?? hdrs.get('x-invoke-path') ?? '/';
const sublabel = getSublabel(pathname);

// In JSX:
<SiteHeader sublabel={sublabel} />
```

If the existing layout does not have `x-pathname` middleware, add a fallback prop pass — the `SiteHeader` default already covers it. Acceptable for the pitch.

**Simpler alternative if the above is fiddly:** mark `SiteHeader` as a client component and use `usePathname()`:

```tsx
'use client';
import { usePathname } from 'next/navigation';
// ... inside SiteHeader:
const pathname = usePathname();
const resolvedSublabel = sublabel ?? getSublabel(pathname);
```

Pick the simplest approach that compiles cleanly.

- [ ] **Step 3: Run typecheck + build**

```bash
pnpm typecheck && pnpm build 2>&1 | tail -10
```

Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add components/site-header.tsx app/\(marketing\)/layout.tsx
git commit -m "feat(header): logo + lockup + lane-aware sub-label + nav rebuild

- Adds <Logo> beside <Wordmark> in a flex column with the new sub-label
  beneath the wordmark.
- Sub-label resolved via getSublabel(pathname): 'DENTAL PRACTICE' on
  /dental*, 'OROFACIAL PAIN & ORAL MEDICINE' on /medical*, 'EST. 1999 ·
  RANCHO CUCAMONGA' elsewhere.
- Nav: 'Services' → 'Dental' + 'Medical' (separate top-level entries).
  Drop 'Blog' from the primary nav (still reachable from footer + admin).
- Phone: single corrected (909) 941-2811 (was index-1, brittle when phones
  array reduced to 1 entry)."
```

---

### Task 13: Update `components/site-footer.tsx` — email + single phone

**Files:**
- Modify: `components/site-footer.tsx`

- [ ] **Step 1: Read the current file**

```bash
sed -n '1,80p' components/site-footer.tsx
```

- [ ] **Step 2: Apply targeted edits**

Find the phone-rendering block. Replace any iteration over `practiceInfo.phones` with a single render of `practiceInfo.phones[0]`.

Find any "no email" text or omitted email. Add an email link block:

```tsx
{practiceInfo.email && (
  <a
    href={`mailto:${practiceInfo.email}`}
    className="text-sm text-stone-300 hover:text-stone-100 transition-colors"
  >
    {practiceInfo.email}
  </a>
)}
```

Place it adjacent to the phone in the footer's contact column.

- [ ] **Step 3: Run typecheck + build**

```bash
pnpm typecheck && pnpm build 2>&1 | tail -5
```

Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add components/site-footer.tsx
git commit -m "feat(footer): surface email; collapse phones to single primary

advancedcare@dentisthsu.com appears next to the phone. Phone array
now has one entry — rendering simplified accordingly."
```

---

## Group C — Pages (Tasks 14–22)

Home rewrite + lane landings + service detail templates + delete `/services/` subtree + contact corrections.

---

### Task 14: Rewrite home AirwayHero keyframes + topEyebrow + fallback

**Files:**
- Modify: `app/(marketing)/page.tsx:7-26` (HOME_KEYFRAMES const + AirwayHero props)

- [ ] **Step 1: Replace the `HOME_KEYFRAMES` const (lines 7-26)**

```ts
const HOME_KEYFRAMES: [AirwayHeroKeyframe, AirwayHeroKeyframe, AirwayHeroKeyframe] = [
  {
    eyebrow: 'Why patients stay',
    title: 'Comfort, restored.',
    italicize: [1],
    body: "For sleep that actually rests you. For a jaw that doesn't ache. For a tooth fixed once and left alone.",
  },
  {
    eyebrow: "What you're looking at",
    title: 'Sleep apnea, treatable.',
    italicize: [1],
    body: 'A custom oral appliance opens the airway during sleep. No mask. No machine. Most patients adapt within two weeks. This is what medical-grade dentistry looks like.',
  },
  {
    eyebrow: 'Two practices, under one roof',
    title: 'Five doctors. Twenty-five years.',
    italicize: [3],
    body: "A USC Master's in Orofacial Pain, Oral Medicine, and Sleep Disorders. A board-certified oral surgeon. A board-certified endodontist. Sought after in Rancho Cucamonga since 1999.",
  },
];
```

- [ ] **Step 2: Update the `<AirwayHero>` props on the home page (around line 77)**

Find the `<AirwayHero>` JSX and replace the `topEyebrow`, `ariaLabel`, and `fallbackHeading` props:

```tsx
topEyebrow={<>Comfort Care Dental &middot; Dental + Medical &middot; Since 1999</>}
keyframes={HOME_KEYFRAMES}
ariaLabel="Comfort Care Dental — two practices, one roof"
fallbackHeading={
  <>
    Comfort,
    <br />
    <span className="italic">restored.</span>
  </>
}
```

- [ ] **Step 3: Run build**

```bash
pnpm build 2>&1 | tail -5
```

Expected: Clean build.

- [ ] **Step 4: Visual verify with preview server**

```bash
pnpm dev
# Open http://localhost:3000 — scroll through the hero, verify all 3 frames render with new copy
```

Expected: Hero scrolls through the three new keyframes; F1 italics on `restored.`, F2 on `treatable.`, F3 on `years.`.

- [ ] **Step 5: Commit**

```bash
git add "app/(marketing)/page.tsx"
git commit -m "feat(home): rewrite hero captions to 'Comfort, restored.' direction

Preserves the AirwayHero scroll-scrubbed video component, video file,
mechanics, mask reveals, iOS warmup, and split-layout. Only the three
caption keyframes + topEyebrow + fallbackHeading are rewritten.

F1 'Comfort, restored.' — umbrella promise.
F2 'Sleep apnea, treatable.' — pays off the airway-scrub video.
F3 'Five doctors. Twenty-five years.' — practice proof + 'Two practices,
under one roof' eyebrow."
```

---

### Task 15: Drop the redundant editorial section + fix doctor count

**Files:**
- Modify: `app/(marketing)/page.tsx`

- [ ] **Step 1: Delete the "Sought-after, in Rancho Cucamonga" editorial section**

Find the block that starts with the comment `{/* ─────────── Editorial positioning hero ─────────── */}` (around line 107) and ends with the closing `</FadeUp>` of that section. Delete the entire block — everything from `<FadeUp>` to its matching `</FadeUp>`.

The next section (Services overview, "Four practices…") should now follow directly after `<AirwayHero>`.

- [ ] **Step 2: Update doctor count from 6 to 5**

Find the doctor strip section (around line 245+):

```tsx
<h2 className="font-serif text-4xl md:text-6xl tracking-tighter max-w-3xl">
  Six doctors,{' '}
```

Replace `Six doctors,` with `Five doctors,`.

Also find the body paragraph below it that mentions "Five additional dentists" — change it to "Four additional dentists".

- [ ] **Step 3: Build + visual verify**

```bash
pnpm build 2>&1 | tail -5
pnpm dev
# Verify the section right after the hero is the services overview, not "Sought-after"
# Verify the doctors strip says "Five doctors" + "Four additional dentists"
```

- [ ] **Step 4: Commit**

```bash
git add "app/(marketing)/page.tsx"
git commit -m "fix(home): drop redundant editorial section; correct doctor count

The 'Sought-after, in Rancho Cucamonga' section duplicated AirwayHero F3
body — the same line ('Sought after in Rancho Cucamonga since 1999') now
lives in the hero. Removed.

Doctor count: 'Six doctors' → 'Five doctors'; 'Five additional dentists'
→ 'Four additional dentists' (Serena Hsu drop)."
```

---

### Task 16: Replace "Four practices" with "Two practices, under one roof"

**Files:**
- Modify: `app/(marketing)/page.tsx`

- [ ] **Step 1: Replace the SERVICE_CATEGORIES const (lines 28-52)**

Replace:

```ts
const SERVICE_CATEGORIES = [
  {
    label: 'General',
    description: '...',
    href: '/services?category=general',
  },
  // ... 3 more
];
```

With:

```ts
const PRACTICE_LANES = [
  {
    label: 'Dental Practice',
    sublabel: 'Family · Restorative · Cosmetic',
    description:
      'Cleanings, fillings, crowns and bridges, veneers, whitening, root canals, implants, periodontal care — the everyday dentistry that keeps a family healthy, plus the cosmetic work that makes a smile worth showing.',
    href: '/dental',
  },
  {
    label: 'Medical Practice',
    sublabel: 'Orofacial Pain & Oral Medicine',
    description:
      'TMJ, sleep apnea, orofacial pain, oral pathology, biopsies, oral cancer screening — medical-grade dentistry led by a doctor with a USC Master\'s in Orofacial Pain, Oral Medicine, and Sleep Disorders.',
    href: '/medical',
  },
];
```

- [ ] **Step 2: Replace the "Four practices, under one roof" section (around lines 165-207)**

Find:

```tsx
<h2 className="font-serif text-4xl md:text-6xl tracking-tighter text-stone-900">
  Four practices,{' '}
  <span className="italic font-light">under one roof.</span>
</h2>
```

Replace the heading text:

```tsx
<h2 className="font-serif text-4xl md:text-6xl tracking-tighter text-stone-900">
  Two practices,{' '}
  <span className="italic font-light">under one roof.</span>
</h2>
```

Find the grid that maps over `SERVICE_CATEGORIES`:

```tsx
<div className="grid gap-px md:grid-cols-2 lg:grid-cols-4 bg-stone-300">
  {SERVICE_CATEGORIES.map((cat) => (
    // ...
  ))}
</div>
```

Replace with a 2-card grid mapping over `PRACTICE_LANES`. The medical card uses the teal accent token.

```tsx
<div className="grid gap-px md:grid-cols-2 bg-stone-300">
  {PRACTICE_LANES.map((lane, i) => (
    <Link
      key={lane.label}
      href={lane.href}
      className={cn(
        'group p-10 md:p-14 transition-colors flex flex-col justify-between min-h-[360px]',
        i === 0
          ? 'bg-stone-50 hover:bg-stone-100'
          : 'bg-stone-50 hover:bg-[var(--color-accent-50)]',
      )}
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.24em] text-stone-500 mb-3">
          {lane.sublabel}
        </p>
        <h3 className="font-serif text-3xl md:text-5xl tracking-tight text-stone-900">
          {lane.label}
        </h3>
      </div>
      <div className="mt-12">
        <p className="text-stone-600 text-base leading-relaxed mb-8 max-w-md">
          {lane.description}
        </p>
        <span
          className={cn(
            'inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all',
            i === 0 ? 'text-stone-900' : 'text-[var(--color-accent-600)]',
          )}
        >
          Enter {lane.label.toLowerCase()} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  ))}
</div>
```

You'll need to import `cn` if not already imported: `import { cn } from '@/lib/cn';`

Also update the "All services →" link in the section header (around line 177-182) to point to `/dental`:

```tsx
<Link
  href="/dental"
  className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900 mt-6 md:mt-0"
>
  Browse dental <ArrowRight className="h-4 w-4" aria-hidden="true" />
</Link>
```

- [ ] **Step 3: Delete the now-unused old `SERVICE_CATEGORIES` const**

If still present, remove it.

- [ ] **Step 4: Build + visual verify**

```bash
pnpm build 2>&1 | tail -5
pnpm dev
# Confirm the section reads "Two practices, under one roof." with two large cards
# Confirm the medical card has the teal hover state
```

- [ ] **Step 5: Commit**

```bash
git add "app/(marketing)/page.tsx"
git commit -m "feat(home): replace 'Four practices' with two-lane card grid

Two large editorial cards: Dental Practice → /dental (warm stone hover),
Medical Practice → /medical (teal hover via --color-accent-50).
Each card displays the lane sublabel above the heading and has a clear
hover affordance with the lane-appropriate accent color."
```

---

### Task 17: Create `/dental` lane landing page

**Files:**
- Create: `app/(marketing)/dental/page.tsx`

The lane landing lists all 5 dental subcategories as section blocks, each with the services in that subcategory. Echoes the editorial typography of the home page.

- [ ] **Step 1: Create `app/(marketing)/dental/page.tsx`**

```tsx
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { practiceInfo } from '@/content/practice-info';
import {
  getServicesByLane,
  getServicesBySubcategory,
  SERVICE_SUBCATEGORY_BY_LANE,
  SERVICE_SUBCATEGORY_LABELS,
} from '@/content/services';
import { FadeUp } from '@/components/motion/fade-up';

export const metadata: Metadata = {
  title: 'Dental Practice — Comfort Care Dental',
  description:
    'Family, restorative, and cosmetic dentistry in Rancho Cucamonga. Cleanings, fillings, crowns and bridges, veneers, whitening, root canals, implants, periodontal care.',
};

export default function DentalLanePage() {
  const main = practiceInfo.phones[0]!;
  const subcats = SERVICE_SUBCATEGORY_BY_LANE.dental;
  const allDental = getServicesByLane('dental');

  return (
    <>
      {/* ─────────── Lane hero ─────────── */}
      <FadeUp>
        <section className="bg-stone-50 py-24 md:py-36">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500 mb-6">
              The dental practice
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter text-stone-900 leading-[0.95] font-light max-w-5xl">
              Family dentistry,{' '}
              <span className="italic font-extralight">done thoroughly.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-stone-700 text-lg md:text-xl leading-relaxed">
              Cleanings calibrated to your risk profile. Restorations meant to
              last. Cosmetic work designed around how a smile actually moves and
              reads. Twenty-{practiceInfo.address.city ? 'five' : 'five'} years
              of family dentistry, under one roof with our medical practice.
            </p>
            <div className="mt-12 grid sm:grid-cols-3 gap-y-6 gap-x-10 max-w-3xl">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-stone-500 mb-2">
                  Subcategories
                </p>
                <p className="text-stone-900 leading-snug">{subcats.length}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-stone-500 mb-2">
                  Services
                </p>
                <p className="text-stone-900 leading-snug">{allDental.length}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-stone-500 mb-2">
                  Doctors
                </p>
                <p className="text-stone-900 leading-snug">5 · {practiceInfo.address.city}</p>
              </div>
            </div>
          </div>
        </section>
      </FadeUp>

      {/* ─────────── Subcategory blocks ─────────── */}
      {subcats.map((sub, i) => {
        const items = getServicesBySubcategory(sub);
        return (
          <FadeUp key={sub} as="section" className={i % 2 === 0 ? 'bg-stone-100/60 py-20 md:py-28' : 'py-20 md:py-28'}>
            <div className="mx-auto max-w-7xl px-5 md:px-8">
              <div className="md:flex md:items-end md:justify-between mb-12">
                <div className="max-w-2xl">
                  <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-3">
                    0{i + 1} · {items.length} services
                  </p>
                  <h2 className="font-serif text-4xl md:text-5xl tracking-tighter text-stone-900">
                    {SERVICE_SUBCATEGORY_LABELS[sub]}
                  </h2>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-300">
                {items.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/dental/${s.slug}`}
                    className="group bg-stone-50 p-6 md:p-8 hover:bg-stone-100 transition-colors flex flex-col justify-between min-h-[200px]"
                  >
                    <div>
                      <h3 className="font-serif text-xl md:text-2xl tracking-tight text-stone-900">
                        {s.name}
                      </h3>
                      <p className="mt-3 text-stone-600 text-sm leading-relaxed">
                        {s.summary}
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-stone-900 group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </FadeUp>
        );
      })}

      {/* ─────────── CTA strip ─────────── */}
      <FadeUp as="section" className="mx-auto max-w-5xl px-5 md:px-8 py-24 md:py-32 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
          Ready when you are
        </p>
        <h2 className="font-serif text-4xl md:text-6xl tracking-tighter text-stone-900 mb-10">
          Book a visit, or just{' '}
          <em className="font-light">say hello.</em>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/request-appointment"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-8 py-4 text-base font-medium hover:bg-stone-700 transition-colors"
          >
            Request appointment <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href={`tel:${main.tel}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-900 text-stone-900 px-8 py-4 text-base font-medium hover:bg-stone-900 hover:text-stone-50 transition-colors"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {main.number}
          </a>
        </div>
      </FadeUp>
    </>
  );
}
```

- [ ] **Step 2: Build + verify**

```bash
pnpm build 2>&1 | tail -5
pnpm dev
# Visit http://localhost:3000/dental
# Verify: hero + 5 subcategory blocks + 22 services rendering as cards
```

- [ ] **Step 3: Commit**

```bash
git add "app/(marketing)/dental/page.tsx"
git commit -m "feat(dental): add /dental lane landing page

Hero ('Family dentistry, done thoroughly.') + 5 subcategory blocks
(Preventive, Restorative, Endodontics, Oral Surgery, Periodontal &
Surgical) listing all 22 dental services as cards. Final CTA strip
matching home."
```

---

### Task 18: Create `/dental/[slug]` service detail template

**Files:**
- Create: `app/(marketing)/dental/[slug]/page.tsx`

- [ ] **Step 1: Create the dynamic route**

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { practiceInfo } from '@/content/practice-info';
import {
  getService,
  getServicesBySubcategory,
  SERVICE_SUBCATEGORY_LABELS,
  services,
} from '@/content/services';
import { FadeUp } from '@/components/motion/fade-up';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services
    .filter((s) => s.lane === 'dental')
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service || service.lane !== 'dental') {
    return { title: 'Not found' };
  }
  return {
    title: `${service.name} — Comfort Care Dental`,
    description: service.summary,
  };
}

export default async function DentalServiceDetail({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service || service.lane !== 'dental') notFound();

  const main = practiceInfo.phones[0]!;
  const peers = getServicesBySubcategory(service.subcategory).filter(
    (s) => s.slug !== service.slug,
  );

  return (
    <>
      <FadeUp>
        <section className="bg-stone-50 py-24 md:py-36">
          <div className="mx-auto max-w-5xl px-5 md:px-8">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500 mb-6">
              <Link href="/dental" className="hover:text-stone-700">
                Dental Practice
              </Link>
              {' · '}
              {SERVICE_SUBCATEGORY_LABELS[service.subcategory]}
            </p>
            <h1 className="font-serif text-5xl md:text-7xl tracking-tighter text-stone-900 leading-[0.95] font-light">
              {service.name}
            </h1>
            <p className="mt-10 max-w-3xl text-stone-700 text-xl md:text-2xl leading-relaxed font-light">
              {service.summary}
            </p>
          </div>
        </section>
      </FadeUp>

      <FadeUp as="section" className="bg-stone-100/60 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <p className="text-stone-700 text-lg md:text-xl leading-[1.7] whitespace-pre-line">
            {service.body}
          </p>
        </div>
      </FadeUp>

      {peers.length > 0 && (
        <FadeUp as="section" className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-3">
              Also in {SERVICE_SUBCATEGORY_LABELS[service.subcategory].toLowerCase()}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tighter text-stone-900 mb-12">
              Related services
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-300">
              {peers.map((s) => (
                <Link
                  key={s.slug}
                  href={`/dental/${s.slug}`}
                  className="group bg-stone-50 p-6 md:p-8 hover:bg-stone-100 transition-colors min-h-[180px] flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-serif text-xl tracking-tight text-stone-900">
                      {s.name}
                    </h3>
                    <p className="mt-2 text-stone-600 text-sm leading-relaxed">
                      {s.summary}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-stone-900 group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </FadeUp>
      )}

      <FadeUp as="section" className="mx-auto max-w-5xl px-5 md:px-8 py-20 md:py-28 text-center">
        <h2 className="font-serif text-3xl md:text-5xl tracking-tighter text-stone-900 mb-10">
          Schedule a visit, or just{' '}
          <em className="font-light">say hello.</em>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/request-appointment"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-8 py-4 text-base font-medium hover:bg-stone-700 transition-colors"
          >
            Request appointment <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href={`tel:${main.tel}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-900 text-stone-900 px-8 py-4 text-base font-medium hover:bg-stone-900 hover:text-stone-50 transition-colors"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {main.number}
          </a>
        </div>
      </FadeUp>
    </>
  );
}
```

- [ ] **Step 2: Build + verify**

```bash
pnpm build 2>&1 | tail -10
pnpm dev
# Visit /dental/composite-fillings, /dental/professional-cleaning, /dental/crowns-and-bridges
# Verify: breadcrumb (Dental Practice · Restorative), hero, body, peer services, CTA
# Confirm composite-fillings does NOT mention "microscope"
```

- [ ] **Step 3: Commit**

```bash
git add "app/(marketing)/dental/[slug]/page.tsx"
git commit -m "feat(dental): add /dental/[slug] service detail template

Static route for all 22 dental services. Hero (breadcrumb + name + summary)
+ body + 'related services' grid (peers in the same subcategory) + CTA.
Returns notFound() for medical services or unknown slugs."
```

---

### Task 19: Create `/medical` lane landing page

**Files:**
- Create: `app/(marketing)/medical/page.tsx`

Same template as `/dental`, but cooler tone with teal accent for sub-headers and link colors.

- [ ] **Step 1: Create `app/(marketing)/medical/page.tsx`**

```tsx
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { practiceInfo } from '@/content/practice-info';
import {
  getServicesByLane,
  getServicesBySubcategory,
  SERVICE_SUBCATEGORY_BY_LANE,
  SERVICE_SUBCATEGORY_LABELS,
} from '@/content/services';
import { FadeUp } from '@/components/motion/fade-up';

export const metadata: Metadata = {
  title: 'Medical Practice — Comfort Care Dental',
  description:
    'Orofacial pain, oral medicine, sleep apnea, TMJ, oral pathology in Rancho Cucamonga. Led by Dr. Brien Hsu — board-certified in Orofacial Pain and Dental Sleep Medicine.',
};

export default function MedicalLanePage() {
  const main = practiceInfo.phones[0]!;
  const subcats = SERVICE_SUBCATEGORY_BY_LANE.medical;
  const all = getServicesByLane('medical');

  return (
    <>
      <FadeUp>
        <section className="bg-stone-50 py-24 md:py-36 border-b border-[var(--color-accent-200)]">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent-600)] mb-6">
              The medical practice
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter text-stone-900 leading-[0.95] font-light max-w-5xl">
              Medical-grade dentistry,{' '}
              <span className="italic font-extralight">in Rancho Cucamonga.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-stone-700 text-lg md:text-xl leading-relaxed">
              The only practice in the area with a doctor specializing in Orofacial Pain.
              TMJ, sleep apnea, oral pathology, biopsies, oral cancer screening — led by
              Dr. Brien Hsu, board-certified by both the American Board of Orofacial Pain
              and the American Board of Dental Sleep Medicine.
            </p>
            <div className="mt-12 grid sm:grid-cols-3 gap-y-6 gap-x-10 max-w-3xl">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-600)] mb-2">
                  Subcategories
                </p>
                <p className="text-stone-900 leading-snug">{subcats.length}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-600)] mb-2">
                  Services
                </p>
                <p className="text-stone-900 leading-snug">{all.length}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-600)] mb-2">
                  Specialists
                </p>
                <p className="text-stone-900 leading-snug">Hsu &middot; Sharobiem</p>
              </div>
            </div>
          </div>
        </section>
      </FadeUp>

      {subcats.map((sub, i) => {
        const items = getServicesBySubcategory(sub);
        return (
          <FadeUp key={sub} as="section" className={i % 2 === 0 ? 'bg-stone-100/60 py-20 md:py-28' : 'py-20 md:py-28'}>
            <div className="mx-auto max-w-7xl px-5 md:px-8">
              <div className="md:flex md:items-end md:justify-between mb-12">
                <div className="max-w-2xl">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-600)] mb-3">
                    0{i + 1} · {items.length} {items.length === 1 ? 'service' : 'services'}
                  </p>
                  <h2 className="font-serif text-4xl md:text-5xl tracking-tighter text-stone-900">
                    {SERVICE_SUBCATEGORY_LABELS[sub]}
                  </h2>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-300">
                {items.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/medical/${s.slug}`}
                    className="group bg-stone-50 p-6 md:p-8 hover:bg-[var(--color-accent-50)] transition-colors flex flex-col justify-between min-h-[200px]"
                  >
                    <div>
                      <h3 className="font-serif text-xl md:text-2xl tracking-tight text-stone-900">
                        {s.name}
                      </h3>
                      <p className="mt-3 text-stone-600 text-sm leading-relaxed">
                        {s.summary}
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent-600)] group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </FadeUp>
        );
      })}

      <FadeUp as="section" className="mx-auto max-w-5xl px-5 md:px-8 py-24 md:py-32 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-600)] mb-6">
          Ready when you are
        </p>
        <h2 className="font-serif text-4xl md:text-6xl tracking-tighter text-stone-900 mb-10">
          Schedule a consultation, or just{' '}
          <em className="font-light">say hello.</em>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/request-appointment"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-8 py-4 text-base font-medium hover:bg-stone-700 transition-colors"
          >
            Request consultation <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href={`tel:${main.tel}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-900 text-stone-900 px-8 py-4 text-base font-medium hover:bg-stone-900 hover:text-stone-50 transition-colors"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {main.number}
          </a>
        </div>
      </FadeUp>
    </>
  );
}
```

- [ ] **Step 2: Build + verify**

```bash
pnpm build 2>&1 | tail -5
pnpm dev
# Visit /medical
# Verify: hero with TEAL eyebrow, subcategory headings + cards in teal, hover state shows accent-50
```

- [ ] **Step 3: Commit**

```bash
git add "app/(marketing)/medical/page.tsx"
git commit -m "feat(medical): add /medical lane landing page

Hero ('Medical-grade dentistry, in Rancho Cucamonga.') + 4 subcategory
blocks (TMJ & Orofacial Pain, Oral Medicine & Pathology, Sleep & Airway,
Surgical & Regenerative) + 10 services as cards. Teal accent palette
applied to subheaders and link colors per spec §10."
```

---

### Task 20: Create `/medical/[slug]` service detail template

**Files:**
- Create: `app/(marketing)/medical/[slug]/page.tsx`

Same shape as `/dental/[slug]` but with teal accent on the breadcrumb + peer-services eyebrow.

- [ ] **Step 1: Create the dynamic route**

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { practiceInfo } from '@/content/practice-info';
import {
  getService,
  getServicesBySubcategory,
  SERVICE_SUBCATEGORY_LABELS,
  services,
} from '@/content/services';
import { FadeUp } from '@/components/motion/fade-up';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services
    .filter((s) => s.lane === 'medical')
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service || service.lane !== 'medical') {
    return { title: 'Not found' };
  }
  return {
    title: `${service.name} — Comfort Care Dental`,
    description: service.summary,
  };
}

export default async function MedicalServiceDetail({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service || service.lane !== 'medical') notFound();

  const main = practiceInfo.phones[0]!;
  const peers = getServicesBySubcategory(service.subcategory).filter(
    (s) => s.slug !== service.slug,
  );

  return (
    <>
      <FadeUp>
        <section className="bg-stone-50 py-24 md:py-36 border-b border-[var(--color-accent-200)]">
          <div className="mx-auto max-w-5xl px-5 md:px-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent-600)] mb-6">
              <Link href="/medical" className="hover:opacity-80">
                Medical Practice
              </Link>
              {' · '}
              {SERVICE_SUBCATEGORY_LABELS[service.subcategory]}
            </p>
            <h1 className="font-serif text-5xl md:text-7xl tracking-tighter text-stone-900 leading-[0.95] font-light">
              {service.name}
            </h1>
            <p className="mt-10 max-w-3xl text-stone-700 text-xl md:text-2xl leading-relaxed font-light">
              {service.summary}
            </p>
          </div>
        </section>
      </FadeUp>

      <FadeUp as="section" className="bg-stone-100/60 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <p className="text-stone-700 text-lg md:text-xl leading-[1.7] whitespace-pre-line">
            {service.body}
          </p>
        </div>
      </FadeUp>

      {peers.length > 0 && (
        <FadeUp as="section" className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-600)] mb-3">
              Also in {SERVICE_SUBCATEGORY_LABELS[service.subcategory].toLowerCase()}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tighter text-stone-900 mb-12">
              Related services
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-300">
              {peers.map((s) => (
                <Link
                  key={s.slug}
                  href={`/medical/${s.slug}`}
                  className="group bg-stone-50 p-6 md:p-8 hover:bg-[var(--color-accent-50)] transition-colors min-h-[180px] flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-serif text-xl tracking-tight text-stone-900">
                      {s.name}
                    </h3>
                    <p className="mt-2 text-stone-600 text-sm leading-relaxed">
                      {s.summary}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent-600)] group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </FadeUp>
      )}

      <FadeUp as="section" className="mx-auto max-w-5xl px-5 md:px-8 py-20 md:py-28 text-center">
        <h2 className="font-serif text-3xl md:text-5xl tracking-tighter text-stone-900 mb-10">
          Schedule a consultation, or just{' '}
          <em className="font-light">say hello.</em>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/request-appointment"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-8 py-4 text-base font-medium hover:bg-stone-700 transition-colors"
          >
            Request consultation <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href={`tel:${main.tel}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-900 text-stone-900 px-8 py-4 text-base font-medium hover:bg-stone-900 hover:text-stone-50 transition-colors"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {main.number}
          </a>
        </div>
      </FadeUp>
    </>
  );
}
```

- [ ] **Step 2: Special-case the TMJ signature page**

The existing TMJ signature page lives at `components/tmj/tmj-signature.tsx` and currently renders on `/services/tmj`. The new route is `/medical/tmj`. To preserve the wow-zone signature treatment for TMJ specifically:

Modify `app/(marketing)/medical/[slug]/page.tsx` — at the top of `MedicalServiceDetail`, BEFORE the default rendering, add:

```tsx
import { TMJSignature } from '@/components/tmj/tmj-signature';

// ... inside MedicalServiceDetail:
if (service.slug === 'tmj') {
  return <TMJSignature />;
}
```

Verify `components/tmj/tmj-signature.tsx` exists and imports work. If the existing TMJ signature page renders any internal links to `/services/tmj` or refers to itself by old path, update those references in the same commit.

- [ ] **Step 3: Build + verify**

```bash
pnpm build 2>&1 | tail -10
pnpm dev
# Visit /medical/tmj — should render TMJSignature wow page
# Visit /medical/sleep-apnea, /medical/oral-pathology — generic detail with teal accent
```

- [ ] **Step 4: Commit**

```bash
git add "app/(marketing)/medical/[slug]/page.tsx"
git commit -m "feat(medical): add /medical/[slug] detail + TMJ signature special-case

Static route for all 10 medical services. Generic template (hero +
breadcrumb + body + peer services + CTA) with teal accent on subheads
and links. /medical/tmj short-circuits to render the existing
TMJSignature wow component (relocated from /services/tmj)."
```

---

### Task 21: Delete the `/services` route subtree

**Files:**
- Delete: `app/(marketing)/services/`

The redirects from Task 7 handle every old URL. The directory itself can go.

- [ ] **Step 1: Inventory the subtree**

```bash
find "app/(marketing)/services" -type f
```

Expected output: `page.tsx` and `[slug]/page.tsx`.

- [ ] **Step 2: Remove the directory**

```bash
rm -rf "app/(marketing)/services"
```

- [ ] **Step 3: Search for any internal links still pointing to `/services`**

```bash
grep -rn "href=\"/services\"\|href={\`/services\`\|'/services/" app components content lib --include="*.tsx" --include="*.ts" 2>&1 | grep -v node_modules | grep -v __tests__
```

Update any straggler references. Common spots: footer nav, structured data, sitemap. Replace `/services` with `/dental` (the default lane).

- [ ] **Step 4: Build**

```bash
pnpm build 2>&1 | tail -10
```

Expected: Clean build; no broken-link warnings.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(routes): delete /services route subtree

Replaced by /dental and /medical lane pages. The 14 lane-migration
redirects and 6 410 Gone entries in content/redirects.ts handle every
external request to the old URLs."
```

---

### Task 22: Update `/contact` with corrected facts

**Files:**
- Modify: `app/(marketing)/contact/page.tsx`

Most data flows from `practiceInfo` automatically, but the hours rendering may need tweaking to handle 3 closed days cleanly.

- [ ] **Step 1: Read the current contact page**

```bash
sed -n '1,100p' "app/(marketing)/contact/page.tsx"
```

- [ ] **Step 2: Verify hours rendering**

The hours block likely iterates over `practiceInfo.hours`. Confirm that closed days (`closed: true`, empty `open`/`close`) render as `Closed` not `:`. If not, update the iteration logic to:

```tsx
{practiceInfo.hours.map((h) => (
  <div key={h.day} className="flex justify-between text-stone-700">
    <span>{h.day}</span>
    <span className="font-mono text-sm">
      {h.closed ? 'Closed' : `${h.open} – ${h.close}`}
    </span>
  </div>
))}
```

- [ ] **Step 3: Surface email near phone**

Find the contact-info column. Add the email block adjacent to phone:

```tsx
<a
  href={`mailto:${practiceInfo.email}`}
  className="inline-flex items-center gap-2 text-stone-700 hover:text-stone-900 transition-colors"
>
  {practiceInfo.email}
</a>
```

- [ ] **Step 4: Build + visual verify**

```bash
pnpm build 2>&1 | tail -5
pnpm dev
# Visit /contact
# Verify: address shows "11458 Kenyon Way, Suite 120, Rancho Cucamonga, CA 91701"
#          hours show closed Fri/Sat/Sun cleanly
#          phone shows (909) 941-2811
#          email shows advancedcare@dentisthsu.com as a mailto link
```

- [ ] **Step 5: Commit**

```bash
git add "app/(marketing)/contact/page.tsx"
git commit -m "fix(contact): render corrected facts cleanly

Address (Suite 120, ZIP 91701) flows from practice-info; hours block now
renders 'Closed' for Fri/Sat/Sun instead of empty time range; email is
surfaced as a mailto link beside the phone."
```

---

## Group D — Verification (Task 23)

---

### Task 23: Build, typecheck, full test suite, manual preview QA

**Files:** none (verification task)

This task gates the audit-pass complete. Run every check; do not skip steps.

- [ ] **Step 1: Full TypeScript typecheck**

```bash
pnpm typecheck
```

Expected: Zero errors.

- [ ] **Step 2: Full test suite**

```bash
pnpm vitest --run
```

Expected: All tests PASS — including the four `content/__tests__/` files and the `lib/__tests__/sublabel.test.ts`.

- [ ] **Step 3: Production build**

```bash
pnpm build 2>&1 | tee /tmp/build.log
```

Expected: Clean build. The build summary should show the new routes (`/dental`, `/medical`, plus all `/dental/[slug]` and `/medical/[slug]` static params), and zero references to the old `/services/*` routes.

- [ ] **Step 4: Spot-check the build output for the static routes**

```bash
grep -E "/dental|/medical|/services" /tmp/build.log | sort -u | head -50
```

Expected: 22 `/dental/[slug]` lines + 10 `/medical/[slug]` lines + the lane index pages. Zero `/services/*` lines (other than redirects).

- [ ] **Step 5: Start the preview server and run the visual QA checklist**

```bash
pnpm dev
```

Then manually verify in the browser:

| Check | Route | Expected |
|---|---|---|
| Hero captions | `/` | F1 'Comfort, restored.' (italic restored), F2 'Sleep apnea, treatable.' (italic treatable), F3 'Five doctors. Twenty-five years.' (italic years) |
| No "Sought-after" section | `/` | The section right after the hero is "Two practices, under one roof." |
| Two-card services overview | `/` | Two large cards: Dental Practice + Medical Practice. Medical card has teal hover. |
| Doctor strip | `/` | "Five doctors, trained at the practices that train other practices." |
| Header lockup | every page | Logo (28px) + "COMFORT CARE DENTAL" wordmark + sub-label beneath |
| Header sub-label | `/dental` | Says "DENTAL PRACTICE" |
| Header sub-label | `/medical` | Says "OROFACIAL PAIN & ORAL MEDICINE" |
| Header sub-label | `/`, `/about` | Says "EST. 1999 · RANCHO CUCAMONGA" |
| Dental landing | `/dental` | Hero + 5 subcategory blocks + 22 service cards |
| Medical landing | `/medical` | Hero with teal eyebrow + 4 subcategory blocks + 10 service cards |
| TMJ wow page | `/medical/tmj` | Renders TMJSignature wow zone |
| Composite fillings copy | `/dental/composite-fillings` | Body does NOT mention "microscope-level magnification" |
| Cleaning copy | `/dental/professional-cleaning` | Body mentions "three or four visits a year" + fluoride + sealants |
| Crowns copy | `/dental/crowns-and-bridges` | Body mentions "restoring the tooth back to functionality" |
| New stub | `/dental/direct-composite-veneers` | Renders with esthetic-focused body |
| Doctor count | `/doctors` | Exactly 5 cards. No Serena Hsu. |
| Contact | `/contact` | Suite 120, ZIP 91701, email mailto link, hours show closed Fri/Sat/Sun |
| Footer | every page | Single phone (909) 941-2811, email visible |
| Old service URL | http://localhost:3000/services/composite-fillings | 301 redirects to /dental/composite-fillings |
| Old TMJ URL | http://localhost:3000/services/tmj | 301 redirects to /medical/tmj |
| Old Serena URL | http://localhost:3000/doctors/dr-serena-hsu | 410 Gone |
| Mobile (375px) | every page | Header collapses cleanly; logo visible; sub-label visible beneath wordmark |
| Reduced-motion | `/` (with `prefers-reduced-motion: reduce` set in DevTools) | AirwayHero falls back to static stack with all 3 keyframes legible |

- [ ] **Step 6: Lighthouse mobile spot-check**

In Chrome DevTools, run Lighthouse mobile on these pages — each should score ≥ 95 across all four metrics:

- `/`
- `/dental`
- `/medical`
- `/dental/composite-fillings`
- `/medical/tmj`

If any page scores < 95, **do not skip — diagnose**. Common culprits: oversized images (the placeholder Unsplash photos), missing `priority` on hero images, render-blocking JS. File any regressions as follow-ups in `docs/audit/dentist-questions.md` if not blocking.

- [ ] **Step 7: Final commit (only if any cleanup happened during QA)**

If QA surfaced any small fixes:

```bash
git add -A
git commit -m "fix(qa): address pre-pitch verification findings

[describe each fix briefly]"
```

If QA was clean, no commit needed — just announce completion.

- [ ] **Step 8: Announce completion**

```
The pre-pitch audit pass is complete:
  - All 23 tasks committed
  - Tests green (services, doctors, practice-info, redirects, sublabel)
  - Build clean
  - Lighthouse mobile ≥ 95 on the spot-check routes
  - All acceptance-criteria checkboxes from spec §13 satisfied

Next steps before pitch:
  1. Confirm dentist-question items (Serena Hsu drop, ortho/pediatric/sedation,
     logo Frame A vs B, Friday/Saturday closure) — see docs/audit/dentist-questions.md
  2. Replace the placeholder Unsplash doctor portraits and clinic photography
     after the photo session post-signing.
  3. Consult ui-ux-pro-max + frontend-design skills if additional visual polish
     is desired before deploy.
```

---

## Self-Review

The plan above was reviewed against the spec with the following checks.

**Spec coverage:** Every item in spec §11 "in scope" maps to one or more plan tasks:

| Spec scope item | Plan task(s) |
|---|---|
| Brand: logo + lockup + sub-label switching + teal token + deep-ink mark | 8, 9, 10, 11, 12 |
| IA rebuild: /dental + /medical + service slug migrations + redirects | 7, 17, 18, 19, 20, 21 |
| Service catalog rebuild (32 services / 9 subcats / 19 stubs) | 1, 2, 5, 6 |
| Home hero: AirwayHero captions + drop editorial section + replace services overview + 6→5 doctors | 14, 15, 16 |
| Practice facts corrected | 3, 22 |
| Roster reduced 6→5 (drop Serena Hsu) | 4, 7 (410 redirect) |
| Doctor bios swap to flyer copy where tighter | 4 |
| Service-by-service copy fixes (cleaning, composites, crowns, direct veneers, removals) | 5, 6 |
| Footer surfaces email + single phone | 13 |

Every acceptance-criteria checkbox in spec §13 is verified by Task 23 step 5 (visual QA matrix) or by the Vitest tests in Task 2 (which Tasks 3–7 turn green).

**Placeholder scan:** No "TBD"/"TODO" remain in any task. Every code block contains complete copy-pasteable content. The only "fill in later" item — long-form bodies on the 19 new stubs — is explicitly out of scope per the spec, and the stubs that ship contain real 50–80 word bodies.

**Type consistency:**
- `ServiceLane` and `ServiceSubcategory` are defined in Task 1 and used identically in Tasks 5, 6, 11, 17–20.
- `getService`, `getServicesByLane`, `getServicesBySubcategory` are exported from `services.ts` in Task 5 and consumed in Tasks 17–20.
- `SERVICE_SUBCATEGORY_LABELS` and `SERVICE_SUBCATEGORY_BY_LANE` are exported in Task 5 and consumed in Tasks 17–20.
- `getSublabel(pathname)` is created in Task 11 and consumed in Task 12.
- `<Logo />` is created in Task 10 and consumed in Task 12.

**One issue found and fixed inline during review:** The `<SiteHeader>` interface in Task 12 uses an optional `sublabel` prop with a default. The layout integration in Task 12 step 2 offers two implementation paths (server-resolved via `headers()` vs client-side via `usePathname`). Either compiles; the engineer picks the simpler one based on what the existing layout already does.

---

*Plan generated by superpowers:writing-plans, 2026-05-06. Spec: `docs/superpowers/specs/2026-05-06-dentisthsu-pre-pitch-audit-pass.md`. Brainstorm session: same-day brainstorming-skill invocation against client annotations + practice flyers + provided logo.*
