'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { getCurrentStaffUser } from '@/lib/supabase/queries';

export interface UserActionResult {
  ok: boolean;
  error?: string;
}

async function requireOwner(): Promise<{ ok: true; userId: string } | UserActionResult> {
  const me = await getCurrentStaffUser();
  if (!me || me.role !== 'owner') return { ok: false, error: 'Forbidden.' };
  return { ok: true, userId: me.userId };
}

const inviteSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.').max(72),
  displayName: z.string().min(1, 'Name required.').max(120),
  role: z.enum(['owner', 'editor', 'front_office']),
  doctorSlug: z.string().optional().or(z.literal('')),
});

export async function inviteUser(formData: FormData): Promise<UserActionResult> {
  const auth = await requireOwner();
  if (!('userId' in auth)) return auth;

  const parsed = inviteSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    displayName: formData.get('displayName'),
    role: formData.get('role'),
    doctorSlug: formData.get('doctorSlug') ?? '',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const admin = createServiceRoleClient();

  const { data: list } = await admin.auth.admin.listUsers();
  const existing = list.users.find(
    (u) => u.email?.toLowerCase() === parsed.data.email.toLowerCase(),
  );

  let userId: string;
  if (existing) {
    // Existing auth user — update their password to the new one.
    const { error: updErr } = await admin.auth.admin.updateUserById(existing.id, {
      password: parsed.data.password,
    });
    if (updErr) return { ok: false, error: updErr.message };
    userId = existing.id;
  } else {
    const { data: created, error: createErr } =
      await admin.auth.admin.createUser({
        email: parsed.data.email,
        password: parsed.data.password,
        email_confirm: true,
        user_metadata: {
          display_name: parsed.data.displayName,
          role: parsed.data.role,
        },
      });
    if (createErr) return { ok: false, error: createErr.message };
    if (!created.user) return { ok: false, error: 'Failed to create auth user.' };
    userId = created.user.id;
  }

  const { error: insErr } = await admin.from('staff_users').upsert({
    user_id: userId,
    email: parsed.data.email,
    display_name: parsed.data.displayName,
    role: parsed.data.role,
    doctor_slug: parsed.data.doctorSlug || null,
    active: true,
    invited_by: auth.userId,
  }, { onConflict: 'user_id' });

  if (insErr) return { ok: false, error: insErr.message };

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

const updateSchema = z.object({
  displayName: z.string().min(1).max(120),
  role: z.enum(['owner', 'editor', 'front_office']),
  doctorSlug: z.string().optional().or(z.literal('')),
  active: z.boolean(),
});

export async function updateUser(
  userId: string,
  formData: FormData,
): Promise<UserActionResult> {
  const auth = await requireOwner();
  if (!('userId' in auth)) return auth;

  const parsed = updateSchema.safeParse({
    displayName: formData.get('displayName'),
    role: formData.get('role'),
    doctorSlug: formData.get('doctorSlug') ?? '',
    active: formData.has('active'),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const admin = createServiceRoleClient();

  if (userId === auth.userId) {
    const willStayOwnerAndActive =
      parsed.data.role === 'owner' && parsed.data.active;
    if (!willStayOwnerAndActive) {
      const { count } = await admin
        .from('staff_users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'owner')
        .eq('active', true)
        .neq('user_id', auth.userId);
      if ((count ?? 0) === 0) {
        return {
          ok: false,
          error: 'You are the last active owner. Promote another user first.',
        };
      }
    }
  }

  const { error } = await admin.from('staff_users').update({
    display_name: parsed.data.displayName,
    role: parsed.data.role,
    doctor_slug: parsed.data.doctorSlug || null,
    active: parsed.data.active,
  }).eq('user_id', userId);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/users');
  revalidatePath(`/admin/users/${userId}`);
  return { ok: true };
}

export async function deactivateUser(userId: string): Promise<UserActionResult> {
  const auth = await requireOwner();
  if (!('userId' in auth)) return auth;

  const admin = createServiceRoleClient();
  if (userId === auth.userId) {
    const { count } = await admin
      .from('staff_users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'owner')
      .eq('active', true)
      .neq('user_id', auth.userId);
    if ((count ?? 0) === 0) {
      return { ok: false, error: 'You are the last active owner.' };
    }
  }

  const { error } = await admin.from('staff_users')
    .update({ active: false }).eq('user_id', userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/users');
  return { ok: true };
}
