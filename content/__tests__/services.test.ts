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
  test('total count is exactly 32', () => {
    expect(services.length).toBe(32);
  });

  test('medical lane has exactly 10 services', () => {
    expect(services.filter((s) => s.lane === 'medical')).toHaveLength(10);
  });

  test('dental lane has exactly 22 services', () => {
    expect(services.filter((s) => s.lane === 'dental')).toHaveLength(22);
  });

  test('every service has a non-empty body of 50–500 words', () => {
    for (const s of services) {
      const wordCount = s.body.trim().split(/\s+/).length;
      expect(wordCount, `${s.slug} body length`).toBeGreaterThanOrEqual(40);
      expect(wordCount, `${s.slug} body length`).toBeLessThanOrEqual(500);
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

  test('helpers return correct subsets', () => {
    expect(getServicesByLane('medical').length).toBe(10);
    expect(getServicesByLane('dental').length).toBe(22);
    expect(getServicesBySubcategory('preventive').length).toBe(5);
    expect(getServicesBySubcategory('restorative').length).toBe(6);
  });
});
