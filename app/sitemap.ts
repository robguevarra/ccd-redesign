import type { MetadataRoute } from 'next';
import { services } from '@/content/services';
import { doctors } from '@/content/doctors';
import { listPublishedPosts } from '@/lib/supabase/queries';

const BASE = 'https://dentisthsu-redesign.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPublishedPosts();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/doctors`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/technology`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/reviews`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE}/financing`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/request-appointment`, lastModified: now, changeFrequency: 'yearly', priority: 0.9 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: s.signature ? 0.9 : 0.7,
  }));

  const doctorRoutes: MetadataRoute.Sitemap = doctors.map((d) => ({
    url: `${BASE}/doctors/${d.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...doctorRoutes, ...blogRoutes];
}
