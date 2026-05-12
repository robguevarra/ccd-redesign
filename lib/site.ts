/**
 * Canonical site URL — the pitch demo lives here. Centralized so favicon
 * generation, metadataBase, sitemap, structured data, and the OG image all
 * read from one source. When the engagement is won and we promote to the
 * real domain, this is the only place to change.
 *
 * No trailing slash — code that joins paths assumes none.
 */
export const SITE_URL = 'https://ccd-redesign.vercel.app';

/** Hostname only — used as the displayed URL in OG cards and similar. */
export const SITE_HOST = new URL(SITE_URL).host;
