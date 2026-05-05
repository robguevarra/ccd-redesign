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
  legalName: 'Brien Hsu, DDS',
  address: {
    street: '11458 Kenyon Way',
    // Suite number to confirm with dentist (audit found 'Suite' but no number).
    city: 'Rancho Cucamonga',
    state: 'CA',
    // Zip placeholder — Rancho Cucamonga zips: 91701, 91730, 91737, 91739.
    // Kenyon Way runs through 91701/91730. Confirm in pitch meeting.
    zip: '91730',
  },
  hours: [
    { day: 'Monday', open: '08:00', close: '17:00' },
    { day: 'Tuesday', open: '08:00', close: '17:00' },
    { day: 'Wednesday', open: '08:00', close: '17:00' },
    { day: 'Thursday', open: '08:00', close: '17:00' },
    { day: 'Friday', open: '08:00', close: '17:00' },
    // Hours below are best-guess defaults; confirm with practice.
    { day: 'Saturday', open: '08:00', close: '13:00' },
    { day: 'Sunday', open: '', close: '', closed: true },
  ],
  phones: [
    { label: 'Toll-free', number: '(800) 365-8295', tel: '+18003658295' },
    { label: 'Main', number: '(909) 558-8187', tel: '+19095588187' },
    { label: 'Alternate', number: '(909) 941-2811', tel: '+19099412811' },
  ],
  // Audit confirmed: practice publishes NO public email across 181 pages.
  // Recommend adding hello@dentisthsu.com (or comfortcaredental.com) in v2.
  email: null,
  socials: {
    facebook: 'https://www.facebook.com/pages/category/Dentist---Dental-Office/Comfort-Care-Dental-Brien-Hsu-DDS-203187206359000/',
    yelp: 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga',
    twitter: 'https://twitter.com/drbrienhsu',
    // Google Business Profile URL TBD — fold into v2 reviews integration.
  },
  // The practice supports CareCredit (per `/financing` content scraped in P1).
  taxIdEnabledForFinancing: true,
};
