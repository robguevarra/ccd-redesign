import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '../../..');
const SOURCE = resolve(ROOT, 'source');

export function sourcePaths(slug?: string) {
  return {
    root: ROOT,
    source: SOURCE,
    sitemapJson: resolve(SOURCE, 'sitemap.json'),
    practiceInfoJson: resolve(SOURCE, 'practice-info.json'),
    pageMarkdown: slug ? resolve(SOURCE, 'pages', `${slug}.md`) : undefined,
    pageJson: slug ? resolve(SOURCE, 'pages', `${slug}.json`) : undefined,
    imageDir: slug ? resolve(SOURCE, 'images', slug) : undefined,
    screenshotDir: slug ? resolve(SOURCE, 'screenshots', slug) : undefined,
    lighthouseJson: slug ? resolve(SOURCE, 'lighthouse', `${slug}.json`) : undefined,
    axeJson: slug ? resolve(SOURCE, 'axe', `${slug}.json`) : undefined,
  };
}
