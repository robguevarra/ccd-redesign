import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { practiceInfo } from '@/content/practice-info';
import { FadeUp } from '@/components/motion/fade-up';
import { Hero } from '@/components/hero';

const SERVICE_CATEGORIES = [
  {
    label: 'General',
    description:
      'Cleanings, fillings, crowns, bridges, dentures, root canals, extractions, sedation, pediatric care.',
    href: '/services?category=general',
  },
  {
    label: 'Cosmetic',
    description:
      'Porcelain veneers and deep-bleaching teeth whitening — designed around how the smile actually moves and reads.',
    href: '/services?category=cosmetic',
  },
  {
    label: 'Specialty',
    description:
      'TMJ, sleep apnea, oral pathology, orofacial pain. Twenty-five years of complex-case experience.',
    href: '/services?category=specialty',
  },
  {
    label: 'Orthodontics',
    description: 'Traditional and removable orthodontics for teens and adults.',
    href: '/services?category=orthodontics',
  },
];

const TECHNOLOGY_BULLETS = [
  {
    label: '3D Cone Beam CT',
    description:
      'iCAT FLX scanner since 2014. Diagnostic detail most general practices outsource — captured in-house, viewable in your consult.',
  },
  {
    label: '3Shape Trios scanner',
    description:
      'Digital impressions instead of trays. Upgraded to the Trios 5 in 2024 — wirelessly connected across every operatory.',
  },
  {
    label: 'Zeiss dental microscope',
    description:
      'Surgical-grade magnification for precision restorative and endodontic work. Rare outside of specialist offices.',
  },
];

export default function HomePage() {
  const main = practiceInfo.phones[1] ?? practiceInfo.phones[0]!;

  return (
    <>
      <Hero />

      {/* ─────────── Lede / value statement ─────────── */}
      <FadeUp>
        <section className="mx-auto max-w-4xl px-5 md:px-8 py-24 md:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-8">
            Why patients choose us
          </p>
          <p className="font-serif text-3xl md:text-5xl leading-tight text-stone-900 tracking-tight">
            Your time is the gift. Our job is to give it back to you — with{' '}
            <em className="text-stone-700">work that lasts</em> and a chair you don't
            mind being in.
          </p>
        </section>
      </FadeUp>

      {/* ─────────── Services overview ─────────── */}
      <FadeUp as="section" className="bg-stone-100/60 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="md:flex md:items-end md:justify-between mb-16 md:mb-20">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-4">
                Services
              </p>
              <h2 className="font-serif text-4xl md:text-6xl tracking-tighter text-stone-900">
                Four practices,{' '}
                <span className="italic font-light">under one roof.</span>
              </h2>
            </div>
            <Link
              href="/services"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900 mt-6 md:mt-0"
            >
              All services <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-px md:grid-cols-2 lg:grid-cols-4 bg-stone-300">
            {SERVICE_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group bg-stone-50 p-8 md:p-10 hover:bg-stone-100 transition-colors flex flex-col justify-between min-h-[280px]"
              >
                <h3 className="font-serif text-2xl md:text-3xl tracking-tight text-stone-900">
                  {cat.label}
                </h3>
                <div className="mt-8">
                  <p className="text-stone-600 text-sm leading-relaxed mb-6">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-stone-900 group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ─────────── Technology / differentiator strip ─────────── */}
      <FadeUp as="section" className="mx-auto max-w-7xl px-5 md:px-8 py-24 md:py-32">
        <div className="grid md:grid-cols-3 gap-12 md:gap-16 items-start">
          <div className="md:col-span-1">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-4">
              Technology
            </p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tighter text-stone-900">
              We invested early so you'd <em className="font-light">save the tooth.</em>
            </h2>
            <Link
              href="/technology"
              className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-stone-700 hover:text-stone-900"
            >
              See the equipment <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="md:col-span-2 grid gap-8">
            {TECHNOLOGY_BULLETS.map((b) => (
              <li
                key={b.label}
                className="border-t border-stone-200 pt-6 grid sm:grid-cols-3 gap-4"
              >
                <div className="font-serif text-xl text-stone-900 sm:col-span-1">
                  {b.label}
                </div>
                <p className="text-stone-600 leading-relaxed sm:col-span-2">
                  {b.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </FadeUp>

      {/* ─────────── Doctors intro ─────────── */}
      <FadeUp as="section" className="bg-stone-900 text-stone-50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-400 mb-6">
            The team
          </p>
          <div className="md:flex md:items-end md:justify-between mb-12">
            <h2 className="font-serif text-4xl md:text-6xl tracking-tighter max-w-3xl">
              Six doctors,{' '}
              <span className="italic font-light">trained at the practices that train other practices.</span>
            </h2>
            <Link
              href="/doctors"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-stone-300 hover:text-stone-50"
            >
              Meet the team <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="max-w-2xl text-stone-300 leading-relaxed text-lg">
            Dr. Brien Hsu has been seeing patients in {practiceInfo.address.city} since 1999.
            Five additional dentists work alongside him today, including the next generation
            of the Hsu family. Long tenure means we remember your case, your kids, and how
            your bite has changed since 2007.
          </p>
        </div>
      </FadeUp>

      {/* ─────────── Final CTA ─────────── */}
      <FadeUp as="section" className="mx-auto max-w-5xl px-5 md:px-8 py-24 md:py-32 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
          Ready when you are
        </p>
        <h2 className="font-serif text-4xl md:text-6xl tracking-tighter text-stone-900 mb-10">
          Book a visit, or just{' '}
          <em className="font-light">say hello.</em>
        </h2>
        <p className="max-w-xl mx-auto text-stone-600 leading-relaxed mb-10">
          Tell us a little about what you need and a preferred time. We'll call back
          the same business day.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/request-appointment"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-8 py-4 text-base font-medium hover:bg-stone-700 transition-colors"
          >
            Request appointment
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
