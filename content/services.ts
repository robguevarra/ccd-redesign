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
    body: `The foundation of every healthy mouth is a consistent cleaning schedule — and we take that foundation seriously. A professional cleaning removes the calculus and biofilm that daily brushing and flossing cannot reach: the buildup that accumulates at the gumline, in the proximal spaces, and in the pockets that form as gum tissue ages. Without it, that accumulation becomes the primary driver of both decay and periodontal disease.

Most patients do well with two visits per year. Others — patients with a history of periodontal disease, those with crowded or difficult-to-clean dentition, patients managing systemic conditions that increase oral disease risk, or those with a high decay rate — benefit from three or four cleanings annually. We establish that cadence at your first comprehensive visit and adjust it over time based on what we actually see at each appointment.

Each visit is more than an instrument appointment. We document any changes since the last visit, probe pocket depths where indicated, screen for soft-tissue changes and oral lesions, apply fluoride to strengthen enamel against acid attack, and apply sealants where deep pitting in molars creates ongoing decay risk. We also review your home care — not to lecture, but because small technique corrections often make a meaningful difference in where decay and inflammation occur.

Patient education at these visits is practical: what is happening in your specific mouth, what habits are driving problems, what the X-rays show, and what we plan to monitor. You should leave each cleaning appointment with a clearer picture of your oral health than when you arrived.

If it has been years since your last professional cleaning, do not let that delay you further. We see that every week — catching up is straightforward, and judgment is not part of how we practice.`,
  },
  {
    slug: 'comprehensive-exam',
    name: 'Comprehensive Exam',
    lane: 'dental',
    subcategory: 'preventive',
    summary:
      'Full-mouth diagnostic exam with CT scan, panoramic imaging, and periodontal charting.',
    body: `A thorough diagnosis at the start of care prevents a long list of problems that come from treating teeth in isolation. The comprehensive exam is where we establish a baseline for your entire oral health — not just the chief complaint, not just the teeth that hurt, but the whole picture.

At a new-patient comprehensive exam, we take a full-mouth series of X-rays or a panoramic radiograph. When the anatomy, a presenting problem, or clinical findings warrant it, we capture a CBCT scan using our iCAT FLX — a three-dimensional image that reveals the bone volume, root anatomy, sinus relationships, and joint structure that a flat X-ray cannot show. This is especially relevant before any extraction, implant, or surgical procedure, and for any patient presenting with jaw pain or bite problems.

We perform a full periodontal chart: pocket depths at six sites per tooth, bleeding on probing, recession, furcation involvement, and mobility. This data tells us the actual disease status of your periodontium at a level that a visual inspection alone cannot provide. We repeat it at every recall visit and track changes over time.

The soft-tissue examination covers lips, cheeks, tongue, floor of mouth, palate, and oropharynx — part of every comprehensive exam, not a separate add-on. We evaluate occlusion, check for signs of bruxism or parafunction, and assess existing restorations for integrity and marginal fit.

The consultation that follows the exam is not a sales presentation. We explain what we found, what it means, and what the treatment options are — including doing nothing when that is a reasonable choice. A treatment plan is built with you, not handed to you.

We recommend a comprehensive re-evaluation annually. Your mouth changes, and the baseline needs to keep pace.`,
  },
  {
    slug: 'scaling-root-planing',
    name: 'Scaling & Root Planing',
    lane: 'dental',
    subcategory: 'preventive',
    summary:
      'Deep cleaning below the gumline for patients with active or early periodontal disease.',
    body: `When pocket depths exceed four millimeters and calculus has formed below the gumline, a standard cleaning cannot reach the problem. Scaling and root planing — sometimes called a deep cleaning — is the first active treatment for early to moderate periodontitis, and it is frequently the only treatment needed to arrest the disease progression when caught at that stage.

The procedure removes calculus, plaque, and bacterial toxins from the root surfaces both above and below the gum margin. The root planing component smooths the root surface, which discourages future bacterial adhesion and allows the gum tissue to reattach and form a healthier, shallower pocket. After the procedure, a medicated solution is often irrigated into the treated pockets to address any remaining bacterial burden.

We complete the procedure one quadrant at a time under local anesthesia, which means each session is comfortable and focused. Most patients need two appointments to cover the full mouth; some cases with less severe involvement can be addressed in one visit. We schedule a re-evaluation at four to six weeks post-treatment to re-probe and assess the tissue response — pockets that have not responded adequately may need additional intervention.

The indication for scaling and root planing is clinical, not cosmetic. If your probe readings are in the healthy range at your annual exam, you do not need this procedure. If they are not, continuing with routine cleanings does not address the underlying disease. We screen proactively at every hygiene visit and recommend deep cleaning when the measurements support it, not as a default.

Dr. Singh, our periodontist with a focus on periodontal disease since 2006, is available for cases that require more advanced surgical management when scaling alone is insufficient.`,
  },
  {
    slug: 'fluoride-sealants',
    name: 'Fluoride & Sealants',
    lane: 'dental',
    subcategory: 'preventive',
    summary:
      'Topical fluoride and sealant application for enamel protection in children, teens, and high-risk adults.',
    body: `Prevention is the most cost-effective work we do, and fluoride and sealants are its two most reliably effective tools. Neither requires anesthetic, neither takes much chair time, and both return meaningful protection across the years that follow.

Fluoride works at the chemistry level. Tooth enamel is composed of hydroxyapatite crystals that are vulnerable to the acid produced by oral bacteria when they metabolize dietary sugars. Fluoride incorporates into that crystal structure and converts it to a more acid-resistant form, reducing the rate at which enamel demineralizes. Topical fluoride applied professionally is more concentrated than what you get from toothpaste or tap water, and the clinical evidence for its protective effect is among the most well-established in preventive dentistry. We apply it at hygiene visits in gel, foam, or varnish form depending on age and risk profile.

Sealants address a different vulnerability: the deep pits and fissures in the biting surfaces of back teeth, where toothbrush bristles cannot reach and where a significant portion of childhood and adolescent decay originates. A sealant is a thin resin material flowed into those grooves and light-cured to form a physical barrier against bacteria and food debris. Applied correctly and maintained over time, they last years and prevent the cavities that would otherwise form.

We recommend fluoride for patients across all ages with elevated decay risk — those with dry mouth from medications, orthodontic patients, people with a history of frequent cavities, and patients with exposed root surfaces from recession. Sealants are most valuable on newly erupted permanent molars in children and adolescents, but we also place them on adult patients whose molar anatomy creates ongoing risk.

Both are included as part of routine hygiene visits when indicated. We do not wait to be asked.`,
  },
  {
    slug: 'occlusal-splints',
    name: 'Occlusal Splints',
    lane: 'dental',
    subcategory: 'preventive',
    summary:
      'Custom-fitted night guards for bruxism, clenching, and bite-force protection.',
    body: `Bruxism — grinding and clenching — is one of the most common and least noticed sources of dental damage. Most people who do it are entirely unaware, because it happens during sleep. The signs accumulate over years: worn enamel, chipped cusp tips, cracked teeth, morning jaw soreness, headaches on waking, and increasing fracture risk in back teeth that have already been restored. By the time patients notice, the damage is already significant.

A custom occlusal splint distributes bite forces across the full arch, removing concentrated load from individual teeth and reducing the compressive force transmitted to the temporomandibular joint. It does not stop the bruxism itself — the neurological drive to grind persists — but it intercepts the damage pathway. Worn enamel does not grow back; protecting what remains is the whole point.

We fabricate splints from digital scans or conventional impressions. The splint is fit and adjusted at a follow-up appointment, with particular attention to the way it sits in your bite — a poorly fitting splint can create new bite problems, so the fit appointment is not optional. We adjust and refine over time as the appliance wears and as your bite changes.

An occlusal splint for bruxism is a distinct device from a sleep apnea oral appliance, even though both are worn during sleep. Sleep apnea appliances are designed to reposition the mandible forward to maintain the airway; they work against the bite and should not double as bruxism protection. If you have both conditions, we address them with the appropriate appliances for each.

We also place splints for patients with active TMJ symptoms, where reducing joint load is part of the treatment plan. The overlap between bruxism, bite mechanics, and TMJ health is real, and the splint prescription reflects that context.`,
  },

  // ─────── Restorative Dentistry (6) ───────
  {
    slug: 'composite-fillings',
    name: 'Composite Fillings',
    lane: 'dental',
    subcategory: 'restorative',
    summary:
      'Tooth-colored composite restorations placed to halt decay and restore tooth function.',
    body: `A composite filling stops the progression of decay and restores the tooth to full function. The decayed tissue is removed, the cavity is cleaned, and a tooth-colored resin is bonded into place — shaped to restore the original contour of the tooth and polished to match the natural enamel around it. Done well, a composite filling is indistinguishable from the tooth it repairs.

The bonding mechanism matters. Modern adhesive composites form a chemical and mechanical bond with tooth structure, which means they reinforce what remains rather than just filling a void. A well-placed composite filling seals the cavity margin against re-contamination, which is what determines long-term durability. We place all direct restorations under rubber dam isolation — this controls moisture in a way that is not achievable without it, and moisture control at the bonding step is the primary determinant of how long the filling lasts.

We use composite for the full range of direct restorations: small cavities in posterior teeth, interproximal decay in both anterior and posterior teeth, chipped or fractured anterior teeth, and conservative restorations where tooth structure needs to be preserved. Composite is also used to replace deteriorating amalgam restorations when the indication supports it.

What to expect: the appointment is completed in a single visit with local anesthesia. Some sensitivity to hot and cold in the days following placement is common and resolves as the tooth settles. We check your bite before you leave; if something feels off after the anesthetic wears off, call and we will adjust it.

We do not claim a composite filling lasts forever. With proper home care and regular maintenance visits, a decade or more of service is a realistic expectation. Fillings at high-stress sites — molar contacts, areas subject to heavy bite force — are monitored at every hygiene visit.`,
  },
  {
    slug: 'direct-composite-veneers',
    name: 'Direct Composite Veneers',
    lane: 'dental',
    subcategory: 'restorative',
    summary:
      'Esthetic-focused composite veneers placed in a single visit. Conservative and reversible.',
    body: `Some smile transformations do not require a laboratory, a two-week wait, or irreversible tooth preparation. Direct composite veneers are sculpted chairside in a single appointment — composite resin shaped and polished directly on the tooth surface to correct shape, color, or proportion. No impressions sent to a lab, no temporaries, no second appointment.

The range of problems they address is broader than many patients expect. Direct veneers can close a gap between the front teeth, build out a tooth that is too narrow, repair a chipped or worn edge, cover discoloration that does not respond to whitening, and reshape teeth with irregular contour. Cases involving multiple front teeth can often be completed in one visit.

The technique is exacting. Building tooth form in resin requires an understanding of dental anatomy, light behavior, and color characterization — the same skills that drive good direct composite work across the rest of the mouth, applied at a higher level of esthetic demand. We mock up the proposed changes before bonding anything permanently, so you see the result before we commit.

The trade-offs are honest. Direct composite does not have the translucency or strength of a laboratory-fabricated porcelain veneer. A typical lifespan is five to seven years, after which the composite may need touch-up or replacement. Polishability is good but not identical to glazed ceramic. For patients with heavy bite forces or prominent bruxism habits, composite at the front teeth carries more risk of chipping.

No enamel is removed in most direct veneer cases — the procedure is reversible. For patients who want to see a smile change before committing to the cost and irreversibility of porcelain veneers, direct composite is the right first step.`,
  },
  {
    slug: 'porcelain-veneers',
    name: 'Porcelain Veneers',
    lane: 'dental',
    subcategory: 'restorative',
    summary:
      'Custom-shaped porcelain shells that change a smile without changing the underlying teeth.',
    body: `Porcelain veneers are among the most powerful tools in cosmetic dentistry — thin ceramic shells custom-fabricated to cover the front surface of teeth, changing their shape, color, length, and proportion while preserving most of the underlying tooth structure. When the case is designed well and executed well, the result is a smile that looks entirely natural and is indistinguishable from healthy enamel.

The range of problems veneers address: severe discoloration that whitening cannot correct (tetracycline staining, fluorosis, intrinsic gray tones), chipped or worn edges, irregular shape or size, minor crowding or spacing, and congenitally malformed teeth. They are not the right solution for every cosmetic problem — we discuss alternatives honestly and recommend veneers only when they are genuinely the best option for the case.

Preparation involves removing a thin layer of enamel from the front surface of each tooth — about the thickness of a contact lens — to create space for the veneer without making the tooth look bulky. This is an irreversible step, which is why the design phase matters so much. We use our 3Shape Trios digital scanner to capture the existing dentition and plan the case in three dimensions. A digital or provisional mock-up lets you see the proposed proportions and color in your mouth before any preparation begins. We do not skip that step.

Temporaries protect the prepared teeth while the porcelain is fabricated. The second appointment — delivery — involves careful bonding and bite verification. Post-delivery adjustments are normal; we schedule a follow-up to make them.

Porcelain veneers are strong and stain-resistant, but they are not indestructible. Patients with heavy bruxism habits need a protective night splint. We discuss these considerations before any preparation, so there are no surprises after the case is complete.`,
    technologyRefs: ['trios'],
  },
  {
    slug: 'crowns-and-bridges',
    name: 'Crowns & Bridges',
    lane: 'dental',
    subcategory: 'restorative',
    summary:
      'Full-coverage restorations and multi-tooth bridges that restore function and protect the tooth.',
    body: `A crown is the appropriate restoration when a tooth can no longer be repaired with a filling alone — when decay is too extensive, when a fracture line runs too deep, when a large existing restoration has failed, or when a tooth has been treated with a root canal and needs full-coverage protection. The crown encases the entire visible portion of the tooth, restoring it back to functionality: the ability to bite and chew normally, to close the bite properly, and to hold its position in the arch.

We design and plan crowns using our 3Shape Trios digital scanner. The scanner captures the tooth and the surrounding dentition in three dimensions without the discomfort and distortion of conventional impression trays. Digital files go directly to the laboratory, which shortens turnaround time and produces restorations with consistently accurate fit at the margin — the single most important variable in how long a crown stays in service.

Material selection is matched to the clinical situation. Full zirconia is the current standard for posterior teeth under heavy load: extremely strong, biocompatible, and conservative in preparation requirements. Lithium disilicate (e-max) offers exceptional esthetics with good strength for anterior and premolar positions. Porcelain-fused-to-metal remains an option where specific clinical factors favor it. We discuss the trade-offs with you before any preparation begins.

A bridge replaces one or more missing teeth by crowning the teeth on either side of the gap and suspending one or more artificial teeth between them. The adjacent teeth serve as anchors, which means some healthy tooth structure must be prepared to accommodate the crowns. For patients with natural, unrestored adjacent teeth, we discuss implants as an alternative that preserves that structure entirely.

The crown and bridge appointment involves two visits: preparation and temporaries at the first, delivery and adjustment at the second. The temporary protects the prepared tooth between visits and gives you a preview of the final restoration's shape.`,
    technologyRefs: ['trios'],
  },
  {
    slug: 'dentures',
    name: 'Dentures & Partial Dentures',
    lane: 'dental',
    subcategory: 'restorative',
    summary: 'Full and partial removable prosthetics, including immediate dentures.',
    body: `Losing teeth changes more than appearance — it changes how you eat, how you speak, and over time, how the underlying bone behaves. Dentures address those changes with a removable prosthesis custom-made to fit your ridge and replicate natural tooth form. When well-made and properly fitted, they restore chewing function and support the facial structure that the teeth were maintaining.

A conventional full denture is fabricated after the extraction sites have healed and the ridge has remodeled — typically four to six weeks after extractions. This timeline allows the denture to be fitted to stable tissue, which means better initial fit and less need for early relining. The process involves several appointments: impressions, bite registration, a try-in with the teeth set in wax where you approve the look before final processing, and the delivery appointment.

Immediate dentures are made before the extractions occur and placed at the same appointment as the extractions. The patient leaves without a gap in their smile, which is the primary advantage. The trade-off is that the tissue continues to remodel for months after extraction, which means the immediate denture will loosen and require relining as the ridge changes shape. Most patients with immediate dentures need a reline within the first year.

Partial dentures replace several missing teeth in an arch where natural teeth remain. A framework of metal or flexible resin clasps onto the remaining teeth for retention. Partial dentures prevent the remaining teeth from drifting into the gap and restore chewing balance across the arch.

For patients who want greater stability and retention than a conventional denture provides, implant-retained overdentures attach to implants placed in the jaw. The implants provide anchorage that prevents the prosthesis from moving during function — a meaningful quality-of-life improvement for patients who find conventional dentures unreliable.`,
  },
  {
    slug: 'teeth-whitening',
    name: 'Teeth Whitening',
    lane: 'dental',
    subcategory: 'restorative',
    summary:
      'In-office and at-home whitening, including deep-bleaching for stubborn cases.',
    body: `Teeth discolor for different reasons, and the reason determines what whitening will actually work. Extrinsic staining from coffee, tea, or wine responds quickly to surface bleaching agents. Intrinsic discoloration — the kind embedded in the dentin, resulting from aging, old restorations, tetracycline exposure, or fluorosis — requires a different approach. Most whitening products, including the higher-end over-the-counter options, do not adequately address intrinsic color.

The problem with many whitening treatments is that they prioritize initial brightness without addressing tooth permeability — the capacity of the whitening agent to penetrate into the dentin where the deeper staining lives. Dehydration from in-office plasma lights creates an apparent whitening effect that partially reverses when the tooth rehydrates. High-concentration gel without preparation can cause sensitivity.

We take a more deliberate approach. Before any bleaching begins, we use a medicated paste that strengthens the enamel and conditions the tooth for whitening — reducing sensitivity and improving the depth of penetration that follows. Our deep-bleaching protocol alternates in-office and supervised at-home phases, allowing the bleaching agent to work progressively without the discomfort associated with high-concentration single-session treatments.

Deep bleaching is indicated for cases that other approaches cannot move: stubborn intrinsic staining, severe discoloration from tetracycline exposure or fluorosis, and patients who have tried other whitening methods with disappointing results. It achieves color change that single-session in-office treatment typically cannot match.

We also screen for restorations and crowns in the smile zone before recommending whitening. Composite and ceramic do not bleach with the teeth — any restorations that were matched to the pre-whitening shade will need replacement after the treatment to match the new color. We discuss this upfront.

Results are stable with a brief annual maintenance touch-up at home. We provide the protocol and the materials at the end of treatment.`,
  },

  // ─────── Endodontics (3) ───────
  {
    slug: 'root-canal',
    name: 'Root Canal Therapy',
    lane: 'dental',
    subcategory: 'endodontics',
    summary:
      'Endodontic treatment to save teeth that would otherwise need extraction.',
    body: `Root canal therapy saves a tooth that would otherwise need to be extracted. When decay reaches the pulp — the soft tissue inside the tooth containing the nerve and blood supply — or when trauma, a crack, or a leaking crown causes the pulp to become infected or inflamed, the infection cannot resolve on its own. The tooth needs to be either treated or removed. Root canal therapy cleans and seals the canals, removes the source of infection, and allows the tooth to remain in the mouth functioning normally.

The procedure has a reputation for discomfort that belongs to an older era of dentistry. Modern root canal therapy, performed under adequate local anesthesia, is not significantly different from having a filling placed. Most patients who are anxious beforehand are surprised by how uneventful the experience actually is.

An access opening is made through the crown of the tooth. The pulp, nerve tissue, and bacteria are removed using a series of files, and the canal system is shaped to receive the permanent filling material. Irrigation with disinfecting solutions throughout the procedure addresses the bacterial load that instruments alone cannot reach. The cleaned canals are then sealed with a material called gutta-percha, which prevents reinfection.

Most cases are completed in a single appointment; multi-rooted teeth or cases with more complex anatomy may require a second visit. After root canal treatment, the tooth needs a permanent restoration — most posterior teeth require a crown to protect against fracture, since the treated tooth becomes more brittle without its vital tissue.

Dr. Rachel Lim is a board-certified endodontist with training at Western University and Columbia University. She handles the complex endodontic cases in our practice: multiple canals, calcified canals, retreatments, and cases referred from other practices in the region.`,
  },
  {
    slug: 'apicoectomy',
    name: 'Apicoectomy',
    lane: 'dental',
    subcategory: 'endodontics',
    summary:
      "Surgical endodontic procedure to save a tooth when conventional retreatment isn't viable.",
    body: `Sometimes a root canal that was completed correctly, years or decades ago, develops new problems at the root tip — residual infection, a cyst that has formed around the apex, or a canal that cannot be reached from above because of a post or a well-fitting crown that would be difficult to remove and replace. In those cases, the surgical approach is to address the problem from the other direction: through the gum and bone rather than through the crown of the tooth.

An apicoectomy — surgical endodontic treatment — removes the tip of the root and the surrounding infected tissue, then seals the canal from the apex to prevent reinfection. The access is made through a small flap in the gum tissue, a small opening in the overlying bone, and the root tip is removed with a precise amount of the root length to eliminate the source of the problem. A retrograde filling material seals the end of the canal.

The procedure is done under local anesthesia in our office. Post-operative swelling and some discomfort for a few days are typical; most patients are comfortable with over-the-counter analgesics and return to normal activity quickly. Sutures are removed at a follow-up appointment within a week to ten days.

Dr. Lim performs apicoectomies for cases where the evidence supports a surgical approach rather than orthograde retreatment. Not all failing root canals are best managed surgically — retreatment through the tooth remains the better option in many cases. We evaluate the anatomy with imaging before recommending a direction, and we do not default to surgery when retreatment is a more conservative and equally appropriate choice.

Saving a tooth with an apicoectomy is almost always preferable to extraction followed by implant, particularly when the tooth is otherwise sound and the surrounding bone is adequate.`,
  },
  {
    slug: 'root-canal-retreatment',
    name: 'Root Canal Retreatment',
    lane: 'dental',
    subcategory: 'endodontics',
    summary:
      'Re-entry of a previously root-canalled tooth to address residual infection or technical issues.',
    body: `A tooth that was successfully root-canalled years ago can develop new problems. The seal at the filling material may have broken down over time, allowing bacteria to re-enter. The original treatment may have missed a canal — particularly in multi-rooted teeth where the anatomy can be complex. A crack may have formed. Or new decay may have progressed far enough to compromise the integrity of the existing treatment. In all these situations, the tooth is not lost — but it needs to be treated again.

Root canal retreatment re-enters the tooth through the crown, removes the prior filling material, re-cleans and re-shapes the canal system, and re-seals it. This is technically more demanding than an initial root canal: the existing gutta-percha must be dissolved or mechanically removed, posts may need to be taken out, and calcified canals that were challenging the first time must be navigated again.

Before recommending retreatment, we evaluate the tooth carefully: the existing crown or restoration, the quality of the original treatment, the bone levels around the root, and whether there are signs of fracture that would make the tooth unrestorable regardless of the endodontic outcome. Retreatment is the right choice when the tooth is structurally sound and the source of the problem is addressable through the canal.

Dr. Lim handles retreatment cases in our practice. The complexity of retreatment — particularly when posts are involved, or when the original canal preparation was incomplete — benefits from the clinical experience and specialized training that an endodontist brings to the procedure.

If retreatment is not viable because of fracture, anatomy, or the condition of the surrounding bone, we discuss the surgical alternative — apicoectomy — or, when the tooth genuinely cannot be saved, the extraction-and-replacement pathway.`,
  },

  // ─────── Oral Surgery — dental context (3) ───────
  {
    slug: 'extractions',
    name: 'Extractions',
    lane: 'dental',
    subcategory: 'oral-surgery-dental',
    summary:
      'Simple and surgical extractions, performed in-house using CBCT planning.',
    body: `Our goal is to save every tooth we can. When extraction is necessary, we make that determination based on clinical evidence: extensive decay that leaves too little tooth structure for a restoration to hold, advanced periodontal disease with bone loss that cannot support the tooth's function, a fracture that extends below the bone level, symptomatic impaction, or orthodontic requirements. We explain the reasoning before we proceed.

Most extractions can be done in our office under local anesthesia without a hospital referral or general sedation. Simple extractions — teeth with intact roots that can be loosened and removed in one piece — are straightforward. Surgical extractions involve sectioning the tooth, removing bone where necessary, or working around curved or fused root anatomy. We handle both.

Before any surgical extraction, we capture a CBCT scan when the anatomy warrants it. The three-dimensional image from our iCAT FLX shows us the relationship between the roots and adjacent structures — the inferior alveolar nerve in the lower jaw, the maxillary sinus in the upper jaw, root curvature that a flat X-ray would underrepresent. That information changes the surgical approach and prevents avoidable complications.

Dr. Robert Sharobiem is a board-certified oral and maxillofacial surgeon with training from UCLA and Mount Sinai, a member of AAOMS, and a recipient of the AAOMS Humanitarian Award. He handles the complex surgical extractions: deeply impacted third molars, teeth with challenging root anatomy, cases where the surgical approach requires the level of training that an OMFS brings.

Post-operative instructions are provided in writing at the appointment. When bone grafting to preserve the site for future use is indicated, we discuss it before the extraction — placing a graft at the time of extraction is significantly simpler and more effective than attempting augmentation later.`,
    technologyRefs: ['cbct'],
  },
  {
    slug: 'bone-grafting',
    name: 'Bone Grafting',
    lane: 'dental',
    subcategory: 'oral-surgery-dental',
    summary:
      'Site preservation and ridge augmentation to support future implant placement.',
    body: `When a tooth is removed, the bone that surrounded the root begins to resorb. This is a predictable biological response to the absence of stimulation — without a tooth root transmitting bite forces into the bone, the body's metabolic activity reduces bone volume. Within six to twelve months of an extraction, a significant percentage of the ridge width and height can be lost. That lost volume creates problems: not enough bone for an implant, a ridge shape that makes denture fit difficult, and a cosmetic contour change visible at the gumline.

A socket preservation graft placed at the time of extraction substantially reduces this resorption. The graft material — a combination of processed bone graft material and, when indicated, platelet-rich fibrin from your own blood — fills the socket, maintains the three-dimensional volume of the site, and provides a scaffold for the body's own bone-forming cells to repopulate the space. Over three to four months, the graft integrates and matures into bone that can support an implant or a stable prosthesis.

Grafting at extraction is considerably simpler than attempting ridge augmentation later. The socket is already prepared, the surrounding bone walls are intact, and the healing starts immediately. Waiting until bone loss has already occurred means a more complex surgical procedure, a longer treatment timeline, and a less predictable outcome.

We also perform more extensive ridge augmentation procedures for patients who present with bone deficiency from previous extractions, severe periodontal bone loss, or trauma — cases where the extraction socket has long closed and the grafting must be done as a separate surgical procedure.

Dr. Sharobiem performs complex grafting cases in our practice. For straightforward socket preservation at a single-tooth extraction, this is often completed at the same appointment as the extraction under the same local anesthesia.`,
  },
  {
    slug: 'implants',
    name: 'Dental Implants',
    lane: 'dental',
    subcategory: 'oral-surgery-dental',
    summary:
      'Single-tooth and multi-tooth dental implants with CBCT-guided placement.',
    body: `A dental implant replaces the root of a missing tooth. A titanium post integrates with the jawbone through a process called osseointegration, becoming a stable foundation that functions like a natural root — supporting a crown, bridge, or denture without involving adjacent teeth. The result is a restoration that looks, bites, and feels like a tooth.

The difference between an implant and the alternatives matters clinically. A bridge requires preparing the adjacent teeth, removing healthy tooth structure to serve as anchors. A removable partial denture relies on the remaining teeth for retention and provides less chewing efficiency. An implant stands alone, preserves the adjacent teeth, and provides the bone stimulation that prevents the ridge resorption that occurs after tooth loss.

Planning is the most important phase of the procedure. We use our iCAT FLX CBCT scanner to capture the three-dimensional anatomy of the site: bone volume and density, distance to the inferior alveolar nerve in the lower jaw, proximity to the sinus in the upper jaw, and the spatial relationship between the implant position and the planned crown. Placement without this level of spatial planning is placement without full information — a situation we avoid.

If the extraction site did not receive a bone graft, or if bone volume has already been lost, augmentation may be required before implant placement. Most patients with a preserved site can proceed directly to surgery. The implant is placed under local anesthesia in our office. The integration period takes three to four months; during that time, a temporary restoration maintains the esthetic and spatial situation.

Dr. Sharobiem and Dr. Huang collaborate on complex implant cases in our practice. Single-tooth implant placement in ideal anatomy, guided by CBCT imaging, is well within the scope of what we manage here without an external surgical referral.`,
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
    body: `Periodontal disease is a chronic bacterial infection of the gum tissue and supporting bone around the teeth. It begins as gingivitis — inflammation without structural damage, reversible with improved hygiene and a cleaning — and progresses to periodontitis when the bacterial burden persists long enough to trigger bone resorption. The loss of bone that supports the teeth is not reversible. Managing periodontal disease is about arresting the progression, not restoring what has already been lost.

The disease is widespread and underdiagnosed. A large portion of adults over thirty have some degree of periodontal involvement, and many of them do not know it — periodontitis is frequently painless until it is advanced. The probing that happens at a comprehensive exam and at regular hygiene visits is the only way to detect it reliably.

We screen at every cleaning visit. When we find pocket depths and bone loss consistent with periodontitis, we treat it directly rather than monitoring it through cleaning-only appointments. Active treatment begins with scaling and root planing: thorough removal of calculus and bacterial biofilm from root surfaces below the gum margin, under local anesthesia, one quadrant at a time. For infected pockets around teeth or implants, laser-assisted decontamination with our diode laser reaches areas that instruments alone cannot adequately address.

After active treatment, we schedule the patient on a periodontal maintenance program — typically every three to four months rather than the standard six-month recall. The maintenance interval is based on individual risk, disease severity, and tissue response, not a fixed standard. Periodontal disease can be controlled with consistent maintenance; it progresses reliably without it.

Dr. Singh brings a periodontics specialty to the cases that require more advanced surgical management: osseous surgery, guided tissue regeneration, and complex multi-tooth involvement. Most patients do not need that level of intervention, but having it in-house means continuity of care when they do.`,
  },
  {
    slug: 'crown-lengthening',
    name: 'Crown Lengthening',
    lane: 'dental',
    subcategory: 'periodontal-surgical',
    summary:
      'Surgical exposure of additional tooth structure for restorative or cosmetic reasons.',
    body: `Crown lengthening creates access to tooth structure that the gum tissue and bone are covering — either because the tooth has broken at or below the gumline, or because the gum line itself sits too high to allow a restoration or veneer to be placed with proper margins.

The restorative indication is more urgent. When a tooth breaks near or below the gumline, the remaining structure may be too short for a crown to grip. Attempting to place a crown without adequate tooth exposure above bone results in a restoration that violates the biologic width — the soft-tissue attachment zone the body maintains around every tooth. That violation causes chronic inflammation and progressive bone loss that undermines the restoration over time. Crown lengthening surgically repositions the gum and bone to expose the minimum tooth structure needed for a sound restoration, respecting the biologic boundary while saving a tooth that would otherwise need extraction.

The cosmetic indication is different in severity but meaningful in impact. A smile that shows a disproportionate amount of gum tissue — sometimes called a "gummy smile" — often has teeth that are fully present beneath the tissue. Crown lengthening removes the excess and reveals the true proportion of the teeth, sometimes transforming the smile without any cosmetic restorative work at all.

The procedure is done under local anesthesia. A small flap is made in the gum tissue, and the tissue and underlying bone are reshaped to the planned level. Sutures are placed and removed at a follow-up in about ten days. The tissue must heal fully before a permanent crown is placed — typically six to eight weeks.

Dr. Singh performs crown lengthening procedures in our practice. For restorative cases, we coordinate timing with the restorative phase to avoid any delay in the restoration once healing is complete.`,
  },
  {
    slug: 'gingivectomy',
    name: 'Gingivectomy',
    lane: 'dental',
    subcategory: 'periodontal-surgical',
    summary:
      'Soft-tissue contouring for periodontal pockets, hyperplasia, or cosmetic shaping.',
    body: `A gingivectomy removes excess or diseased gum tissue when the anatomy creates a clinical problem that cannot be resolved through cleaning or medication alone. The result is healthier tissue, shallower pockets, and gum margins that sit at the right level relative to the teeth.

The most common indications fall into a few categories. Drug-induced gingival hyperplasia — enlargement of the gum tissue as a side effect of certain blood pressure medications, anticonvulsants, or immunosuppressants — creates pockets that trap bacteria and are impossible to clean adequately. Gingivectomy removes the excess tissue and restores a cleaner tissue architecture. Persistent pockets that remain after scaling and root planing, and that have not responded to conventional maintenance, can be reduced surgically to bring the pocket depth within a manageable range. Cosmetic asymmetry — gum margins at different levels, uneven display, tissue that sits too low and makes teeth appear short — can be refined to create better proportions.

We perform most gingivectomies with our diode laser rather than a conventional scalpel. The laser seals tissue as it works, which means significantly less intraoperative bleeding, less post-operative swelling, and a faster recovery compared to traditional techniques. Sutures are often unnecessary for laser procedures. Most patients describe the post-operative experience as mild — some sensitivity for a few days and soft-diet guidance, but not the extended healing associated with conventional gingival surgery.

The procedure is done under local anesthesia. For patients with dental anxiety, the laser approach is considerably less intimidating than scalpel surgery, and the absence of bleeding changes the experience meaningfully. We discuss sedation options for any patient who needs additional support.

The tissue response is typically visible within a few weeks as the swelling fully resolves and the new gum margin heals in place.`,
  },
  {
    slug: 'frenectomy',
    name: 'Frenectomy',
    lane: 'dental',
    subcategory: 'periodontal-surgical',
    summary:
      'Release of restrictive frenum attachments — lip-tie, tongue-tie, or labial frenum.',
    body: `A frenum is a small fold of tissue that connects the lip or tongue to the gum. Everyone has them. When a frenum is unusually thick, short, or attached too close to the gum margin, it creates clinical problems — and when those problems are significant, a frenectomy releases the attachment.

The labial frenum — the tissue connecting the upper lip to the gum above the front teeth — can pull on the gum tissue directly, contributing to recession and making adequate oral hygiene difficult in that area. In some patients, a thick or low labial frenum also maintains a gap between the upper central incisors. Orthodontic treatment can close the gap mechanically, but without frenectomy, the tissue can cause the space to reopen after braces or aligners are removed. Timing the frenectomy in coordination with orthodontic treatment matters: we work with your orthodontist directly.

Lingual frenectomy — releasing a tongue tie — addresses restriction in tongue mobility that can affect speech articulation, the ability to breastfeed in infants, and oral function in older children and adults. Tongue ties range in clinical significance from mild and functionally irrelevant to severe and meaningfully disruptive. We evaluate rather than treat automatically, because not every tongue tie requires intervention.

We perform frenectomies with our diode laser. The procedure takes only a few minutes under local anesthesia. The laser approach seals the tissue as it cuts, which means minimal bleeding, rapid healing, and rarely any need for sutures. Post-operative discomfort is typically mild and short-lived.

Frenectomies for infants are evaluated and coordinated with a lactation consultant or pediatrician when breastfeeding is the primary concern. For older patients, we coordinate with the referring orthodontist or speech-language pathologist to align the timing with the broader treatment plan.`,
  },
  {
    slug: 'alveoloplasty',
    name: 'Alveoloplasty',
    lane: 'dental',
    subcategory: 'periodontal-surgical',
    summary:
      'Surgical smoothing and reshaping of the bony ridge after extractions.',
    body: `After teeth are extracted, the bone that supported them does not heal in a smooth, even contour on its own. Sharp ridges, bony projections, and irregular undercuts are common — particularly after multiple extractions in a row, or after teeth that were already compromised by bone loss or infection. That uneven ridge creates problems: pressure points under a denture that cause pain and sores, poor prosthesis stability, and, in some cases, discomfort even without a prosthesis.

Alveoloplasty reshapes and smooths the bony ridge at the time of extraction — removing sharp peaks, filling in undercuts, and contouring the bone to a form that heals with a smooth, regular shape. It is most commonly done at the same appointment as multiple extractions, before the tissue is sutured closed, while the surgical site is already open. Adding alveoloplasty at that stage adds minimal time and healing burden compared to the significant benefit it provides.

For patients receiving an immediate denture — one placed the same day as the extractions — alveoloplasty is particularly important. The denture is made in advance using pre-extraction impressions, and the fit depends on the ridge conforming reasonably well to what the lab anticipated. Contouring the bone at extraction improves how the immediate denture seats and reduces the number of pressure-point adjustments needed in the weeks that follow.

Alveoloplasty is also performed as a separate procedure in patients who have already healed after prior extractions but whose ridge shape is incompatible with a well-fitting prosthesis. This is a less common scenario — most patients benefit most from addressing it at the time of extraction — but it is an option when the situation warrants it.

Dr. Sharobiem performs alveoloplasty in the context of complex extractions and full-arch surgical planning.`,
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
