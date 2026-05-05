'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { submitAppointmentRequest, type AppointmentSubmitResult } from './actions';

export function AppointmentForm() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<AppointmentSubmitResult | null>(null);

  if (result?.ok) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-10 text-center">
        <CheckCircle2 className="h-12 w-12 mx-auto text-stone-900 mb-6" aria-hidden="true" />
        <h2 className="font-serif text-3xl text-stone-900 mb-3">Request received.</h2>
        <p className="text-stone-600 max-w-md mx-auto">
          We'll call you back the same business day. If it's outside of office
          hours, we'll reach out first thing in the morning.
        </p>
      </div>
    );
  }

  return (
    <form
      action={async (formData) => {
        setPending(true);
        const r = await submitAppointmentRequest(formData);
        setResult(r);
        setPending(false);
      }}
      className="space-y-6"
    >
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className="hidden"
      />

      <Field label="Your name" id="name" required>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
        />
      </Field>

      <Field label="Phone number" id="phone" required>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="(909) 555-0123"
          className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors font-mono tabular-nums"
        />
      </Field>

      <Field label="Email (optional)" id="email">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
        />
      </Field>

      <Field label="Preferred time" id="preferredTime" required>
        <div className="grid grid-cols-3 gap-3">
          {(['morning', 'afternoon', 'either'] as const).map((opt) => (
            <label
              key={opt}
              className="relative flex items-center justify-center rounded-lg border-2 border-stone-300 px-4 py-3 cursor-pointer hover:border-stone-500 has-checked:border-stone-900 has-checked:bg-stone-900 has-checked:text-stone-50 transition-colors text-sm font-medium capitalize"
            >
              <input
                type="radio"
                name="preferredTime"
                value={opt}
                defaultChecked={opt === 'either'}
                className="sr-only"
              />
              {opt}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Notes (optional)" id="notes">
        <textarea
          id="notes"
          name="notes"
          rows={4}
          maxLength={2000}
          className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors resize-y"
        />
      </Field>

      {result && !result.ok && (
        <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {result.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-stone-900 text-stone-50 px-6 py-4 text-base font-medium hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? 'Sending…' : 'Request appointment'}
      </button>

      <p className="text-xs text-stone-500 text-center">
        We use your information only to schedule and confirm your visit.
      </p>
    </form>
  );
}

function Field({
  label,
  id,
  required,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-stone-900 mb-2">
        {label}
        {required && <span className="text-stone-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
