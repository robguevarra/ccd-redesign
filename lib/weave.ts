import type { BusinessHours } from '@/content/schemas';
import { DEFAULT_OFFICE_HOURS } from '@/lib/office-hours';

/**
 * Weave Text Connect integration config + scheduling logic.
 *
 * This module is isomorphic (no 'server-only') so the admin form, the
 * marketing "Text us" component, and the server query all share one source of
 * truth for the config shape and the "is texting available right now?" rule.
 *
 * Why a scheduler: Weave texts land in the front desk's inbox. Outside office
 * hours / on holidays nobody answers, and a patient texting into silence is a
 * worse experience than being nudged to call. The schedule auto-hides the
 * "Text us" button when staff aren't there to respond.
 *
 * There is one surface: an on-brand "Text us" button (on Contact + Request
 * Appointment) that opens a modal embedding Weave's hosted page. (The
 * earlier site-wide floating bubble was removed at the practice's request.)
 */

export type WeaveScheduleMode = 'always' | 'business_hours';

export interface WeaveSchedule {
  /** 'always' = whenever enabled. 'business_hours' = only during practice hours. */
  mode: WeaveScheduleMode;
  /** ISO dates (YYYY-MM-DD, practice-local) on which texting is force-hidden. */
  blackoutDates: string[];
}

export interface WeaveConfig {
  /** Master switch. When false, no "Text us" button renders anywhere. */
  enabled: boolean;
  /** Weave Text Connect widget id (the uuid in the embed URL). */
  widgetId: string;
  schedule: WeaveSchedule;
  /** IANA timezone the schedule is evaluated in (practice-local). */
  timezone: string;
}

/**
 * Defaults — must mirror the DB column default in
 * supabase/migrations/2026-05-29_create_site_settings.sql. Used as a fallback
 * when the settings row can't be read so the site never hard-crashes on it.
 */
export const WEAVE_DEFAULTS: WeaveConfig = {
  enabled: false,
  widgetId: '6d39d575-d6f2-45b7-8961-69a41b828fdb',
  schedule: { mode: 'always', blackoutDates: [] },
  timezone: 'America/Los_Angeles',
};

/** URL for the hosted Text Connect page (embedded in the modal iframe). */
export function weaveTextConnectUrl(widgetId: string): string {
  return `https://book.getweave.com/${widgetId}/text-connect/contact-info`;
}

/**
 * Coerce an unknown value (e.g. a JSONB blob from the DB) into a valid
 * WeaveConfig, filling any missing/invalid field from WEAVE_DEFAULTS and
 * ignoring legacy fields (showFloatingWidget, showInlineButtons,
 * offlineBehavior) left over from earlier versions.
 */
export function normalizeWeaveConfig(input: unknown): WeaveConfig {
  const raw = (input ?? {}) as Record<string, unknown>;
  const schedRaw = (raw.schedule ?? {}) as Record<string, unknown>;

  const mode: WeaveScheduleMode =
    schedRaw.mode === 'business_hours' ? 'business_hours' : 'always';

  const blackoutDates = Array.isArray(schedRaw.blackoutDates)
    ? schedRaw.blackoutDates.filter(
        (d): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d),
      )
    : [];

  return {
    enabled: typeof raw.enabled === 'boolean' ? raw.enabled : WEAVE_DEFAULTS.enabled,
    widgetId:
      typeof raw.widgetId === 'string' && raw.widgetId.length > 0
        ? raw.widgetId
        : WEAVE_DEFAULTS.widgetId,
    schedule: { mode, blackoutDates },
    timezone:
      typeof raw.timezone === 'string' && raw.timezone.length > 0
        ? raw.timezone
        : WEAVE_DEFAULTS.timezone,
  };
}

/* ---- Schedule evaluation ------------------------------------------------ */

interface TzParts {
  /** Full weekday name, e.g. "Monday". */
  weekday: string;
  /** Minutes since local midnight. */
  minutes: number;
  /** Local date as YYYY-MM-DD. */
  isoDate: string;
}

/** Decompose a Date into practice-local parts using Intl (DST-correct). */
function partsInTimezone(date: Date, timezone: string): TzParts {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = fmt.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';

  let hour = parseInt(get('hour'), 10);
  // Intl can emit "24" for midnight with hour12:false; normalize to 0.
  if (hour === 24) hour = 0;
  const minute = parseInt(get('minute'), 10);

  return {
    weekday: get('weekday'),
    minutes: hour * 60 + minute,
    isoDate: `${get('year')}-${get('month')}-${get('day')}`,
  };
}

/** "HH:MM" → minutes since midnight. */
function hhmmToMinutes(value: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!m) return null;
  return parseInt(m[1]!, 10) * 60 + parseInt(m[2]!, 10);
}

/** Is the practice within its published business hours at `parts`? */
function withinBusinessHours(parts: TzParts, hours: BusinessHours[]): boolean {
  const today = hours.find((h) => h.day === parts.weekday);
  if (!today || today.closed) return false;
  const open = hhmmToMinutes(today.open);
  const close = hhmmToMinutes(today.close);
  if (open === null || close === null) return false;
  return parts.minutes >= open && parts.minutes < close;
}

/**
 * The single rule that governs the Weave "Text us" button. Pure and
 * deterministic given (config, now, hours) — unit-tested in
 * lib/__tests__/weave.test.ts. `hours` defaults to the seed values so callers
 * that don't have the admin-edited hours still behave sensibly.
 */
export function isWeaveLiveNow(
  config: WeaveConfig,
  now: Date,
  hours: BusinessHours[] = DEFAULT_OFFICE_HOURS,
): boolean {
  if (!config.enabled) return false;

  const parts = partsInTimezone(now, config.timezone);

  // Blackout dates win over everything (holidays / closures).
  if (config.schedule.blackoutDates.includes(parts.isoDate)) return false;

  if (config.schedule.mode === 'always') return true;
  return withinBusinessHours(parts, hours);
}
