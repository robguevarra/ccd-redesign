'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useToast, Toast } from '@/components/admin/toast';
import { ArrowLeft, Trash2 } from 'lucide-react';
import type { PatientForm } from '@/lib/supabase/queries';
import { createPatientForm, updatePatientForm, deletePatientForm, type FormActionResult } from './actions';

export function PatientFormEditor({ form }: { form?: PatientForm }) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<FormActionResult | null>(null);
  const { state: toastState, showToast } = useToast();

  async function handleDelete() {
    if (!form) return;
    if (!confirm('Delete this form permanently?')) return;
    setPending(true);
    await deletePatientForm(form.id);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-12">
      <Link
        href="/admin/patient-forms"
        className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Patient Forms
      </Link>
      <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-10">
        {form ? 'Edit form' : 'Upload new form'}
      </h1>

      <form
        action={async (formData) => {
          setPending(true);
          setResult(null);
          const r = form
            ? await updatePatientForm(form.id, formData)
            : await createPatientForm(formData);
          setPending(false);
          if (r && !r.ok) setResult(r);
          else if (r && r.ok) showToast(form ? 'Form updated.' : 'Form uploaded.');
        }}
        className="space-y-6"
      >
        <Field label="Label" id="label" required>
          <input
            id="label" name="label" type="text" required maxLength={120}
            defaultValue={form?.label}
            placeholder="Dental Patient Forms"
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
          />
        </Field>
        <Field label="Description (optional)" id="description">
          <textarea
            id="description" name="description" rows={2} maxLength={500}
            defaultValue={form?.description ?? ''}
            placeholder="For new patients, or to update medical history."
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors resize-y"
          />
        </Field>
        <Field label={form ? 'Replace PDF (optional)' : 'PDF file'} id="file" required={!form}>
          <input
            id="file" name="file" type="file" accept="application/pdf"
            required={!form}
            className="block w-full text-sm text-stone-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-stone-900 file:text-stone-50 hover:file:bg-stone-700"
          />
          <p className="mt-1 text-xs text-stone-500">PDF only, max 10 MB.</p>
          {form && (
            <p className="mt-2 text-xs text-stone-600">
              Current file: <span className="font-mono">{form.filePath}</span>
            </p>
          )}
        </Field>
        <fieldset className="flex items-center gap-4 pt-4 border-t border-stone-200">
          <legend className="sr-only">Visibility</legend>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="radio" name="active" value="true"
              defaultChecked={form?.active !== false} className="accent-stone-900" />
            <span className="text-sm font-medium">Live</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="radio" name="active" value="false"
              defaultChecked={form?.active === false} className="accent-stone-900" />
            <span className="text-sm">Hidden</span>
          </label>
        </fieldset>

        <div className="flex items-center gap-3">
          {form && (
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
            {pending ? 'Saving…' : form ? 'Save changes' : 'Upload form'}
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
