'use server';

import { z } from 'zod';

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

  // Stub for the pitch demo: log the request server-side. Wired to Supabase
  // + Resend in a later commit; current state intentionally doesn't depend on
  // those to keep the demo deployable independent of backend status.
  console.log('[appointment-request]', parsed.data);

  // Simulate a small RTT so the UX feels real.
  await new Promise((r) => setTimeout(r, 400));
  return { ok: true };
}
