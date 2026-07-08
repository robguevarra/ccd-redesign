import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { practiceInfo } from '@/content/practice-info';
import { beforeAfterCases } from '@/content/before-after';
import { BeforeAfterSlider } from '@/components/before-after/before-after-slider';
import { FadeUp } from '@/components/motion/fade-up';

export const metadata: Metadata = {
  title: 'Before & After Smiles',
  description:
    'Real smile transformations from our patients. Drag each slider to compare before and after results from cosmetic and restorative treatment.',
};

export default function BeforeAfterPage() {
  const main = practiceInfo.phones[0]!;

  return (
    <>
      <FadeUp>
        <section className="bg-stone-50 py-24 md:py-36">
          <div className="mx-auto max-w-5xl px-5 md:px-8">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500 mb-6">
              Cosmetic &amp; Restorative Dentistry
            </p>
            <h1 className="font-serif text-5xl md:text-7xl tracking-tighter text-stone-900 leading-[0.95] font-light">
              Before &amp; After
            </h1>
            <p className="mt-10 max-w-3xl text-stone-700 text-xl md:text-2xl leading-relaxed font-light">
              Real smiles from our patients. Drag the handle on any photo to
              swipe between where they started and the result we delivered.
            </p>
          </div>
        </section>
      </FadeUp>

      <FadeUp as="section" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
            {beforeAfterCases.map((c) => (
              <BeforeAfterSlider key={c.slug} data={c} />
            ))}
          </div>

          <p className="mx-auto mt-16 max-w-2xl text-center text-sm leading-relaxed text-stone-500">
            Photos are of our own patients, shared with their permission.
            Every mouth is different — results vary from person to person, and
            the right plan for you starts with an exam.
          </p>
        </div>
      </FadeUp>

      <FadeUp as="section" className="mx-auto max-w-5xl px-5 md:px-8 py-20 md:py-28 text-center">
        <h2 className="font-serif text-3xl md:text-5xl tracking-tighter text-stone-900 mb-10">
          Ready for your own{' '}
          <em className="font-light">before &amp; after?</em>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/request-appointment"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-8 py-4 text-base font-medium hover:bg-stone-700 transition-colors"
          >
            Request a consultation <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href={`tel:${main.tel}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-900 text-stone-900 px-8 py-4 text-base font-medium hover:bg-stone-900 hover:text-stone-50 transition-colors"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {main.number}
          </a>
        </div>
      </FadeUp>
    </>
  );
}
