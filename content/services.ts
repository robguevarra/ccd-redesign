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
    body: 'Used for frenectomies, gingivectomies, peri-implantitis decontamination, and biostimulation of surgical sites. The laser cauterizes as it cuts — minimal bleeding, faster healing, less post-operative discomfort than traditional scalpel approaches. Particularly effective for pediatric and anxious patients, and for cases where bleeding control matters more than visibility through a magnification lens.',
  },

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
    body: 'Conventional dentures are made after the gums heal (4–6 weeks of being without teeth). Immediate dentures are made in advance and placed the same day as extractions. We adjust them as the tissues remodel over the following months. Implant-retained overdentures are also available for patients who want greater stability.',
  },
  {
    slug: 'teeth-whitening',
    name: 'Teeth Whitening',
    lane: 'dental',
    subcategory: 'restorative',
    summary:
      'In-office and at-home whitening, including deep-bleaching for stubborn cases.',
    body: 'Most over-the-counter whitening underperforms because it does not address tooth permeability. Our deep-bleaching protocol — alternating in-office and supervised at-home phases — works on cases other approaches cannot move. Results are stable with a brief annual touch-up, and the process is closely supervised to avoid sensitivity.',
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
    body: "When a previous root canal has failed and orthograde retreatment isn't feasible, an apicoectomy removes the root tip and seals the canal from below. Performed under microscope-level magnification by Dr. Lim. Saves teeth that would otherwise require extraction, particularly for molars where re-entry through the existing crown is impractical.",
  },
  {
    slug: 'root-canal-retreatment',
    name: 'Root Canal Retreatment',
    lane: 'dental',
    subcategory: 'endodontics',
    summary:
      'Re-entry of a previously root-canalled tooth to address residual infection or technical issues.',
    body: "Sometimes a root canal needs to be redone — the original treatment didn't fully resolve, the seal compromised, or new decay reached the canal. Retreatment removes the prior filling material and re-cleans the canal system. More involved than first-time RCT, with high success rates when the indication is right and the tooth is still restorable.",
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
    body: 'A titanium implant replaces the root of a missing tooth, supporting a crown, bridge, or denture. We plan placement using our CBCT scanner for precise positioning around nerves and sinuses. Most patients are candidates after a graft if needed. Surgical phase is in-office; restoration follows after osseointegration over three to four months.',
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
    body: 'Periodontitis affects half of US adults over 30 and is one of the most under-diagnosed dental conditions. We screen at every cleaning and treat actively when we find it: scaling and root planing, laser-assisted decontamination, and ongoing periodontal maintenance visits calibrated to your risk profile.',
  },
  {
    slug: 'crown-lengthening',
    name: 'Crown Lengthening',
    lane: 'dental',
    subcategory: 'periodontal-surgical',
    summary:
      'Surgical exposure of additional tooth structure for restorative or cosmetic reasons.',
    body: 'When a tooth is broken near the gumline or a smile shows excessive gum, crown lengthening reshapes the tissue (and sometimes bone) to expose more enamel. Restorative crown lengthening saves teeth that would otherwise be unrestorable; cosmetic crown lengthening evens out a smile that shows too much gum tissue when you laugh.',
  },
  {
    slug: 'gingivectomy',
    name: 'Gingivectomy',
    lane: 'dental',
    subcategory: 'periodontal-surgical',
    summary:
      'Soft-tissue contouring for periodontal pockets, hyperplasia, or cosmetic shaping.',
    body: 'A gingivectomy removes excess or diseased gum tissue. Indications include drug-induced hyperplasia, persistent pockets after scaling, and cosmetic asymmetry. Performed with a diode laser in most cases — minimal bleeding, faster healing, less discomfort than traditional scalpel approaches, and ideal for patients with anxiety.',
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
    body: 'Often performed at the same visit as extractions — particularly multiple extractions — to smooth the bone and prepare the ridge for a denture or implant. Reduces post-extraction discomfort and improves prosthesis fit. Patients with full-arch extractions especially benefit from immediate alveoloplasty before tissue heals.',
  },
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
