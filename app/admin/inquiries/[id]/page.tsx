import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail } from 'lucide-react';
import { getAppointmentRequest } from '@/lib/supabase/queries';
import { InquiryControls } from './inquiry-controls';

export const metadata = {
  title: 'Inquiry',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await getAppointmentRequest(id);
  if (!inquiry) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-12">
      <Link
        href="/admin/inquiries"
        className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Inquiries
      </Link>

      <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">
        {inquiry.name}
      </h1>
      <p className="text-stone-500 text-sm mb-8">
        Submitted {new Date(inquiry.createdAt).toLocaleString('en-US', {
          dateStyle: 'long', timeStyle: 'short',
        })}
      </p>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4 mb-8">
        <a href={`tel:${inquiry.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3 text-stone-900 hover:underline">
          <Phone className="h-4 w-4" /> <span className="font-mono tabular-nums">{inquiry.phone}</span>
        </a>
        {inquiry.email && (
          <a href={`mailto:${inquiry.email}`} className="flex items-center gap-3 text-stone-900 hover:underline">
            <Mail className="h-4 w-4" /> {inquiry.email}
          </a>
        )}
        <div className="text-sm text-stone-700">
          <span className="text-stone-500">Preferred time: </span>
          <span className="capitalize">{inquiry.preferredTime}</span>
        </div>
        {inquiry.notes && (
          <div className="pt-4 border-t border-stone-200">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-2">From the patient</p>
            <p className="text-stone-700 leading-relaxed whitespace-pre-line">{inquiry.notes}</p>
          </div>
        )}
      </div>

      <InquiryControls inquiry={inquiry} />
    </div>
  );
}
