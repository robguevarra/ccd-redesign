'use client';

import { useState, useTransition } from 'react';
import type { AppointmentRequest, AppointmentStatus } from '@/content/schemas';
import { updateInquiryStatus, updateInquiryNotes } from '../actions';
import { cn } from '@/lib/cn';

const STATUSES: AppointmentStatus[] = ['new', 'contacted', 'closed'];

export function InquiryControls({ inquiry }: { inquiry: AppointmentRequest }) {
  const [status, setStatus] = useState<AppointmentStatus>(inquiry.status);
  const [notes, setNotes] = useState(inquiry.internalNotes ?? '');
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [pending, startTransition] = useTransition();

  function handleStatusChange(next: AppointmentStatus) {
    setStatus(next);
    startTransition(async () => {
      const r = await updateInquiryStatus(inquiry.id, next);
      if (r.ok) setSavedAt(new Date());
    });
  }

  function handleNotesBlur() {
    if (notes === (inquiry.internalNotes ?? '')) return;
    startTransition(async () => {
      const r = await updateInquiryNotes(inquiry.id, notes);
      if (r.ok) setSavedAt(new Date());
    });
  }

  return (
    <>
      <section className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-3">Status</p>
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              className={cn(
                'inline-flex items-center px-4 py-2 text-sm rounded-full border transition-colors capitalize',
                status === s
                  ? 'border-stone-900 bg-stone-900 text-stone-50'
                  : 'border-stone-300 text-stone-700 hover:bg-stone-100',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      <section>
        <label htmlFor="internal_notes" className="block text-xs uppercase tracking-[0.18em] text-stone-500 mb-3">
          Internal notes (only staff see this)
        </label>
        <textarea
          id="internal_notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleNotesBlur}
          rows={6}
          maxLength={4000}
          placeholder="Called 10:30am — left voicemail. Will retry tomorrow."
          className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors resize-y leading-relaxed"
        />
        <p className="mt-2 text-xs text-stone-500">
          {pending
            ? 'Saving…'
            : savedAt
              ? `Saved at ${savedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
              : 'Auto-saves on focus loss.'}
        </p>
      </section>
    </>
  );
}
