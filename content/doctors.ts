import type { Doctor } from './schemas';

/**
 * Doctor team. Names + lead-clinician facts pulled from scraped pages
 * (`source/pages/doctors-dr-*.md`). Bios here are placeholder for the pitch
 * and will be revised post-signing during v2 content production.
 */
export const doctors: Doctor[] = [
  {
    slug: 'dr-brien-hsu',
    name: 'Dr. Brien Hsu',
    title: 'DDS, Lead Clinician',
    portrait: { src: '/images/doctors/dr-brien-hsu.jpg', alt: 'Dr. Brien Hsu' },
    short:
      'Lead clinician since 1999. Twenty-five years of practice in Rancho Cucamonga, with a special focus on TMJ, complex restorative work, and dental technology adoption.',
    bio: 'Dr. Hsu founded the practice in 1999 and has been serving the Rancho Cucamonga area continuously since. He pioneered 3D Cone Beam CT imaging in the office in 2014 and continues to lead clinical technology adoption — most recently a 3Shape Trios 5 digital scanning workflow added in 2024. Outside of clinical work, he writes long-form on dental technology and contributes to volunteer outreach clinics.',
    specialties: ['TMJ', 'Restorative dentistry', 'Cosmetic dentistry', 'Sedation dentistry'],
    joinedYear: 1999,
    isLead: true,
  },
  {
    slug: 'dr-angela-huang',
    name: 'Dr. Angela Huang',
    title: 'DDS',
    portrait: { src: '/images/doctors/dr-angela-huang.jpg', alt: 'Dr. Angela Huang' },
    short:
      'Pediatric and family dentistry specialist. Trained at one of the country\'s top dental schools, with a focus on building lifelong patient relationships starting in childhood.',
    bio: "Dr. Huang's practice centers on pediatric care and family dentistry. She graduated from Temple University School of Dentistry, where she spent significant time with the Student Outreach Program providing care for underserved patients. She joined the Comfort Care team to continue work that builds positive dental experiences from a young age.",
    specialties: ['Pediatric dentistry', 'Family dentistry', 'Preventive care'],
    joinedYear: 2010,
    isLead: false,
  },
  {
    slug: 'dr-earlene-milone',
    name: 'Dr. Earlene Milone',
    title: 'DMD',
    portrait: { src: '/images/doctors/dr-earlene-milone.jpg', alt: 'Dr. Earlene Milone' },
    short:
      'General and restorative dentistry. Long-tenured associate with extensive experience in complex prosthodontics.',
    bio: 'Dr. Milone has been part of the practice for over a decade, focusing on general and restorative dentistry with particular skill in complex prosthodontics — full-mouth rehabilitations, bridges, and cases combining periodontal and restorative work.',
    specialties: ['General dentistry', 'Prosthodontics', 'Restorative dentistry'],
    joinedYear: 2012,
    isLead: false,
  },
  {
    slug: 'dr-rachel-lim',
    name: 'Dr. Rachel Lim',
    title: 'DDS',
    portrait: { src: '/images/doctors/dr-rachel-lim.jpg', alt: 'Dr. Rachel Lim' },
    short: 'General and cosmetic dentistry, with a focus on minimally invasive techniques.',
    bio: 'Dr. Lim approaches dentistry with a minimally invasive philosophy — preserving as much natural tooth structure as possible, using the most conservative restoration that will solve the problem.',
    specialties: ['General dentistry', 'Cosmetic dentistry', 'Minimally invasive dentistry'],
    joinedYear: 2018,
    isLead: false,
  },
  {
    slug: 'dr-robert-sharobiem',
    name: 'Dr. Robert Sharobiem',
    title: 'DDS',
    portrait: { src: '/images/doctors/dr-robert-sharobiem.jpg', alt: 'Dr. Robert Sharobiem' },
    short:
      'Surgical and implant dentistry. Handles in-house surgical extractions and implant placement.',
    bio: 'Dr. Sharobiem completed advanced training in oral surgery and implant dentistry. He performs the majority of surgical extractions and implant placements in-house, using CBCT-guided planning, which means most patients never need to be referred out.',
    specialties: ['Implant dentistry', 'Oral surgery', 'CBCT-guided treatment planning'],
    joinedYear: 2016,
    isLead: false,
  },
  {
    slug: 'dr-serena-hsu',
    name: 'Dr. Serena Hsu',
    title: 'DDS',
    portrait: { src: '/images/doctors/dr-serena-hsu.jpg', alt: 'Dr. Serena Hsu' },
    short: "Next-generation Hsu family clinician. Joined the practice after completing dental school.",
    bio: 'Dr. Serena Hsu joined the practice as the next generation of the Hsu family in dentistry. She brings contemporary clinical training and works alongside Dr. Brien Hsu on complex cases.',
    specialties: ['General dentistry', 'Cosmetic dentistry'],
    joinedYear: 2022,
    isLead: false,
  },
];

export function getDoctor(slug: string): Doctor | undefined {
  return doctors.find((d) => d.slug === slug);
}
