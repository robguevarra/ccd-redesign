import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { practiceInfo } from '@/content/practice-info';
import type { Service } from '@/content/schemas';
import { AirwayHero, type AirwayHeroKeyframe } from '@/components/airway-hero';

const KEYFRAMES: [AirwayHeroKeyframe, AirwayHeroKeyframe, AirwayHeroKeyframe] = [
  {
    eyebrow: 'The problem',
    title: 'When the airway collapses.',
    body: 'During sleep, the tongue and soft palate relax. In obstructive sleep apnea, they fall back and close the airway entirely. The body wakes — over and over — to breathe.',
  },
  {
    eyebrow: 'The intervention',
    title: 'A precision-fit appliance.',
    body: 'A custom oral appliance gently advances the lower jaw a few millimeters during sleep. The tongue moves with it. The airway begins to open.',
  },
  {
    eyebrow: 'The outcome',
    title: 'Breath, restored.',
    body: 'The airway is patent again. The body stays asleep. Most patients tolerate the appliance far better than CPAP — and we coordinate with your sleep physician throughout.',
  },
];

const SECTIONS = [
  {
    label: 'How we evaluate',
    body:
      'We start with a careful review of your sleep study and symptom history — daytime fatigue, morning headaches, partner-witnessed apneas. For airway-imaging clarity we use 3D Cone Beam CT. The goal is to confirm an oral appliance is right for your anatomy and severity.',
  },
  {
    label: 'How we treat',
    body:
      'A custom appliance is fitted, calibrated, and progressively adjusted across follow-up visits. Most patients adapt within two weeks. We track outcomes against your original sleep study and coordinate with your sleep physician on follow-up testing.',
  },
  {
    label: 'What patients tell us',
    body:
      'The shared experience: they sleep through the night for the first time in years, their partner stops being woken by snoring, and the daytime fog they had stopped noticing finally lifts. Several arrive after years of CPAP intolerance.',
  },
];

export function SleepApneaSignature({ service }: { service: Service }) {
  const main = practiceInfo.phones[1] ?? practiceInfo.phones[0]!;

  return (
    <article>
      <AirwayHero
        topEyebrow={<>Signature service · Specialty</>}
        keyframes={KEYFRAMES}
        ariaLabel="How an oral appliance resolves obstructive sleep apnea"
        fallbackHeading={
          <>
            Sleep apnea,
            <br />
            <span className="italic">resolved.</span>
          </>
        }
      />

      {/* Lede */}
      <section className="bg-stone-50 py-24 md:py-36">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <p className="font-serif text-2xl md:text-4xl leading-[1.4] text-stone-900 tracking-tight">
            {service.body}
          </p>
        </div>
      </section>

      {/* Case-study sections */}
      {SECTIONS.map((sec, i) => (
        <Section key={sec.label} sec={sec} index={i} />
      ))}

      {/* CTA */}
      <section className="bg-stone-900 text-stone-50 py-24 md:py-36">
        <div className="mx-auto max-w-4xl px-5 md:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-6xl tracking-tighter font-light leading-[1.0] mb-12">
            If CPAP isn't working,
            <br />
            <span className="italic">there's another way.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request-appointment"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-50 text-stone-900 px-8 py-4 text-base font-medium hover:bg-stone-200 transition-colors"
            >
              Schedule a sleep consult <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={`tel:${main.tel}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-50/70 text-stone-50 px-8 py-4 text-base font-medium hover:bg-stone-50 hover:text-stone-900 transition-colors"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {main.number}
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}

function Section({
  sec,
  index,
}: {
  sec: { label: string; body: string };
  index: number;
}) {
  const isAlt = index % 2 === 1;
  return (
    <section className={`py-24 md:py-36 ${isAlt ? 'bg-stone-100/60' : 'bg-stone-50'}`}>
      <div
        className={`mx-auto max-w-7xl px-5 md:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
          isAlt ? 'lg:[direction:rtl]' : ''
        }`}
      >
        <div className="lg:col-span-7 [direction:ltr]">
          <div className="relative aspect-[4/3] overflow-hidden bg-stone-200 flex items-end p-10 md:p-14">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(245,236,219,0.6),transparent_55%),radial-gradient(ellipse_at_70%_80%,rgba(96,165,250,0.18),transparent_55%)]" />
            <div className="absolute inset-0 bg-stone-200 -z-10" />
            <p className="relative font-serif text-3xl md:text-5xl text-stone-900 italic font-light leading-[1.1] max-w-md">
              {sec.label}.
            </p>
          </div>
        </div>
        <div className="lg:col-span-5 [direction:ltr]">
          <p className="text-xs uppercase tracking-[0.24em] text-stone-500 mb-4">
            {String(index + 1).padStart(2, '0')} · {sec.label}
          </p>
          <p className="text-stone-700 text-lg md:text-xl leading-relaxed">{sec.body}</p>
        </div>
      </div>
    </section>
  );
}
