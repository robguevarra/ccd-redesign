'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { uploadToBucket, deleteFromBucket } from '@/lib/supabase/storage';

export interface FormActionResult {
  ok: boolean;
  error?: string;
}

const inputSchema = z.object({
  label: z.string().min(1, 'Label required.').max(120),
  description: z.string().max(500).optional(),
  active: z.enum(['true', 'false']).transform((v) => v === 'true'),
});

function revalidatePublic() {
  revalidatePath('/patient-forms');
  revalidatePath('/admin/patient-forms');
}

export async function createPatientForm(formData: FormData): Promise<FormActionResult> {
  const parsed = inputSchema.safeParse({
    label: formData.get('label'),
    description: formData.get('description') ?? '',
    active: formData.get('active') ?? 'true',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'Please choose a PDF to upload.' };
  }

  const upload = await uploadToBucket('patient-forms', file);
  if (!upload.ok || !upload.path) return { ok: false, error: upload.error ?? 'Upload failed.' };

  const supabase = await createClient();
  const { data: maxRow } = await supabase
    .from('patient_forms').select('display_order')
    .order('display_order', { ascending: false }).limit(1).maybeSingle();
  const nextOrder = (maxRow?.display_order ?? -1) + 1;

  const { data, error } = await supabase.from('patient_forms').insert({
    label: parsed.data.label,
    description: parsed.data.description || null,
    file_path: upload.path,
    file_size_bytes: file.size,
    display_order: nextOrder,
    active: parsed.data.active,
  }).select('id').single();

  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  redirect(`/admin/patient-forms/${data.id}`);
}

export async function updatePatientForm(
  id: string, formData: FormData,
): Promise<FormActionResult> {
  const parsed = inputSchema.safeParse({
    label: formData.get('label'),
    description: formData.get('description') ?? '',
    active: formData.get('active') ?? 'true',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }
  const file = formData.get('file');

  const supabase = await createClient();
  const updates: Record<string, unknown> = {
    label: parsed.data.label,
    description: parsed.data.description || null,
    active: parsed.data.active,
  };

  if (file instanceof File && file.size > 0) {
    const { data: existing } = await supabase
      .from('patient_forms').select('file_path').eq('id', id).maybeSingle();
    const upload = await uploadToBucket('patient-forms', file);
    if (!upload.ok || !upload.path) return { ok: false, error: upload.error ?? 'Upload failed.' };
    updates.file_path = upload.path;
    updates.file_size_bytes = file.size;
    if (existing?.file_path && existing.file_path !== upload.path) {
      await deleteFromBucket('patient-forms', existing.file_path);
    }
  }

  const { error } = await supabase.from('patient_forms').update(updates).eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

export async function deletePatientForm(id: string): Promise<FormActionResult> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from('patient_forms').select('file_path').eq('id', id).maybeSingle();
  const { error } = await supabase.from('patient_forms').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  if (existing?.file_path) await deleteFromBucket('patient-forms', existing.file_path);
  revalidatePublic();
  redirect('/admin/patient-forms');
}

export async function reorderPatientForm(
  id: string, direction: 'up' | 'down',
): Promise<FormActionResult> {
  const supabase = await createClient();
  const { data: current } = await supabase
    .from('patient_forms').select('id, display_order').eq('id', id).maybeSingle();
  if (!current) return { ok: false, error: 'Form not found.' };

  const cmp = direction === 'up' ? 'lt' : 'gt';
  const order = direction === 'up' ? 'desc' : 'asc';
  const { data: neighbor } = await supabase
    .from('patient_forms')
    .select('id, display_order')
    .filter('display_order', cmp, current.display_order)
    .order('display_order', { ascending: order === 'asc' })
    .limit(1).maybeSingle();
  if (!neighbor) return { ok: true };

  const { error: e1 } = await supabase.from('patient_forms')
    .update({ display_order: neighbor.display_order }).eq('id', current.id);
  const { error: e2 } = await supabase.from('patient_forms')
    .update({ display_order: current.display_order }).eq('id', neighbor.id);
  if (e1 || e2) return { ok: false, error: e1?.message ?? e2?.message ?? 'Swap failed.' };

  revalidatePublic();
  return { ok: true };
}
