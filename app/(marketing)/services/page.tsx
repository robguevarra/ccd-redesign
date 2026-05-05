import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  ALL_CATEGORIES,
  SERVICE_CATEGORY_DESCRIPTIONS,
  SERVICE_CATEGORY_LABELS,
  getServicesByCategory,
} from '@/content/services';

export const metadata = {
  title: 'Services',
  description:
    'General dentistry, cosmetic, specialty (TMJ, sleep apnea), and orthodontics — all under one roof in Rancho Cucamonga.',
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-stone-100/60 py-24 md:py-32 border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
            Services
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter text-stone-900 leading-[0.95]">
            Four practices,{' '}
            <span className="italic font-light">under one roof.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-stone-600 text-lg leading-relaxed">
            We are a full-spectrum practice. General work and complex specialty
            cases are handled in the same office, by doctors who know your file.
          </p>
        </div>
      </section>

      {ALL_CATEGORIES.map((cat) => {
        const items = getServicesByCategory(cat);
        return (
          <section
            key={cat}
            className="border-b border-stone-200 last:border-b-0"
            id={cat}
          >
            <div className="mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28">
              <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12">
                <div className="md:col-span-1">
                  <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-3">
                    {SERVICE_CATEGORY_LABELS[cat]}
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl tracking-tighter text-stone-900">
                    {items.length} services
                  </h2>
                </div>
                <p className="md:col-span-2 text-stone-600 leading-relaxed text-lg">
                  {SERVICE_CATEGORY_DESCRIPTIONS[cat]}
                </p>
              </div>

              <ul className="grid gap-px md:grid-cols-2 lg:grid-cols-3 bg-stone-200">
                {items.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="group block bg-stone-50 p-6 md:p-8 hover:bg-stone-100 transition-colors h-full"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-serif text-xl md:text-2xl text-stone-900">
                          {s.name}
                        </h3>
                        {s.signature && (
                          <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-stone-50 bg-stone-900 px-2 py-1 rounded-full">
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
