import { describe, it, expect } from 'vitest';
import { slugify } from '../slugify';

describe('slugify', () => {
  it('reduces the homepage to "index"', () => {
    expect(slugify('https://dentisthsu.com/')).toBe('index');
    expect(slugify('https://dentisthsu.com')).toBe('index');
  });

  it('uses the path for inner pages', () => {
    expect(slugify('https://dentisthsu.com/about')).toBe('about');
    expect(slugify('https://dentisthsu.com/about/')).toBe('about');
  });

  it('replaces nested slashes with hyphens', () => {
    expect(slugify('https://dentisthsu.com/services/tmj-treatment'))
      .toBe('services-tmj-treatment');
  });

  it('strips query strings and fragments', () => {
    expect(slugify('https://dentisthsu.com/contact?utm=x#section')).toBe('contact');
  });

  it('lowercases and replaces unsafe chars', () => {
    expect(slugify('https://dentisthsu.com/Dr%20Hsu/About-Us')).toBe('dr-hsu-about-us');
  });

  it('throws on non-URL input', () => {
    expect(() => slugify('not a url')).toThrow();
  });
});
