import Link from 'next/link';
import { Plus } from 'lucide-react';
import { listDoctorRows } from '@/lib/supabase/queries';
import { DoctorRowItem } from './doctor-row';

export const metadata = {
  title: 'Doctors',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function DoctorsAdminPage() {
  const doctors = await listDoctorRows();

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900">Doctors</h1>
        <Link
          href="/admin/doctors/new"
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-4 py-2 text-sm font-medium hover:bg-stone-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add doctor
        </Link>
      </div>

      <ul className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-200 overflow-hidden">
        {doctors.map((d, idx) => (
          <DoctorRowItem
            key={d.id}
            doctor={d}
            isFirst={idx === 0}
            isLast={idx === doctors.length - 1}
          />
        ))}
      </ul>
    </div>
  );
}
