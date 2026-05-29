'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getCurrentStaffUser, SITE_SETTINGS_TAG } from '@/lib/supabase/queries';
import { normalizeWeaveConfig } from '@/lib/weave';
import { DAY_ORDER, normalizeOfficeHours } from '@/lib/office-hours';
import type { BusinessHours } from '@/content/schemas';

export interface SettingsActionResult {
  ok: boolean;
  error?: string;
}

/** Weave settings are managed by owners and front-office staff (who answer the texts). */
async function requireSettingsManager(): Promise<
  { ok: true; userId: string } | SettingsActionResult
> {
  const me = await getCurrentStaffUser();
  if (!me || (me.role !== 'owner' && me.role !== 'front_office')) {
    return { ok: false, error: 'Forbidden.' };
  }
  return { ok: true, userId: me.userId };
}

const weaveSchema = z.object({
  enabled: z.boolean(),
  widgetId: z
    .string()
    .trim()
    .min(1, 'Widget ID is required.')
    .max(200)
    // Weave embed ids are UUIDs; keep it permissive but reject obvious junk.
    .regex(/^[A-Za-z0-9-]+$/, 'Widget ID may only contain letters, numbers and dashes.'),
  scheduleMode: z.enum(['always', 'business_hours']),
  blackoutDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).max(60),
});

/** Checkbox inputs only appear in FormData when checked. */
function checkbox(formData: FormData, name: string): boolean {
  return formData.get(name) === 'on' || formData.get(name) === 'true';
}

export async function updateWeaveSettings(
  formData: FormData,
): Promise<SettingsActionResult> {
  const auth = await requireSettingsManager();
  if (!('userId' in auth)) return auth;

  // blackoutDates arrive as a comma/newline-separated textarea; split + clean.
  const blackoutRaw = String(formData.get('blackoutDates') ?? '');
  const blackoutDates = Array.from(
    new Set(
      blackoutRaw
        .split(/[\s,]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ).sort();

  const parsed = weaveSchema.safeParse({
    enabled: checkbox(formData, 'enabled'),
    widgetId: formData.get('widgetId'),
    scheduleMode: formData.get('scheduleMode'),
    blackoutDates,
  });

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const msg =
      issue?.path[0] === 'blackoutDates'
        ? 'Blackout dates must be in YYYY-MM-DD format.'
        : issue?.message ?? 'Invalid input.';
    return { ok: false, error: msg };
  }

  const p = parsed.data;
  // normalizeWeaveConfig keeps timezone consistent with defaults + drops any
  // legacy fields still present on the stored row.
  const weave = normalizeWeaveConfig({
    enabled: p.enabled,
    widgetId: p.widgetId,
    schedule: { mode: p.scheduleMode, blackoutDates: p.blackoutDates },
  });

  const supabase = await createClient();
  const { error } = await supabase
    .from('site_settings')
    .update({ weave, updated_by: auth.userId })
    .eq('id', 1);

  if (error) return { ok: false, error: error.message };

  // Bust the marketing cache and refresh the admin form.
  revalidateTag(SITE_SETTINGS_TAG, 'default');
  revalidatePath('/admin/settings');

  return { ok: true };
}

/* ---- Office hours ---------------------------------------------------- */

const HHMM = /^([01]?\d|2[0-3]):[0-5]\d$/;

/** "HH:MM" → minutes since midnight (assumes HHMM already matched). */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':');
  return parseInt(h!, 10) * 60 + parseInt(m!, 10);
}

/**
 * Save office hours. FormData carries, per day: `<Day>-closed` (checkbox),
 * `<Day>-open`, `<Day>-close` (HH:MM). Reflected in the footer, contact page,
 * schema.org data, and the Weave business-hours scheduler.
 */
export async function updateOfficeHours(
  formData: FormData,
): Promise<SettingsActionResult> {
  const auth = await requireSettingsManager();
  if (!('userId' in auth)) return auth;

  const hours: BusinessHours[] = [];
  for (const day of DAY_ORDER) {
    const closed = checkbox(formData, `${day}-closed`);
    if (closed) {
      hours.push({ day, open: '', close: '', closed: true });
      continue;
    }
    const open = String(formData.get(`${day}-open`) ?? '').trim();
    const close = String(formData.get(`${day}-close`) ?? '').trim();
    if (!HHMM.test(open) || !HHMM.test(close)) {
      return { ok: false, error: `Enter open and close times for ${day}, or mark it closed.` };
    }
    if (toMinutes(open) >= toMinutes(close)) {
      return { ok: false, error: `${day}: the closing time must be after the opening time.` };
    }
    hours.push({ day, open, close });
  }

  // normalizeOfficeHours guarantees a complete, ordered 7-day array.
  const normalized = normalizeOfficeHours(hours);

  const supabase = await createClient();
  const { error } = await supabase
    .from('site_settings')
    .update({ hours: normalized, updated_by: auth.userId })
    .eq('id', 1);

  if (error) return { ok: false, error: error.message };

  revalidateTag(SITE_SETTINGS_TAG, 'default');
  revalidatePath('/admin/settings');

  return { ok: true };
}
