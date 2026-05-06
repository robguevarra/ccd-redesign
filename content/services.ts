import type { Service, ServiceCategory } from './schemas';

/**
 * Curated service catalog. Source: master spec §4 service taxonomy +
 * scraped service pages in `source/pages/`.
 *
 * Body content here is intentionally short for the pitch (1–2 paragraphs).
 * Full long-form MDX bodies are written in P4 or v2.
 */

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  general: 'General Dentistry',
  cosmetic: 'Cosmetic',
  specialty: 'Specialty',
  orthodontics: 'Orthodontics',
};

export const SERVICE_CATEGORY_DESCRIPTIONS: Record<ServiceCategory, string> = {
  general:
    'Routine and restorative dentistry — the work that keeps the mouth healthy and the smile intact.',
  cosmetic:
    'Considered changes to color, shape, and proportion. Designed around how a smile actually moves and reads in conversation.',
  specialty:
    'Complex cases that most general practices refer out: TMJ, sleep apnea, oral pathology, orofacial pain. Twenty-five years of experience handling these in-house.',
  orthodontics:
    'Bite correction for teens and adults. Traditional and removable approaches.',
};

export const services: Service[] = [
  // ─────── General Dentistry (12) ───────
  {
    slug: 'cleaning',
    name: 'Professional Cleaning',
    category: 'general',
    summary:
      'Bi-annual hygiene visits done thoroughly — the foundation everything else rests on.',
    body: 'Periodic professional cleanings remove plaque and tartar that brushing alone cannot reach. We pair them with oral cancer screening and a periodontal probe so we catch issues before they become expensive.',
  },
  {
    slug: 'composite-fillings',
    name: 'Composite Fillings',
    category: 'general',
    summary:
      'Tooth-colored composite restorations placed under microscope-level magnification.',
    body: 'Modern composites bond to the tooth and reinforce it. Done well, they last a decade or more. We place them with rubber dam isolation and surgical-grade magnification — the difference between a 5-year filling and a 15-year one.',
  },
  {
    slug: 'amalgam-fillings',
    name: 'Amalgam Fillings',
    category: 'general',
    summary:
      'Traditional silver fillings — still appropriate for some clinical situations.',
    body: 'We do not place new amalgam fillings as a default, but they remain the right answer in specific cases (very large restorations under heavy load, certain pediatric situations). Existing amalgams are not automatically replaced — we only intervene when there is a clinical reason.',
  },
  {
    slug: 'crowns-caps',
    name: 'Crowns & Caps',
    category: 'general',
    summary:
      'Full-coverage restorations for teeth that need protection beyond a filling.',
    body: 'Crowns are designed and fitted using our 3Shape Trios digital scanner — no traditional impression trays, faster turnaround, more accurate fit. Materials include porcelain-fused-to-metal, full zirconia, and lithium disilicate depending on location and load.',
  },
  {
    slug: 'fixed-bridges',
    name: 'Fixed Bridges',
    category: 'general',
    summary:
      'Permanent multi-tooth restorations for replacing missing teeth between healthy abutments.',
    body: 'A fixed bridge replaces one or more missing teeth using the adjacent teeth as anchors. Designed digitally, milled to fit, and bonded permanently in place. Often a faster and less invasive alternative to implants.',
  },
  {
    slug: 'dentures',
    name: 'Dentures & Partial Dentures',
    category: 'general',
    summary: 'Full and partial removable prosthetics, including immediate dentures.',
    body: 'Conventional dentures are made after the gums heal (4–6 weeks of being without teeth). Immediate dentures are made in advance and placed the same day as extractions. We adjust them as the tissues remodel.',
  },
  {
    slug: 'root-canal-therapy',
    name: 'Root Canal Therapy',
    category: 'general',
    summary:
      'Endodontic treatment to save teeth that would otherwise need extraction.',
    body: 'Modern root canals, performed under microscope-level magnification, are not the painful procedure they were a generation ago. Most patients describe them as comparable to having a filling done. We complete most cases in a single visit.',
  },
  {
    slug: 'oral-hygiene',
    name: 'Oral Hygiene',
    category: 'general',
    summary:
      'Personalized education and at-home care plans for patients with specific risk factors.',
    body: 'Beyond the cleaning itself, we teach you what to do between visits — adapted to whether you have crowns, bridges, implants, orthodontics, or a higher-than-average decay risk. The goal is fewer interventions over time, not more.',
  },
  {
    slug: 'tooth-extractions',
    name: 'Tooth Extractions',
    category: 'general',
    summary:
      'Surgical and non-surgical extractions, performed in-house using CBCT planning.',
    body: 'Most extractions, including complex cases involving impacted teeth, can be done in our office without referral. CBCT scanning before extraction gives us the spatial information needed to avoid surprises.',
  },
  {
    slug: 'sedation-dentistry',
    name: 'Sedation Dentistry',
    category: 'general',
    summary:
      'Oral and IV sedation for patients with dental anxiety or extensive treatment needs.',
    body: 'Sedation is a tool, not a default. For patients who avoid the dentist due to anxiety, or for treatment that would otherwise require multiple visits, sedation lets us do more in less time and with no recall of the procedure.',
  },
  {
    slug: 'children-oral-healthcare',
    name: "Children's Oral Healthcare",
    category: 'general',
    summary:
      'Pediatric dentistry that builds positive associations early — and avoids unnecessary treatment.',
    body: 'We see children from age one onward. Most early visits are about normalizing the chair, not treatment. When intervention is needed (sealants, fluoride, occasionally fillings), we choose the most conservative approach.',
  },
  {
    slug: 'periodontal-treatment',
    name: 'Periodontal Treatment',
    category: 'general',
    summary:
      'Active treatment of gum disease — including laser-assisted therapy where indicated.',
    body: 'Periodontitis affects half of US adults over 30 and is one of the most under-diagnosed dental conditions. We screen at every cleaning and treat actively when we find it: scaling and root planing, laser-assisted decontamination, and ongoing maintenance.',
  },

  // ─────── Cosmetic (2) ───────
  {
    slug: 'porcelain-veneers',
    name: 'Porcelain Veneers',
    category: 'cosmetic',
    summary:
      'Custom-shaped porcelain shells that change a smile without changing the underlying teeth.',
    body: 'Veneers are a meaningful commitment — they are also one of the most rewarding cosmetic procedures in dentistry when done well. We design every case digitally first, mock it up in your mouth, and only proceed once the proportions and color are right.',
  },
  {
    slug: 'teeth-whitening',
    name: 'Teeth Whitening',
    category: 'cosmetic',
    summary:
      'In-office and at-home whitening, including deep-bleaching for stubborn cases.',
    body: 'Most over-the-counter whitening underperforms because it does not address tooth permeability. Our deep-bleaching protocol — alternating in-office and supervised at-home phases — works on cases other approaches cannot move.',
  },

  // ─────── Specialty (4) ───────
  {
    slug: 'tmj',
    name: 'TMJ Treatment',
    category: 'specialty',
    summary:
      'Comprehensive evaluation and treatment for temporomandibular joint disorders. Most cases are managed without surgery.',
    signature: true,
    technologyRefs: ['cbct'],
    body: "TMJ symptoms — jaw pain, clicking, headaches, ear pressure, limited opening — are often misdiagnosed for years before someone connects them to bite mechanics. We use CBCT imaging to see the joint in three dimensions, and we design splint therapy and bite-equilibration protocols tailored to the specific dysfunction. Surgery is a last resort.",
  },
  {
    slug: 'sleep-apnea',
    name: 'Sleep Apnea Treatment',
    category: 'specialty',
    summary:
      'Oral appliance therapy as an alternative to CPAP for mild to moderate obstructive sleep apnea.',
    signature: true,
    body: 'Many patients diagnosed with OSA cannot tolerate CPAP. A custom-fitted oral appliance, designed to advance the lower jaw during sleep, opens the airway and is well-tolerated by most. We coordinate with your sleep physician.',
  },
  {
    slug: 'oral-pathology',
    name: 'Oral Pathology',
    category: 'specialty',
    summary:
      'Diagnosis and biopsy of oral lesions — both routine and concerning.',
    body: 'Most oral lesions are benign but every one is worth identifying. We screen at every cleaning, and we biopsy and pathology-track any lesion that warrants it.',
  },
  {
    slug: 'orofacial-pain',
    name: 'Orofacial Pain',
    category: 'specialty',
    summary:
      'Chronic facial pain syndromes — when the cause is dental, when it is not, and how to tell the difference.',
    body: 'Facial pain is one of the hardest diagnostic problems in clinical medicine. Some of it is dental in origin (cracked teeth, occlusion); much of it is not. We rule out the dental causes systematically and refer appropriately when the source is elsewhere.',
  },

  // ─────── Orthodontics (2) ───────
  {
    slug: 'orthodontics',
    name: 'Traditional Orthodontics',
    category: 'orthodontics',
    summary:
      'Comprehensive bite correction for teens and adults using traditional brackets.',
    body: 'Traditional orthodontics remain the most predictable treatment for complex bite corrections. Treatment time runs 18–24 months for most adult cases. We coordinate with our orthodontic specialist for cases requiring it.',
  },
  {
    slug: 'removable-orthodontics',
    name: 'Removable Orthodontics',
    category: 'orthodontics',
    summary:
      'Clear aligner therapy for adult patients with simple to moderate alignment needs.',
    body: 'Removable aligners are best for patients with predictable, well-defined movements. We screen carefully — some cases that look straightforward in photos are not — and we are honest about when traditional orthodontics is the better choice.',
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServicesByCategory(category: ServiceCategory): Service[] {
  return services.filter((s) => s.category === category);
}

export const ALL_CATEGORIES: ServiceCategory[] = [
  'general',
  'cosmetic',
  'specialty',
  'orthodontics',
];
