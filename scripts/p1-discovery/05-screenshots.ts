import { readFile, mkdir } from 'node:fs/promises';
import { chromium, devices } from 'playwright';
import { sourcePaths } from './lib/paths';
import { slugify } from './lib/slugify';
import { selectAuditedPages } from './lib/audited-pages';
import { log } from './lib/logger';

async function main() {
  const sitemap = JSON.parse(await readFile(sourcePaths().sitemapJson, 'utf8')) as { urls: string[] };
  const targets = selectAuditedPages(sitemap.urls);
  log.step('05', `Capturing ${targets.length} pages on mobile + desktop`);

  const browser = await chromium.launch();
  for (const url of targets) {
    const slug = slugify(url);
    const dir = sourcePaths(slug).screenshotDir!;
    await mkdir(dir, { recursive: true });

    for (const variant of [
      { name: 'mobile', context: devices['iPhone 14'] },
      { name: 'desktop', context: { viewport: { width: 1440, height: 900 } } },
    ]) {
      const ctx = await browser.newContext(variant.context);
      const page = await ctx.newPage();
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
        await page.screenshot({ path: `${dir}/${variant.name}.png`, fullPage: true });
        log.ok(`${slug} ${variant.name}`);
      } catch (e) {
        log.warn(`${slug} ${variant.name} failed: ${String(e)}`);
      } finally {
        await ctx.close();
      }
    }
  }
  await browser.close();
}

main().catch((e) => { log.err(String(e)); process.exit(1); });
