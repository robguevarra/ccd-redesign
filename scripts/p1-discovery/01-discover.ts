import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { firecrawl } from './lib/firecrawl-client';
import { sourcePaths } from './lib/paths';
import { log } from './lib/logger';

const TARGET = 'https://dentisthsu.com';

async function main() {
  log.step('01', `Mapping ${TARGET} via Firecrawl /map`);
  const result = await firecrawl.mapUrl(TARGET, { limit: 500 });

  if (!result.success) {
    log.err(`Map failed: ${result.error ?? 'unknown error'}`);
    process.exit(1);
  }

  const links = result.links ?? [];
  log.ok(`Discovered ${links.length} URLs`);

  const out = sourcePaths().sitemapJson;
  await mkdir(dirname(out), { recursive: true });
  await writeFile(
    out,
    JSON.stringify(
      { target: TARGET, discoveredAt: new Date().toISOString(), count: links.length, urls: links },
      null,
      2,
    ),
  );
  log.ok(`Wrote ${out}`);
}

main().catch((e) => {
  log.err(String(e));
  process.exit(1);
});
