import { describe, expect, test } from 'vitest';
import { doctors, getDoctor } from '../doctors';

describe('doctor roster', () => {
  test('total count is exactly 5', () => {
    expect(doctors).toHaveLength(5);
  });

  test('Serena Hsu is removed', () => {
    expect(getDoctor('dr-serena-hsu')).toBeUndefined();
  });

  test('lead clinician is Dr. Brien Hsu', () => {
    const lead = doctors.find((d) => d.isLead);
    expect(lead?.slug).toBe('dr-brien-hsu');
  });

  test('every doctor has a portrait, short, and bio', () => {
    for (const d of doctors) {
      expect(d.portrait.src, d.slug).toBeTruthy();
      expect(d.short.length, d.slug).toBeGreaterThan(0);
      expect(d.bio.length, d.slug).toBeGreaterThan(0);
    }
  });
});
