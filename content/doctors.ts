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
    portrait: { src: '/images/doctors/dr-brien-hsu.jpg', alt: 'Dr. Brien Hsu' },
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
    portrait: { src: '/images/doctors/dr-angela-huang.jpg', alt: 'Dr. Angela Huang' },
    short:
      'General dentist with a passion for cosmetic and restorative dentistry. Temple University DMD, certified in Tissue Management for Implants and Advanced Dental Implant & Reconstructive Surgery.',
    bio: `Dr. Angela Huang is a general dentist who has a passion for cosmetic and restorative dentistry. She earned her BS in Biological Science at the University of California, Irvine.

In 2008 she graduated from the Temple University School of Dentistry, earning her Doctorate in Dental Medicine. As a dental student, she spent significant time with the Student Outreach Program at Temple, performing dental work on underprivileged patients at various designated dental group facilities.

Dr. Huang has earned certification in Tissue Management for Implants and the Advanced Dental Implant & Reconstructive Surgery Training Program. During her free time she enjoys baking, running, and spending time with her family.`,
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
    portrait: { src: '/images/doctors/dr-amandeep-singh.jpg', alt: 'Dr. Amandeep Singh' },
    short:
      'Dental Hygiene and Periodontal Specialist. University of Pennsylvania DMD. Specializes in performing professional, gentle periodontal procedures since 2006.',
    bio: `Dental Hygiene Specialist Dr. Amandeep Singh earned his Bachelor of Science in Biology at the University of California, Irvine.

He continued his education at the University of Pennsylvania School of Dental Medicine, where he earned his Doctorate of Dental Medicine. His accomplishments include serving as Assistant Instructor to first-year dental students on periodontal treatment, Dean's Honor Roll, and Secretary and Treasurer of the Medical Health Science Society.

Dr. Singh has been specializing in performing dental hygiene and periodontal procedures since 2006. He is known by many of his patients for providing professional yet gentle care.`,
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
    portrait: { src: '/images/doctors/dr-rachel-lim.jpg', alt: 'Dr. Rachel Lim' },
    short:
      'Board-certified Endodontist (root canal specialist). Western University DMD, Columbia University endodontic residency. Co-founder of the American Association of Women Dentists.',
    bio: `Dr. Rachel Lim is a board-certified Endodontist (root canal specialist). She earned her Doctor of Dental Medicine (DMD) at Western University of Health Sciences, College of Dental Medicine. She then attended Columbia University, College of Dental Medicine to specialize in Endodontics.

Her achievements include board certification by the American Board of Endodontics, Dean's List recognition, the Outstanding Resident Award, and induction into the Omicron Kappa Upsilon honor society. She is also the Co-founder and previous Secretary of the American Association of Women Dentists.

Dr. Lim grew up in Orange County and enjoys exploring new cities, hiking, and spending quality time with loved ones.`,
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
    portrait: { src: '/images/doctors/dr-robert-sharobiem.jpg', alt: 'Dr. Robert Sharobiem' },
    short:
      'Board-certified Oral & Maxillofacial Surgeon. UCLA DDS (top 5% of class), Mount Sinai NY surgery certificate. American Association of Oral and Maxillofacial Surgeons Humanitarian Award recipient.',
    bio: `Dr. Robert Sharobiem completed his Doctorate in Dental Surgery at UCLA in 2009, graduating in the top five percent of his class. From there, he earned a General Dental Practice Residency Certificate at St. Barnabas Hospital, NY, where he was named Resident of the Year in Oral and Maxillofacial Surgery.

He completed his Oral and Maxillofacial Surgery Certificate at Mount Sinai Hospital, NY, receiving advanced training in facial trauma, oral surgery, and reconstruction. His accomplishments include board certification by the American Board of Oral Maxillofacial Surgery, serving as Director of the UCLA/USC Mobile Dental Clinic, and being one of the founders of the Oral and Maxillofacial Surgery Study Club at UCLA.

For Dr. Sharobiem, giving back to the community is a priority. He has participated in dental mission trips to help impoverished people in Mexico, Haiti, and Guatemala. The American Association of Oral and Maxillofacial Surgeons honored Dr. Sharobiem with the Humanitarian Award for Residents in 2013.`,
    specialties: [
      'Oral & maxillofacial surgery',
      'Dental implants',
      'Facial trauma reconstruction',
      'Wisdom tooth extraction',
    ],
    joinedYear: 2014,
    isLead: false,
  },
  {
    slug: 'dr-serena-hsu',
    name: 'Dr. Serena Hsu',
    title: 'DDS, MS · Orthodontist',
    portrait: { src: '/images/doctors/dr-serena-hsu.jpg', alt: 'Dr. Serena Hsu' },
    short:
      'Board-certified Orthodontist. UCLA BS, USC DDS (with honors), USC Orthodontic Specialty + MS in Craniofacial Biology. Speaks English, Mandarin, and Spanish.',
    bio: `Dr. Serena Hsu was born and raised in Southern California and speaks English, Mandarin, and Spanish.

Before becoming an orthodontist, she earned a Bachelor of Science in Biology from UCLA. She went on to obtain a Doctorate of Dental Surgery degree with honors from USC, where she received the Dean's Award for Outstanding Service and Commitment. She continued at USC, attaining an Orthodontic Specialty certificate and a Master of Science degree in Craniofacial Biology — the study of jaw and facial growth.

She is now a board-certified member of the American Board of Orthodontics, finally able to achieve her goal of making beautiful smiles and seeing her patients grow into wonderful, more confident individuals.

Dr. Serena also serves as a part-time Clinical Instructor at the Ostrow School of Dentistry of USC. To stay current with new orthodontic technology and continuing education, she is an active member of the American Association of Orthodontists, California Association of Orthodontists, Pacific Coast Society of Orthodontists, American Dental Association, and California Dental Association.`,
    specialties: [
      'Orthodontics',
      'Clear aligner therapy',
      'Pediatric orthodontics',
      'Adult orthodontics',
    ],
    joinedYear: 2018,
    isLead: false,
  },
];

export function getDoctor(slug: string): Doctor | undefined {
  return doctors.find((d) => d.slug === slug);
}
