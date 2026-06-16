import type { Doctor } from './schemas';
import { portraitBlurMap } from './doctors-blur';

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
    portrait: { src: '/images/doctors/dr-brien-hsu.webp', alt: 'Dr. Brien Hsu', objectPosition: '30% center', blurDataURL: portraitBlurMap['dr-brien-hsu'] },
    short:
      'Lead clinician since 1999. USC DDS and Master of Science in Orofacial Pain, Oral Medicine, and Sleep Disorders. Known throughout the Inland Empire as "the gentle dentist."',
    bio: `After graduating top in his High School class as Valedictorian, he was selected as one of the few in the nation to attend the Accelerated Dental Advanced Placement Tract at USC. He then became the youngest doctor in his class to earn the Doctor of Dental Surgery degree — in fact one of the youngest in USC Dental School history. Amongst his many accomplishments, Dr. Hsu spent a year in 1999 as a volunteer dentist serving families throughout the impoverished areas of California. Since 2000, he has been in private practice, but continues to volunteer his dental services to free dental clinics and charitable organizations throughout each year. In 2002, Dr. Hsu took under his wing a private dental office in Alta Loma that has been serving the Rancho Cucamonga area since 1993. Dr. Hsu has quickly made a name for himself in the neighborhood as "the gentle dentist." He became well known by many of his patients for providing nearly pain-free family dentistry.

Immediately, Dr. Hsu's popularity as "the gentle dentist" grew exponentially and he soon discovered that his small dental office could no longer accommodate the rapid growth of his patient base. In 2012, construction of his new state-of-the-art dental office began, with a focus on how gentle dentistry could be provided in a comfortable environment. Construction was completed in 2013, enabling Dr. Hsu to move into the most advanced family dental center in the Inland Empire. In his effort to improve care for patients with complex medical problems and sleep disorders, Dr. Hsu continued to expand his knowledge throughout his career, including completing his Master of Science in Orofacial Pain, Oral Medicine and Sleep Disorders at the USC School of Dentistry — allowing him to become a specialist in Orofacial pain in both the medical and dental field. Outside of his compassionate care for his patients, Dr. Brien Hsu enjoys numerous artistic hobbies and was the recipient of many art awards for his portrait and landscape paintings in both watercolor and acrylics. In addition he has practiced many forms of martial arts and was an instructor for Karate at USC. Many of these skills have influenced his precision and artistic capabilities as a proficient dental surgeon.`,
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
    portrait: { src: '/images/doctors/dr-angela-huang.webp', alt: 'Dr. Angela Huang', objectPosition: '25% center', blurDataURL: portraitBlurMap['dr-angela-huang'] },
    short:
      'A highly skilled general dentist known for her exceptional work in cosmetic and restorative dentistry, with a gentle touch and a warm, personable approach.',
    bio: `A general dentist with a passion for cosmetic and restorative dentistry. She earned her BS in Biological Science at the University of California, Irvine (UCI). In 2008 she graduated from the Temple University School of Dentistry, earning her Doctorate in Dental Medicine. As a dentist, she spent time with the Student Outreach Program at Temple University School of Dentistry, where she performed dental work on underprivileged patients at various designated dental group facilities. She has also earned certification in Tissue Management for Implants and the Advanced Dental Implant & Reconstructive Surgery Training Program. During her free time she enjoys baking, running, and spending time with her family.`,
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
    portrait: { src: '/images/doctors/dr-amandeep-singh.webp', alt: 'Dr. Amandeep Singh', objectPosition: '50% center', blurDataURL: portraitBlurMap['dr-amandeep-singh'] },
    short:
      'Focused on dental hygiene and periodontal care since 2006, bringing both expertise and a gentle touch to every patient interaction.',
    bio: `A dental hygiene specialist who earned his Bachelor of Science in Biology at the University of California, Irvine. He then continued his education at the University of Pennsylvania School of Dental Medicine, where he earned his Doctorate of Dental Medicine. His accomplishments include serving as an Assistant Instructor to first-year dental students on periodontal treatment, the Dean's Honor Roll, and Secretary and Treasurer of the Medical Health Science Society. He has been specializing in dental hygiene procedures since 2006, and is known by many of his patients for providing professional, yet gentle periodontal care.`,
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
    portrait: { src: '/images/doctors/dr-rachel-lim.webp', alt: 'Dr. Rachel Lim', objectPosition: '65% center', blurDataURL: portraitBlurMap['dr-rachel-lim'] },
    short:
      'Board-certified endodontist. DMD from Western University, endodontic specialty at Columbia University. Co-founder of the American Association of Women Dentists.',
    bio: `An Endodontist (Root Canal Specialist) who earned her Doctor of Dental Medicine (DMD) at Western University of Health Sciences, College of Dental Medicine. She then attended Columbia University, College of Dental Medicine to specialize in Endodontics. Her achievements include board certification by the American Board of Endodontics, the Dean's List, the Outstanding Resident Award, and induction into the Omicron Kappa Upsilon honor society. She is also a co-founder and previous Secretary of the American Association of Women Dentists. She grew up in Orange County and enjoys exploring new cities, hiking, and spending quality time with loved ones.`,
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
    portrait: { src: '/images/doctors/dr-robert-sharobiem.webp', alt: 'Dr. Robert Sharobiem', objectPosition: '30% center', blurDataURL: portraitBlurMap['dr-robert-sharobiem'] },
    short:
      'Board-certified oral and maxillofacial surgeon. UCLA DDS and Mount Sinai NY surgical training in facial trauma, oral surgery, and reconstruction.',
    bio: `He completed his Doctorate in Dental Surgery at UCLA in 2009, graduating in the top five percent of his class. From there, he earned a General Dental Practice Residency Certificate at St. Barnabas Hospital, NY, where he was named Resident of the Year in Oral and Maxillofacial Surgery. He completed his Oral and Maxillofacial Surgery Certificate at Mount Sinai Hospital, NY, receiving advanced training in facial trauma, oral surgery, and reconstruction. His accomplishments include board certification by the American Board of Oral and Maxillofacial Surgery, serving as Director of the UCLA/USC Mobile Dental Clinic, and being one of the founders of the Oral and Maxillofacial Surgery Study Club at UCLA.

Giving back to the community is extremely important to him. He has participated in dental mission trips to help impoverished people in Mexico, Haiti, and Guatemala. That generosity is why the American Association of Oral and Maxillofacial Surgeons honored him with the Humanitarian Award for Residents in 2013.`,
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
    title: 'DDS, MS · Orthodontist & Dentofacial Orthopedist',
    portrait: { src: '/images/doctors/dr-serena-hsu.webp', alt: 'Dr. Serena Hsu', objectPosition: '50% 25%', blurDataURL: portraitBlurMap['dr-serena-hsu'] },
    short:
      'Board-certified orthodontist and dentofacial orthopedist. UCLA biology, USC DDS with honors and an MS in Craniofacial Biology. Speaks English, Mandarin, and Spanish; also helps treat orofacial pain.',
    bio: `Born and raised in Southern California, she speaks English, Mandarin, and Spanish. Before becoming an Orthodontist/Dentofacial Orthopedist, she earned a Bachelor of Science degree in Biology from UCLA. She went on to obtain a Doctorate of Dental Surgery degree with honors from USC, where she was given the Dean's Award for Outstanding Service and Commitment. She continued on at USC, attaining an Orthodontic Specialty certificate and a Master of Science degree in Craniofacial Biology. She is board certified by the American Board of Orthodontics, and helps treat patients with orofacial pain.`,
    specialties: [
      'Orthodontics',
      'Dentofacial orthopedics',
      'Craniofacial biology',
      'Orofacial pain',
    ],
    joinedYear: 2019,
    isLead: false,
  },
];

export function getDoctor(slug: string): Doctor | undefined {
  return doctors.find((d) => d.slug === slug);
}
