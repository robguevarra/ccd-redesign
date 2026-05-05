import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { sourcePaths } from './lib/paths';
import { slugify } from './lib/slugify';
import { selectAuditedPages } from './lib/audited-pages';
import { log } from './lib/logger';

async function runLH(url: string, port: number, formFactor: 'mobile' | 'desktop') {
  const flags = { port, output: 'json' as const, logLevel: 'error' as const, formFactor };
  const config = formFactor === 'mobile' ? undefined : { extends: 'lighthouse:default', settings: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false } } };
  const result = await lighthouse(url, flags, config as never);
  if (!result) throw new Error('lighthouse returned undefined');
  return JSON.parse(result.report as string);
}

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

async function main() {
  const sitemap = JSON.parse(await readFile(sourcePaths().sitemapJson, 'utf8')) as { urls: string[] };
  const targets = selectAuditedPages(sitemap.urls);
  log.step('06', `Lighthouse on ${targets.length} pages × 2 form factors × 3 runs`);

  const chrome = await launch({ chromeFlags: ['--headless=new'] });
  try {
    for (const url of targets) {
      const slug = slugify(url);
      const out = sourcePaths(slug).lighthouseJson!;
      await mkdir(dirname(out), { recursive: true });

      const results: { mobile: any[]; desktop: any[] } = { mobile: [], desktop: [] };
      for (const ff of ['mobile', 'desktop'] as const) {
        for (let i = 0; i < 3; i++) {
          try {
            results[ff].push(await runLH(url, chrome.port, ff));
            log.ok(`${slug} ${ff} run ${i + 1}/3`);
          } catch (e) {
            log.warn(`${slug} ${ff} run ${i + 1} failed: ${String(e)}`);
          }
        }
      }

      const summary = (runs: any[]) => ({
        runs: runs.length,
        scores: {
          performance: median(runs.map((r) => Math.round((r.categories?.performance?.score ?? 0) * 100))),
          accessibility: median(runs.map((r) => Math.round((r.categories?.accessibility?.score ?? 0) * 100))),
          bestPractices: median(runs.map((r) => Math.round((r.categories?.['best-practices']?.score ?? 0) * 100))),
          seo: median(runs.map((r) => Math.round((r.categories?.seo?.score ?? 0) * 100))),
        },
        metrics: {
          lcpMs: median(runs.map((r) => r.audits?.['largest-contentful-paint']?.numericValue ?? 0)),
          fcpMs: median(runs.map((r) => r.audits?.['first-contentful-paint']?.numericValue ?? 0)),
          cls: median(runs.map((r) => r.audits?.['cumulative-layout-shift']?.numericValue ?? 0)),
          tbtMs: median(runs.map((r) => r.audits?.['total-blocking-time']?.numericValue ?? 0)),
        },
      });

      await writeFile(out, JSON.stringify({ url, generatedAt: new Date().toISOString(), mobile: summary(results.mobile), desktop: summary(results.desktop) }, null, 2));
      log.ok(`wrote ${out}`);
    }
  } finally {
    await chrome.kill();
  }
}

main().catch((e) => { log.err(String(e)); process.exit(1); });
