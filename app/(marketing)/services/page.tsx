import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  ALL_CATEGORIES,
  SERVICE_CATEGORY_DESCRIPTIONS,
  SERVICE_CATEGORY_LABELS,
  getServicesByCategory,
} from '@/content/services';
import { serviceCategoryCovers } from '@/content/photography';
import { FadeUp } from '@/components/motion/fade-up';

export const metadata = {
  title: 'Services',
  description:
    'General dentistry, cosmetic, specialty (TMJ, sleep apnea), and orthodontics — all under one roof in Rancho Cucamonga.',
};

export default function ServicesPage() {
  return (
    <>
      {/* Editorial header */}
      <section className="bg-stone-100/60 py-24 md:py-36 border-b border-stone-200">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.24em] text-stone-500 mb-8">
            Services
          </p>
          <h1 className="font-serif text-[clamp(3rem,9vw,8rem)] tracking-tighter text-stone-900 leading-[0.92] font-light">
            Four practices,
            <br />
            <span className="italic">under one roof.</span>
          </h1>
          <p className="mt-12 max-w-2xl text-stone-600 text-lg leading-relaxed">
            We are a full-spectrum practice. General work and complex specialty
            cases are handled in the same office, by doctors who know your file.
          </p>
        </div>
      </section>

      {ALL_CATEGORIES.map((cat, idx) => {
        const items = getServicesByCategory(cat);
        const cover = serviceCategoryCovers[cat];
        const isAlt = idx % 2 === 1;
        return (
          <section
            key={cat}
            className="border-b border-stone-200 last:border-b-0"
            id={cat}
          >
            <div className="mx-auto max-w-7xl px-5 md:px-8 py-24 md:py-36">
              {/* Image + intro side-by-side */}
              <div
                className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-16 ${
                  isAlt ? 'lg:[direction:rtl]' : ''
                }`}
              >
                <FadeUp className="lg:col-span-5 [direction:ltr]">
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-200">
                    {cover ? (
                      <>
                        <Image
                          src={cover.src}
                          alt={cover.alt}
                          fill
                          sizes="(min-width: 1024px) 40vw, 100vw"
                          className="object-cover grayscale-[0.65] group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-stone-50">
                          <p className="text-[10px] uppercase tracking-[0.24em] text-stone-300 mb-1">
                            {String(idx + 1).padStart(2, '0')}
                          </p>
                          <p className="font-serif text-3xl">
                            {SERVICE_CATEGORY_LABELS[cat]}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Editorial gradient placeholder — same treatment as TMJ */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(245,236,219,0.65),transparent_55%),radial-gradient(ellipse_at_70%_85%,rgba(184,85,58,0.20),transparent_55%)]" />
                        <div className="absolute bottom-6 left-6 text-stone-900">
                          <p className="text-[10px] uppercase tracking-[0.24em] text-stone-500 mb-1">
                            {String(idx + 1).padStart(2, '0')}
                          </p>
                          <p className="font-serif text-3xl italic font-light">
                            {SERVICE_CATEGORY_LABELS[cat]}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </FadeUp>

                <FadeUp delay={0.1} className="lg:col-span-7 [direction:ltr]">
                  <p className="text-xs uppercase tracking-[0.24em] text-stone-500 mb-4">
                    {items.length} services
                  </p>
                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tighter text-stone-900 leading-[0.95]">
                    {SERVICE_CATEGORY_LABELS[cat]}
                  </h2>
                  <p className="mt-8 text-stone-600 text-lg leading-relaxed max-w-2xl">
                    {SERVICE_CATEGORY_DESCRIPTIONS[cat]}
                  </p>
                </FadeUp>
              </div>

              {/* Service list — minimal, editorial */}
              <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-200">
                {items.map((s) => (
                  <li key={s.slug} className="bg-stone-50">
                    <Link
                      href={`/services/${s.slug}`}
                      className="group relative block p-6 md:p-8 hover:bg-stone-100 transition-colors h-full"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-serif text-xl md:text-2xl text-stone-900">
                          {s.name}
                        </h3>
                        {s.signature && (
                          <span className="shrink-0 text-[9px] uppercase tracking-[0.22em] text-stone-50 bg-stone-900 px-2 py-1 rounded-full">
                            Signature
                          </span>
                        )}
                      </div>
                      <p className="text-stone-600 text-sm leading-relaxed mb-6">
                        {s.summary}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-stone-900 group-hover:gap-2 transition-all">
                        Learn more <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </>
  );
}
