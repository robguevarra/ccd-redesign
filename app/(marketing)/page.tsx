import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { practiceInfo } from '@/content/practice-info';
import { doctors } from '@/content/doctors';
import { FadeUp } from '@/components/motion/fade-up';
import { AirwayHero, type AirwayHeroKeyframe } from '@/components/airway-hero';
import { cn } from '@/lib/cn';

const HOME_KEYFRAMES: [AirwayHeroKeyframe, AirwayHeroKeyframe, AirwayHeroKeyframe] = [
  {
    eyebrow: 'Why patients stay',
    title: 'Comfort, restored.',
    italicize: [1],
    body: "For sleep that finally rests you. For a jaw that isn't always bracing. For a tooth fixed once, then forgotten. Care that feels like care.",
  },
  {
    eyebrow: "What you're looking at",
    title: 'Sleep apnea, manageable.',
    italicize: [1],
    body: 'A custom oral appliance, fitted to your bite. No mask, no machine, no white noise. Most patients adapt within two weeks, and most partners notice on the first night. This is what dental and medical care under one roof can do.',
  },
  {
    eyebrow: 'The team',
    title: 'The gentle dentist, still.',
    italicize: [3],
    body: "Twenty-five years on Kenyon Way. Dr. Brien Hsu earned that nickname his second year in practice, and four colleagues have grown the office around him since — an oral surgeon, an endodontist, and two family dentists. We treat the children of the people we first treated thirty years ago.",
  },
];

const PRACTICE_LANES = [
  {
    label: 'Dental Practice',
    sublabel: 'Family · Restorative · Cosmetic',
    description:
      'Cleanings, fillings, crowns and bridges, veneers, whitening, root canals, implants, periodontal care — the everyday dentistry that keeps a family healthy, plus the cosmetic work that makes a smile worth showing.',
    href: '/dental',
  },
  {
    label: 'Medical Practice',
    sublabel: 'Orofacial Pain & Oral Medicine',
    description:
      'TMJ, sleep apnea, orofacial pain, oral pathology, biopsies, oral cancer screening. The medical side of the practice, led by Dr. Hsu — USC Master\'s in Orofacial Pain, Oral Medicine, and Sleep Disorders.',
    href: '/medical',
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
  const main = practiceInfo.phones[0]!;

  return (
    <>
      <AirwayHero
        topEyebrow={<>Comfort Care Dental &middot; Dental + Medical &middot; Since 1999</>}
        keyframes={HOME_KEYFRAMES}
        ariaLabel="Comfort Care Dental — two practices, one roof"
        fallbackHeading={
          <>
            Comfort,
            <br />
            <span className="italic">restored.</span>
          </>
        }
        cta={
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/request-appointment"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-50 text-stone-950 px-6 py-3 text-sm font-medium hover:bg-stone-200 transition-colors"
            >
              Request appointment <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={`tel:${main.tel}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-50/70 text-stone-50 px-6 py-3 text-sm font-medium hover:bg-stone-50 hover:text-stone-950 transition-colors"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {main.number}
            </a>
          </div>
        }
      />

      {/* ─────────── Services overview ─────────── */}
      <FadeUp as="section" className="bg-stone-100/60 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="md:flex md:items-end md:justify-between mb-16 md:mb-20">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-4">
                Services
              </p>
              <h2 className="font-serif text-4xl md:text-6xl tracking-tighter text-stone-900">
                Two practices,{' '}
                <span className="italic font-light">under one roof.</span>
              </h2>
            </div>
            <Link
              href="/dental"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900 mt-6 md:mt-0"
            >
              Browse dental <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-px md:grid-cols-2 bg-stone-300">
            {PRACTICE_LANES.map((lane, i) => (
              <Link
                key={lane.label}
                href={lane.href}
                className={cn(
                  'group p-10 md:p-14 transition-colors flex flex-col justify-between min-h-[360px]',
                  i === 0
                    ? 'bg-stone-50 hover:bg-stone-100'
                    : 'bg-stone-50 hover:bg-[var(--color-accent-50)]',
                )}
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-stone-500 mb-3">
                    {lane.sublabel}
                  </p>
                  <h3 className="font-serif text-3xl md:text-5xl tracking-tight text-stone-900">
                    {lane.label}
                  </h3>
                </div>
                <div className="mt-12">
                  <p className="text-stone-600 text-base leading-relaxed mb-8 max-w-md">
                    {lane.description}
                  </p>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all',
                      i === 0 ? 'text-stone-900' : 'text-[var(--color-accent-600)]',
                    )}
                  >
                    Enter {lane.label.toLowerCase()} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ─────────── Doctors intro + cards ─────────── */}
      <FadeUp as="section" className="bg-[var(--color-ink-teal,#0a2520)] text-stone-50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-200)] mb-6">
            The team
          </p>
          <div className="md:flex md:items-end md:justify-between mb-14">
            <h2 className="font-serif text-4xl md:text-6xl tracking-tighter max-w-3xl">
              Five doctors,{' '}
              <span className="italic font-light text-stone-300">
                one office.
              </span>
            </h2>
            <Link
              href="/doctors"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent-200)] hover:text-stone-50 transition-colors"
            >
              Meet the team <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="max-w-2xl text-stone-300 leading-relaxed text-lg mb-16">
            Dr. Brien Hsu has been seeing patients in{' '}
            {practiceInfo.address.city} since 1999. Four board-certified
            specialists practice alongside him today, in oral surgery,
            endodontics, periodontal care, and orofacial pain. Long tenure means
            we remember your case, your kids, and how your bite has changed
            since 2007.
          </p>

          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {doctors.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/doctors/${d.slug}`}
                  className="group block"
                  aria-label={`${d.name} — read bio`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-accent-900)]">
                    <Image
                      src={d.portrait.src}
                      alt={d.portrait.alt}
                      fill
                      sizes="(min-width: 1024px) 18vw, (min-width: 768px) 30vw, 45vw"
                      style={{
                        objectPosition: d.portrait.objectPosition ?? 'center',
                      }}
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent-950)]/80 to-transparent" />
                  </div>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent-200)]">
                    {d.title.split('·')[0]?.trim()}
                  </p>
                  <p className="mt-1 font-serif text-lg md:text-xl text-stone-50 leading-tight">
                    {d.name}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/doctors"
            className="md:hidden mt-10 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent-200)]"
          >
            Meet the team <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </FadeUp>

      {/* ─────────── Technology / differentiator strip ─────────── */}
      <FadeUp as="section" className="mx-auto max-w-7xl px-5 md:px-8 py-24 md:py-32">
        <div className="grid md:grid-cols-3 gap-12 md:gap-16 items-start">
          <div className="md:col-span-1">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-600)] mb-4">
              Technology
            </p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tighter text-stone-900">
              We invested early so you'd <em className="font-light">save the tooth.</em>
            </h2>
            <Link
              href="/technology"
              className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-stone-700 hover:text-[var(--color-accent-600)] transition-colors"
            >
              See the equipment <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="md:col-span-2 grid gap-8">
            {TECHNOLOGY_BULLETS.map((b) => (
              <li
                key={b.label}
                className="border-t border-[var(--color-accent-200)] pt-6 grid sm:grid-cols-3 gap-4"
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
