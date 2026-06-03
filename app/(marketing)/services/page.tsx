import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import {
  getLaneServiceGroups,
  serviceHref,
  SERVICE_LANE_LABELS,
  SERVICE_LANE_SUBLABELS,
} from '@/content/services';
import type { ServiceLane } from '@/content/schemas';
import { FadeUp } from '@/components/motion/fade-up';

export const metadata: Metadata = {
  title: 'All Services — Comfort Care Dental',
  description:
    'Every service at Comfort Care Dental at a glance — TMJ & orofacial pain, sleep & airway, and oral medicine on the medical side; preventive, restorative, cosmetic, endodontic, and surgical care on the dental side.',
};

const LANES: ServiceLane[] = ['dental', 'medical'];

export default function AllServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-stone-100/60 py-24 md:py-32 border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
            Everything we do · at a glance
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter text-stone-900 leading-[0.95]">
            All <span className="italic font-light">services.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-stone-600 text-lg leading-relaxed">
            One practice, two sides of care. Browse everything below, or jump to
            a side.
          </p>
          {/* Jump links */}
          <nav aria-label="Jump to a side" className="mt-8 flex flex-wrap gap-3">
            {LANES.map((lane) => (
              <a
                key={lane}
                href={`#${lane}`}
                className="inline-flex items-center gap-2 rounded-full border-2 border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-900 hover:border-stone-900 transition-colors min-h-[44px]"
              >
                {SERVICE_LANE_LABELS[lane]}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* One section per lane */}
      {LANES.map((lane) => {
        const groups = getLaneServiceGroups(lane);
        const count = groups.reduce((n, g) => n + g.services.length, 0);
        return (
          <section
            key={lane}
            id={lane}
            className="scroll-mt-28 border-b border-stone-200 last:border-b-0"
          >
            <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-24">
              {/* Lane header + 'View all' */}
              <FadeUp>
                <div className="md:flex md:items-end md:justify-between gap-8 mb-12">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-3">
                      {SERVICE_LANE_SUBLABELS[lane]} · {count} services
                    </p>
                    <h2 className="font-serif text-4xl md:text-6xl tracking-tighter text-stone-900">
                      {SERVICE_LANE_LABELS[lane]}
                    </h2>
                  </div>
                  <Link
                    href={`/${lane}`}
                    className="mt-5 md:mt-0 inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-5 py-3 text-sm font-medium hover:bg-stone-700 transition-colors shrink-0"
                  >
                    View all {SERVICE_LANE_LABELS[lane].replace(' Practice', '')}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </FadeUp>

              {/* Subcategory groups */}
              <div className="space-y-12">
                {groups.map((group) => (
                  <FadeUp key={group.subcategory}>
                    <div className="md:grid md:grid-cols-[200px_1fr] md:gap-10">
                      <h3 className="font-serif text-xl text-stone-900 mb-4 md:mb-0 md:pt-1">
                        {group.label}
                      </h3>
                      <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                        {group.services.map((s) => (
                          <li key={s.slug}>
                            <Link
                              href={serviceHref(s)}
                              className="group block"
                            >
                              <span className="inline-flex items-center gap-1.5 font-medium text-stone-900 text-lg">
                                {s.name}
                                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden="true" />
                              </span>
                              <span className="block text-sm text-stone-600 leading-relaxed mt-1">
                                {s.summary}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
