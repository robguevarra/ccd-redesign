import Link from 'next/link';
import { Plus } from 'lucide-react';
import { listPatientForms } from '@/lib/supabase/queries';
import { FormRow } from './form-row';

export const metadata = {
  title: 'Patient Forms',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function PatientFormsAdminPage() {
  const forms = await listPatientForms();

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
      <div className="flex items-center justify-between gap-3 mb-10">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-stone-900">Patient Forms</h1>
        <Link
          href="/admin/patient-forms/new"
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-4 py-2 text-sm font-medium hover:bg-stone-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Upload new
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-12 text-stone-500 text-sm text-center">
          No forms yet. Click &quot;Upload new&quot; to add the first PDF.
        </div>
      ) : (
        <ul className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-200 overflow-hidden">
          {forms.map((f, idx) => (
            <FormRow
              key={f.id}
              form={f}
              isFirst={idx === 0}
              isLast={idx === forms.length - 1}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
