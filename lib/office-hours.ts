import type { BusinessHours } from '@/content/schemas';
import { practiceInfo } from '@/content/practice-info';

/**
 * Office hours: the single source of truth, editable from /admin/settings and
 * read by the footer, contact page, schema.org structured data, and the Weave
 * "business hours" scheduler.
 *
 * Isomorphic (no 'server-only') so the admin form, marketing components, and
 * server queries share the shape + normalization.
 */

/** Canonical week order. The stored array is normalized to exactly this. */
export const DAY_ORDER = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export type DayName = (typeof DAY_ORDER)[number];

/**
 * Seed/fallback hours — mirrors the DB column default in
 * supabase/migrations/2026-05-29_add_office_hours.sql and the original
 * content/practice-info.ts values. Used when the settings row can't be read.
 */
export const DEFAULT_OFFICE_HOURS: BusinessHours[] = practiceInfo.hours;

const HHMM = /^([01]?\d|2[0-3]):[0-5]\d$/;

/**
 * Coerce an unknown value (e.g. a JSONB blob) into a valid 7-day, correctly
 * ordered hours array. Missing/invalid days fall back to the default for that
 * day so the site never renders a broken or partial week.
 */
export function normalizeOfficeHours(input: unknown): BusinessHours[] {
  const byDay = new Map<string, BusinessHours>();
  if (Array.isArray(input)) {
    for (const raw of input) {
      if (!raw || typeof raw !== 'object') continue;
      const r = raw as Record<string, unknown>;
      if (typeof r.day !== 'string' || !DAY_ORDER.includes(r.day as DayName)) continue;
      const closed = r.closed === true;
      const open = typeof r.open === 'string' && HHMM.test(r.open) ? r.open : '';
      const close = typeof r.close === 'string' && HHMM.test(r.close) ? r.close : '';
      // A day with no valid open/close is treated as closed regardless of flag.
      const isClosed = closed || !open || !close;
      byDay.set(r.day, {
        day: r.day,
        open: isClosed ? '' : open,
        close: isClosed ? '' : close,
        ...(isClosed ? { closed: true } : {}),
      });
    }
  }

  return DAY_ORDER.map((day) => {
    const found = byDay.get(day);
    if (found) return found;
    const fallback = DEFAULT_OFFICE_HOURS.find((h) => h.day === day);
    return fallback ?? { day, open: '', close: '', closed: true };
  });
}

/** "HH:MM" 24h → "9:00 AM" for display. Returns '' for blank input. */
export function formatTime12h(hhmm: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  if (!m) return '';
  let h = parseInt(m[1]!, 10);
  const min = m[2]!;
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${min} ${period}`;
}

/** Human label for a day's hours, e.g. "9:00 AM – 6:00 PM" or "Closed". */
export function formatDayHours(h: BusinessHours): string {
  if (h.closed || !h.open || !h.close) return 'Closed';
  return `${formatTime12h(h.open)} – ${formatTime12h(h.close)}`;
}
