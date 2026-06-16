'use server';

import { redirect } from 'next/navigation';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { uploadToBucket, deleteFromBucket } from '@/lib/supabase/storage';

export interface DoctorActionResult {
  ok: boolean;
  error?: string;
  slug?: string;
}

const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const inputSchema = z.object({
  slug: z.string().min(1).max(120).regex(slugRe, 'Slug must be lowercase + hyphens.'),
  name: z.string().min(1).max(120),
  title: z.string().min(1).max(200),
  short: z.string().min(1).max(800),
  bio: z.string().min(1).max(20000),
  specialties: z.string().optional(),
  // Optional — an empty field means "year unknown" (stored as null), not 0.
  joinedYear: z.preprocess(
    (v) => (v === '' || v == null ? undefined : v),
    z.coerce.number().int().min(1900).max(2100).optional(),
  ),
  isLead: z.boolean(),
  portraitAlt: z.string().max(300).optional(),
  portraitObjectPosition: z.string().max(40).optional(),
  active: z.boolean(),
});

function parseSpecialties(raw: string | undefined | null): string[] {
  if (!raw) return [];
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

function revalidateAll(slug: string) {
  revalidateTag('doctors', 'default');
  revalidatePath('/doctors');
  revalidatePath(`/doctors/${slug}`);
  revalidatePath('/');
  revalidatePath('/admin/doctors');
  revalidatePath(`/admin/doctors/${slug}`);
}

export async function createDoctor(formData: FormData): Promise<DoctorActionResult> {
  const parsed = inputSchema.safeParse({
    slug: formData.get('slug'),
    name: formData.get('name'),
    title: formData.get('title'),
    short: formData.get('short'),
    bio: formData.get('bio'),
    specialties: formData.get('specialties') ?? '',
    joinedYear: formData.get('joinedYear'),
    isLead: formData.has('isLead'),
    portraitAlt: formData.get('portraitAlt') ?? '',
    portraitObjectPosition: formData.get('portraitObjectPosition') ?? 'center center',
    active: formData.has('active'),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = await createClient();
  let portraitPath: string | null = null;
  const file = formData.get('portrait');
  if (file instanceof File && file.size > 0) {
    const upload = await uploadToBucket('doctor-portraits', file, parsed.data.slug);
    if (!upload.ok || !upload.path) return { ok: false, error: upload.error ?? 'Upload failed.' };
    portraitPath = upload.path;
  }

  const { data: maxRow } = await supabase.from('doctors')
    .select('display_order').order('display_order', { ascending: false }).limit(1).maybeSingle();
  const nextOrder = (maxRow?.display_order ?? -1) + 1;

  if (parsed.data.isLead) {
    await supabase.from('doctors').update({ is_lead: false }).eq('is_lead', true);
  }

  const { error } = await supabase.from('doctors').insert({
    slug: parsed.data.slug,
    name: parsed.data.name,
    title: parsed.data.title,
    short: parsed.data.short,
    bio: parsed.data.bio,
    specialties: parseSpecialties(parsed.data.specialties),
    joined_year: parsed.data.joinedYear ?? null,
    is_lead: parsed.data.isLead,
    portrait_path: portraitPath,
    portrait_alt: parsed.data.portraitAlt ?? parsed.data.name,
    portrait_object_position: parsed.data.portraitObjectPosition ?? 'center center',
    display_order: nextOrder,
    active: parsed.data.active,
  });
  if (error) {
    if (portraitPath) {
      await deleteFromBucket('doctor-portraits', portraitPath);
    }
    return { ok: false, error: error.message };
  }

  revalidateAll(parsed.data.slug);
  redirect(`/admin/doctors/${parsed.data.slug}`);
}

export async function updateDoctor(
  slug: string, formData: FormData,
): Promise<DoctorActionResult> {
  const parsed = inputSchema.safeParse({
    slug: formData.get('slug'),
    name: formData.get('name'),
    title: formData.get('title'),
    short: formData.get('short'),
    bio: formData.get('bio'),
    specialties: formData.get('specialties') ?? '',
    joinedYear: formData.get('joinedYear'),
    isLead: formData.has('isLead'),
    portraitAlt: formData.get('portraitAlt') ?? '',
    portraitObjectPosition: formData.get('portraitObjectPosition') ?? 'center center',
    active: formData.has('active'),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from('doctors').select('portrait_path').eq('slug', slug).maybeSingle();

  const updates: Record<string, unknown> = {
    slug: parsed.data.slug,
    name: parsed.data.name,
    title: parsed.data.title,
    short: parsed.data.short,
    bio: parsed.data.bio,
    specialties: parseSpecialties(parsed.data.specialties),
    joined_year: parsed.data.joinedYear ?? null,
    is_lead: parsed.data.isLead,
    portrait_alt: parsed.data.portraitAlt ?? parsed.data.name,
    portrait_object_position: parsed.data.portraitObjectPosition ?? 'center center',
    active: parsed.data.active,
  };

  const file = formData.get('portrait');
  if (file instanceof File && file.size > 0) {
    const upload = await uploadToBucket('doctor-portraits', file, parsed.data.slug);
    if (!upload.ok || !upload.path) return { ok: false, error: upload.error ?? 'Upload failed.' };
    updates.portrait_path = upload.path;
    if (existing?.portrait_path && existing.portrait_path !== upload.path) {
      await deleteFromBucket('doctor-portraits', existing.portrait_path);
    }
  }

  if (parsed.data.isLead) {
    await supabase.from('doctors').update({ is_lead: false })
      .eq('is_lead', true).neq('slug', slug);
  }

  const { error } = await supabase.from('doctors').update(updates).eq('slug', slug);
  if (error) {
    if (typeof updates.portrait_path === 'string' && updates.portrait_path) {
      await deleteFromBucket('doctor-portraits', updates.portrait_path);
    }
    return { ok: false, error: error.message };
  }

  revalidateAll(parsed.data.slug);
  return { ok: true, slug: parsed.data.slug };
}

export async function deleteDoctor(slug: string): Promise<DoctorActionResult> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from('doctors').select('portrait_path, is_lead').eq('slug', slug).maybeSingle();
  if (existing?.is_lead) {
    return { ok: false, error: 'Cannot delete the lead clinician. Set a new lead first.' };
  }
  const { count: postCount } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_doctor_slug', slug);
  if ((postCount ?? 0) > 0) {
    return {
      ok: false,
      error: `${postCount} blog post(s) reference this doctor as author. Deactivate instead, or reassign the posts first.`,
    };
  }
  const { error } = await supabase.from('doctors').delete().eq('slug', slug);
  if (error) return { ok: false, error: error.message };
  if (existing?.portrait_path) {
    await deleteFromBucket('doctor-portraits', existing.portrait_path);
  }
  revalidateAll(slug);
  redirect('/admin/doctors');
}

export async function reorderDoctor(
  slug: string, direction: 'up' | 'down',
): Promise<DoctorActionResult> {
  const supabase = await createClient();
  const { data: current } = await supabase
    .from('doctors').select('id, display_order, slug').eq('slug', slug).maybeSingle();
  if (!current) return { ok: false, error: 'Doctor not found.' };

  const cmp = direction === 'up' ? 'lt' : 'gt';
  const order = direction === 'up' ? 'desc' : 'asc';
  const { data: neighbor } = await supabase
    .from('doctors')
    .select('id, display_order')
    .filter('display_order', cmp, current.display_order)
    .order('display_order', { ascending: order === 'asc' })
    .limit(1).maybeSingle();
  if (!neighbor) return { ok: true };

  await supabase.from('doctors')
    .update({ display_order: neighbor.display_order }).eq('id', current.id);
  await supabase.from('doctors')
    .update({ display_order: current.display_order }).eq('id', neighbor.id);

  revalidateAll(current.slug);
  return { ok: true };
}

export async function setLead(slug: string): Promise<DoctorActionResult> {
  const supabase = await createClient();
  await supabase.from('doctors').update({ is_lead: false }).eq('is_lead', true);
  const { error } = await supabase.from('doctors').update({ is_lead: true }).eq('slug', slug);
  if (error) return { ok: false, error: error.message };
  revalidateAll(slug);
  return { ok: true };
}
