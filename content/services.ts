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
    body: `TMJ symptoms — jaw pain, clicking, headaches, ear pressure, limited opening — are often misdiagnosed for years before someone connects them to bite mechanics. The frustrating part for most patients is that they have already seen a physician, a neurologist, or an ENT specialist, and nothing has resolved. The problem lives at the intersection of dentistry and medicine, and very few practices are equipped to evaluate both sides.

We approach TMJ disorders the way a specialty clinic should: with a thorough history, a physical examination of the joint and masticatory muscles, and CBCT imaging that shows the joint in three dimensions. That imaging — taken with our iCAT FLX — reveals the bony architecture of the condyle, the degree of joint space narrowing, and any degenerative changes that would shift the treatment plan. What cannot be seen on a flat panoramic X-ray becomes visible. Decisions get better from there.

Treatment is always conservative first. Splint therapy — a precision-fit occlusal appliance worn during sleep, during the day, or both — removes the joint from destructive load and gives the tissues a chance to recover. Where the bite is contributing to the dysfunction, bite-equilibration addresses the root mechanical problem rather than masking it. Physical therapy and trigger-point work are often part of the same episode of care.

Surgery is a last resort — one we discuss candidly when we reach the limits of conservative management, but something most patients never need. Our goal is pain relief, jaw mobility, and a lasting result, not a dependency on a device. If the case warrants a surgical consult, we have that relationship in-house.`,
  },
  {
    slug: 'orofacial-pain',
    name: 'Orofacial Pain',
    lane: 'medical',
    subcategory: 'tmj-orofacial-pain',
    summary:
      'Chronic facial pain syndromes — when the cause is dental, when it is not, and how to tell the difference.',
    body: `Facial pain is one of the hardest diagnostic problems in clinical medicine. Some of it is dental in origin — cracked teeth, occlusal interference, pulpal pathology. Much of it is not. Neuropathic pain, neurovascular pain, cervical musculoskeletal pain, and systemic conditions that manifest in the head and face all look similar to a patient describing where it hurts.

Dr. Brien Hsu holds a master's degree in Orofacial Pain, Oral Medicine, and Sleep Disorders from USC and is board-certified by the American Board of Orofacial Pain — a credential that represents postgraduate specialty training most dentists do not pursue. We are the only dental or medical office in Rancho Cucamonga with that specialty on staff.

What that means for a patient in pain: you get a thorough diagnostic workup — a detailed history, a review of prior imaging and lab work, sleep habit assessment, behavioral and occupational factors, and a systematic clinical examination — before any treatment is proposed. We do not presume the answer is a night guard. We figure out what is actually happening first.

Orofacial pain encompasses TMJ disorders, masticatory muscle pain, cervicofacial musculoskeletal pain, neuropathic pain, headache disorders, sleep-related conditions, and intraoral and systemic conditions that produce pain in the face and mouth. These problems overlap, and the best outcomes come from a clinician who understands the full differential and knows when to treat, when to refer, and when to co-manage with a physician or neurologist.

We also serve as consultants to other dentists and physicians in the region when a complex orofacial pain case requires specialty evaluation.`,
  },
  {
    slug: 'trigger-point-injections',
    name: 'Trigger Point Injections',
    lane: 'medical',
    subcategory: 'tmj-orofacial-pain',
    summary:
      'Targeted injections to release muscle tension around the jaw, head, and neck.',
    body: `Muscle pain around the jaw, temples, and neck is one of the most consistent features of TMJ disorders and orofacial pain syndromes. The muscles most often involved — the masseter, temporalis, medial and lateral pterygoids, and the sternocleidomastoid — develop hyperactive spots called trigger points that compress local nerve fibers and refer pain to distant sites. The temporal headache that seems to come from nowhere, the earache with no ear findings, the tooth pain that moves around — these are often muscle in origin.

Trigger point injections deliver a small amount of local anesthetic directly into the hyperactive muscle band. The injection disrupts the self-sustaining spasm cycle, allows the muscle to fully relax, and gives the surrounding nerve endings a chance to reset. Relief is often immediate; the full effect unfolds over the following days. In some cases we pair the injection with PRF — platelet-rich fibrin concentrated from your own blood — to promote tissue healing at the injection site.

The procedure is done entirely in-office and takes under thirty minutes, including the time needed to precisely locate the trigger point through palpation. Local anesthesia makes the injection itself comfortable. Soreness at the injection site is common for a day or two; serious complications are rare.

Trigger point injections are most effective as part of a broader treatment plan. They break the acute pain cycle and allow other therapies — splint therapy, bite equilibration, physical therapy — to take effect without the interference of constant muscle guarding. We do not offer them as a standalone substitute for addressing the underlying dysfunction.`,
  },
  {
    slug: 'prf-prp-injections',
    name: 'PRF / PRP Injections',
    lane: 'medical',
    subcategory: 'tmj-orofacial-pain',
    summary:
      'Platelet-rich fibrin or plasma injections to support healing and tissue regeneration.',
    body: `Healing after surgery or an injection depends on what your body brings to the site. Platelet-rich fibrin (PRF) and platelet-rich plasma (PRP) work by concentrating your own blood's healing factors and delivering them precisely where the tissue needs support. The mechanism is straightforward: a small blood draw, a brief centrifuge cycle, and the resulting concentrate is applied to extraction sockets, bone graft sites, surgical wounds, or used alongside trigger point injections to promote recovery.

The practical result is meaningful. Post-operative swelling is reduced. The inflammatory phase is shorter. Soft-tissue and bone regeneration begin sooner. For patients undergoing bone grafting before implant placement, the combination of graft material and PRF creates a more hospitable environment for new bone formation. For patients receiving trigger point injections for orofacial pain, PRF adds a tissue-healing dimension to what would otherwise be a purely analgesic procedure.

PRF and PRP are autologous — derived entirely from your own blood — so there is no risk of allergic reaction or rejection. The preparation adds approximately fifteen minutes to a procedure. We use it selectively, for cases where the evidence supports the benefit, not as a routine add-on.

This is not a cosmetic facial filler treatment. Our use of PRF and PRP is in the context of surgical and orofacial medicine: dental extractions, bone grafting, implant site preparation, and adjunctive orofacial pain management. Patients considering aesthetic facial applications for cosmetic rejuvenation purposes should consult a dermatologist or plastic surgeon.`,
  },

  // ─────── Oral Medicine & Pathology (4) ───────
  {
    slug: 'oral-pathology',
    name: 'Oral Pathology',
    lane: 'medical',
    subcategory: 'oral-medicine-pathology',
    summary:
      'Diagnosis and biopsy of oral lesions — both routine and concerning.',
    body: `Most unusual findings in the mouth are benign — an aphthous ulcer, a bite injury, a harmless fibroma. But the ability to make that distinction reliably requires a trained eye and an understanding of what warrants watching, what warrants testing, and what warrants immediate biopsy. That is oral pathology.

Dr. Brien Hsu brings board-certification in Oral Medicine to every examination, which means the clinical evaluation of soft-tissue lesions, bone changes, and systemic conditions that affect the mouth is not a secondary skill — it is a core specialty. We screen at every hygiene visit and at every comprehensive exam, and we maintain a record of any finding that warrants monitoring over time.

Oral pathology encompasses a broad range of conditions: benign and malignant neoplasms, inflammatory and reactive lesions, cysts of the jaw, white and red lesions of the mucosa, autoimmune conditions affecting the oral tissues, vesiculobullous diseases, and pigmented lesions that need to be distinguished from melanoma. Some of these present as persistent sores, some as swelling, some as color changes, and some are discovered incidentally on imaging.

When we find something that needs pathological confirmation, we perform the biopsy in our office under local anesthesia and send the specimen to a board-certified oral pathologist. We do not send patients elsewhere for that step unless the anatomy requires a different surgical approach.

We also see patients on referral from other dentists and physicians who encounter oral findings outside their clinical comfort zone. A second opinion on an unusual lesion is always appropriate.`,
  },
  {
    slug: 'biopsies',
    name: 'Biopsies',
    lane: 'medical',
    subcategory: 'oral-medicine-pathology',
    summary:
      'Soft-tissue and oral lesion biopsies, performed in-office with pathology turnaround in days.',
    body: `When an oral lesion needs tissue diagnosis — and most do not — the path from discovery to answer should be direct. We perform biopsies in our office under local anesthesia, on the same day or at a short-notice follow-up appointment, and send the specimen to a board-certified oral pathologist for analysis. There is no referral to a separate facility, no scheduling delay across multiple practices, no gap between the clinician who found the lesion and the one who explains the result.

Incisional biopsy is used for larger lesions where only a sample is taken. Excisional biopsy removes the entire lesion — appropriate for smaller findings where complete removal is both diagnostic and curative. The technique and approach are determined by the size, location, and clinical appearance of the finding.

After the anesthetic, the procedure itself is brief. Soft-tissue biopsies heal quickly; most patients return to normal function within a few days. The specimen goes to the laboratory the same day.

Pathology results typically return in three to five business days. We review the report with you directly — the findings, what they mean, and the treatment plan that follows. If the result warrants oncology referral or further treatment, we coordinate that immediately and stay involved in your care. You are never handed a report and left to interpret it alone.

We biopsy appropriately, not reflexively. Not every lesion needs tissue diagnosis; some need monitoring, some have a clear clinical diagnosis, and some resolve on their own. We use clinical judgment to avoid unnecessary procedures while not missing the ones that matter.`,
  },
  {
    slug: 'oral-cancer-screening',
    name: 'Oral Cancer Screening',
    lane: 'medical',
    subcategory: 'oral-medicine-pathology',
    summary:
      'Visual and tactile examination for soft-tissue lesions and early signs of oral malignancy.',
    body: `Oral cancer is among the most survivable cancers when caught early — and among the most deadly when caught late. The difference almost always comes down to whether someone was looking. We screen every patient at every hygiene visit, because the lesion that will matter most to you may be the one you would never notice on your own.

The screening is a visual and tactile examination: lips, labial mucosa, buccal mucosa, gingiva, hard and soft palate, floor of the mouth, lateral and ventral tongue, oropharynx. We check for lesions, unusual color changes (red, white, or speckled), tissue thickening, ulcerations that have not healed, and asymmetry. It adds five minutes to the visit and is included in the cost of your cleaning.

When something warrants a closer look, we document it, photograph it, and discuss it with you honestly. Some findings are clearly benign and need only monitoring. Some are indeterminate and get a follow-up appointment in two to four weeks to see if they resolve on their own — many inflammatory lesions do. Findings that do not resolve, or that present with characteristics associated with malignancy, are biopsied in our office without delay.

Risk factors worth knowing about: tobacco and alcohol use remain the primary risk factors, but HPV-associated oropharyngeal cancers are increasing substantially in non-smokers. Age is a factor; so is chronic sun exposure to the lips. None of these are required for a cancer to develop, which is why we screen everyone.

You should not need to ask for this screen. We perform it automatically.`,
  },
  {
    slug: 'oral-cancer-shields',
    name: 'Oral Cancer Shields',
    lane: 'medical',
    subcategory: 'oral-medicine-pathology',
    summary:
      'Custom radiation shields for patients undergoing head and neck cancer treatment.',
    body: `Radiation therapy for head and neck cancers is essential treatment — and it is hard on the surrounding tissues. Scatter radiation that reaches the teeth, salivary glands, and jaw bone causes complications that can persist long after treatment ends: rampant caries from xerostomia, compromised bone healing, mucositis, and trismus. Custom intraoral shields are designed to deflect radiation away from tissues that are not in the treatment field, reducing the dose those structures receive without interfering with the therapeutic target.

We fabricate the shields in close coordination with your radiation oncology team. The process begins with impressions or a digital scan of your mouth; the shield is then constructed from a lead-lined material formed to fit precisely over your teeth and palate in the treatment position. The fit matters because a shield that moves during treatment defeats its purpose.

Timing is important. Ideally, a consultation happens before radiation begins — sometimes before surgery — so the shield is ready at the start of the treatment course. We work quickly; most patients are fitted within a week of a referral.

We also provide pre-radiation dental clearance evaluations for oncology patients, identifying teeth that should be extracted before radiation begins to prevent later extractions from a jaw with compromised bone healing capacity. This coordination between oncology and dentistry is a clinical relationship built over years, not a service offered in isolation.

If you or a family member is preparing for head or neck radiation, ask your oncologist for a dental consultation early in the treatment planning process.`,
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
    body: `Sleep apnea does more than disrupt sleep. Untreated obstructive sleep apnea is associated with high blood pressure, cardiovascular disease, metabolic dysregulation, cognitive impairment, and daytime dysfunction that compounds over years. The problem is that many patients who need treatment cannot sustain it — CPAP therapy is highly effective when worn consistently, and many people cannot or will not wear it.

Oral appliance therapy offers a well-tolerated alternative. A custom-fitted appliance worn during sleep repositions the lower jaw slightly forward, which opens the posterior airway, stabilizes the soft tissue, and prevents the obstruction that produces apnea events. FDA-cleared oral appliances are indicated for mild to moderate obstructive sleep apnea and for CPAP-intolerant patients with severe OSA when the alternative is no treatment at all.

Dr. Brien Hsu is a Diplomate of the American Board of Dental Sleep Medicine — an original-examination credential that represents rigorous clinical training and case submission across a specialty few dentists pursue. He is the first dentist from the USC School of Dentistry to publish in the Journal of Clinical Sleep Medicine. Sleep medicine is not a secondary service here; it is a clinical specialty.

The process begins with a review of your sleep study results. We work in coordination with your sleep physician — diagnosis is medicine's domain; appliance design and management is ours. The appliance is custom-fitted from a digital or conventional impression of your teeth, calibrated for your anatomy, and adjusted at follow-up visits as needed. Ongoing monitoring ensures the appliance continues to manage your airway effectively.

We do not diagnose sleep apnea in the dental chair. A qualified sleep physician performs that evaluation. Our role is the appliance therapy that follows.`,
  },

  // ─────── Surgical & Regenerative — medical context (1) ───────
  {
    slug: 'surgical-laser-therapy',
    name: 'Surgical Laser Therapy',
    lane: 'medical',
    subcategory: 'surgical-regenerative-medical',
    summary:
      'Diode laser treatment for soft-tissue procedures, decontamination, and biostimulation.',
    body: `Soft-tissue surgery has a reputation for bleeding, swelling, and slow recovery because that is the legacy of conventional scalpel techniques. Diode laser therapy changes the experience meaningfully: the laser seals blood vessels as it works, which means less intraoperative bleeding, less post-operative swelling, and faster tissue healing. The difference is especially noticeable for patients who have had traditional gum surgery before — they tend to be surprised at how uncomplicated the recovery is.

We use the diode laser for a range of procedures in the medical and dental practice: frenectomies, gingivectomies, gingival contouring, peri-implant tissue management, decontamination of infected pockets around implants, and biostimulation of surgical sites to promote healing. In the orofacial pain context, low-level laser energy at a surgical site accelerates tissue repair after injection procedures or minor oral surgery.

The procedure is performed under local anesthesia. The laser itself generates a characteristic sensation, but most patients describe the experience as significantly more comfortable than conventional scalpel surgery. Sutures are often unnecessary for smaller procedures. Post-operative instructions are minimal: soft diet for a few days, normal oral hygiene with gentle technique around the surgical site.

Laser therapy is not appropriate for every soft-tissue procedure. Anatomy, lesion size, and access all influence whether laser is the right tool. For procedures requiring deep tissue access or bony involvement, conventional surgical instruments remain the standard. We recommend laser where the evidence and the clinical situation support it, not uniformly.`,
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
