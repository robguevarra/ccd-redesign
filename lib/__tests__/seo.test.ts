import { describe, expect, test } from 'vitest';
import { services } from '@/content/services';
import { META_DESCRIPTION_MAX, META_DESCRIPTION_MIN, serviceMetaDescription } from '../seo';

describe('serviceMetaDescription', () => {
  test('every service description lands in the 150–165 band (or was already longer)', () => {
    const out = services.map((s) => ({
      slug: s.slug,
      len: serviceMetaDescription(s.summary).length,
      summaryLen: s.summary.length,
    }));
    const tooShort = out.filter((o) => o.len < META_DESCRIPTION_MIN);
    expect(tooShort).toEqual([]);
    // Summaries that were already long enough on their own keep the shortest
    // suffix; only those are allowed past the max.
    const tooLong = out.filter(
      (o) => o.len > META_DESCRIPTION_MAX && o.summaryLen + 46 < META_DESCRIPTION_MIN,
    );
    expect(tooLong).toEqual([]);
  });

  test('keeps the summary verbatim and always names the city', () => {
    const d = serviceMetaDescription('Short summary.');
    expect(d.startsWith('Short summary. ')).toBe(true);
    expect(d).toContain('Rancho Cucamonga, CA');
  });

  test('uses the shortest suffix that reaches the minimum', () => {
    const long = 'x'.repeat(120) + '.';
    expect(serviceMetaDescription(long)).toBe(`${long} Comfort Care Dental in Rancho Cucamonga, CA.`);
  });
});
