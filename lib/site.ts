/**
 * Canonical site URL — the production domain (apex, no www, matching the
 * old WordPress site's canonical form so SEO equity transfers 1:1).
 * Centralized so favicon generation, metadataBase, sitemap, structured data,
 * and the OG image all read from one source. Change here only.
 *
 * No trailing slash — code that joins paths assumes none.
 */
export const SITE_URL = 'https://dentisthsu.com';

/** Hostname only — used as the displayed URL in OG cards and similar. */
export const SITE_HOST = new URL(SITE_URL).host;
