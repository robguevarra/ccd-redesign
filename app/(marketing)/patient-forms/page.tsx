import Link from 'next/link';
import { FileText, Download } from 'lucide-react';
import { listPatientForms } from '@/lib/supabase/queries';
import { publicUrlFor } from '@/lib/supabase/storage';
import { practiceInfo } from '@/content/practice-info';

export const metadata = {
  title: 'Patient Forms',
  description: `Download patient forms for ${practiceInfo.brandName}. Print, fill out, and bring to your visit.`,
};

export const revalidate = 60;

function formatBytes(n: number | null): string {
  if (!n) return '';
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export default async function PatientFormsPage() {
  const forms = await listPatientForms({ activeOnly: true });
  const cards = await Promise.all(
    forms.map(async (f) => ({
      ...f,
      url: await publicUrlFor('patient-forms', f.filePath),
    })),
  );

  return (
    <>
      <section className="bg-stone-100/60 py-24 md:py-32 border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
            Before your visit
          </p>
          <h1 className="font-serif text-5xl md:text-7xl tracking-tighter text-stone-900 leading-[0.95]">
            Patient{' '}
            <span className="italic font-light">forms.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-stone-700 text-lg leading-relaxed">
            Download, print, fill out, and bring to your appointment. Or fill
            them in on screen and bring the printed copy. If you'd rather not
            print, we'll have them ready for you in the office.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 md:px-8 py-16 md:py-24">
        {cards.length === 0 ? (
          <p className="text-stone-600 text-lg">
            Forms aren't available online right now. Please call us at{' '}
            <a href={`tel:${practiceInfo.phones[0]?.tel}`} className="underline">
              {practiceInfo.phones[0]?.number}
            </a>{' '}
            and we'll send them to you directly.
          </p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-6">
            {cards.map((f) => (
              <li key={f.id} className="rounded-2xl border border-stone-200 bg-white p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <FileText className="h-8 w-8 text-stone-400 shrink-0 mt-1" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif text-2xl text-stone-900 mb-2">{f.label}</h2>
                    {f.description && (
                      <p className="text-stone-600 text-sm leading-relaxed mb-4">{f.description}</p>
                    )}
                    <p className="text-xs text-stone-500 font-mono mb-5">
                      PDF · {formatBytes(f.fileSizeBytes)}
                    </p>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-5 py-2.5 text-sm font-medium hover:bg-stone-700 transition-colors"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Download PDF
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-16 text-stone-600 text-sm">
          Trouble downloading?{' '}
          <Link href="/contact" className="underline hover:text-stone-900">
            Call or email us
          </Link>{' '}
          and we'll send them another way.
        </div>
      </section>
    </>
  );
}
