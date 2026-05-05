import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { doctors } from '@/content/doctors';

export const metadata = {
  title: 'Doctors',
  description:
    'Six doctors. Twenty-five years of continuous practice in Rancho Cucamonga. Led by Dr. Brien Hsu, DDS.',
};

export default function DoctorsPage() {
  return (
    <>
      <section className="bg-stone-100/60 py-24 md:py-32 border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
            The team
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter text-stone-900 leading-[0.95]">
            Six doctors,{' '}
            <span className="italic font-light">one office.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-stone-600 text-lg leading-relaxed">
            Long-tenured staff means we remember your case, your kids, and how
            your bite has changed since 2007. The next generation of the Hsu family
            now works alongside Dr. Brien — continuity by design.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28">
        <ul className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/doctors/${d.slug}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] bg-stone-200 mb-6 overflow-hidden">
                  {/* Placeholder for portrait — replaced with next/image once
                      doctor photos are licensed/captured. */}
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-300 to-stone-400 flex items-center justify-center">
                    <span className="font-serif text-8xl text-stone-50/40">
                      {d.name
                        .split(' ')
                        .slice(-1)[0]
                        ?.charAt(0)}
                    </span>
                  </div>
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-2">
                  {d.title}
                  {d.isLead && ' · Lead'}
                </p>
                <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 group-hover:underline underline-offset-4 decoration-stone-400">
                  {d.name}
                </h2>
                <p className="text-stone-600 text-sm leading-relaxed">{d.short}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-stone-900 group-hover:gap-2 transition-all">
                  Read bio <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
