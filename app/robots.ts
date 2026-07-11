import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * Production robots — the site is live on dentisthsu.com. Everything is
 * crawlable except the staff CMS. Pairs with the indexable default metadata
 * in app/layout.tsx (the pitch-era noindex was removed at switchover) and
 * the per-layout noindex on /admin.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/admin',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
