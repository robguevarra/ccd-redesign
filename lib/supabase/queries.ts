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

/* ---- staff_users (auth allowlist) ----------------------------------- */

export type StaffRole = 'owner' | 'editor';

export interface StaffUser {
  userId: string;
  email: string;
  displayName: string;
  role: StaffRole;
  doctorSlug: string | null;
  active: boolean;
  invitedBy: string | null;
  createdAt: string;
}

function rowToStaff(row: any): StaffUser {
  return {
    userId: row.user_id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    doctorSlug: row.doctor_slug,
    active: row.active,
    invitedBy: row.invited_by,
    createdAt: row.created_at,
  };
}

/** Returns the staff_users row for the currently-signed-in user, or null. */
export async function getCurrentStaffUser(): Promise<StaffUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('staff_users')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();
  if (error || !data) return null;
  return rowToStaff(data);
}

/** Lists all staff_users joined with auth.users.last_sign_in_at. */
export async function listStaffUsers(): Promise<
  Array<StaffUser & { lastSignInAt: string | null }>
> {
  const { createServiceRoleClient } = await import('./service-role');
  const admin = createServiceRoleClient();
  const { data: staff } = await admin
    .from('staff_users').select('*').order('created_at', { ascending: false });
  const { data: authList } = await admin.auth.admin.listUsers();
  const byId = new Map(
    (authList?.users ?? []).map((u) => [u.id, u.last_sign_in_at ?? null]),
  );
  return (staff ?? []).map((row) => ({
    ...rowToStaff(row),
    lastSignInAt: byId.get(row.user_id) ?? null,
  }));
}

export async function getStaffUserById(userId: string): Promise<StaffUser | null> {
  const { createServiceRoleClient } = await import('./service-role');
  const admin = createServiceRoleClient();
  const { data, error } = await admin
    .from('staff_users').select('*').eq('user_id', userId).maybeSingle();
  if (error || !data) return null;
  return rowToStaff(data);
}
