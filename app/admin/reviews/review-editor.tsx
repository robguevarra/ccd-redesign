'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useToast, Toast } from '@/components/admin/toast';
import type { ReviewRow } from '@/lib/supabase/queries';
import { createReview, updateReview, deleteReview, type ReviewActionResult } from './actions';

interface Props {
  review?: ReviewRow;
}

export function ReviewEditor({ review }: Props) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ReviewActionResult | null>(null);
  const { state: toastState, showToast } = useToast();

  async function handleDelete() {
    if (!review) return;
    if (!confirm(`Delete the review from ${review.authorName} permanently?`)) return;
    setPending(true);
    const r = await deleteReview(review.id);
    setPending(false);
    if (r && !r.ok) setResult(r);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-12">
      <Link
        href="/admin/reviews"
        className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Reviews
      </Link>
      <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-8">
        {review ? review.authorName : 'New review'}
      </h1>

      <form
        action={async (formData) => {
          setPending(true);
          setResult(null);
          const r = review
            ? await updateReview(review.id, formData)
            : await createReview(formData);
          setPending(false);
          if (r && !r.ok) setResult(r);
          else if (r && r.ok) showToast(review ? 'Review updated.' : 'Review created.');
        }}
        className="space-y-8"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <Field label="Reviewer name" id="authorName" required>
            <input id="authorName" name="authorName" type="text" required maxLength={120}
              defaultValue={review?.authorName}
              placeholder="e.g. Michael S. or A patient"
              className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors" />
          </Field>
          <Field label="Initials / anonymity label" id="authorInitial">
            <input id="authorInitial" name="authorInitial" type="text" maxLength={60}
              defaultValue={review?.authorInitial ?? ''}
              placeholder="e.g. M.S. or Anonymous"
              className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors" />
          </Field>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Field label="Source" id="source" required>
            <select id="source" name="source" required
              defaultValue={review?.source ?? 'yelp'}
              className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors">
              <option value="yelp">Yelp</option>
              <option value="google">Google</option>
              <option value="facebook">Facebook</option>
            </select>
          </Field>
          <Field label="Rating" id="rating" required>
            <select id="rating" name="rating" required
              defaultValue={String(review?.rating ?? 5)}
              className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors font-mono">
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} star{n === 1 ? '' : 's'}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Review text" id="body" required>
          <textarea id="body" name="body" required rows={8} maxLength={6000}
            defaultValue={review?.body}
            placeholder="The review, in the patient's words."
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors resize-y" />
        </Field>

        <Field label="Source URL (link to the original review or page)" id="sourceUrl">
          <input id="sourceUrl" name="sourceUrl" type="url" maxLength={500}
            defaultValue={review?.sourceUrl ?? ''}
            placeholder="https://www.yelp.com/biz/…"
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors font-mono text-sm" />
        </Field>

        <fieldset className="space-y-3 pt-6 border-t border-stone-200">
          <legend className="text-sm font-medium text-stone-900 mb-2">Placement</legend>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="featured"
              defaultChecked={review?.featured ?? false}
              className="accent-stone-900" />
            <span className="text-sm font-medium">Featured</span>
            <span className="text-xs text-stone-500 ml-2">(shown on the homepage)</span>
          </label>
          <br />
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="active"
              defaultChecked={review?.active !== false}
              className="accent-stone-900" />
            <span className="text-sm">Visible on site</span>
            <span className="text-xs text-stone-500 ml-2">(uncheck to hide without deleting)</span>
          </label>
        </fieldset>

        <div className="flex items-center gap-3 pt-4 border-t border-stone-200">
          {review && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 text-red-700 px-4 py-2 text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          )}
          <button
            type="submit"
            disabled={pending}
            className="ml-auto inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-6 py-3 text-sm font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors"
          >
            {pending ? 'Saving…' : review ? 'Save changes' : 'Create review'}
          </button>
        </div>

        {result && !result.ok && (
          <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {result.error}
          </p>
        )}
      </form>
      <Toast state={toastState} />
    </div>
  );
}

function Field({ label, id, required, children }: {
  label: string; id: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-stone-900 mb-2">
        {label}{required && <span className="text-stone-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
