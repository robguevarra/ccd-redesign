'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export interface ReviewActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

const inputSchema = z.object({
  source: z.enum(['google', 'yelp', 'facebook']),
  authorName: z.string().min(1).max(120),
  authorInitial: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().max(60).optional(),
  ),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().min(1).max(6000),
  sourceUrl: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? '' : v),
    z.string().url('Enter a valid URL.').max(500).or(z.literal('')),
  ),
  featured: z.boolean(),
  active: z.boolean(),
});

function parse(formData: FormData) {
  return inputSchema.safeParse({
    source: formData.get('source'),
    authorName: formData.get('authorName'),
    authorInitial: formData.get('authorInitial') ?? '',
    rating: formData.get('rating'),
    body: formData.get('body'),
    sourceUrl: formData.get('sourceUrl') ?? '',
    featured: formData.has('featured'),
    active: formData.has('active'),
  });
}

function toRow(data: z.infer<typeof inputSchema>) {
  return {
    source: data.source,
    author_name: data.authorName,
    author_initial: data.authorInitial ?? null,
    rating: data.rating,
    body: data.body,
    source_url: data.sourceUrl ?? '',
    featured: data.featured,
    active: data.active,
  };
}

/** The load-bearing invalidations: the public /reviews page and the homepage
 * featured-reviews strip, plus the admin list. */
function revalidateAll() {
  revalidatePath('/reviews');
  revalidatePath('/');
  revalidatePath('/admin/reviews');
}

export async function createReview(formData: FormData): Promise<ReviewActionResult> {
  const parsed = parse(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = await createClient();
  const { data: maxRow } = await supabase.from('reviews')
    .select('display_order').order('display_order', { ascending: false }).limit(1).maybeSingle();
  const nextOrder = (maxRow?.display_order ?? 0) + 1;

  const { data, error } = await supabase.from('reviews')
    .insert({ ...toRow(parsed.data), display_order: nextOrder })
    .select('id').single();
  if (error) return { ok: false, error: error.message };

  revalidateAll();
  redirect(`/admin/reviews/${data.id}`);
}

export async function updateReview(
  id: string, formData: FormData,
): Promise<ReviewActionResult> {
  const parsed = parse(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('reviews').update(toRow(parsed.data)).eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidateAll();
  return { ok: true, id };
}

export async function deleteReview(id: string): Promise<ReviewActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateAll();
  redirect('/admin/reviews');
}

export async function reorderReview(
  id: string, direction: 'up' | 'down',
): Promise<ReviewActionResult> {
  const supabase = await createClient();
  const { data: current } = await supabase
    .from('reviews').select('id, display_order').eq('id', id).maybeSingle();
  if (!current) return { ok: false, error: 'Review not found.' };

  const cmp = direction === 'up' ? 'lt' : 'gt';
  const { data: neighbor } = await supabase
    .from('reviews')
    .select('id, display_order')
    .filter('display_order', cmp, current.display_order)
    .order('display_order', { ascending: direction === 'down' })
    .limit(1).maybeSingle();
  if (!neighbor) return { ok: true };

  await supabase.from('reviews')
    .update({ display_order: neighbor.display_order }).eq('id', current.id);
  await supabase.from('reviews')
    .update({ display_order: current.display_order }).eq('id', neighbor.id);

  revalidateAll();
  return { ok: true };
}
