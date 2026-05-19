import { notFound } from 'next/navigation';
import { getDoctorRow } from '@/lib/supabase/queries';
import { DoctorEditor } from '../doctor-editor';

export const metadata = {
  title: 'Edit doctor',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function EditDoctorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = await getDoctorRow(slug);
  if (!doctor) notFound();
  return <DoctorEditor doctor={doctor} />;
}
