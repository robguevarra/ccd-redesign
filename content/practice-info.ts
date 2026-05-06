import type { PracticeInfo } from './schemas';

/**
 * Practice info singleton.
 *
 * Curated from `source/practice-info.json` (extracted by P1 Task 8 via
 * `scripts/p1-discovery/03-extract-globals.ts`) plus manual confirmation
 * against the live dentisthsu.com pages and the practice's Yelp listing.
 *
 * Items flagged with TODO comments need confirmation in the pitch meeting
 * (mirrored in `docs/audit/dentist-questions.md`).
 *
 * See: docs/superpowers/specs/2026-05-05-dentisthsu-phase-2-ia-content-strategy.md §2 + §6
 */
export const practiceInfo: PracticeInfo = {
  brandName: 'Comfort Care Dental',
  legalName: 'Brien Hsu, DDS, MS & Associates',
  address: {
    street: '11458 Kenyon Way, Suite 120',
    city: 'Rancho Cucamonga',
    state: 'CA',
    zip: '91701',
  },
  hours: [
    { day: 'Monday', open: '09:00', close: '18:00' },
    { day: 'Tuesday', open: '09:00', close: '18:00' },
    { day: 'Wednesday', open: '08:00', close: '17:00' },
    { day: 'Thursday', open: '09:00', close: '18:00' },
    { day: 'Friday', open: '', close: '', closed: true },
    { day: 'Saturday', open: '', close: '', closed: true },
    { day: 'Sunday', open: '', close: '', closed: true },
  ],
  phones: [
    { label: 'Main', number: '(909) 941-2811', tel: '+19099412811' },
  ],
  email: 'advancedcare@dentisthsu.com',
  socials: {
    facebook: 'https://www.facebook.com/pages/category/Dentist---Dental-Office/Comfort-Care-Dental-Brien-Hsu-DDS-203187206359000/',
    yelp: 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga',
    twitter: 'https://twitter.com/drbrienhsu',
  },
  taxIdEnabledForFinancing: true,
};
