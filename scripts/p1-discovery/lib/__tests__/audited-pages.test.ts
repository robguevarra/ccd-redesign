import { describe, it, expect } from 'vitest';
import { selectAuditedPages } from '../audited-pages';

describe('selectAuditedPages', () => {
  const sample = [
    'https://dentisthsu.com/',
    'https://dentisthsu.com/about',
    'https://dentisthsu.com/doctor',
    'https://dentisthsu.com/contact',
    'https://dentisthsu.com/services',
    'https://dentisthsu.com/services/general',
    'https://dentisthsu.com/services/tmj',
    'https://dentisthsu.com/services/sleep-apnea',
    'https://dentisthsu.com/blog',
    'https://dentisthsu.com/blog/post-1',
    'https://dentisthsu.com/blog/post-2',
    'https://dentisthsu.com/blog/post-3',
    'https://dentisthsu.com/privacy',
    'https://dentisthsu.com/terms',
    'https://dentisthsu.com/sitemap',
  ];

  it('always includes the homepage first', () => {
    const picked = selectAuditedPages(sample);
    expect(picked[0]).toBe('https://dentisthsu.com/');
  });

  it('caps the result at 12', () => {
    const picked = selectAuditedPages(sample);
    expect(picked.length).toBeLessThanOrEqual(12);
  });

  it('prefers service pages over policy pages', () => {
    const picked = selectAuditedPages(sample);
    expect(picked).toContain('https://dentisthsu.com/services/tmj');
    expect(picked).not.toContain('https://dentisthsu.com/privacy');
  });

  it('includes at most 2 blog posts', () => {
    const picked = selectAuditedPages(sample);
    const posts = picked.filter((u) => /\/blog\/[^/]+/.test(u));
    expect(posts.length).toBeLessThanOrEqual(2);
  });

  it('returns sample input unchanged in priority order when ≤12 high-priority', () => {
    const small = sample.slice(0, 5);
    expect(selectAuditedPages(small).length).toBe(small.length);
  });
});
