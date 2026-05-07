import type { Doctor } from './schemas';

/**
 * Doctor team. Bios extracted from `source/pages/doctors-dr-*.md` (scraped
 * from the existing dentisthsu.com WordPress install — these are the
 * dentist's own published bios, lightly edited for line breaks).
 *
 * **Note on Dr. Amandeep Singh:** the WordPress slug for this doctor is
 * `dr-earlene-milone-2` — almost certainly leftover from a prior associate.
 * We use the clean slug `dr-amandeep-singh` and 301-redirect the old URL.
 */
export const doctors: Doctor[] = [
  {
    slug: 'dr-brien-hsu',
    name: 'Dr. Brien Hsu',
    title: 'DDS, MS · Lead Clinician',
    portrait: { src: '/images/doctors/dr-brien-hsu.png', alt: 'Dr. Brien Hsu', objectPosition: '30% center' },
    short:
      'Lead clinician since 1999. USC DDS and Master of Science in Orofacial Pain, Oral Medicine, and Sleep Disorders. Known throughout the Inland Empire as "the gentle dentist."',
    bio: `After graduating Valedictorian of his high school class, Dr. Hsu was selected as one of the few in the nation to attend the Accelerated Dental Advanced Placement Tract at USC. He became one of the youngest doctors in his class to earn the Doctor of Dental Surgery degree — in fact one of the youngest in USC Dental School history.

In 1999, Dr. Hsu spent a year as a volunteer dentist serving families throughout impoverished areas of California. Since 2000, he has been in private practice while continuing to volunteer his services to free dental clinics and charitable organizations each year. In 2002, he took under his wing a private dental office in Alta Loma that has been serving the Rancho Cucamonga area since 1993. He quickly made a name for himself in the neighborhood as "the gentle dentist."

In 2012, construction of his new state-of-the-art dental office began, focused on how gentle dentistry could be provided in a comfortable environment. Construction completed in 2013, enabling Dr. Hsu to move into one of the most advanced family dental centers in the Inland Empire.

In his effort to improve care for patients with complex medical problems and sleep disorders, Dr. Hsu completed his Master of Science in Orofacial Pain, Oral Medicine, and Sleep Disorders at the USC School of Dentistry — making him a specialist in orofacial pain in both the medical and dental field.

Outside of clinical practice, Dr. Hsu has won numerous awards for his portrait and landscape paintings in watercolor and acrylics, and has practiced multiple martial arts (he was an instructor for Karate at USC). Many of these skills have shaped his precision and artistic capabilities as a dental surgeon.`,
    specialties: [
      'Orofacial pain (specialist)',
      'Sleep disorders',
      'TMJ',
      'Cosmetic dentistry',
      'Restorative dentistry',
    ],
    joinedYear: 1999,
    isLead: true,
  },
  {
    slug: 'dr-angela-huang',
    name: 'Dr. Angela Huang',
    title: 'DMD',
    portrait: { src: '/images/doctors/dr-angela-huang.png', alt: 'Dr. Angela Huang', objectPosition: '25% center' },
    short:
      'A highly skilled general dentist known for her exceptional work in cosmetic and restorative dentistry, with a gentle touch and a warm, personable approach.',
    bio: `Dr. Angela Huang is a highly skilled general dentist known for her exceptional work in cosmetic and restorative dentistry. With a gentle touch and a warm, personable approach, she makes every patient feel at ease.

Dr. Huang earned her B.S. in Biological Sciences from UC Irvine and her Doctorate in Dental Medicine from Temple University in 2008. She is also certified in Tissue Management for Implants and Advanced Dental Implant & Reconstructive Surgery, further enhancing her ability to deliver beautiful, lasting results.`,
    specialties: [
      'General dentistry',
      'Cosmetic dentistry',
      'Restorative dentistry',
      'Dental implants',
    ],
    joinedYear: 2008,
    isLead: false,
  },
  {
    slug: 'dr-amandeep-singh',
    name: 'Dr. Amandeep Singh',
    title: 'DMD · Periodontal Specialist',
    portrait: { src: '/images/doctors/dr-amandeep-singh.png', alt: 'Dr. Amandeep Singh', objectPosition: '50% center' },
    short:
      'Focused on dental hygiene and periodontal care since 2006, bringing both expertise and a gentle touch to every patient interaction.',
    bio: `Dr. Singh earned his B.S. in Biology from UC Irvine and his Doctorate of Dental Medicine from the University of Pennsylvania.

With a focus on dental hygiene and periodontal care since 2006, he brings both expertise and a gentle touch to his practice. Patients appreciate his professional and compassionate approach to care.`,
    specialties: [
      'Dental hygiene',
      'Periodontal treatment',
      'Periodontal surgery',
    ],
    joinedYear: 2006,
    isLead: false,
  },
  {
    slug: 'dr-rachel-lim',
    name: 'Dr. Rachel Lim',
    title: 'DMD · Endodontist',
    portrait: { src: '/images/doctors/dr-rachel-lim.png', alt: 'Dr. Rachel Lim', objectPosition: '58% center' },
    short:
      'Board-certified endodontist. DMD from Western University, endodontic specialty at Columbia University. Co-founder of the American Association of Women Dentists.',
    bio: `Dr. Rachel Lim is a board-certified endodontist who earned her DMD from Western University of Health Sciences and completed her specialty training in Endodontics at Columbia University.

She has received multiple honors, including the Outstanding Resident Award, and induction into the Omicron Kappa Upsilon honor society. Dr. Rachel is also a co-founder and former Secretary of the American Association of Women Dentists, reflecting her commitment to leadership and advocacy in the dental field.`,
    specialties: [
      'Endodontics (root canal therapy)',
      'Microscopic endodontics',
      'Re-treatment of failed root canals',
    ],
    joinedYear: 2020,
    isLead: false,
  },
  {
    slug: 'dr-robert-sharobiem',
    name: 'Dr. Robert Sharobiem',
    title: 'DDS · Oral & Maxillofacial Surgeon',
    portrait: { src: '/images/doctors/dr-robert-sharobiem.png', alt: 'Dr. Robert Sharobiem', objectPosition: '30% center' },
    short:
      'Board-certified oral and maxillofacial surgeon. UCLA DDS and Mount Sinai NY surgical training in facial trauma, oral surgery, and reconstruction.',
    bio: `Dr. Robert Sharobiem is a board-certified oral and maxillofacial surgeon who earned his DDS from UCLA. He completed advanced surgical training at Mount Sinai Hospital in New York, where he specialized in facial trauma, oral surgery, and reconstruction.

Dr. Sharobiem has been recognized with numerous honors, including the AAOMS Humanitarian Award, and has served as Director of the UCLA/USC Mobile Dental Clinic.`,
    specialties: [
      'Oral & maxillofacial surgery',
      'Dental implants',
      'Facial trauma reconstruction',
      'Wisdom tooth extraction',
    ],
    joinedYear: 2014,
    isLead: false,
  },
];

export function getDoctor(slug: string): Doctor | undefined {
  return doctors.find((d) => d.slug === slug);
}
