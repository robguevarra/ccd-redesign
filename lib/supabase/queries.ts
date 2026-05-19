import 'server-only';
import { unstable_cache } from 'next/cache';
import { createClient } from './server';
import type { BlogPost, AppointmentRequest, AppointmentStatus, Doctor, Image } from '@/content/schemas';
import { publicUrlFor } from './storage';

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

function rowToInquiry(row: any): AppointmentRequest {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    preferredTime: row.preferred_time,
    notes: row.notes,
    internalNotes: row.internal_notes,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function listAppointmentRequests(limit = 10): Promise<AppointmentRequest[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('appointment_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data ?? []).map(rowToInquiry);
}

export async function listAllAppointmentRequests(
  status?: AppointmentStatus | 'all',
): Promise<AppointmentRequest[]> {
  const supabase = await createClient();
  let q = supabase.from('appointment_requests').select('*').order('created_at', { ascending: false });
  if (status && status !== 'all') q = q.eq('status', status);
  const { data } = await q;
  return (data ?? []).map(rowToInquiry);
}

export async function getAppointmentRequest(id: string): Promise<AppointmentRequest | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('appointment_requests').select('*').eq('id', id).maybeSingle();
  return data ? rowToInquiry(data) : null;
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

/* ---- patient_forms ----------------------------------------------------- */

export interface PatientForm {
  id: string;
  label: string;
  description: string | null;
  filePath: string;
  fileSizeBytes: number | null;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

function rowToPatientForm(row: any): PatientForm {
  return {
    id: row.id,
    label: row.label,
    description: row.description,
    filePath: row.file_path,
    fileSizeBytes: row.file_size_bytes,
    displayOrder: row.display_order,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPatientForms(opts: { activeOnly?: boolean } = {}): Promise<PatientForm[]> {
  const supabase = await createClient();
  let q = supabase
    .from('patient_forms').select('*').order('display_order', { ascending: true });
  if (opts.activeOnly) q = q.eq('active', true);
  const { data } = await q;
  return (data ?? []).map(rowToPatientForm);
}

export async function getPatientForm(id: string): Promise<PatientForm | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('patient_forms').select('*').eq('id', id).maybeSingle();
  return data ? rowToPatientForm(data) : null;
}

/* ---- doctors --------------------------------------------------------- */

async function rowToDoctor(row: any): Promise<Doctor> {
  let portrait: Image;
  if (row.portrait_path) {
    const src = await publicUrlFor('doctor-portraits', row.portrait_path);
    portrait = {
      src,
      alt: row.portrait_alt ?? row.name,
      objectPosition: row.portrait_object_position ?? 'center center',
    };
  } else {
    portrait = {
      src: `/images/doctors/${row.slug}.webp`,
      alt: row.portrait_alt ?? row.name,
      objectPosition: row.portrait_object_position ?? 'center center',
    };
  }
  return {
    slug: row.slug,
    name: row.name,
    title: row.title,
    portrait,
    short: row.short,
    bio: row.bio,
    specialties: row.specialties ?? [],
    joinedYear: row.joined_year,
    isLead: row.is_lead,
  };
}

export async function listDoctors(opts: { activeOnly?: boolean } = { activeOnly: true }): Promise<Doctor[]> {
  const supabase = await createClient();
  let q = supabase
    .from('doctors')
    .select('*')
    .order('display_order', { ascending: true });
  if (opts.activeOnly !== false) q = q.eq('active', true);
  const { data } = await q;
  if (!data) return [];
  return Promise.all(data.map(rowToDoctor));
}

export async function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('doctors').select('*').eq('slug', slug).maybeSingle();
  return data ? rowToDoctor(data) : null;
}

export interface DoctorRow extends Doctor {
  id: string;
  displayOrder: number;
  active: boolean;
  portraitPath: string | null;
}

export async function listDoctorRows(): Promise<DoctorRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('doctors').select('*').order('display_order', { ascending: true });
  if (!data) return [];
  const docs = await Promise.all(data.map(async (row) => {
    const d = await rowToDoctor(row);
    return {
      ...d,
      id: row.id,
      displayOrder: row.display_order,
      active: row.active,
      portraitPath: row.portrait_path,
    };
  }));
  return docs;
}

export async function getDoctorRow(slug: string): Promise<DoctorRow | null> {
  const supabase = await createClient();
  const { data: row } = await supabase
    .from('doctors').select('*').eq('slug', slug).maybeSingle();
  if (!row) return null;
  const d = await rowToDoctor(row);
  return {
    ...d,
    id: row.id,
    displayOrder: row.display_order,
    active: row.active,
    portraitPath: row.portrait_path,
  };
}
