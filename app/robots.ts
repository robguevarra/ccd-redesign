import type { MetadataRoute } from 'next';

/**
 * Pitch site — DO NOT index. This is a live demo of a redesign for an
 * existing dental practice; the real practice already ranks for its name and
 * domain, and indexing this Vercel subdomain would risk duplicate-content
 * confusion and leak the work-in-progress publicly. Pair this with the
 * `robots: { index: false }` directive in app/layout.tsx (belt + suspenders).
 *
 * Flip back to `allow: '/'` (and re-add the sitemap line) only after the
 * engagement is won and this is promoted to the production domain.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
  };
}
