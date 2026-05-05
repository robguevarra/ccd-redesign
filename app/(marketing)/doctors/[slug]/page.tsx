import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Phone } from 'lucide-react';
import { doctors, getDoctor } from '@/content/doctors';
import { practiceInfo } from '@/content/practice-info';

export function generateStaticParams() {
  return doctors.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = getDoctor(slug);
  if (!doctor) return {};
  return {
    title: doctor.name,
    description: doctor.short,
  };
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = getDoctor(slug);
  if (!doctor) notFound();

  const main = practiceInfo.phones[1] ?? practiceInfo.phones[0]!;

  return (
    <article>
      <header className="bg-stone-100/60 py-20 md:py-28 border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-5 md:px-8 grid md:grid-cols-2 gap-12 md:gap-20 items-end">
          <div className="aspect-[3/4] bg-stone-200 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-stone-300 to-stone-500 flex items-center justify-center">
              <span className="font-serif text-9xl text-stone-50/40">
                {doctor.name.split(' ').slice(-1)[0]?.charAt(0)}
              </span>
            </div>
          </div>
          <div>
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Back to team
            </Link>
            <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-3">
              {doctor.title}
              {doctor.isLead && ' · Lead Clinician'}
            </p>
            <h1 className="font-serif text-4xl md:text-6xl tracking-tighter text-stone-900 leading-[1.0] mb-6">
              {doctor.name}
            </h1>
            <p className="text-stone-600 text-lg leading-relaxed">{doctor.short}</p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 md:px-8 py-16 md:py-24">
        <p className="text-stone-700 text-lg leading-[1.7]">{doctor.bio}</p>

        <div className="mt-12 border-t border-stone-200 pt-8">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-4">
            Specialties
          </p>
          <ul className="flex flex-wrap gap-2">
            {doctor.specialties.map((s) => (
              <li
                key={s}
                className="text-sm text-stone-700 bg-stone-100 rounded-full px-3 py-1"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 border-t border-stone-200 pt-8 text-sm text-stone-600">
          With the practice since {doctor.joinedYear}.
        </div>

        <div className="mt-16 flex flex-col sm:flex-row gap-4">
          <Link
            href="/request-appointment"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-6 py-3 text-sm font-medium hover:bg-stone-700 transition-colors"
          >
            Request to see {doctor.name.split(' ')[0]}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href={`tel:${main.tel}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-900 text-stone-900 px-6 py-3 text-sm font-medium hover:bg-stone-900 hover:text-stone-50 transition-colors"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {main.number}
          </a>
        </div>
      </section>
    </article>
  );
}
