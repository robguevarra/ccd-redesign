'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { BusinessHours } from '@/content/schemas';
import { DAY_ORDER } from '@/lib/office-hours';
import { updateOfficeHours, type SettingsActionResult } from './actions';

interface DayState {
  day: string;
  open: string;
  close: string;
  closed: boolean;
  note: string;
}

export function OfficeHoursForm({ initial }: { initial: BusinessHours[] }) {
  const byDay = new Map(initial.map((h) => [h.day, h]));
  const [days, setDays] = useState<DayState[]>(
    DAY_ORDER.map((day) => {
      const h = byDay.get(day);
      return {
        day,
        open: h?.open || '09:00',
        close: h?.close || '17:00',
        closed: h?.closed ?? (!h?.open || !h?.close),
        note: h?.note ?? '',
      };
    }),
  );

  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<SettingsActionResult | null>(null);

  const update = (i: number, patch: Partial<DayState>) =>
    setDays((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));

  return (
    <form
      // onSubmit (not `action`) so React 19's post-action form reset doesn't
      // visually clear our controlled time inputs / checkboxes. See settings-form.
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setPending(true);
        setResult(null);
        const r = await updateOfficeHours(formData);
        setResult(r);
        setPending(false);
      }}
      className="space-y-4"
    >
      <ul className="divide-y divide-stone-100 rounded-xl border border-stone-200">
        {days.map((d, i) => (
          <li key={d.day} className="px-4 py-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:flex-nowrap">
              <span className="w-24 shrink-0 text-base font-medium text-stone-900">
                {d.day}
              </span>

              <label className="flex items-center gap-2 text-sm text-stone-600 order-last sm:order-none sm:ml-auto">
                <input
                  type="checkbox"
                  name={`${d.day}-closed`}
                  checked={d.closed}
                  onChange={(e) => update(i, { closed: e.target.checked })}
                  className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                />
                Closed
              </label>

              <div
                className={`flex items-center gap-2 ${d.closed || d.note ? 'opacity-40' : ''}`}
              >
                <input
                  type="time"
                  name={`${d.day}-open`}
                  value={d.open}
                  disabled={d.closed}
                  onChange={(e) => update(i, { open: e.target.value })}
                  className="rounded-lg border-2 border-stone-300 px-3 py-2 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors font-mono tabular-nums disabled:bg-stone-50"
                />
                <span className="text-stone-400">–</span>
                <input
                  type="time"
                  name={`${d.day}-close`}
                  value={d.close}
                  disabled={d.closed}
                  onChange={(e) => update(i, { close: e.target.value })}
                  className="rounded-lg border-2 border-stone-300 px-3 py-2 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors font-mono tabular-nums disabled:bg-stone-50"
                />
              </div>
            </div>

            <input
              type="text"
              name={`${d.day}-note`}
              value={d.note}
              maxLength={60}
              onChange={(e) => update(i, { note: e.target.value })}
              placeholder="Optional note shown instead of hours — e.g. “Inquire for appointments”"
              className="mt-3 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm bg-white focus:border-stone-900 focus:outline-none transition-colors"
            />
          </li>
        ))}
      </ul>

      {/*
        Disabled <input> values are dropped from FormData, so for closed days
        the action falls back to '' — which it already treats as closed. We
        also send the checkbox, so the day is unambiguously closed server-side.
      */}

      {result?.ok && (
        <p className="flex items-center gap-2 text-green-800 text-sm bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          Office hours saved.
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
        {pending ? 'Saving…' : 'Save office hours'}
      </button>
    </form>
  );
}
