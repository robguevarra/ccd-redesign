import 'server-only';
import { unstable_cache } from 'next/cache';
import { createClient } from './server';
import type { BlogPost } from '@/content/schemas';

/**
 * Database row → typed BlogPost mapping.
 */
function rowToPost(row: any): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status,
    publishedAt: row.published_at,
    authorDoctorSlug: row.author_doctor_slug,
    hero: row.hero_path
      ? { src: row.hero_path, alt: row.hero_alt ?? '' }
      : null,
    excerpt: row.excerpt,
    bodyMdx: row.body_mdx,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPublishedPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[listPublishedPosts]', error);
    return [];
  }
  return (data ?? []).map(rowToPost);
}

export async function getPublishedPost(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    console.error('[getPublishedPost]', error);
    return null;
  }
  return data ? rowToPost(data) : null;
}

/* ---- Admin queries (require auth) ----------------------------------- */

export async function listAllPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) return [];
  return (data ?? []).map(rowToPost);
}

export async function getPost(id: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) return null;
  return data ? rowToPost(data) : null;
}

export async function listAppointmentRequests(limit = 10) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('appointment_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}
