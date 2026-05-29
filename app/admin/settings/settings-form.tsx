'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  isWeaveLiveNow,
  type WeaveConfig,
  type WeaveScheduleMode,
} from '@/lib/weave';
import { updateWeaveSettings, type SettingsActionResult } from './actions';

interface Props {
  initial: WeaveConfig;
  businessHours: Array<{ day: string; label: string }>;
  timezone: string;
}

export function WeaveSettingsForm({ initial, businessHours, timezone }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [widgetId, setWidgetId] = useState(initial.widgetId);
  const [scheduleMode, setScheduleMode] = useState<WeaveScheduleMode>(initial.schedule.mode);
  const [blackoutDates, setBlackoutDates] = useState(initial.schedule.blackoutDates.join('\n'));

  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<SettingsActionResult | null>(null);

  // Live preview: is the "Text us" button showing right now with the current
  // (possibly unsaved) settings? Recomputed each minute.
  const [liveNow, setLiveNow] = useState<boolean | null>(null);
  useEffect(() => {
    const draft: WeaveConfig = {
      enabled,
      widgetId,
      schedule: {
        mode: scheduleMode,
        blackoutDates: blackoutDates.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean),
      },
      timezone,
    };
    const tick = () => setLiveNow(isWeaveLiveNow(draft, new Date()));
    tick();
    const i = setInterval(tick, 60_000);
    return () => clearInterval(i);
  }, [enabled, widgetId, scheduleMode, blackoutDates, timezone]);

  return (
    <form
      // NB: onSubmit (not the `action` prop) on purpose. React 19 auto-resets a
      // form after an `action` completes, which visually clears our *controlled*
      // radios/checkboxes (the prop value doesn't change, so React doesn't
      // re-apply `checked` after the reset). onSubmit keeps state authoritative.
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setPending(true);
        setResult(null);
        const r = await updateWeaveSettings(formData);
        setResult(r);
        setPending(false);
      }}
      className="space-y-8"
    >
      {/* Live status */}
      <div
        className={`rounded-xl border px-5 py-4 text-sm font-medium ${
          liveNow == null
            ? 'border-stone-200 bg-stone-50 text-stone-500'
            : liveNow
              ? 'border-green-300 bg-green-50 text-green-800'
              : 'border-amber-300 bg-amber-50 text-amber-800'
        }`}
        aria-live="polite"
      >
        {liveNow == null
          ? 'Checking…'
          : liveNow
            ? 'The “Text us” button is showing on the website right now.'
            : 'The “Text us” button is hidden right now.'}
        <span className="block text-xs font-normal opacity-80 mt-1">
          This preview reflects the choices below, even before you save.
        </span>
      </div>

      {/* 1 — Master toggle */}
      <Toggle
        name="enabled"
        checked={enabled}
        onChange={setEnabled}
        label="Show the “Text us” button"
        hint="Turns texting on or off across the website. When off, the button never appears."
      />

      {/* 2 — Schedule */}
      <div className={enabled ? 'space-y-3' : 'space-y-3 opacity-50'}>
        <h2 className="text-base font-medium text-stone-900">When should it appear?</h2>
        <Radio
          name="scheduleMode"
          value="always"
          checked={scheduleMode === 'always'}
          onChange={() => setScheduleMode('always')}
          label="All the time"
        />
        <Radio
          name="scheduleMode"
          value="business_hours"
          checked={scheduleMode === 'business_hours'}
          onChange={() => setScheduleMode('business_hours')}
          label="Only during office hours"
          hint="Hides the button when the office is closed, so nobody texts an empty inbox."
        />
        {scheduleMode === 'business_hours' && (
          <div className="ml-7 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm">
            <p className="text-stone-500 mb-2">Office hours ({timezone}):</p>
            <ul className="font-mono tabular-nums text-stone-700 space-y-0.5">
              {businessHours.map((h) => (
                <li key={h.day} className="flex justify-between gap-6">
                  <span>{h.day}</span>
                  <span className="text-stone-500">{h.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 3 — Blackout dates */}
      <div className={enabled ? 'space-y-2' : 'space-y-2 opacity-50'}>
        <label htmlFor="blackoutDates" className="block text-base font-medium text-stone-900">
          Days off <span className="font-normal text-stone-500">(optional)</span>
        </label>
        <p className="text-sm text-stone-500">
          Hide the button on holidays or closures. One date per line (YYYY-MM-DD).
        </p>
        <textarea
          id="blackoutDates"
          name="blackoutDates"
          value={blackoutDates}
          onChange={(e) => setBlackoutDates(e.target.value)}
          rows={3}
          placeholder={'2026-12-25\n2027-01-01'}
          className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors font-mono tabular-nums resize-y"
        />
      </div>

      {result?.ok && (
        <p className="flex items-center gap-2 text-green-800 text-sm bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          Saved.
        </p>
      )}
      {result && !result.ok && (
        <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {result.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-stone-900 text-stone-50 px-8 py-4 text-base font-medium hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? 'Saving…' : 'Save'}
      </button>

      {/* Advanced — rarely touched. Hidden in a <details> so it doesn't clutter. */}
      <details className="border-t border-stone-200 pt-6">
        <summary className="cursor-pointer text-sm text-stone-500 hover:text-stone-900">
          Advanced
        </summary>
        <div className="mt-4 space-y-2">
          <label htmlFor="widgetId" className="block text-sm font-medium text-stone-900">
            Weave widget ID
          </label>
          <p className="text-sm text-stone-500">
            From your Weave Text Connect embed code. Only change this if Weave gives you a new one.
          </p>
          <input
            id="widgetId"
            name="widgetId"
            value={widgetId}
            onChange={(e) => setWidgetId(e.target.value)}
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors font-mono"
          />
        </div>
      </details>
    </form>
  );
}

function Toggle({
  name,
  checked,
  onChange,
  label,
  hint,
}: {
  name: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
      />
      <span>
        <span className="block text-base font-medium text-stone-900">{label}</span>
        {hint && <span className="block text-sm text-stone-500">{hint}</span>}
      </span>
    </label>
  );
}

function Radio({
  name,
  value,
  checked,
  onChange,
  label,
  hint,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-5 w-5 border-stone-300 text-stone-900 focus:ring-stone-900"
      />
      <span>
        <span className="block text-base font-medium text-stone-900">{label}</span>
        {hint && <span className="block text-sm text-stone-500">{hint}</span>}
      </span>
    </label>
  );
}
