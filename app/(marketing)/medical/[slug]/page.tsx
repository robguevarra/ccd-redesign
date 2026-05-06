import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { practiceInfo } from '@/content/practice-info';
import {
  getService,
  getServicesBySubcategory,
  SERVICE_SUBCATEGORY_LABELS,
  services,
} from '@/content/services';
import { FadeUp } from '@/components/motion/fade-up';
import { TmjSignature } from '@/components/tmj/tmj-signature';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services
    .filter((s) => s.lane === 'medical')
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service || service.lane !== 'medical') {
    return { title: 'Not found' };
  }
  return {
    title: `${service.name} — Comfort Care Dental`,
    description: service.summary,
  };
}

export default async function MedicalServiceDetail({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service || service.lane !== 'medical') notFound();

  // TMJ is the wow-zone signature page — render the existing TmjSignature component.
  if (service.slug === 'tmj') {
    return <TmjSignature service={service} />;
  }

  const main = practiceInfo.phones[0]!;
  const peers = getServicesBySubcategory(service.subcategory).filter(
    (s) => s.slug !== service.slug,
  );

  return (
    <>
      <FadeUp>
        <section className="bg-stone-50 py-24 md:py-36 border-b border-[var(--color-accent-200)]">
          <div className="mx-auto max-w-5xl px-5 md:px-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent-600)] mb-6">
              <Link href="/medical" className="hover:opacity-80">
                Medical Practice
              </Link>
              {' · '}
              {SERVICE_SUBCATEGORY_LABELS[service.subcategory]}
            </p>
            <h1 className="font-serif text-5xl md:text-7xl tracking-tighter text-stone-900 leading-[0.95] font-light">
              {service.name}
            </h1>
            <p className="mt-10 max-w-3xl text-stone-700 text-xl md:text-2xl leading-relaxed font-light">
              {service.summary}
            </p>
          </div>
        </section>
      </FadeUp>

      <FadeUp as="section" className="bg-stone-100/60 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <p className="text-stone-700 text-lg md:text-xl leading-[1.7] whitespace-pre-line">
            {service.body}
          </p>
        </div>
      </FadeUp>

      {peers.length > 0 && (
        <FadeUp as="section" className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-600)] mb-3">
              Also in {SERVICE_SUBCATEGORY_LABELS[service.subcategory].toLowerCase()}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tighter text-stone-900 mb-12">
              Related services
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-300">
              {peers.map((s) => (
                <Link
                  key={s.slug}
                  href={`/medical/${s.slug}`}
                  className="group bg-stone-50 p-6 md:p-8 hover:bg-[var(--color-accent-50)] transition-colors min-h-[180px] flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-serif text-xl tracking-tight text-stone-900">
                      {s.name}
                    </h3>
                    <p className="mt-2 text-stone-600 text-sm leading-relaxed">
                      {s.summary}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent-600)] group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </FadeUp>
      )}

      <FadeUp as="section" className="mx-auto max-w-5xl px-5 md:px-8 py-20 md:py-28 text-center">
        <h2 className="font-serif text-3xl md:text-5xl tracking-tighter text-stone-900 mb-10">
          Schedule a consultation, or just{' '}
          <em className="font-light">say hello.</em>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/request-appointment"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-8 py-4 text-base font-medium hover:bg-stone-700 transition-colors"
          >
            Request consultation <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
