import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { sourcePaths } from './lib/paths';
import { slugify } from './lib/slugify';
import { selectAuditedPages } from './lib/audited-pages';
import { log } from './lib/logger';

async function main() {
  const sitemap = JSON.parse(await readFile(sourcePaths().sitemapJson, 'utf8')) as { urls: string[] };
  const targets = selectAuditedPages(sitemap.urls);
  log.step('07', `axe-core on ${targets.length} pages`);

  const browser = await chromium.launch();
  try {
    for (const url of targets) {
      const slug = slugify(url);
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
        const r = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();

        const summary = {
          url,
          generatedAt: new Date().toISOString(),
          counts: {
            violations: r.violations.length,
            incomplete: r.incomplete.length,
            passes: r.passes.length,
            inapplicable: r.inapplicable.length,
          },
          violations: r.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            helpUrl: v.helpUrl,
            nodes: v.nodes.length,
          })),
        };

        const out = sourcePaths(slug).axeJson!;
        await mkdir(dirname(out), { recursive: true });
        await writeFile(out, JSON.stringify(summary, null, 2));
        log.ok(`${slug}: ${summary.counts.violations} violations`);
      } catch (e) {
        log.warn(`${slug} failed: ${String(e)}`);
      } finally {
        await ctx.close();
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => { log.err(String(e)); process.exit(1); });
