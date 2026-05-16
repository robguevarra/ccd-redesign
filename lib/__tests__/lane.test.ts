import { describe, expect, test } from 'vitest';
import { getLane } from '../lane';

describe('getLane', () => {
  test('dental routes resolve to "dental"', () => {
    expect(getLane('/dental')).toBe('dental');
    expect(getLane('/dental/composite-fillings')).toBe('dental');
    expect(getLane('/dental/crowns-bridges')).toBe('dental');
  });

  test('medical routes resolve to "medical"', () => {
    expect(getLane('/medical')).toBe('medical');
    expect(getLane('/medical/tmj')).toBe('medical');
    expect(getLane('/medical/sleep-apnea')).toBe('medical');
  });

  test('home, about, doctors, blog, contact resolve to "neutral"', () => {
    expect(getLane('/')).toBe('neutral');
    expect(getLane('/about')).toBe('neutral');
    expect(getLane('/doctors')).toBe('neutral');
    expect(getLane('/doctors/dr-brien-hsu')).toBe('neutral');
    expect(getLane('/blog')).toBe('neutral');
    expect(getLane('/blog/some-post')).toBe('neutral');
    expect(getLane('/contact')).toBe('neutral');
    expect(getLane('/technology')).toBe('neutral');
    expect(getLane('/reviews')).toBe('neutral');
    expect(getLane('/financing')).toBe('neutral');
    expect(getLane('/request-appointment')).toBe('neutral');
  });

  test('admin routes resolve to "neutral"', () => {
    expect(getLane('/admin')).toBe('neutral');
    expect(getLane('/admin/login')).toBe('neutral');
    expect(getLane('/admin/dashboard')).toBe('neutral');
    expect(getLane('/admin/posts/new')).toBe('neutral');
  });

  test('lane match is prefix-strict — /dental-x is NOT dental', () => {
    expect(getLane('/dental-clinic')).toBe('neutral');
    expect(getLane('/medical-team')).toBe('neutral');
  });
});
