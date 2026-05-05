import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { dirname } from 'node:path';
import { firecrawl } from './lib/firecrawl-client';
import { sourcePaths } from './lib/paths';
import { slugify } from './lib/slugify';
import { log } from './lib/logger';

type Sitemap = { urls: string[] };

async function fileExists(p: string): Promise<boolean> {
  try { await access(p); return true; } catch { return false; }
}

async function main() {
  const sitemap = JSON.parse(await readFile(sourcePaths().sitemapJson, 'utf8')) as Sitemap;
  log.step('02', `Scraping ${sitemap.urls.length} URLs`);

  for (let i = 0; i < sitemap.urls.length; i++) {
    const url = sitemap.urls[i]!;
    const slug = slugify(url);
    const paths = sourcePaths(slug);
    if (!paths.pageMarkdown || !paths.pageJson) continue;

    if (await fileExists(paths.pageMarkdown)) {
      log.info(`[${i + 1}/${sitemap.urls.length}] cache hit: ${slug}`);
      continue;
    }

    log.step(`${i + 1}/${sitemap.urls.length}`, `scraping ${url}`);
    let r: Awaited<ReturnType<typeof firecrawl.scrapeUrl>>;
    try {
      r = await firecrawl.scrapeUrl(url, { formats: ['markdown', 'links'] });
    } catch (e) {
      log.warn(`scrape failed for ${url}: ${String(e)}`);
      continue;
    }
    if (!r.success) {
      log.warn(`scrape failed for ${url}: ${r.error ?? 'unknown'}`);
      continue;
    }

    await mkdir(dirname(paths.pageMarkdown), { recursive: true });
    await writeFile(paths.pageMarkdown, r.markdown ?? '');
    await writeFile(
      paths.pageJson,
      JSON.stringify(
        {
          url,
          slug,
          scrapedAt: new Date().toISOString(),
          metadata: r.metadata ?? {},
          links: r.links ?? [],
        },
        null,
        2,
      ),
    );
    log.ok(`wrote ${slug}.md + ${slug}.json`);
  }
}

main().catch((e) => { log.err(String(e)); process.exit(1); });
