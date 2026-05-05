import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { doctors } from '@/content/doctors';
import { doctorPlaceholders } from '@/content/photography';
import { FadeUp } from '@/components/motion/fade-up';

export const metadata = {
  title: 'Doctors',
  description:
    'Six doctors. Twenty-five years of continuous practice in Rancho Cucamonga. Led by Dr. Brien Hsu, DDS.',
};

export default function DoctorsPage() {
  return (
    <>
      <section className="bg-stone-100/60 py-24 md:py-36 border-b border-stone-200">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.24em] text-stone-500 mb-8">
            The team
          </p>
          <h1 className="font-serif text-[clamp(3rem,9vw,8rem)] tracking-tighter text-stone-900 leading-[0.92] font-light">
            Six doctors,
            <br />
            <span className="italic">one office.</span>
          </h1>
          <p className="mt-12 max-w-2xl text-stone-600 text-lg leading-relaxed">
            Long-tenured staff means we remember your case, your kids, and how
            your bite has changed since 2007. The next generation of the Hsu family
            now works alongside Dr. Brien — continuity by design.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8 py-24 md:py-36">
        <ul className="grid gap-x-8 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => {
            const portrait = doctorPlaceholders[d.slug as keyof typeof doctorPlaceholders];
            return (
              <li key={d.slug}>
                <Link href={`/doctors/${d.slug}`} className="group block">
                  <div className="relative aspect-[3/4] bg-stone-200 mb-8 overflow-hidden">
                    {portrait && (
                      <Image
                        src={portrait.src}
                        alt={portrait.alt}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700 ease-out"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/30 to-transparent" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-2">
                    {d.title}
                    {d.isLead && ' · Lead'}
                  </p>
                  <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3 group-hover:underline underline-offset-4 decoration-stone-400">
                    {d.name}
                  </h2>
                  <p className="text-stone-600 text-sm leading-relaxed">{d.short}</p>
                  <span className="inline-flex items-center gap-1 mt-5 text-sm font-medium text-stone-900 group-hover:gap-2 transition-all">
                    Read bio <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
