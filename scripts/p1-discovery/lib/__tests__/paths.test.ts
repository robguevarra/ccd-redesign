import { describe, it, expect } from 'vitest';
import { sourcePaths } from '../paths';

describe('sourcePaths', () => {
  it('returns absolute paths under source/', () => {
    const p = sourcePaths('about');
    expect(p.pageMarkdown).toMatch(/source\/pages\/about\.md$/);
    expect(p.pageJson).toMatch(/source\/pages\/about\.json$/);
    expect(p.imageDir).toMatch(/source\/images\/about$/);
    expect(p.screenshotDir).toMatch(/source\/screenshots\/about$/);
    expect(p.lighthouseJson).toMatch(/source\/lighthouse\/about\.json$/);
    expect(p.axeJson).toMatch(/source\/axe\/about\.json$/);
  });

  it('returns globals for the practice-info file', () => {
    expect(sourcePaths().sitemapJson).toMatch(/source\/sitemap\.json$/);
    expect(sourcePaths().practiceInfoJson).toMatch(/source\/practice-info\.json$/);
  });
});
