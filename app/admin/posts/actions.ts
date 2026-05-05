'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const postSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .max(120)
    .regex(slugRe, 'Slug must be lowercase, hyphenated, no special characters.'),
  title: z.string().min(1, 'Title is required.').max(200),
  excerpt: z.string().max(500).optional(),
  bodyMdx: z.string().min(1, 'Post body cannot be empty.'),
  tags: z.string().optional(),
  authorDoctorSlug: z.string().min(1).default('dr-brien-hsu'),
  status: z.enum(['draft', 'published']),
});

export interface PostActionResult {
  ok: boolean;
  error?: string;
  postId?: string;
}

function parseTags(raw: string | undefined | null): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

function revalidatePublic(slug: string) {
  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
}

export async function createPost(formData: FormData): Promise<PostActionResult> {
  const parsed = postSchema.safeParse({
    slug: formData.get('slug'),
    title: formData.get('title'),
    excerpt: formData.get('excerpt') ?? '',
    bodyMdx: formData.get('bodyMdx'),
    tags: formData.get('tags') ?? '',
    authorDoctorSlug: formData.get('authorDoctorSlug') ?? 'dr-brien-hsu',
    status: formData.get('status') ?? 'draft',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      slug: parsed.data.slug,
      title: parsed.data.title,
      excerpt: parsed.data.excerpt ?? '',
      body_mdx: parsed.data.bodyMdx,
      tags: parseTags(parsed.data.tags),
      author_doctor_slug: parsed.data.authorDoctorSlug,
      status: parsed.data.status,
      published_at:
        parsed.data.status === 'published' ? new Date().toISOString() : null,
    })
    .select('id')
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  if (parsed.data.status === 'published') {
    revalidatePublic(parsed.data.slug);
  }

  redirect(`/admin/posts/${data.id}`);
}

export async function updatePost(
  id: string,
  formData: FormData,
): Promise<PostActionResult> {
  const parsed = postSchema.safeParse({
    slug: formData.get('slug'),
    title: formData.get('title'),
    excerpt: formData.get('excerpt') ?? '',
    bodyMdx: formData.get('bodyMdx'),
    tags: formData.get('tags') ?? '',
    authorDoctorSlug: formData.get('authorDoctorSlug') ?? 'dr-brien-hsu',
    status: formData.get('status') ?? 'draft',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = await createClient();

  // Fetch current to compare publish state.
  const { data: current } = await supabase
    .from('blog_posts')
    .select('status,published_at,slug')
    .eq('id', id)
    .single();

  const isNewlyPublishing =
    parsed.data.status === 'published' &&
    (current?.status !== 'published' || !current?.published_at);

  const updates: Record<string, unknown> = {
    slug: parsed.data.slug,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt ?? '',
    body_mdx: parsed.data.bodyMdx,
    tags: parseTags(parsed.data.tags),
    author_doctor_slug: parsed.data.authorDoctorSlug,
    status: parsed.data.status,
  };
  if (isNewlyPublishing) {
    updates.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id);

  if (error) {
    return { ok: false, error: error.message };
  }

  // Revalidate both old and new slugs in case slug changed.
  if (parsed.data.status === 'published' || current?.status === 'published') {
    revalidatePublic(parsed.data.slug);
    if (current?.slug && current.slug !== parsed.data.slug) {
      revalidatePublic(current.slug);
    }
  }

  return { ok: true, postId: id };
}

export async function deletePost(id: string): Promise<PostActionResult> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from('blog_posts')
    .select('slug,status')
    .eq('id', id)
    .single();

  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };

  if (existing?.status === 'published' && existing.slug) {
    revalidatePublic(existing.slug);
  }

  redirect('/admin/dashboard');
}
