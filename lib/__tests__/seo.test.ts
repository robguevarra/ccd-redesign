import { describe, expect, test } from 'vitest';
import { services } from '@/content/services';
import {
  blogTitle,
  META_DESCRIPTION_MAX,
  META_DESCRIPTION_MIN,
  serviceMetaDescription,
  serviceTitle,
  TITLE_MAX,
} from '../seo';

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

describe('serviceTitle', () => {
  test('every service title is at most 70 characters and names the city', () => {
    for (const s of services) {
      const t = serviceTitle(s.name);
      expect(t.length, `${s.slug}: ${t}`).toBeLessThanOrEqual(TITLE_MAX);
      expect(t).toContain('Rancho Cucamonga');
    }
  });

  test('keeps the brand when it fits, drops it when it does not', () => {
    expect(serviceTitle('Implants')).toBe('Implants — Rancho Cucamonga | Comfort Care Dental');
    expect(serviceTitle('Low Level Laser Therapy / Photobiomodulation')).toBe(
      'Low Level Laser Therapy / Photobiomodulation — Rancho Cucamonga, CA',
    );
  });
});

describe('blogTitle', () => {
  test('appends the brand only when the result stays within 70 characters', () => {
    expect(blogTitle('Short post')).toBe('Short post — Comfort Care Dental');
    const long = 'A patient story: when whitening toothpaste was the problem';
    expect(blogTitle(long)).toBe(long);
  });
});
