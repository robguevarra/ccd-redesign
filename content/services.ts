import type { Service, ServiceLane, ServiceSubcategory } from './schemas';

/**
 * Service catalog. 40 services across 9 subcategories under 2 lanes
 * (medical, dental). Source: docs/superpowers/specs/2026-05-06-dentisthsu-pre-pitch-audit-pass.md §5
 * plus the June 2026 client content update (new procedures + revised bodies).
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
  // MEDICAL LANE (17 services across 4 subcategories)
  // ═════════════════════════════════════════════════════════════════

  // ─────── TMJ & Orofacial Pain (8) ───────
  {
    slug: 'tmj',
    name: 'TMJ Treatment',
    lane: 'medical',
    subcategory: 'tmj-orofacial-pain',
    summary:
      'Comprehensive evaluation and treatment for temporomandibular joint disorders. Most cases are managed without surgery.',
    signature: true,
    technologyRefs: ['cbct'],
    body: `If you have jaw pain, clicking, popping, headaches, ear pressure, or limited opening, it's likely been misdiagnosed for years before someone connected it to bite mechanics. Most patients who find us have already seen a physician, a neurologist, or an ENT specialist, and nothing has been resolved. The problem lies at the intersection of dentistry and medicine, and very few practices are equipped to evaluate both sides.

We approach TMJ disorders the way a specialty clinic should: with a thorough history, a physical examination of the joint and masticatory muscles, and CBCT imaging that shows the joint in three dimensions. That imaging, taken with our iCAT FLX, reveals the bony architecture of the condyle, the degree of joint space narrowing, and any degenerative changes that would shift the treatment plan. What cannot be seen on a flat panoramic X-ray becomes visible. Decisions get better from there.

Treatment is always conservative first. Splint therapy — a precision-fit occlusal appliance worn during sleep, during the day, or both — reduces destructive joint loading and allows the tissues a chance to recover. Where the bite is contributing to the dysfunction, bite-equilibration addresses the root mechanical problem rather than masking it. Physical therapy and trigger-point work are often part of the same episode of care.

Surgery is a last resort, one we discuss candidly when we reach the limits of conservative management, but something most patients never need. Our goal is pain relief, jaw mobility, and a lasting result, not a dependency on a device.`,
  },
  {
    slug: 'orofacial-pain',
    name: 'Orofacial Pain',
    lane: 'medical',
    subcategory: 'tmj-orofacial-pain',
    summary:
      'Chronic facial pain syndromes: when the cause is dental, when it is not, and how to tell the difference.',
    body: `Facial pain is one of the hardest diagnostic problems in clinical medicine. Some of it is dental in origin: cracked teeth, occlusal interference, pulpal pathology. Much of it is not. Neuropathic pain, neurovascular pain, cervical musculoskeletal pain, and systemic conditions that manifest in the head and face all look similar to a patient describing where it hurts.

What that means for a patient in pain: you get a thorough diagnostic workup. A detailed history, a review of prior imaging and lab work, sleep habit assessment, behavioral and occupational factors, and a systematic clinical examination, before any treatment is proposed. We do not presume the answer is a night guard. We figure out what is actually happening first.

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
    body: `When jaw pain, temple pain, and neck tension are part of the picture, the muscles are usually involved. The masseter, temporalis, medial and lateral pterygoids, and the sternocleidomastoid can all develop hyperactive spots called trigger points that compress local nerve fibers and refer pain to distant sites. The temporal headache that seems to come from nowhere, the earache with no ear findings, the tooth pain that moves around: these are often muscle in origin.

Trigger point injections deliver a small amount of local anesthetic directly into the hyperactive muscle band. The injection disrupts the self-sustaining spasm cycle, allows the muscle to fully relax, and gives the surrounding nerve endings a chance to reset. Relief is often immediate; the full effect unfolds over the following days. In some cases we pair the injection with PRF (platelet-rich fibrin concentrated from your own blood) to promote tissue healing at the injection site.

The procedure is done entirely in-office. Local anesthesia makes the injection itself comfortable. Soreness at the injection site is common for a day or two; serious complications are rare.

Trigger point injections are most effective as part of a broader treatment plan. They break the acute pain cycle and allow other therapies to take effect: splint therapy, bite equilibration, physical therapy, without the interference of constant muscle guarding. We do not offer them as a standalone substitute for addressing the underlying dysfunction.`,
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

PRF and PRP are autologous, derived entirely from your own blood, so there is no risk of allergic reaction or rejection. We use it selectively, for cases where the evidence supports the benefit, not as a routine add-on.

This is not a cosmetic facial filler treatment. Our use of PRF and PRP is in the context of surgical and orofacial medicine: dental extractions, bone grafting, implant site preparation, and adjunctive orofacial pain management. Patients considering aesthetic facial applications for cosmetic rejuvenation purposes should consult a dermatologist or plastic surgeon.`,
  },
  {
    slug: 'arthrocentesis',
    name: 'Arthrocentesis',
    lane: 'medical',
    subcategory: 'tmj-orofacial-pain',
    summary:
      'A minimally invasive washout of the jaw joint to relieve TMJ pain, locking, and limited opening — optionally enhanced with PRF.',
    body: `This procedure is essentially a gentle washout of the jaw joint. The provider places a small needle into the joint space and gently flushes it with sterile fluid, washing out inflammation, removing debris, and releasing pressure within the joint. The goal is to help your jaw move better, decrease pain, and improve symptoms like locking or limited opening — in many cases it can also free a joint that feels stuck.

This procedure is commonly recommended for patients who have:
• Jaw pain
• Limited mouth opening
• Jaw locking or catching
• Clicking or popping with pain
• Inflammation inside the joint
• Symptoms that have not improved with conservative treatment like medications, splints, or physical therapy

The goals of the procedure are to:
• Reduce pain and inflammation
• Improve jaw movement
• Decrease pressure inside the joint
• Help restore more normal function

Most patients experience soreness for a few days afterward, but recovery is usually much easier than open joint surgery. You may still need physical therapy, jaw exercises, a TMJ splint, or additional treatment afterward to maintain improvement.

What makes our treatment different is that we may also use PRF (Platelet-Rich Fibrin). PRF is created using a small sample of your own blood, which is spun down to concentrate natural healing cells and growth factors. This material can then be placed into the joint to help support healing, reduce inflammation, and improve recovery. Because it comes from your own body, it is considered very safe and biocompatible.`,
  },
  {
    slug: 'neuropathic-pain',
    name: 'Neuropathic Pain',
    lane: 'medical',
    subcategory: 'tmj-orofacial-pain',
    summary:
      'Evaluation and personalized management of chronic neuropathic (nerve) pain affecting the face and jaw.',
    body: `Neuropathic pain is a complex, chronic condition caused by damage or disease affecting the network of neural structures responsible for the conscious perception of touch, pain, temperature, pressure, and body position. Rather than signaling a physical injury, damaged nerves send abnormal pain signals to the brain. Patients often describe neuropathic pain as burning, shooting, stabbing, or a persistent "pins and needles" sensation. Because the condition originates within the nervous system itself, it can be difficult to manage with traditional pain medications.

Neuropathy may develop from a wide range of medical conditions and underlying factors, including:
• Metabolic diseases: diabetes is the leading cause of peripheral neuropathy.
• Viral infections: conditions such as shingles (postherpetic neuralgia) and HIV/AIDS.
• Nerve compression: herniated discs, carpal tunnel syndrome, and spinal stenosis.
• Toxins and deficiencies: chemotherapy, radiation therapy, excessive alcohol use, and severe vitamin deficiencies.
• Autoimmune and neurological disorders: multiple sclerosis, Guillain-Barré syndrome, fibromyalgia, and others.
• Trauma: facial trauma from surgeries, dental treatment, and physical contact.

For Dr. Hsu, treatment begins with understanding the connection between the medical health history and the orofacial complex, including jaw alignment, jaw function, and the musculoskeletal and neurological systems. Every care plan is customized to the individual patient. Dr. Hsu is committed to developing personalized treatment strategies designed to address each patient's unique condition, symptoms, and long-term wellness goals.`,
  },
  {
    slug: 'custom-orthotic-device',
    name: 'Custom-Fit Orthotic Device',
    lane: 'medical',
    subcategory: 'tmj-orofacial-pain',
    summary:
      'A precision-fitted TMJ orthotic that repositions the jaw to relieve joint and muscle strain from clenching and grinding.',
    body: `A custom-fitted TMJ splint is a removable appliance custom-fabricated to fit over your teeth and help reduce stress on the temporomandibular joint (TMJ) and surrounding muscles.

Unlike over-the-counter night guards, this splint is designed from impressions or a scan of your teeth and jaw after evaluation of imaging. The fit needs to be precise and will require additional appointments to adjust and relieve pressure on your TMJs and craniofacial muscles. The goal is to guide your jaw into a more relaxed, stable position and prevent clenching or grinding from overloading the joint and muscles.

The appliance can help with:
• Jaw pain or soreness
• Headaches related to clenching or grinding
• Clicking, popping, or locking of the jaw
• Muscle tension in the face, neck, or temples
• Tooth wear from grinding

How it works:
• It creates a protective barrier between the upper and lower teeth
• It helps relax the jaw muscles by changing how your teeth come together
• It can reduce pressure inside the TMJ and allow inflammation to settle
• It encourages the jaw to rest in a more balanced position

Patients typically wear the splint at night and sometimes during the day depending on the provider's recommendations. It may take a short adjustment period as the muscles and joints adapt. Don't worry — we are with you every step of the way, with routine follow-ups and adjustments to the orthotic device.`,
  },
  {
    slug: 'myofascial-pain-therapy',
    name: 'Myofascial Pain Therapy & Exercises',
    lane: 'medical',
    subcategory: 'tmj-orofacial-pain',
    summary:
      'A comprehensive exercise program combining myofunctional therapy, myofascial therapy, and isotonic and isometric exercises for TMJ, facial pain, and sleep-disordered breathing.',
    body: `Poor muscle function, muscle tension, and chronic muscle pain are often significant contributors to temporomandibular joint (TMJ) disorders, facial pain, and obstructive sleep apnea. While treatment typically focuses on managing symptoms, there are few comprehensive therapy programs specifically designed to improve the function of the muscles involved in these conditions. Drawing on more than a decade of experience in orofacial pain, oral medicine, sleep disorders, and the myofunctional complex, Dr. Hsu has developed a comprehensive exercise program that combines myofunctional therapy, myofascial therapy, and isotonic and isometric exercises to address a variety of orofacial conditions. During your therapy appointments, our clinical team provides hands-on instruction, monitors your progress, and ensures you are performing each exercise correctly so you can achieve the greatest therapeutic benefit.

Myofunctional therapy: A specialized program of exercises that trains the muscles of the tongue, lips, cheeks, and face to work together properly. These muscles play an important role in breathing, swallowing, speaking, chewing, and maintaining a healthy jaw and airway. When they are not functioning correctly, they can contribute to TMJ pain and muscle tension, teeth grinding or clenching, mouth breathing, snoring and sleep-disordered breathing, tongue thrusting, difficulty swallowing, and poor tongue posture. The goal is to retrain these muscles through a series of simple, repetitive exercises performed both in the office and at home — over time, healthy muscle patterns become automatic. Myofunctional therapy is often recommended alongside TMJ splint therapy, lingual frenectomy, sleep apnea treatment, and oral surgery. For patients with a tongue-tie it is especially important: the exercises strengthen the tongue, improve mobility, and teach the tongue to rest against the roof of the mouth after the release procedure. Without therapy, the tongue may continue its restricted movement patterns, limiting the benefits of treatment.

Myofascial therapy: Similar to physical therapy for the muscles and connective tissue (fascia) of the face, jaw, head, and neck. Gentle manual techniques release tight muscles, decrease trigger points, improve circulation, and restore normal movement. It is commonly recommended for TMJ disorders, facial pain, jaw muscle tension, headaches and migraines, neck pain, limited jaw opening, and muscle soreness from clenching or grinding.

In our office we combine two types of exercise for our orofacial pain and TMD patients — isometric and isotonic — the same approaches used in TMJ rehabilitation, myofunctional therapy, and physical therapy to strengthen muscles, improve coordination, and restore normal jaw function.

Isometric exercises (static strengthening): the muscle contracts without movement. These strengthen muscles without placing excessive stress on the TMJ, improve stability and endurance, reduce muscle guarding and pain, and promote neuromuscular control. Because they are gentle on an irritated joint, rehabilitation programs often start here.

Isotonic exercises (movement strengthening): the muscle contracts while moving through a range of motion. These build strength through movement, increase jaw mobility, restore coordination and function, and improve endurance for everyday activities like chewing and speaking. They are introduced as pain decreases and muscle control improves.

The connection to TMJ and sleep: your tongue is one of the strongest and most influential muscles in your mouth. Ideally it rests gently against the roof of the mouth, supporting your jaw and helping keep your airway open. If the tongue sits low, pushes against the teeth, or cannot move properly due to a tongue-tie or muscle dysfunction, it can contribute to jaw strain, bite problems, mouth breathing, snoring, and obstructive sleep apnea. Myofascial therapy helps restore proper tongue posture and muscle function, allowing your jaw and airway to work more naturally.

What to expect: myofascial therapy is not a quick fix — it is a training program. Just like physical therapy after an injury, the best results come from consistent practice and participation. Most patients begin noticing improvements in muscle awareness and function within a few weeks, with continued progress over several months. The goal is lasting change to muscle habits and better overall oral function.`,
  },

  // ─────── Oral Medicine & Pathology (5) ───────
  {
    slug: 'oral-pathology',
    name: 'Oral Pathology',
    lane: 'medical',
    subcategory: 'oral-medicine-pathology',
    summary:
      'Diagnosis and biopsy of oral lesions — both routine and concerning.',
    body: `Most unusual findings in the mouth turn out to be benign: an aphthous ulcer, a bite injury, a harmless fibroma. But making that distinction reliably requires a trained eye and an understanding of what warrants watching, what warrants testing, and what warrants immediate biopsy. That is oral pathology.

Dr. Brien Hsu brings board-certification in Oral Medicine to every examination. The clinical evaluation of soft-tissue lesions, bone changes, and systemic conditions that affect the mouth is not a secondary skill here; it is a core specialty. We screen at every hygiene visit and at every comprehensive exam, and we maintain a record of any finding that warrants monitoring over time.

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
    body: `Oral lesions are a general term we use to describe any abnormal area in the mouth. This can include changes in the tissue of the gums, tongue, cheeks, lips, or roof of the mouth.

These changes can look or feel different from normal tissue and may appear as:
• Sores or ulcers that do not heal
• White or red patches
• Thickened or rough areas
• Bumps, lumps, or growths
• Areas of irritation, bleeding, or discoloration

Oral lesions can happen for many reasons, including irritation (like biting or rubbing), infections (viral, bacterial, or fungal), immune-related conditions, medication effects, or in some cases, precancerous or cancerous changes. Due to this wide range of causes, it's important to properly evaluate any lesion that does not heal within 10–14 days.

Evaluation may include a clinical exam, monitoring over time, and sometimes a biopsy. An oral biopsy is a small, routine procedure where we take a tiny sample of tissue from an area in the mouth so it can be examined under a microscope. The purpose is to find out exactly what the tissue change is, especially when something does not look normal or does not heal as expected.

We recommend a biopsy when there is a lesion, sore, or area of concern that:
• Has not healed within about 10–14 days
• Looks unusual in color, texture, or shape
• Is growing or changing over time
• Cannot be clearly identified on exam

During the procedure, the area is numbed with local anesthetic, so the patient stays comfortable. A small piece of tissue is then carefully removed. In most cases, stitches are placed to help the area heal. The sample is sent to a board-certified laboratory, where a pathologist examines it to determine the exact diagnosis.

After the biopsy, patients may have mild soreness, swelling, or minor bleeding for a short period of time. Healing typically occurs within 3–5 business days of treatment if any is needed.

What sets us apart? When it comes to oral lesions, we take them very seriously, and we make sure that all care within our scope can be done under our roof. No referrals to separate facilities, no scheduling delays across multiple practices, no gap between the clinician who found the lesion and the one who explains the results. We review the report with you directly: the findings, what they mean, and the treatment plan that follows. If the results warrant referrals to other specialties or further treatment, we coordinate and adapt to the change immediately and stay involved in your care. We know results can be scary, which is why we will be here with you every step of the way. You will never be handed a report and left to interpret it alone. Often we will also educate patients on the possible causes of their lesions and help guide them on methods to reduce or even avoid re-occurrence.`,
  },
  {
    slug: 'oral-cancer-screening',
    name: 'Oral Cancer Screening',
    lane: 'medical',
    subcategory: 'oral-medicine-pathology',
    summary:
      'Visual and tactile examination for soft-tissue lesions and early signs of oral malignancy.',
    body: `Oral cancer is among the most survivable cancers when caught early, and among the most deadly when caught late. The difference almost always comes down to whether someone was looking. We screen every patient at every hygiene visit, because the lesion that will matter most to you may be the one you would never notice on your own.

The screening is a visual and tactile examination: lips, labial mucosa, buccal mucosa, gingiva, hard and soft palate, floor of the mouth, lateral and ventral tongue, oropharynx. We check for lesions, unusual color changes (red, white, or speckled), tissue thickening, ulcerations that have not healed, and asymmetry. It adds five minutes to the visit and is included in the cost of your cleaning.

When something warrants a closer look, we document it, photograph it, and discuss it with you honestly. Some findings are clearly benign and need only monitoring. Some are indeterminate and get a follow-up appointment in two to four weeks to see if they resolve on their own. Many inflammatory lesions do. Findings that do not resolve, or that present with characteristics associated with malignancy, are biopsied in our office without delay.

Risk factors worth knowing about: tobacco and alcohol use remain the primary risk factors, but HPV-associated oropharyngeal cancers are increasing substantially in non-smokers. Age is a factor; so is chronic sun exposure to the lips. None of these are required for a cancer to develop, which is why we screen everyone.

You should not need to ask for this screening. We perform it automatically.`,
  },
  {
    slug: 'oral-cancer-shields',
    name: 'Custom Radiation Shields',
    lane: 'medical',
    subcategory: 'oral-medicine-pathology',
    summary:
      'Custom oral radiation shields and positioning stents that protect healthy tissue during head and neck radiation therapy.',
    body: `Before radiation therapy, your radiation oncologist may recommend a custom oral radiation shield to wear during treatment.

When radiation is directed near the mouth, some of the radiation can scatter inside the oral cavity. This may increase the risk of side effects such as:
• Mouth sores
• Mucositis (painful inflammation of the mouth tissues)
• Dry mouth / xerostomia (reduced saliva production)
• Osteoradionecrosis (bone damage caused by radiation)

Metal fillings, crowns, or other dental restorations may also become heated during treatment and irritate or burn nearby soft tissues.

A custom oral radiation shield helps protect healthy areas of the mouth by:
• Positioning the jaw to reduce the exposure of radiation
• Absorbing some of the radiation
• Reducing unnecessary radiation exposure to healthy tissues
• Preventing soft tissues from directly contacting metal dental restorations during treatment

These stents are typically made from materials such as:
• Polymethyl methacrylate (PMMA)
• Tungsten
• Silicone

Although oral radiation shields and/or positioning stents cannot completely prevent side effects, they may help reduce the risk and severity of complications.

Not every patient needs a custom oral radiation shield and/or positioning stent. Its use depends on factors such as:
• The location of the radiation treatment
• The radiation dose
• The amount of tissue being treated

Your radiation oncology team will determine whether a shield is appropriate for your treatment plan.`,
  },
  {
    slug: 'osteonecrosis',
    name: 'Osteonecrosis',
    lane: 'medical',
    subcategory: 'oral-medicine-pathology',
    summary:
      'Less-invasive evaluation and management of osteonecrosis of the jaw (dead jaw bone), often linked to certain medications or prior radiation.',
    body: `Osteonecrosis of the jaw — sometimes called "dead jaw bone" — occurs when a portion of the jawbone does not heal properly. Over time, this can cause the bone to weaken, become infected, and then necrotic (dead), usually resulting in exposed bone inside the mouth.

This condition can happen for different reasons, but it is most associated with certain medications used to treat osteoporosis, cancer involving the bones, or following radiation therapy to the head and neck.

Symptoms can include:
• Pain or swelling in the jaw
• Exposed bone that does not heal
• Loose teeth
• Drainage or infection
• Difficulty chewing
• Numbness or a heavy feeling in the jaw

Treatment depends on how severe the condition is. The goal is to control pain and infection while preventing the area from worsening and helping the tissue heal as much as possible. A dentist will usually advise the following:
• Antibiotics or antibacterial mouth rinses
• Gentle cleaning of the area
• Avoiding irritation or trauma to the jaw
• Monitoring the area closely
• In some cases, surgery to remove unhealthy bone

Our medical practice specializes in less invasive treatment to slow the spread of osteonecrosis, reduce the risk of further complications, and potentially resolve the problem. If you feel that this applies to you, please contact the office so we can schedule a consultation for you. It is important to understand that healing can take time, and treatment is often focused on managing the condition and preventing progression.`,
  },

  // ─────── Sleep & Airway (2) ───────
  {
    slug: 'sleep-apnea',
    name: 'Sleep Apnea Treatment',
    lane: 'medical',
    subcategory: 'sleep-airway',
    summary:
      'Oral appliance therapy as an alternative to CPAP for mild to moderate obstructive sleep apnea.',
    signature: false,
    body: `If you're waking up tired, snoring through the night, or your partner has nudged you about gasping in your sleep, sleep apnea is worth taking seriously. Untreated obstructive sleep apnea is associated with high blood pressure, cardiovascular disease, metabolic dysregulation, cognitive impairment, and daytime dysfunction that compounds over years. Many patients who need treatment cannot sustain CPAP, which is highly effective when worn consistently, but many people cannot or will not wear it night after night.

Oral appliance therapy offers a well-tolerated alternative. A custom-fitted appliance worn during sleep repositions the lower jaw slightly forward, which opens the posterior airway, stabilizes the soft tissue, and prevents the obstruction that produces apnea events. FDA-cleared oral appliances are indicated for mild to moderate obstructive sleep apnea and for CPAP-intolerant patients with severe OSA when the alternative is no treatment at all.

Dr. Brien Hsu is a Diplomate of the American Board of Dental Sleep Medicine, an original-examination credential that represents rigorous clinical training and case submission across a specialty few dentists pursue. He is the first dentist from the USC School of Dentistry to publish in the Journal of Clinical Sleep Medicine. Sleep medicine is not a secondary service here; it is a clinical specialty.

The process begins with a review of your sleep study results. We work in coordination with your sleep physician. Diagnosis is medicine's domain; appliance design and management is ours. The appliance is custom-fitted from a digital or conventional impression of your teeth, calibrated for your anatomy, and adjusted at follow-up visits as needed. Ongoing monitoring ensures the appliance continues to manage your airway effectively.

We do not diagnose sleep apnea in the dental chair. A qualified sleep physician performs that evaluation. Our role is the appliance therapy that follows.`,
  },
  {
    slug: 'tongue-tie-release',
    name: 'Tongue-Tie Release',
    lane: 'medical',
    subcategory: 'sleep-airway',
    summary:
      'Laser release of a restrictive tongue-tie (lingual frenum) to improve tongue mobility, jaw development, and airway function.',
    body: `A lingual frenectomy is a procedure that releases or removes the tight band of tissue underneath the tongue, called the lingual frenum. When this tissue is too tight or short, it can restrict tongue movement — a condition commonly known as a "tongue tie."

A tongue tie can affect the way the jaw and mouth develop over time. When the tongue cannot rest properly on the roof of the mouth, it may contribute to a narrower upper jaw, crowding of the teeth, bite issues, or improper oral posture. The tongue plays an important role in guiding healthy jaw growth and supporting the airway.

In some individuals, restricted tongue movement may also contribute to airway problems and sleep-disordered breathing, including snoring or obstructive sleep apnea. If the tongue sits lower in the mouth or falls backward during sleep, it can partially block the airway and make breathing more difficult at night. Releasing the tongue tie may help improve tongue posture and airway function, although additional treatment may still be needed depending on the severity of the airway restriction.

During the procedure, the provider carefully releases the tight tissue to allow the tongue to move more freely. The procedure is usually quick and is commonly performed using a laser under local anesthesia.

After the procedure, patients can expect some soreness and swelling for a few days. Stretching exercises may also be recommended to help retrain tongue movement and reduce the chance of the tissue tightening again during healing. Often, if the patient does not perform the exercises regularly, scar tissue will form around the area of the tongue tie and removal of this tissue will be needed at another visit.`,
  },

  // ─────── Surgical & Regenerative — medical context (2) ───────
  {
    slug: 'laser-photobiomodulation',
    name: 'Low Level Laser Therapy / Photobiomodulation',
    lane: 'medical',
    subcategory: 'surgical-regenerative-medical',
    summary:
      '810–980 nm diode laser therapy to relieve nerve and muscle pain, support healing, and aid recovery of the orofacial region.',
    body: `Our Low Level Laser/Photobiomodulation therapy for orofacial pain utilizes 810–980 nm therapeutic diode laser light to promote tissue healing, reduce pain, and enhance recovery of the nerves and muscles involved in jaw motor and sensory function.

Photobiomodulation (PBM): This laser therapy is recommended for patients who have experienced significant trauma or injury to the jaw and orofacial region resulting in nerve pain, altered sensation, or numbness. PBM delivers specific wavelengths of light energy that stimulate cellular repair, encourage nerve regeneration, and help restore normal nerve signaling pathways. By supporting the healing process, this treatment can improve sensation and reduce neuropathic discomfort over time.

Orofacial Muscle Low Level Laser Therapy: This treatment targets the muscles of the jaw, face, and surrounding structures to decrease inflammation, improve circulation, and promote muscle relaxation and healing. It is commonly used in conjunction with our orofacial exercise program and custom orthotic appliance therapy to optimize muscle function and relieve tension associated with temporomandibular disorders (TMD). Additionally, it is frequently performed following PRP/PRF (Platelet-Rich Plasma/Platelet-Rich Fibrin) trigger point injections to enhance the body's natural healing response, accelerate recovery, and support regeneration of the treated muscles and soft tissues.

Together, these non-invasive laser therapies are designed to reduce pain, improve function, and promote long-term healing of both the nerves and muscles of the orofacial region.`,
  },
  {
    slug: 'ultrasound-guided-procedures',
    name: 'Ultrasound-Guided Procedures',
    lane: 'medical',
    subcategory: 'surgical-regenerative-medical',
    summary:
      'Real-time ultrasound imaging guides blood draws and therapeutic injections precisely — fewer needle sticks, greater accuracy, and improved safety.',
    body: `Ultrasound-guided blood draw: An ultrasound-guided blood draw uses real-time ultrasound imaging to locate veins that are difficult to see or feel. A trained medical professional uses a handheld ultrasound probe to visualize the vein and guide a needle directly into the blood vessel, increasing the likelihood of successful access on the first attempt. This technique minimizes discomfort and reduces the need for multiple needle sticks. It is recommended for patients with difficult venous access, including those who have deep veins that cannot be easily felt through the skin, chronic illnesses requiring frequent blood draws or IV access, scar tissue from repeated needle insertions, veins that are dehydrated or collapse easily, or other physical characteristics that make veins difficult to locate.

Ultrasound-guided injection: An ultrasound-guided injection is a minimally invasive procedure in which a healthcare provider uses live ultrasound imaging to precisely guide a needle into a joint, tendon, bursa, muscle, or around a nerve. This allows medication — typically a local anesthetic or other therapeutic agent — to be delivered directly to the source of pain or inflammation, improving accuracy, effectiveness, and safety. Your provider may recommend an ultrasound-guided injection to improve the accuracy of medication placement, diagnose the source of pain, treat joint, tendon, ligament, bursa, or nerve-related conditions, reduce inflammation and relieve pain, or avoid nearby nerves, blood vessels, and other important structures.

Compared with traditional landmark-guided techniques, ultrasound guidance offers several important advantages:
• Greater accuracy — real-time imaging allows precise needle placement
• Fewer needle sticks — significantly reduces failed attempts and repeat insertions
• Increased comfort — less tissue trauma results in less pain and bruising
• Improved safety — helps avoid nerves, arteries, and other sensitive structures
• Better treatment outcomes — ensures medication reaches the intended target for maximum effectiveness
• Faster care — reduces delays by improving first-attempt success, especially in patients with difficult vein access`,
  },

  // ═════════════════════════════════════════════════════════════════
  // DENTAL LANE (23 services across 5 subcategories)
  // ═════════════════════════════════════════════════════════════════

  // ─────── Preventive Dentistry (5) ───────
  {
    slug: 'professional-cleaning',
    name: 'Professional Cleaning',
    lane: 'dental',
    subcategory: 'preventive',
    summary:
      'Bi-annual hygiene visits done thoroughly — the foundation everything else rests on.',
    body: `The foundation of every healthy mouth is a consistent cleaning schedule, and we take that foundation seriously. A professional cleaning removes the calculus and biofilm that daily brushing and flossing cannot reach: the buildup that accumulates at the gumline, in the proximal spaces, and in the pockets that form as gum tissue ages. Without it, that accumulation becomes the primary driver of both decay and periodontal disease.

Most patients do well with two visits per year. Others benefit from three or four cleanings annually: patients with a history of periodontal disease, those with crowded or difficult-to-clean dentition, patients managing systemic conditions that increase oral disease risk, or those with a high decay rate. We establish that cadence at your first comprehensive visit and adjust it over time based on what we actually see at each appointment.

Each visit is more than an instrument appointment. We document any changes since the last visit, probe pocket depths where indicated, screen for soft-tissue changes and oral lesions, apply fluoride to strengthen enamel against acid attack, and apply sealants where deep pitting in molars creates ongoing decay risk. We also review your home care, not to lecture, but because small technique corrections often make a meaningful difference in where decay and inflammation occur.

Patient education at these visits is practical: what is happening in your specific mouth, what habits are driving problems, what the X-rays show, and what we plan to monitor. You should leave each cleaning appointment with a clearer picture of your oral health than when you arrived.

If it has been years since your last professional cleaning, do not let that delay you further. We see that every week. Catching up is straightforward, and judgment is not part of how we practice.`,
  },
  {
    slug: 'comprehensive-exam',
    name: 'Comprehensive Exam',
    lane: 'dental',
    subcategory: 'preventive',
    summary:
      'Full-mouth diagnostic exam with full-mouth series or panoramic imaging, periodontal charting, and oral cancer screening.',
    body: `A thorough diagnosis at the start of care prevents a long list of problems that come from treating teeth in isolation. The comprehensive exam is where we establish a baseline for your whole oral health: not just the chief complaint, not just the teeth that hurt, but the full picture.

At a new-patient visit we take a full-mouth series of X-rays or a panoramic radiograph, depending on what your anatomy and history call for. We perform complete periodontal charting, recording pocket depths, bleeding on probing, recession, and mobility, so we can track the actual disease status of your gums over time rather than relying on visual inspection alone.

The soft-tissue examination covers lips, cheeks, tongue, floor of mouth, palate, and the back of the throat. This is the oral cancer screening, performed at every comprehensive exam at no extra cost. Early detection is the single largest factor in survival, and the screening takes only a few minutes.

We also evaluate your bite, look for signs of grinding or clenching, and check existing restorations for integrity and marginal fit.

The consultation that follows is not a sales presentation. We explain what we found, what it means, and what your options are, including doing nothing when that is a reasonable choice. A treatment plan is built with you, not handed to you.

We recommend a comprehensive re-evaluation each year.`,
  },
  {
    slug: 'scaling-root-planing',
    name: 'Scaling & Root Planing',
    lane: 'dental',
    subcategory: 'preventive',
    summary:
      'Deep cleaning below the gumline for patients with active or early periodontal disease.',
    body: `When pocket depths exceed four millimeters and calculus has formed below the gumline, a standard cleaning cannot reach the problem. Scaling and root planing, sometimes called a deep cleaning, is the first active treatment for early to moderate periodontitis, and it is frequently the only treatment needed to arrest the disease progression when caught at that stage.

The procedure removes calculus, plaque, and bacterial toxins from the root surfaces both above and below the gum margin. The root planing component smooths the root surface, which discourages future bacterial adhesion and allows the gum tissue to reattach and form a healthier, shallower pocket. After the procedure, a medicated solution is often irrigated into the treated pockets to address any remaining bacterial burden.

We complete the procedure 2 quadrants at a time, typically one side of the mouth first, under local anesthesia, which means each session is comfortable and focused. We schedule a re-evaluation 1 month post-treatment to re-probe and assess the tissue response. Pockets that have not responded adequately may need additional intervention.

The indication for scaling and root planing is clinical, not cosmetic. If your probe readings are in the healthy range at your annual exam, you do not need this procedure. If they are not, continuing with routine cleanings does not address the underlying disease. We screen proactively at every hygiene visit and recommend deep cleaning when the measurements support it, not as a default.`,
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

We recommend fluoride for patients across all ages with elevated decay risk: those with dry mouth from medications, orthodontic patients, people with a history of frequent cavities, and patients with exposed root surfaces from recession. Sealants are most valuable on newly erupted permanent molars in children and adolescents, but we also place them on adult patients whose molar anatomy creates ongoing risk.`,
  },
  {
    slug: 'occlusal-splints',
    name: 'Occlusal Splints',
    lane: 'dental',
    subcategory: 'preventive',
    summary:
      'Custom-fitted night guards for bruxism, clenching, and bite-force protection.',
    body: `Grinding and clenching is one of the most common and least noticed sources of dental damage. Most people who do it are entirely unaware, because it happens during sleep. The signs accumulate over years: worn enamel, chipped cusp tips, cracked teeth, morning jaw soreness, headaches on waking, and increasing fracture risk in back teeth that have already been restored. By the time patients notice, the damage is already significant.

A custom occlusal splint protects your teeth at night from the wear that happens when you clench and grind. It does not stop the bruxism itself, as this is a normal neurological response, but it intercepts the damage pathway. Worn enamel does not grow back; protecting what remains is the whole point.

We fabricate splints from digital scans or conventional impressions. The splint is fitted and then adjusted during a follow-up appointment, with particular attention to the way it sits in your bite. We adjust and refine over time as the appliance wears and as your bite changes.

An occlusal splint for bruxism is a distinct device from a TMJ oral appliance, even though both are worn during sleep. TMJ appliances are designed with specific measurements to unload and protect the TMJ joints from further wear when sleeping. If you have both conditions, we address them with the appropriate appliances for each.`,
  },

  // ─────── Restorative Dentistry (7) ───────
  {
    slug: 'composite-fillings',
    name: 'Composite Fillings',
    lane: 'dental',
    subcategory: 'restorative',
    summary:
      'Tooth-colored composite restorations placed to halt decay and restore tooth function.',
    body: `When a tooth has decay, our job is to stop it before it spreads, then restore the tooth so you can chew, smile, and forget about it. The decayed tissue is removed, the cavity is cleaned, and a tooth-colored resin is bonded into place, shaped to restore the original contour of the tooth and polished to match the natural enamel around it. Done well, a composite filling is indistinguishable from the tooth it repairs.

The bonding mechanism matters. Modern adhesive composites form a chemical and mechanical bond with tooth structure, which means they reinforce what remains rather than just filling a void. A well-placed composite filling seals the cavity margin against re-contamination, which is what determines long-term durability. We place all direct restorations under rubber dam isolation — the moisture control this provides at the bonding step is the primary determinant of how long the filling lasts.

We use composite for the full range of direct restorations: small cavities in posterior teeth, interproximal decay in both anterior and posterior teeth, chipped or fractured anterior teeth, and conservative restorations where tooth structure needs to be preserved. Composite is also used to replace deteriorating amalgam restorations when the indication supports it.

What to expect: the appointment is completed in a single visit with local anesthesia. Some sensitivity to hot and cold in the days following placement is common and resolves as the tooth settles. We check your bite before you leave; if something feels off after the anesthetic wears off, call and we will adjust it.

We do not claim a composite filling lasts forever. With proper home care and regular maintenance visits, a decade or more of service is a realistic expectation. Fillings at high-stress sites, molar contacts and areas subject to heavy bite force, are monitored at every hygiene visit.`,
  },
  {
    slug: 'onlays',
    name: 'Onlays',
    lane: 'dental',
    subcategory: 'restorative',
    summary:
      'Custom "partial crown" restorations that rebuild damaged cusps and protect the tooth while preserving healthy structure.',
    technologyRefs: ['trios'],
    body: `When a tooth has more damage than a filling can reliably restore, but not so much that it needs a full crown, an onlay is the conservative answer. An onlay is a custom-made restoration that rebuilds one or more of the chewing cusps of a back tooth, bonded into place to restore the tooth's original strength and shape while preserving the healthy structure a crown would otherwise remove.

The distinction matters. A large direct filling at a high-stress site can flex and leak over time, and eventually crack the tooth it was meant to save. A crown solves the strength problem but requires reducing the entire tooth. An onlay sits in between: it covers and protects the vulnerable cusps without sacrificing sound tooth structure, which is why it is often called a "partial crown."

We design onlays from a digital scan with our 3Shape Trios scanner — no putty impression trays — and the restoration is fabricated from tooth-colored ceramic or composite that matches the surrounding enamel. Because the bond seals the margin against bacteria, a well-placed onlay both restores function and protects the tooth from further decay.

Onlays are indicated for teeth with large failing fillings, fractured cusps, or decay too extensive for a direct restoration, but where enough healthy tooth remains to avoid a crown. The procedure typically takes two visits — one to prepare and scan the tooth, one to bond the finished restoration — with a temporary in between. (An inlay is the same idea for damage that sits within the cusps rather than across them; we choose between the two based on exactly what the tooth needs.)`,
  },
  {
    slug: 'direct-composite-veneers',
    name: 'Direct Composite Veneers',
    lane: 'dental',
    subcategory: 'restorative',
    summary:
      'Esthetic-focused composite veneers placed in a single visit. Conservative and reversible.',
    body: `Some smile transformations do not require a laboratory, a two-week wait, or irreversible tooth preparation. Direct composite veneers are sculpted chairside in a single appointment: composite resin shaped and polished directly on the tooth surface to correct shape, color, or proportion. No impressions sent to a lab, no temporaries, no second appointment. Very minimal enamel is removed, or none at all.

The range of problems they address is broader than many patients expect. Direct veneers can close a gap between the front teeth, build out a tooth that is too narrow, repair a chipped or worn edge, cover discoloration that does not respond to whitening, and reshape teeth with irregular contour. Cases involving multiple front teeth can often be completed in one visit.

The technique is exacting. Building tooth form in resin requires an understanding of dental anatomy, light behavior, and color characterization — the same skills that drive good direct composite work across the rest of the mouth, applied at a higher level of esthetic demand.

The trade-offs are honest. Direct composite does not have the translucency or strength of a laboratory-fabricated porcelain veneer. A typical lifespan is five to seven years, after which the composite may need touch-up or replacement. Polishability is good but not identical to glazed ceramic. For patients with heavy bite forces or prominent bruxism habits, composite at the front teeth carries more risk of chipping.`,
  },
  {
    slug: 'porcelain-veneers',
    name: 'Porcelain Veneers',
    lane: 'dental',
    subcategory: 'restorative',
    summary:
      'Custom-shaped porcelain shells that change a smile with minimal reduction of the underlying teeth.',
    body: `Porcelain veneers are thin ceramic shells custom-fabricated to cover the front surface of teeth, changing their shape, color, length, and proportion while preserving most of the underlying tooth structure. When the case is designed well and executed well, the result is a smile that looks entirely natural and is indistinguishable from healthy enamel.

The range of problems veneers address: severe discoloration that whitening cannot correct (tetracycline staining, fluorosis, intrinsic gray tones), chipped or worn edges, irregular shape or size, minor crowding or spacing, and congenitally malformed teeth. They are not the right solution for every cosmetic problem, and we discuss alternatives honestly before recommending veneers.

Preparation involves removing a thin layer of enamel from the front surface of each tooth, about the thickness of a contact lens, to create space for the veneer without making the tooth look bulky. This is an irreversible step, which is why the design phase matters so much. We use our 3Shape Trios digital scanner to capture the existing dentition and plan the case in three dimensions. A digital or provisional mock-up lets you see the proposed proportions and color in your mouth before any preparation begins. We do not skip that step.

Temporaries protect the prepared teeth while the porcelain is fabricated. The second appointment, delivery, involves careful bonding and bite verification. Post-delivery adjustments are normal; we schedule a follow-up to make them.

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
    body: `A crown is the appropriate restoration when a tooth can no longer be repaired with a filling alone: when decay is too extensive, when a fracture line runs too deep, when a large existing restoration has failed, or when a tooth has been treated with a root canal and needs full-coverage protection. The crown encases the entire visible portion of the tooth, restoring it back to functionality: the ability to bite and chew normally, to close the bite properly, and to hold its position in the arch.

We design and plan crowns using our 3Shape Trios digital scanner. The scanner captures the tooth and the surrounding dentition in three dimensions without the discomfort and distortion of conventional impression trays. Digital files go directly to the laboratory, which shortens turnaround time and produces restorations with consistently accurate fit at the margin. That fit is the single most important variable in how long a crown stays in service.

Material selection is matched to the clinical situation. Full zirconia is the current standard for posterior teeth under heavy load: extremely strong, biocompatible, and conservative in preparation requirements. Lithium disilicate (eMax) offers exceptional esthetics with good strength for anterior and premolar positions. Porcelain-fused-to-metal remains an option where specific clinical factors favor it. We discuss the trade-offs with you before any preparation begins.

A bridge replaces one or more missing teeth by crowning the teeth on either side of the gap and suspending one or more artificial teeth between them. The adjacent teeth serve as anchors, which means some healthy tooth structure must be prepared to accommodate the crowns. For patients with natural, unrestored adjacent teeth, we discuss implants as an alternative that preserves that structure entirely.

The crown and bridge appointment involves two visits: preparation and temporaries at the first; delivery and adjustment at the second. The temporary protects the prepared tooth between visits and gives you a preview of the final restoration's shape.`,
    technologyRefs: ['trios'],
  },
  {
    slug: 'dentures',
    name: 'Dentures & Partial Dentures',
    lane: 'dental',
    subcategory: 'restorative',
    summary: 'Full and partial removable prosthetics, including immediate dentures.',
    body: `Losing teeth changes more than appearance. It changes how you eat, how you speak, and over time, how the underlying bone behaves. Dentures address those changes with a removable prosthesis custom-made to fit your ridge and replicate natural tooth form. When well-made and properly fitted, they restore chewing function and support the facial structure that the teeth were maintaining.

A conventional full denture is fabricated after the extraction sites have healed and the ridge has remodeled — typically four to six weeks after extractions. This timeline allows the denture to be fitted to stable tissue, which means better initial fit and less need for early relining. The process involves several appointments: impressions, bite registration, a try-in with the teeth set in wax where you approve the look before final processing, and the delivery appointment.

Immediate dentures are made before the extractions occur and the denture is placed at the same appointment as the extractions. The patient leaves without a gap in their smile, which is the primary advantage. The trade-off is that the tissue continues to remodel for months after extraction, which means the immediate denture will loosen and require relining as the ridge changes shape. Most patients with immediate dentures need a reline within the first year.

Partial dentures replace several missing teeth in an arch where natural teeth remain. A framework of metal or flexible resin clasps onto the remaining teeth for retention. Partial dentures prevent the remaining teeth from drifting into the gap and restore chewing balance across the arch.

For patients who want greater stability and retention than a conventional denture provides, implant-retained overdentures attach to implants placed in the jaw. The implants provide anchorage that prevents the prosthesis from moving during function. For patients who find conventional dentures unreliable, this is a meaningful quality-of-life improvement.`,
  },
  {
    slug: 'teeth-whitening',
    name: 'Teeth Whitening',
    lane: 'dental',
    subcategory: 'restorative',
    summary:
      'In-office and at-home whitening, including deep-bleaching for stubborn cases.',
    body: `Teeth discolor for different reasons, and the reason determines which type of whitening will actually work. Extrinsic staining from coffee, tea, or wine responds quickly to surface bleaching agents. Intrinsic discoloration, the kind embedded in the dentin, resulting from aging, old restorations, tetracycline exposure, or fluorosis, requires a different approach. Most whitening products, including the higher-end over-the-counter options, do not adequately address intrinsic color.

The problem with many whitening treatments is that they prioritize initial brightness without addressing tooth permeability — the capacity of the whitening agent to penetrate into the dentin where the deeper staining lives. Dehydration from in-office plasma lights creates an apparent whitening effect that partially reverses when the tooth rehydrates. High-concentration gel without preparation can cause sensitivity.

We take a more deliberate approach. Before any bleaching begins, we use a medicated paste that strengthens the enamel and conditions the tooth for whitening, reducing sensitivity and improving the depth of penetration that follows. Our deep-bleaching protocol alternates in-office and supervised at-home phases, allowing the bleaching agent to work progressively without the discomfort associated with high-concentration single-session treatments.

Deep bleaching is indicated for cases that other approaches cannot move: stubborn intrinsic staining, severe discoloration from tetracycline exposure or fluorosis, and patients who have tried other whitening methods with disappointing results. It achieves color change that single-session in-office treatment typically cannot match.

We also screen for restorations and crowns in the smile zone before recommending whitening. Composite and ceramic do not bleach with the teeth. Any restorations matched to the pre-whitening shade will need replacement after treatment to match the new color. We discuss this upfront.

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
    body: `Root canal therapy saves a tooth that would otherwise need to be extracted. When decay reaches the pulp (the soft tissue inside the tooth containing the nerve and blood supply), or when trauma, a crack, or a leaking crown causes the pulp to become infected or inflamed, the infection cannot resolve on its own. The tooth needs to be either treated or removed. Root canal therapy cleans and seals the canals, removes the source of infection, and allows the tooth to remain in the mouth functioning normally.

The procedure has a reputation for discomfort that belongs to an older era of dentistry. Modern root canal therapy, performed under adequate local anesthesia, is not significantly different from having a filling placed. Most patients who are anxious beforehand are surprised by how uneventful the experience actually is.

An access opening is made through the crown of the tooth. The pulp, nerve tissue, and bacteria are removed using a series of files, and the canal system is shaped to receive the permanent filling material. Irrigation with disinfecting solutions throughout the procedure addresses the bacterial load that instruments alone cannot reach. The cleaned canals are then sealed with a material called gutta-percha, which prevents reinfection.

Most cases are completed in a single appointment; multi-rooted teeth or cases with more complex anatomy may require a second visit. After root canal treatment, the tooth needs a permanent restoration — most posterior teeth require a crown to protect against fracture, since the treated tooth becomes more brittle without its vital tissue.`,
  },
  {
    slug: 'apicoectomy',
    name: 'Apicoectomy',
    lane: 'dental',
    subcategory: 'endodontics',
    summary:
      "Surgical endodontic procedure to save a tooth when conventional retreatment isn't viable.",
    body: `Sometimes a root canal that was completed correctly, years or decades ago, develops new problems at the root tip: residual infection, a cyst that has formed around the apex, or a canal that cannot be reached from above because of a post or a well-fitting crown that would be difficult to remove and replace. In those cases, the surgical approach is to address the problem from the other direction: through the gum and bone rather than through the crown of the tooth.

An apicoectomy (surgical endodontic treatment) removes the tip of the root and the surrounding infected tissue, then seals the canal from the apex to prevent reinfection. The access is made through a small flap in the gum tissue, a small opening in the overlying bone, and the root tip is removed with a precise amount of the root length to eliminate the source of the problem. A retrograde filling material seals the end of the canal.

The procedure is done under local anesthesia in our office. Post-operative swelling and some discomfort for a few days are typical; most patients are comfortable with over-the-counter analgesics and return to normal activity quickly. Sutures are removed at a follow-up appointment within a week to ten days.

Not all failing root canals are best managed surgically. Retreatment through the tooth remains the better option in many cases. We evaluate the anatomy with imaging before recommending a direction, and we do not default to surgery when retreatment is a more conservative and equally appropriate choice.`,
  },
  {
    slug: 'root-canal-retreatment',
    name: 'Root Canal Retreatment',
    lane: 'dental',
    subcategory: 'endodontics',
    summary:
      'Re-entry of a previously root-canalled tooth to address residual infection or technical issues.',
    body: `A tooth that was successfully root-canalled years ago can develop new problems. The seal at the filling material may have broken down over time, allowing bacteria to re-enter. The original treatment may have missed a canal, particularly in multi-rooted teeth where the anatomy can be complex. A crack may have formed. Or new decay may have progressed far enough to compromise the integrity of the existing treatment. In all these situations, the tooth is not lost, but it needs to be treated again.

Root canal retreatment re-enters the tooth through the crown, removes the prior filling material, re-cleans and re-shapes the canal system, and re-seals it. This is technically more demanding than an initial root canal: the existing gutta-percha must be dissolved or mechanically removed, posts may need to be taken out, and calcified canals that were challenging the first time must be navigated again.

Before recommending retreatment, we evaluate the tooth carefully: the existing crown or restoration, the quality of the original treatment, the bone levels around the root, and whether there are signs of fracture that would make the tooth unrestorable regardless of the endodontic outcome. Retreatment is the right choice when the tooth is structurally sound and the source of the problem is addressable through the canal.

If retreatment is not viable because of fracture, anatomy, or the condition of the surrounding bone, we discuss the surgical alternative (apicoectomy) or, when the tooth genuinely cannot be saved, the extraction-and-replacement pathway.`,
  },

  // ─────── Oral Surgery — dental context (3) ───────
  {
    slug: 'extractions',
    name: 'Extractions',
    lane: 'dental',
    subcategory: 'oral-surgery-dental',
    summary:
      'Simple and surgical extractions, performed in-house using CBCT planning.',
    body: `Our goal is to save every tooth we can. However, when extraction is necessary, we make that determination based on clinical evidence: extensive decay that leaves too little tooth structure for a restoration to hold, advanced periodontal disease with bone loss that cannot support the tooth's function, a fracture that extends below the bone level, symptomatic impaction, or orthodontic requirements. We explain the reasoning before we proceed.

Most extractions can be done in our office under local anesthesia without a hospital referral or general sedation. Simple extractions (teeth with intact roots that can be loosened and removed in one piece) are straightforward. Surgical extractions involve sectioning the tooth, removing bone where necessary, or working around curved or fused root anatomy. We handle both.

Before any surgical extraction, we capture a CBCT scan when the anatomy warrants it. The three-dimensional image from our iCAT FLX shows us the relationship between the roots and adjacent structures — the inferior alveolar nerve in the lower jaw, the maxillary sinus in the upper jaw, root curvature that a flat X-ray would underrepresent. That information changes the surgical approach and prevents avoidable complications.

When bone grafting to preserve the site for future use is indicated, we discuss it before the extraction. Placing a graft at the time of extraction is significantly simpler and more effective than attempting augmentation later. Post-operative instructions are provided in writing at the appointment.`,
    technologyRefs: ['cbct'],
  },
  {
    slug: 'bone-grafting',
    name: 'Bone Grafting',
    lane: 'dental',
    subcategory: 'oral-surgery-dental',
    summary:
      'Site preservation and ridge augmentation to support future implant placement.',
    body: `When a tooth is removed, the bone that surrounded the root begins to resorb. Without a tooth root transmitting bite forces into the bone, the body's metabolic activity reduces bone volume. Within six to twelve months of an extraction, a significant percentage of the ridge width and height can be lost — not enough bone for an implant, a ridge shape that makes denture fit difficult, and a cosmetic contour change visible at the gumline.

A socket preservation graft placed at the time of extraction substantially reduces this resorption. The graft material — a combination of processed bone graft material and, when indicated, platelet-rich fibrin from your own blood — fills the socket, maintains the three-dimensional volume of the site, and provides a scaffold for the body's own bone-forming cells to repopulate the space. Over three to four months, the graft integrates and matures into bone that can support an implant or a stable prosthesis.

Grafting at extraction is considerably simpler than attempting ridge augmentation later. The socket is already prepared, the surrounding bone walls are intact, and the healing starts immediately. Waiting until bone loss has already occurred means a more complex surgical procedure, a longer treatment timeline, and a less predictable outcome.

We also perform more extensive ridge augmentation procedures for patients who present with bone deficiency from previous extractions, severe periodontal bone loss, or trauma — cases where the extraction socket has long closed and the grafting must be done as a separate surgical procedure.`,
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

If the extraction site did not receive a bone graft, or if bone volume has already been lost, augmentation may be required before implant placement. Most patients with a preserved site can proceed directly to surgery. The implant is placed under local anesthesia in our office. The integration period takes three to four months; during that time, a temporary restoration maintains the esthetic and spatial situation.`,
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
    body: `Periodontal disease is a chronic bacterial infection of the gum tissue and supporting bone around the teeth. It begins as gingivitis, which is inflammation without structural damage, reversible with improved hygiene and a cleaning, and progresses to periodontitis when the bacterial burden persists long enough to trigger bone resorption. The loss of bone that supports the teeth is not reversible. Managing periodontal disease is about arresting the progression, not restoring what has already been lost.

The disease is widespread and underdiagnosed. A large portion of adults over thirty have some degree of periodontal involvement, and many of them do not know it. Periodontitis is frequently painless until it is advanced. The probing that happens at a comprehensive exam and at regular hygiene visits is the only way to detect it reliably.

We screen at every cleaning visit. When we find pocket depths and bone loss consistent with periodontitis, we treat it directly rather than monitoring it through cleaning-only appointments. Active treatment begins with scaling and root planing: thorough removal of calculus and bacterial biofilm from root surfaces below the gum margin, under local anesthesia, one quadrant at a time. For infected pockets around teeth or implants, laser-assisted decontamination with our diode laser reaches areas that instruments alone cannot adequately address.

After active treatment, we schedule the patient on a periodontal maintenance program — typically every three to four months rather than the standard six-month recall. The maintenance interval is based on individual risk, disease severity, and tissue response, not a fixed standard. Periodontal disease can be controlled with consistent maintenance; it progresses reliably without it.`,
  },
  {
    slug: 'crown-lengthening',
    name: 'Crown Lengthening',
    lane: 'dental',
    subcategory: 'periodontal-surgical',
    summary:
      'Surgical exposure of additional tooth structure for restorative or cosmetic reasons.',
    body: `Crown lengthening creates access to tooth structure that the gum tissue and bone are covering — either because the tooth has broken at or below the gumline, or because the gumline itself sits too high to allow a restoration or veneer to be placed with proper margins.

The restorative indication is more urgent. When a tooth breaks near or below the gumline, the remaining structure may be too short for a crown to grip. Attempting to place a crown without adequate tooth exposure above bone results in a restoration that violates the biologic width — the soft-tissue attachment zone the body maintains around every tooth. That violation causes chronic inflammation and progressive bone loss that undermines the restoration over time. Crown lengthening surgically repositions the gum and bone to expose the minimum tooth structure needed for a sound restoration, respecting the biologic boundary while saving a tooth that would otherwise need extraction.

The cosmetic indication is different in severity but meaningful in impact. A smile that shows a disproportionate amount of gum tissue — sometimes called a "gummy smile" — often has teeth that are fully present beneath the tissue. Crown lengthening removes the excess and reveals the true proportion of the teeth, sometimes transforming the smile without any cosmetic restorative work at all.`,
  },
  {
    slug: 'gingivectomy',
    name: 'Gingivectomy',
    lane: 'dental',
    subcategory: 'periodontal-surgical',
    summary:
      'Soft-tissue contouring for periodontal pockets, hyperplasia, or cosmetic shaping.',
    body: `A gingivectomy removes excess or diseased gum tissue when the anatomy creates a clinical problem that cannot be resolved through cleaning or medication alone. The result is healthier tissue, shallower pockets, and gum margins that sit at the right level relative to the teeth.

The most common indications fall into a few categories. Drug-induced gingival hyperplasia (enlargement of the gum tissue as a side effect of certain blood pressure medications, anticonvulsants, or immunosuppressants) creates pockets that trap bacteria and are impossible to clean adequately. Gingivectomy removes the excess tissue and restores a cleaner tissue architecture. Persistent pockets that remain after scaling and root planing, and that have not responded to conventional maintenance, can be reduced surgically to bring the pocket depth within a manageable range. Cosmetic asymmetry, such as gum margins at different levels, uneven display, or tissue that sits too low and makes teeth appear short, can be refined to create better proportions.

We perform most gingivectomies with our diode laser rather than a conventional scalpel. The laser seals tissue as it works, which means significantly less intraoperative bleeding, less post-operative swelling, and a faster recovery compared to traditional techniques. Sutures are often unnecessary for laser procedures. Most patients describe the post-operative experience as mild — some sensitivity for a few days and soft-diet guidance, but not the extended healing associated with conventional gingival surgery.

The procedure is done under local anesthesia. For patients with dental anxiety, the laser approach is considerably less intimidating than scalpel surgery, and the absence of bleeding changes the experience meaningfully.

The tissue response is typically visible within a few weeks as the swelling fully resolves and the new gum margin heals in place.`,
  },
  {
    slug: 'frenectomy',
    name: 'Frenectomy',
    lane: 'dental',
    subcategory: 'periodontal-surgical',
    summary:
      'Release of restrictive frenum attachments: lip-tie, tongue-tie, or labial frenum.',
    body: `A frenum is a small fold of tissue that connects the lip or tongue to the gum. Everyone has them. When a frenum is unusually thick, short, or attached too close to the gum margin, it creates clinical problems. When those problems are significant, a frenectomy releases the attachment.

The labial frenum, the tissue connecting the upper lip to the gum above the front teeth, can pull on the gum tissue directly, contributing to recession and making adequate oral hygiene difficult in that area. In some patients, a thick or low labial frenum also maintains a gap between the upper central incisors. Orthodontic treatment can close the gap mechanically, but without frenectomy, the tissue can cause the space to reopen after braces or aligners are removed. Timing the frenectomy in coordination with orthodontic treatment matters: we work with your orthodontist directly.

Lingual frenectomy, releasing a tongue tie, addresses restriction in tongue mobility that can affect speech articulation, the ability to breastfeed in infants, and oral function in older children and adults. Tongue ties range in clinical significance from mild and functionally irrelevant to severe and meaningfully disruptive. We evaluate rather than treat automatically, because not every tongue tie requires intervention.

We perform frenectomies with our diode laser. The procedure takes only a few minutes under local anesthesia. The laser approach seals the tissue as it cuts, which means minimal bleeding, rapid healing, and rarely any need for sutures. Post-operative discomfort is typically mild and short-lived.`,
  },
  {
    slug: 'alveoloplasty',
    name: 'Alveoloplasty',
    lane: 'dental',
    subcategory: 'periodontal-surgical',
    summary:
      'Surgical smoothing and reshaping of the bony ridge after extractions.',
    body: `After teeth are extracted, the bone that supported them does not heal in a smooth, even contour on its own. Sharp ridges, bony projections, and irregular undercuts are common, particularly after multiple extractions in a row, or after teeth that were already compromised by bone loss or infection. That uneven ridge creates problems: pressure points under a denture that cause pain and sores, poor prosthesis stability, and, in some cases, discomfort even without a prosthesis.

Alveoloplasty reshapes and smooths the bony ridge at the time of extraction, removing sharp peaks, filling in undercuts, and contouring the bone to a form that heals with a smooth, regular shape. It is most commonly done at the same appointment as multiple extractions, before the tissue is sutured closed, while the surgical site is already open. Adding alveoloplasty at that stage adds minimal time and healing burden compared to the significant benefit it provides.

For patients receiving an immediate denture — one placed the same day as the extractions — alveoloplasty is particularly important. The denture is made in advance using pre-extraction impressions, and the fit depends on the ridge conforming reasonably well to what the lab anticipated. Contouring the bone at extraction improves how the immediate denture seats and reduces the number of pressure-point adjustments needed in the weeks that follow.

Alveoloplasty is also performed as a separate procedure in patients who have already healed after prior extractions but whose ridge shape is incompatible with a well-fitting prosthesis. This is a less common scenario, but it is an option when the situation warrants it. Most patients benefit most from addressing it at the time of extraction.`,
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

export interface LaneServiceGroup {
  subcategory: ServiceSubcategory;
  label: string;
  services: Service[];
}

/**
 * A lane's services grouped by subcategory, in canonical subcategory order.
 * Shared by the header services menu (desktop panel + mobile accordion) and the
 * /services index page so they never drift. Empty subcategories are omitted.
 */
export function getLaneServiceGroups(lane: ServiceLane): LaneServiceGroup[] {
  return SERVICE_SUBCATEGORY_BY_LANE[lane]
    .map((subcategory) => ({
      subcategory,
      label: SERVICE_SUBCATEGORY_LABELS[subcategory],
      services: getServicesBySubcategory(subcategory),
    }))
    .filter((group) => group.services.length > 0);
}

/** URL for a service detail page: /dental/<slug> or /medical/<slug>. */
export function serviceHref(service: Service): string {
  return `/${service.lane}/${service.slug}`;
}
