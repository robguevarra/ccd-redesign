import { describe, expect, test } from 'vitest';
import {
  isWeaveLiveNow,
  normalizeWeaveConfig,
  weaveTextConnectUrl,
  WEAVE_DEFAULTS,
  type WeaveConfig,
} from '../weave';

// Practice hours (content/practice-info.ts): Mon/Tue 09:00–18:00,
// Wed 08:00–17:00, Thu 09:00–18:00, Fri/Sat/Sun closed. Timezone is
// America/Los_Angeles → PDT (UTC-7) in late May.
//
// Reference instants (UTC) and their LA-local meaning:
//   2026-05-25T19:00:00Z = Mon 12:00 PDT  (within Mon hours)
//   2026-05-25T14:00:00Z = Mon 07:00 PDT  (before open)
//   2026-05-26T02:00:00Z = Mon 19:00 PDT  (after close)
//   2026-05-29T19:00:00Z = Fri 12:00 PDT  (closed day)
const MON_NOON = new Date('2026-05-25T19:00:00Z');
const MON_EARLY = new Date('2026-05-25T14:00:00Z');
const MON_EVENING = new Date('2026-05-26T02:00:00Z');
const FRI_NOON = new Date('2026-05-29T19:00:00Z');

function cfg(overrides: Partial<WeaveConfig> = {}): WeaveConfig {
  return { ...WEAVE_DEFAULTS, enabled: true, ...overrides };
}

describe('isWeaveLiveNow', () => {
  test('disabled is never live', () => {
    expect(isWeaveLiveNow(cfg({ enabled: false }), MON_NOON)).toBe(false);
  });

  test('mode "always" is live whenever enabled', () => {
    const c = cfg({ schedule: { mode: 'always', blackoutDates: [] } });
    expect(isWeaveLiveNow(c, MON_NOON)).toBe(true);
    expect(isWeaveLiveNow(c, MON_EVENING)).toBe(true);
    expect(isWeaveLiveNow(c, FRI_NOON)).toBe(true);
  });

  test('business_hours: live during open hours', () => {
    const c = cfg({ schedule: { mode: 'business_hours', blackoutDates: [] } });
    expect(isWeaveLiveNow(c, MON_NOON)).toBe(true);
  });

  test('business_hours: closed before open and after close', () => {
    const c = cfg({ schedule: { mode: 'business_hours', blackoutDates: [] } });
    expect(isWeaveLiveNow(c, MON_EARLY)).toBe(false);
    expect(isWeaveLiveNow(c, MON_EVENING)).toBe(false);
  });

  test('business_hours: closed on a closed weekday (Friday)', () => {
    const c = cfg({ schedule: { mode: 'business_hours', blackoutDates: [] } });
    expect(isWeaveLiveNow(c, FRI_NOON)).toBe(false);
  });

  test('business_hours: honors custom (admin-edited) hours', () => {
    const c = cfg({ schedule: { mode: 'business_hours', blackoutDates: [] } });
    // Default Friday is closed; an admin who opens Friday 09:00–18:00 flips it.
    const openFriday = [
      { day: 'Friday', open: '09:00', close: '18:00' },
    ];
    expect(isWeaveLiveNow(c, FRI_NOON, openFriday)).toBe(true);
    // And closing Monday hides it even though the default Monday is open.
    const closedMonday = [{ day: 'Monday', open: '', close: '', closed: true }];
    expect(isWeaveLiveNow(c, MON_NOON, closedMonday)).toBe(false);
  });

  test('blackout date overrides "always" mode', () => {
    const c = cfg({ schedule: { mode: 'always', blackoutDates: ['2026-05-25'] } });
    expect(isWeaveLiveNow(c, MON_NOON)).toBe(false);
    // A different day is unaffected.
    expect(isWeaveLiveNow(c, FRI_NOON)).toBe(true);
  });

  test('blackout date is evaluated in the practice timezone', () => {
    // 14:00Z on the 25th is still 07:00 PDT on the 25th → blackout applies.
    const c = cfg({ schedule: { mode: 'always', blackoutDates: ['2026-05-25'] } });
    expect(isWeaveLiveNow(c, MON_EARLY)).toBe(false);
  });
});

describe('normalizeWeaveConfig', () => {
  test('fills defaults from empty/garbage input', () => {
    expect(normalizeWeaveConfig(null)).toEqual(WEAVE_DEFAULTS);
    expect(normalizeWeaveConfig({})).toEqual(WEAVE_DEFAULTS);
  });

  test('coerces invalid schedule mode and filters bad blackout dates', () => {
    const out = normalizeWeaveConfig({
      enabled: true,
      schedule: { mode: 'nonsense', blackoutDates: ['2026-12-25', 'bad', 42] },
    });
    expect(out.enabled).toBe(true);
    expect(out.schedule.mode).toBe('always');
    expect(out.schedule.blackoutDates).toEqual(['2026-12-25']);
  });

  test('preserves valid values and drops legacy fields', () => {
    const out = normalizeWeaveConfig({
      enabled: true,
      widgetId: 'abc',
      // legacy fields from earlier versions — must be ignored
      showFloatingWidget: false,
      showInlineButtons: false,
      offlineBehavior: 'show_call',
      schedule: { mode: 'business_hours', blackoutDates: ['2026-07-04'] },
      timezone: 'America/New_York',
    });
    expect(out).toEqual({
      enabled: true,
      widgetId: 'abc',
      schedule: { mode: 'business_hours', blackoutDates: ['2026-07-04'] },
      timezone: 'America/New_York',
    });
  });
});

describe('url builder', () => {
  test('text-connect url embeds the widget id', () => {
    expect(weaveTextConnectUrl('xyz')).toBe(
      'https://book.getweave.com/xyz/text-connect/contact-info',
    );
  });
});
