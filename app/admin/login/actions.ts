'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export interface LoginResult {
  ok: boolean;
  error?: string;
}

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export async function signIn(formData: FormData): Promise<LoginResult> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get('email') ?? '').trim(),
    password: String(formData.get('password') ?? ''),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { ok: false, error: error.message };
  }
  redirect('/admin/dashboard');
}

const resetSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
});

export async function requestPasswordReset(formData: FormData): Promise<LoginResult> {
  const parsed = resetSchema.safeParse({
    email: String(formData.get('email') ?? '').trim(),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = await createClient();
  // Build redirect URL from the request host so it works both in dev (autoPort)
  // and on the deployed Vercel URL.
  const h = await headers();
  const host = h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const redirectTo = `${proto}://${host}/admin/auth/callback?next=/admin/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo,
  });
  // Treat unknown emails as success to avoid leaking which addresses are registered.
  if (error && !/User not found/i.test(error.message)) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
