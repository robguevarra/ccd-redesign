// One-off teardown capture script. Not part of run-all.
// Captures full-page mobile + desktop screenshots of competitive references
// (TMJ Expert per-site; Aventura per-dimension) to source/teardowns/<site>/.

import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, devices } from 'playwright';
import { sourcePaths } from './lib/paths';
import { log } from './lib/logger';

interface Target {
  site: string;
  pages: Array<{ slug: string; url: string }>;
  // Some sites have long-polling trackers that never let networkidle fire.
  waitUntil: 'networkidle' | 'load' | 'domcontentloaded';
}

const TARGETS: Target[] = [
  {
    site: 'tmj-expert',
    waitUntil: 'load',
    pages: [
      { slug: '01-home', url: 'https://tmjexpert.com/' },
      { slug: '02-gallery-tmj-treatments-02', url: 'https://tmjexpert.com/gallery/tmj-cases/tmj-treatments/02/' },
      { slug: '03-gallery-tmj-treatments-01', url: 'https://tmjexpert.com/gallery/tmj-cases/tmj-treatments/01/' },
      { slug: '04-tmj', url: 'https://tmjexpert.com/tmj/' },
      { slug: '05-about', url: 'https://tmjexpert.com/about/' },
      { slug: '06-services', url: 'https://tmjexpert.com/services/' },
      { slug: '07-contact', url: 'https://tmjexpert.com/contact/' },
      { slug: '08-blog', url: 'https://tmjexpert.com/blog/' },
    ],
  },
  {
    site: 'aventura',
    waitUntil: 'networkidle',
    pages: [
      { slug: '01-home', url: 'https://aventuradentalarts.com/' },
      { slug: '02-services', url: 'https://aventuradentalarts.com/services/' },
      { slug: '03-about', url: 'https://aventuradentalarts.com/about/' },
      { slug: '04-team', url: 'https://aventuradentalarts.com/team/' },
      { slug: '05-contact', url: 'https://aventuradentalarts.com/contact/' },
      { slug: '06-cosmetic', url: 'https://aventuradentalarts.com/cosmetic-dentistry/' },
    ],
  },
];

async function main() {
  const browser = await chromium.launch();
  try {
    for (const target of TARGETS) {
      const dir = resolve(sourcePaths().source, 'teardowns', target.site);
      await mkdir(dir, { recursive: true });
      log.step(target.site, `${target.pages.length} pages × mobile+desktop (waitUntil=${target.waitUntil})`);

      for (const { slug, url } of target.pages) {
        for (const variant of [
          { name: 'mobile', context: devices['iPhone 14'] },
          { name: 'desktop', context: { viewport: { width: 1440, height: 900 } } },
        ]) {
          const ctx = await browser.newContext(variant.context);
          const page = await ctx.newPage();
          try {
            await page.goto(url, { waitUntil: target.waitUntil, timeout: 30_000 });
            // Many SOTY sites have entry animations; let them settle.
            await page.waitForTimeout(2_500);
            await page.screenshot({
              path: `${dir}/${slug}-${variant.name}.png`,
              fullPage: true,
            });
            log.ok(`${target.site}/${slug}-${variant.name}`);
          } catch (e) {
            log.warn(`${target.site}/${slug}-${variant.name} failed: ${String(e).slice(0, 100)}`);
          } finally {
            await ctx.close();
          }
        }
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  log.err(String(e));
  process.exit(1);
});
