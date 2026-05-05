'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export interface AppointmentSubmitResult {
  ok: boolean;
  error?: string;
}

const schema = z.object({
  name: z.string().min(1, 'Please enter your name.').max(100),
  phone: z
    .string()
    .min(7, 'Please enter a phone number.')
    .max(30)
    .regex(/[\d ()+\-.]/, 'That phone number looks unusual.'),
  email: z.union([z.string().email(), z.literal('')]).optional(),
  preferredTime: z.enum(['morning', 'afternoon', 'either']),
  notes: z.string().max(2000).optional(),
  /** Honeypot — must be empty. Bots fill it in. */
  website: z.string().max(0, 'Honeypot triggered.').optional(),
});

export async function submitAppointmentRequest(
  formData: FormData,
): Promise<AppointmentSubmitResult> {
  const raw = {
    name: String(formData.get('name') ?? '').trim(),
    phone: String(formData.get('phone') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim(),
    preferredTime: String(formData.get('preferredTime') ?? 'either'),
    notes: String(formData.get('notes') ?? '').trim(),
    website: String(formData.get('website') ?? ''),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid input.',
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('appointment_requests').insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      preferred_time: parsed.data.preferredTime,
      notes: parsed.data.notes || null,
    });

    if (error) {
      console.error('[appointment-request] supabase error:', error);
      return {
        ok: false,
        error:
          'Something went wrong on our end. Please call us directly — we\'d love to hear from you.',
      };
    }

    return { ok: true };
  } catch (e) {
    console.error('[appointment-request] unexpected error:', e);
    return {
      ok: false,
      error:
        'Something went wrong on our end. Please call us directly — we\'d love to hear from you.',
    };
  }
}
