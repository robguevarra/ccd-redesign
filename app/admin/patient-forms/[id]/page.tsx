import { notFound } from 'next/navigation';
import { getPatientForm } from '@/lib/supabase/queries';
import { PatientFormEditor } from '../form-editor';

export const metadata = {
  title: 'Edit patient form',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function EditPatientFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await getPatientForm(id);
  if (!form) notFound();
  return <PatientFormEditor form={form} />;
}
