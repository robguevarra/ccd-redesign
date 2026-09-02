/**
 * Bulk-submit URLs to IndexNow (Bing / Yahoo / DuckDuckGo).
 *
 *   pnpm indexnow:submit                 # every URL in the live sitemap
 *   pnpm indexnow:submit /blog /doctors  # specific paths or absolute URLs
 *
 * Reads the production sitemap so what we submit is exactly what we publish.
 */
import { INDEXNOW_KEY_LOCATION, submitToIndexNow } from '../lib/indexnow';
import { SITE_URL } from '../lib/site';

async function sitemapUrls(): Promise<string[]> {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => (m[1] ?? "").trim()).filter(Boolean);
}

async function main() {
  const keyRes = await fetch(INDEXNOW_KEY_LOCATION);
  const keyBody = (await keyRes.text()).trim();
  if (!keyRes.ok || !INDEXNOW_KEY_LOCATION.endsWith(`/${keyBody}.txt`)) {
    throw new Error(
      `key file not live at ${INDEXNOW_KEY_LOCATION} (status ${keyRes.status}) — deploy first`,
    );
  }

  const args = process.argv.slice(2);
  const urls = args.length ? args : await sitemapUrls();
  const r = await submitToIndexNow(urls);
  console.log(
    r.skipped
      ? 'nothing to submit'
      : `IndexNow ${r.ok ? 'accepted' : 'REJECTED'} (HTTP ${r.status}) — ${r.submitted} url(s)`,
  );
  if (!r.ok) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
