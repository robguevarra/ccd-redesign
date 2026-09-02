import { practiceInfo } from '@/content/practice-info';

/**
 * Meta-description helpers.
 *
 * Bing Webmaster Tools flags descriptions under ~150 characters as "too
 * short" (2026-09-02 audit: 12 pages flagged, ~45 actually under the line).
 * Google truncates around 155–160. Target band: 150–165.
 */
export const META_DESCRIPTION_MIN = 150;
export const META_DESCRIPTION_MAX = 165;

const CITY = `${practiceInfo.address.city}, CA`;
const PHONE = practiceInfo.phones[0]?.number ?? '(909) 941-2811';

/**
 * Suffixes in ascending length. The service summary (one sentence, written
 * for the service cards) is kept verbatim; we append the shortest local-SEO
 * suffix that lifts the whole description to the target band. City stays in
 * every variant — Google bolds the matched location in the snippet.
 */
const BRAND_CITY = `${practiceInfo.brandName} in ${CITY}.`;
const BRAND_CITY_SINCE = `${practiceInfo.brandName} in ${CITY}, since 1993.`;
const LEAD_CITY = `${practiceInfo.brandName}, Dr. Brien Hsu and associates, in ${CITY}.`;
const OFFERED_CITY = `Offered by Dr. Brien Hsu and associates at ${practiceInfo.brandName} in ${CITY}.`;
const CALL = `Call ${PHONE}.`;
const CALL_BOOK = `Call ${PHONE} to book.`;

/**
 * Candidate suffixes, sorted ascending by length (~46 → ~117 chars in steps
 * of ≤12), so the first one that lifts a summary past the minimum overshoots
 * by at most a dozen characters.
 */
const SERVICE_SUFFIXES: readonly string[] = [
  BRAND_CITY,
  BRAND_CITY_SINCE,
  `${BRAND_CITY} ${CALL}`,
  `${BRAND_CITY_SINCE} ${CALL}`,
  `${BRAND_CITY} ${CALL_BOOK}`,
  LEAD_CITY,
  OFFERED_CITY,
  `${LEAD_CITY} ${CALL}`,
  `${OFFERED_CITY} ${CALL}`,
  `${OFFERED_CITY} ${CALL_BOOK}`,
]
  .map((x) => ` ${x}`)
  .sort((a, b) => a.length - b.length);

export function serviceMetaDescription(summary: string): string {
  const base = summary.trim();
  for (const suffix of SERVICE_SUFFIXES) {
    const candidate = base + suffix;
    if (candidate.length >= META_DESCRIPTION_MIN) return candidate;
  }
  return base + SERVICE_SUFFIXES[SERVICE_SUFFIXES.length - 1]!;
}

/**
 * Titles. Bing warns above 70 characters; Google truncates around 60 but
 * still reads the rest. Service titles keep the practice's stated priority
 * order (service, city, brand last) and drop the brand only when the service
 * name alone would push the title past 70.
 */
export const TITLE_MAX = 70;

export function serviceTitle(name: string): string {
  const withBrand = `${name} — ${practiceInfo.address.city} | ${practiceInfo.brandName}`;
  if (withBrand.length <= TITLE_MAX) return withBrand;
  const cityOnly = `${name} — ${practiceInfo.address.city}, CA`;
  return cityOnly.length <= TITLE_MAX ? cityOnly : name;
}

/** Blog titles are authored in the CMS; only append the brand when it fits. */
export function blogTitle(title: string): string {
  const withBrand = `${title} — ${practiceInfo.brandName}`;
  return withBrand.length <= TITLE_MAX ? withBrand : title;
}
