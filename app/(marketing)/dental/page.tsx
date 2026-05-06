import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { practiceInfo } from '@/content/practice-info';
import {
  getServicesByLane,
  getServicesBySubcategory,
  SERVICE_SUBCATEGORY_BY_LANE,
  SERVICE_SUBCATEGORY_LABELS,
} from '@/content/services';
import { FadeUp } from '@/components/motion/fade-up';

export const metadata: Metadata = {
  title: 'Dental Practice — Comfort Care Dental',
  description:
    'Family, restorative, and cosmetic dentistry in Rancho Cucamonga. Cleanings, fillings, crowns and bridges, veneers, whitening, root canals, implants, periodontal care.',
};

export default function DentalLanePage() {
  const main = practiceInfo.phones[0]!;
  const subcats = SERVICE_SUBCATEGORY_BY_LANE.dental;
  const allDental = getServicesByLane('dental');

  return (
    <>
      <FadeUp>
        <section className="bg-stone-50 py-24 md:py-36">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500 mb-6">
              The dental practice
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter text-stone-900 leading-[0.95] font-light max-w-5xl">
              Family dentistry,{' '}
              <span className="italic font-extralight">done thoroughly.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-stone-700 text-lg md:text-xl leading-relaxed">
              Cleanings calibrated to your risk profile. Restorations meant to
              last. Cosmetic work designed around how a smile actually moves and
              reads. Twenty-five years of family dentistry, under one roof with
              our medical practice.
            </p>
            <div className="mt-12 grid sm:grid-cols-3 gap-y-6 gap-x-10 max-w-3xl">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-stone-500 mb-2">
                  Subcategories
                </p>
                <p className="text-stone-900 leading-snug">{subcats.length}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-stone-500 mb-2">
                  Services
                </p>
                <p className="text-stone-900 leading-snug">{allDental.length}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-stone-500 mb-2">
                  Doctors
                </p>
                <p className="text-stone-900 leading-snug">5 · {practiceInfo.address.city}</p>
              </div>
            </div>
          </div>
        </section>
      </FadeUp>

      {subcats.map((sub, i) => {
        const items = getServicesBySubcategory(sub);
        return (
          <FadeUp key={sub} as="section" className={i % 2 === 0 ? 'bg-stone-100/60 py-20 md:py-28' : 'py-20 md:py-28'}>
            <div className="mx-auto max-w-7xl px-5 md:px-8">
              <div className="md:flex md:items-end md:justify-between mb-12">
                <div className="max-w-2xl">
                  <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-3">
                    0{i + 1} · {items.length} services
                  </p>
                  <h2 className="font-serif text-4xl md:text-5xl tracking-tighter text-stone-900">
                    {SERVICE_SUBCATEGORY_LABELS[sub]}
                  </h2>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-300">
                {items.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/dental/${s.slug}`}
                    className="group bg-stone-50 p-6 md:p-8 hover:bg-stone-100 transition-colors flex flex-col justify-between min-h-[200px]"
                  >
                    <div>
                      <h3 className="font-serif text-xl md:text-2xl tracking-tight text-stone-900">
                        {s.name}
                      </h3>
                      <p className="mt-3 text-stone-600 text-sm leading-relaxed">
                        {s.summary}
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-stone-900 group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </FadeUp>
        );
      })}

      <FadeUp as="section" className="mx-auto max-w-5xl px-5 md:px-8 py-24 md:py-32 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
          Ready when you are
        </p>
        <h2 className="font-serif text-4xl md:text-6xl tracking-tighter text-stone-900 mb-10">
          Book a visit, or just{' '}
          <em className="font-light">say hello.</em>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/request-appointment"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-8 py-4 text-base font-medium hover:bg-stone-700 transition-colors"
          >
            Request appointment <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
