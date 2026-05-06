import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowLeft, Phone } from 'lucide-react';
import {
  SERVICE_CATEGORY_LABELS,
  getService,
  getServicesByCategory,
  services,
} from '@/content/services';
import { practiceInfo } from '@/content/practice-info';
import { TmjSignature } from '@/components/tmj/tmj-signature';
import { SleepApneaSignature } from '@/components/sleep-apnea/sleep-apnea-signature';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const main = practiceInfo.phones[1] ?? practiceInfo.phones[0]!;
  const related = getServicesByCategory(service.category)
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  // Wow-zone signature variants — dispatch by slug.
  if (service.signature) {
    if (service.slug === 'sleep-apnea') {
      return <SleepApneaSignature service={service} />;
    }
    return <TmjSignature service={service} />;
  }

  return <UtilityServiceLayout service={service} related={related} mainPhone={main} />;
}

/* --- Standard utility service detail layout ------------------------- */

function UtilityServiceLayout({
  service,
  related,
  mainPhone,
}: {
  service: import('@/content/schemas').Service;
  related: import('@/content/schemas').Service[];
  mainPhone: import('@/content/schemas').PhoneNumber;
}) {
  return (
    <article>
      <header className="bg-stone-100/60 py-20 md:py-28 border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-4">
            {SERVICE_CATEGORY_LABELS[service.category]}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tighter text-stone-900 leading-[1.0]">
            {service.name}
          </h1>
          <p className="mt-8 max-w-2xl text-stone-600 text-lg leading-relaxed">
            {service.summary}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 md:px-8 py-16 md:py-24">
        <p className="text-stone-700 text-lg leading-[1.7]">{service.body}</p>

        <div className="mt-16 flex flex-col sm:flex-row gap-4">
          <Link
            href="/request-appointment"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-6 py-3 text-sm font-medium hover:bg-stone-700 transition-colors"
          >
            Request appointment <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href={`tel:${mainPhone.tel}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-900 text-stone-900 px-6 py-3 text-sm font-medium hover:bg-stone-900 hover:text-stone-50 transition-colors"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {mainPhone.number}
          </a>
        </div>
      </div>

      {related.length > 0 && (
        <section className="bg-stone-100/60 py-20 md:py-24 border-t border-stone-200">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
              Related services
            </p>
            <ul className="grid gap-px md:grid-cols-3 bg-stone-200">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/services/${r.slug}`}
                    className="group bg-stone-50 p-6 md:p-8 hover:bg-stone-100 transition-colors block h-full"
                  >
                    <h3 className="font-serif text-xl text-stone-900 mb-2">{r.name}</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">{r.summary}</p>
                    <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-stone-900 group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 mt-12 text-sm font-medium text-stone-700 hover:text-stone-900"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All services
            </Link>
          </div>
        </section>
      )}
    </article>
  );
}

/* --- Legacy signature variant (kept for reference; not used) -------- */

function _LegacySignatureLayout({
  service,
  related,
  mainPhone,
}: {
  service: import('@/content/schemas').Service;
  related: import('@/content/schemas').Service[];
  mainPhone: import('@/content/schemas').PhoneNumber;
}) {
  return (
    <article>
      {/* Hero — dark wow zone */}
      <header className="relative bg-stone-900 text-stone-50 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-stone-700)_0%,_transparent_60%)] opacity-50" />
        <div className="mx-auto max-w-7xl px-5 md:px-8 pt-24 md:pt-40 pb-32 md:pb-44 relative">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-400 mb-6">
            Signature service · {SERVICE_CATEGORY_LABELS[service.category]}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl tracking-tighter text-stone-50 leading-[0.92] max-w-5xl">
            {service.name.split(' ')[0]}
            <br />
            <span className="italic font-light">
              {service.name.split(' ').slice(1).join(' ')}
            </span>
          </h1>
          <p className="mt-12 max-w-2xl text-stone-300 text-lg md:text-xl leading-relaxed">
            {service.summary}
          </p>
        </div>
      </header>

      {/* Long-form body — case-study format */}
      <section className="mx-auto max-w-3xl px-5 md:px-8 py-24 md:py-32">
        <p className="text-xl md:text-2xl font-serif text-stone-900 leading-[1.5] mb-12">
          {service.body}
        </p>

        <div className="grid gap-8 mt-16">
          <div className="border-t border-stone-200 pt-8 grid sm:grid-cols-3 gap-4">
            <div className="text-xs uppercase tracking-[0.18em] text-stone-500 sm:col-span-1">
              How we evaluate
            </div>
            <p className="text-stone-700 leading-relaxed sm:col-span-2">
              Comprehensive bite analysis, jaw-joint imaging via 3D Cone Beam CT,
              muscle palpation, and a careful review of headache, ear, and sleep
              symptoms. Most TMJ cases are mis-diagnosed as ear infections or
              tension headaches first.
            </p>
          </div>
          <div className="border-t border-stone-200 pt-8 grid sm:grid-cols-3 gap-4">
            <div className="text-xs uppercase tracking-[0.18em] text-stone-500 sm:col-span-1">
              Treatment we use
            </div>
            <p className="text-stone-700 leading-relaxed sm:col-span-2">
              Custom splint therapy, bite equilibration, physical therapy
              coordination, and targeted muscle work. We avoid surgical
              intervention except as a last resort and have not had to refer
              for surgery in the majority of our cases.
            </p>
          </div>
          <div className="border-t border-stone-200 pt-8 grid sm:grid-cols-3 gap-4">
            <div className="text-xs uppercase tracking-[0.18em] text-stone-500 sm:col-span-1">
              What patients tell us
            </div>
            <p className="text-stone-700 leading-relaxed sm:col-span-2">
              Most TMJ patients have been to multiple practices before us.
              The shared experience: someone is finally listening to the whole
              symptom picture, not just the part of it that's in the mouth.
            </p>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-stone-100/60 py-20 md:py-24 border-y border-stone-200">
        <div className="mx-auto max-w-4xl px-5 md:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-5xl tracking-tighter text-stone-900 mb-8">
            If your jaw clicks, your head hurts, or you wake up tired —
            <br />
            <em className="font-light">it's worth a conversation.</em>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/request-appointment"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-8 py-4 text-base font-medium hover:bg-stone-700 transition-colors"
            >
              Schedule a consult <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={`tel:${mainPhone.tel}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-900 text-stone-900 px-8 py-4 text-base font-medium hover:bg-stone-900 hover:text-stone-50 transition-colors"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call {mainPhone.number}
            </a>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
              Related specialty services
            </p>
            <ul className="grid gap-px md:grid-cols-3 bg-stone-200">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/services/${r.slug}`}
                    className="group bg-stone-50 p-6 md:p-8 hover:bg-stone-100 transition-colors block h-full"
                  >
                    <h3 className="font-serif text-xl text-stone-900 mb-2">{r.name}</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">{r.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
