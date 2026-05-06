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
