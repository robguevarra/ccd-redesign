import { SITE_URL, SITE_HOST } from '@/lib/site';

/**
 * IndexNow — push URL changes to Bing (and Yandex, Seznam, Naver, which share
 * the protocol) the moment content changes, instead of waiting weeks for a
 * recrawl. Yahoo and DuckDuckGo serve Bing's index, so one ping covers all.
 *
 * Protocol: https://www.indexnow.org/documentation
 *   - The key is public by design. Bing verifies ownership by fetching
 *     `${SITE_URL}/${INDEXNOW_KEY}.txt` (served from /public) and checking
 *     the body equals the key.
 *   - One POST can carry up to 10,000 URLs, all on the same host.
 *   - 200/202 = accepted. 400 bad request, 403 key invalid, 422 URL/host
 *     mismatch, 429 throttled.
 *
 * Wired into the admin server actions (posts / doctors / reviews) via
 * `notifyIndexNow`, which is a no-op outside production so preview deploys
 * and local dev never ping Bing with URLs that don't exist on the live host.
 * `pnpm indexnow:submit` bulk-submits the live sitemap on demand.
 *
 * Registered in Bing Webmaster Tools on 2026-09-02.
 */

export const INDEXNOW_KEY = '2171c98f59cd441c88ebe29cfe77285a';
export const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
export const INDEXNOW_MAX_URLS = 10_000;

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

export interface IndexNowResult {
  ok: boolean;
  status: number;
  submitted: number;
  /** Set when the request was skipped (nothing to send). */
  skipped?: 'no-urls';
}

/**
 * Normalize paths and/or absolute URLs into a deduped list of absolute URLs
 * on the production host. Anything off-host, under /admin, or empty is
 * dropped — IndexNow rejects the whole batch (422) on a single foreign host,
 * and admin pages are noindex.
 */
export function toIndexNowUrls(inputs: readonly string[]): string[] {
  const out = new Set<string>();
  for (const raw of inputs) {
    const s = raw.trim();
    if (!s) continue;
    let url: URL;
    try {
      url = s.startsWith('http://') || s.startsWith('https://')
        ? new URL(s)
        : new URL(s.startsWith('/') ? s : `/${s}`, SITE_URL);
    } catch {
      continue;
    }
    if (url.host !== SITE_HOST) continue;
    if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) continue;
    // Canonical form: https, no trailing slash except root, no hash.
    url.protocol = 'https:';
    url.hash = '';
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
    }
    out.add(url.toString());
    if (out.size >= INDEXNOW_MAX_URLS) break;
  }
  return [...out];
}

export function buildIndexNowPayload(inputs: readonly string[]): IndexNowPayload {
  return {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: toIndexNowUrls(inputs),
  };
}

/**
 * Only production should ping — the key file and the URLs only resolve on
 * the live host. `INDEXNOW_FORCE=1` lets the CLI script run from a laptop.
 */
export function shouldNotifyIndexNow(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return env.INDEXNOW_FORCE === '1' || env.VERCEL_ENV === 'production';
}

export async function submitToIndexNow(
  inputs: readonly string[],
  fetchImpl: typeof fetch = fetch,
): Promise<IndexNowResult> {
  const payload = buildIndexNowPayload(inputs);
  if (payload.urlList.length === 0) {
    return { ok: true, status: 0, submitted: 0, skipped: 'no-urls' };
  }
  const res = await fetchImpl(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  return {
    ok: res.status === 200 || res.status === 202,
    status: res.status,
    submitted: payload.urlList.length,
  };
}

/**
 * Fire-and-forget for server actions. Never throws — a Bing outage must not
 * fail a content save. Callers should wrap in `after()` from next/server so
 * the ping runs once the response has been sent.
 */
export async function notifyIndexNow(inputs: readonly string[]): Promise<void> {
  if (!shouldNotifyIndexNow()) return;
  try {
    const r = await submitToIndexNow(inputs);
    if (!r.ok && !r.skipped) {
      console.warn(`[indexnow] Bing returned ${r.status} for ${r.submitted} url(s)`);
    }
  } catch (err) {
    console.warn('[indexnow] submit failed', err);
  }
}
