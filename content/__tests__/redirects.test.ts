import { describe, expect, test } from 'vitest';
import { redirects } from '../redirects';

describe('redirects', () => {
  test('lane-migration entries map old service URLs to new lane URLs', () => {
    const map = Object.fromEntries(
      redirects.filter((r) => r.status === 301).map((r) => [r.from, r.to]),
    );

    expect(map['/services/tmj']).toBe('/medical/tmj');
    expect(map['/services/sleep-apnea']).toBe('/medical/sleep-apnea');
    expect(map['/services/orofacial-pain']).toBe('/medical/orofacial-pain');
    expect(map['/services/oral-pathology']).toBe('/medical/oral-pathology');
    expect(map['/services/cleaning']).toBe('/dental/professional-cleaning');
    expect(map['/services/composite-fillings']).toBe('/dental/composite-fillings');
    expect(map['/services/crowns-caps']).toBe('/dental/crowns-and-bridges');
    expect(map['/services/fixed-bridges']).toBe('/dental/crowns-and-bridges');
    expect(map['/services/root-canal-therapy']).toBe('/dental/root-canal');
    expect(map['/services/tooth-extractions']).toBe('/dental/extractions');
    expect(map['/services/porcelain-veneers']).toBe('/dental/porcelain-veneers');
    expect(map['/services/teeth-whitening']).toBe('/dental/teeth-whitening');
    expect(map['/services/dentures']).toBe('/dental/dentures');
    expect(map['/services/periodontal-treatment']).toBe('/dental/periodontal-treatment');
  });

  test('removed services return 410', () => {
    const map = Object.fromEntries(
      redirects.filter((r) => r.status === 410).map((r) => [r.from, true]),
    );
    expect(map['/services/amalgam-fillings']).toBe(true);
    expect(map['/services/orthodontics']).toBe(true);
    expect(map['/services/removable-orthodontics']).toBe(true);
    expect(map['/services/sedation-dentistry']).toBe(true);
    expect(map['/services/children-oral-healthcare']).toBe(true);
    expect(map['/services/oral-hygiene']).toBe(true);
    expect(map['/doctors/dr-serena-hsu']).toBe(true);
  });
});
