import { describe, expect, test, vi } from 'vitest';
import {
  buildIndexNowPayload,
  INDEXNOW_ENDPOINT,
  INDEXNOW_KEY,
  INDEXNOW_KEY_LOCATION,
  shouldNotifyIndexNow,
  submitToIndexNow,
  toIndexNowUrls,
} from '../indexnow';

describe('toIndexNowUrls', () => {
  test('resolves paths against the production host', () => {
    expect(toIndexNowUrls(['/blog', 'doctors'])).toEqual([
      'https://dentisthsu.com/blog',
      'https://dentisthsu.com/doctors',
    ]);
  });

  test('passes through on-host absolute URLs and canonicalizes them', () => {
    expect(
      toIndexNowUrls(['http://dentisthsu.com/reviews/', 'https://dentisthsu.com/#top']),
    ).toEqual(['https://dentisthsu.com/reviews', 'https://dentisthsu.com/']);
  });

  test('drops foreign hosts, admin paths, blanks, and duplicates', () => {
    expect(
      toIndexNowUrls([
        'https://www.dentisthsu.com/blog',
        'https://example.com/x',
        '/admin/posts',
        '/admin',
        '  ',
        '/blog',
        '/blog/',
      ]),
    ).toEqual(['https://dentisthsu.com/blog']);
  });
});

describe('buildIndexNowPayload', () => {
  test('carries host, key, and key location', () => {
    const p = buildIndexNowPayload(['/']);
    expect(p).toEqual({
      host: 'dentisthsu.com',
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: ['https://dentisthsu.com/'],
    });
    expect(INDEXNOW_KEY_LOCATION).toBe(`https://dentisthsu.com/${INDEXNOW_KEY}.txt`);
  });
});

describe('shouldNotifyIndexNow', () => {
  test('only production or explicit force', () => {
    expect(shouldNotifyIndexNow({})).toBe(false);
    expect(shouldNotifyIndexNow({ VERCEL_ENV: 'preview' })).toBe(false);
    expect(shouldNotifyIndexNow({ VERCEL_ENV: 'production' })).toBe(true);
    expect(shouldNotifyIndexNow({ INDEXNOW_FORCE: '1' })).toBe(true);
  });
});

describe('submitToIndexNow', () => {
  test('POSTs JSON to the IndexNow endpoint and treats 200/202 as ok', async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 202 }));
    const r = await submitToIndexNow(['/blog/hello'], fetchMock as unknown as typeof fetch);
    expect(r).toEqual({ ok: true, status: 202, submitted: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(INDEXNOW_ENDPOINT);
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toMatchObject({
      host: 'dentisthsu.com',
      urlList: ['https://dentisthsu.com/blog/hello'],
    });
  });

  test('reports non-2xx as not ok', async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 422 }));
    const r = await submitToIndexNow(['/x'], fetchMock as unknown as typeof fetch);
    expect(r.ok).toBe(false);
    expect(r.status).toBe(422);
  });

  test('skips the request entirely when nothing survives normalization', async () => {
    const fetchMock = vi.fn();
    const r = await submitToIndexNow(['https://example.com/'], fetchMock as unknown as typeof fetch);
    expect(r.skipped).toBe('no-urls');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
