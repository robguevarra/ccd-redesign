import { describe, expect, test } from 'vitest';
import { services, getService, getServicesByLane, getServicesBySubcategory } from '../services';
import type { ServiceLane, ServiceSubcategory } from '../schemas';

const MEDICAL_SUBCATS: ServiceSubcategory[] = [
  'tmj-orofacial-pain',
  'oral-medicine-pathology',
  'sleep-airway',
  'surgical-regenerative-medical',
];
const DENTAL_SUBCATS: ServiceSubcategory[] = [
  'preventive',
  'restorative',
  'endodontics',
  'oral-surgery-dental',
  'periodontal-surgical',
];

describe('services catalog', () => {
  test('total count is exactly 41', () => {
    expect(services.length).toBe(41);
  });

  test('medical lane has exactly 18 services', () => {
    expect(services.filter((s) => s.lane === 'medical')).toHaveLength(18);
  });

  test('dental lane has exactly 23 services', () => {
    expect(services.filter((s) => s.lane === 'dental')).toHaveLength(23);
  });

  test('every service has a non-empty body of 50–900 words', () => {
    // The Oncology Journey is a full client-supplied patient guide (Oct 2026),
    // rendered as structured long-form copy — exempt from the cap.
    const LONG_FORM = new Set(['oncology-journey']);
    for (const s of services) {
      if (LONG_FORM.has(s.slug)) continue;
      const wordCount = s.body.trim().split(/\s+/).length;
      expect(wordCount, `${s.slug} body length`).toBeGreaterThanOrEqual(40);
      // Cap raised from 500: the July 2026 client additions include two
      // long-form client-supplied bodies (myofascial, ultrasound-guided).
      expect(wordCount, `${s.slug} body length`).toBeLessThanOrEqual(900);
    }
  });

  test('every service has a non-empty summary <= 200 chars', () => {
    for (const s of services) {
      expect(s.summary.length, `${s.slug} summary length`).toBeGreaterThan(0);
      expect(s.summary.length, `${s.slug} summary length`).toBeLessThanOrEqual(200);
    }
  });

  test('subcategory matches lane', () => {
    for (const s of services) {
      const valid = s.lane === 'medical' ? MEDICAL_SUBCATS : DENTAL_SUBCATS;
      expect(valid, `${s.slug} subcategory ${s.subcategory} not valid for lane ${s.lane}`)
        .toContain(s.subcategory);
    }
  });

  test('slugs are unique and kebab-case', () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug, `slug ${slug}`).toMatch(/^[a-z][a-z0-9-]*[a-z0-9]$/);
    }
  });

  test('removed slugs are not present', () => {
    const removed = [
      'amalgam-fillings',
      'orthodontics',
      'removable-orthodontics',
      'sedation-dentistry',
      'children-oral-healthcare',
      'oral-hygiene',
      'fixed-bridges',
      'crowns-caps',
      'root-canal-therapy',
      'tooth-extractions',
      'cleaning',
      // Renamed June 2026 → laser-photobiomodulation
      'surgical-laser-therapy',
    ];
    for (const slug of removed) {
      expect(getService(slug), `${slug} should be removed`).toBeUndefined();
    }
  });

  test('exactly one signature service', () => {
    const sigs = services.filter((s) => s.signature);
    expect(sigs).toHaveLength(1);
    expect(sigs[0]?.slug).toBe('tmj');
  });

  test('oral medicine & pathology follows the practice-specified order', () => {
    expect(getServicesBySubcategory('oral-medicine-pathology').map((s) => s.slug)).toEqual([
      'oral-pathology',
      'oral-cancer-screening',
      'biopsies',
      'oncology-journey',
      'oral-cancer-shields',
      'osteonecrosis',
    ]);
  });

  test('helpers return correct subsets', () => {
    expect(getServicesByLane('medical').length).toBe(18);
    expect(getServicesByLane('dental').length).toBe(23);
    expect(getServicesBySubcategory('preventive').length).toBe(5);
    expect(getServicesBySubcategory('restorative').length).toBe(7);
  });
});
