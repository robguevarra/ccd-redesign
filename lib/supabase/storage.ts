import 'server-only';
import { createClient } from './server';

export type UploadBucket = 'doctor-portraits' | 'patient-forms' | 'blog-images';

export interface UploadResult {
  ok: boolean;
  path?: string;
  publicUrl?: string;
  error?: string;
}

const ALLOWED_MIME: Record<UploadBucket, string[]> = {
  'doctor-portraits': ['image/jpeg', 'image/png', 'image/webp'],
  'patient-forms': ['application/pdf'],
  'blog-images': ['image/jpeg', 'image/png', 'image/webp'],
};

const MAX_BYTES: Record<UploadBucket, number> = {
  'doctor-portraits': 5 * 1024 * 1024,
  'patient-forms': 10 * 1024 * 1024,
  'blog-images': 8 * 1024 * 1024,
};

/**
 * Upload a File to a Supabase Storage bucket. Validates MIME + size
 * before contacting Storage. Returns the storage path and the
 * publicly-resolvable URL.
 *
 * `keyPrefix` is optional — defaults to a uuid filename. Pass a stable
 * value (like the doctor slug) when you want overwriting to replace
 * the previous asset rather than accumulate.
 */
export async function uploadToBucket(
  bucket: UploadBucket,
  file: File,
  keyPrefix?: string,
): Promise<UploadResult> {
  if (!ALLOWED_MIME[bucket].includes(file.type)) {
    return { ok: false, error: `File type ${file.type} not allowed in ${bucket}.` };
  }
  if (file.size > MAX_BYTES[bucket]) {
    return {
      ok: false,
      error: `File exceeds ${(MAX_BYTES[bucket] / 1024 / 1024).toFixed(0)}MB limit.`,
    };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const stem = keyPrefix ?? crypto.randomUUID();
  const path = `${stem}.${ext}`;

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) return { ok: false, error: error.message };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { ok: true, path, publicUrl: data.publicUrl };
}

/**
 * Delete an object from a bucket. Tolerant of missing objects.
 */
export async function deleteFromBucket(
  bucket: UploadBucket,
  path: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * Resolve a stored bucket path to its public URL. Cheap; no network call.
 */
export async function publicUrlFor(
  bucket: UploadBucket,
  path: string,
): Promise<string> {
  const supabase = await createClient();
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
