'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export interface InquiryActionResult {
  ok: boolean;
  error?: string;
}

const statusSchema = z.enum(['new', 'contacted', 'closed']);

export async function updateInquiryStatus(
  id: string, status: string,
): Promise<InquiryActionResult> {
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, error: 'Invalid status.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('appointment_requests')
    .update({ status: parsed.data })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/inquiries');
  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath('/admin/dashboard');
  return { ok: true };
}

const notesSchema = z.string().max(4000);

export async function updateInquiryNotes(
  id: string, notes: string,
): Promise<InquiryActionResult> {
  const parsed = notesSchema.safeParse(notes);
  if (!parsed.success) return { ok: false, error: 'Notes too long.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('appointment_requests')
    .update({ internal_notes: parsed.data })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/inquiries/${id}`);
  return { ok: true };
}
