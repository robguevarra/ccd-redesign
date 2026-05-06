import { describe, expect, test } from 'vitest';
import { getSublabel } from '../sublabel';

describe('getSublabel', () => {
  test('dental routes', () => {
    expect(getSublabel('/dental')).toBe('DENTAL PRACTICE');
    expect(getSublabel('/dental/composite-fillings')).toBe('DENTAL PRACTICE');
  });

  test('medical routes', () => {
    expect(getSublabel('/medical')).toBe('OROFACIAL PAIN & ORAL MEDICINE');
    expect(getSublabel('/medical/tmj')).toBe('OROFACIAL PAIN & ORAL MEDICINE');
  });

  test('admin routes return empty string (no sub-label)', () => {
    expect(getSublabel('/admin')).toBe('');
    expect(getSublabel('/admin/dashboard')).toBe('');
  });

  test('all other routes return the practice tagline', () => {
    expect(getSublabel('/')).toBe('EST. 1999 · RANCHO CUCAMONGA');
    expect(getSublabel('/about')).toBe('EST. 1999 · RANCHO CUCAMONGA');
    expect(getSublabel('/doctors')).toBe('EST. 1999 · RANCHO CUCAMONGA');
    expect(getSublabel('/contact')).toBe('EST. 1999 · RANCHO CUCAMONGA');
    expect(getSublabel('/blog')).toBe('EST. 1999 · RANCHO CUCAMONGA');
  });
});
