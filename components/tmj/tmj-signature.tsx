import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { practiceInfo } from '@/content/practice-info';
import type { Service } from '@/content/schemas';
import { AirwayHero, type AirwayHeroKeyframe } from '@/components/airway-hero';

interface TmjSignatureProps {
  service: Service;
}

// Scroll-scrubbed narrative for the TMJ joint sequence video:
//   pain (man holds jaw) → problem (disc displaced, inflamed) → relief (splint, disc seats, calm).
const TMJ_KEYFRAMES: [AirwayHeroKeyframe, AirwayHeroKeyframe, AirwayHeroKeyframe] = [
  {
    eyebrow: 'When your jaw hurts',
    title: 'The pain is real.',
    italicize: [3],
    body: 'Jaw that clicks or locks. Headaches. Ear pain. A bite that feels off. TMJ disorders are easy to dismiss — but the ache has a physical cause: a small cushioning disc inside the joint has slipped out of place.',
  },
  {
    eyebrow: 'How we treat it',
    title: 'A custom appliance.',
    italicize: [2],
    body: 'A precisely fitted splint repositions the jaw a few millimeters and holds it there, so the joint is no longer forced to grind against itself. No surgery, no drilling — worn like a retainer.',
  },
  {
    eyebrow: 'The outcome',
    title: 'The joint settles.',
    italicize: [2],
    body: 'The disc seats back into place, the inflammation calms, and the jaw can finally rest. For most of our patients, that is the end of years of pain that no one else could explain.',
  },
];

const SECTIONS = [
  {
    label: 'How we evaluate',
    body:
      'Comprehensive bite analysis, jaw-joint imaging via 3D Cone Beam CT, muscle palpation, and a careful review of headache, ear, and sleep symptoms. Most TMJ cases are misdiagnosed as ear infections or tension headaches first.',
  },
  {
    label: 'How we treat',
    body:
      'Custom splint therapy, bite equilibration, physical therapy coordination, and targeted muscle work. We avoid surgical intervention except as a last resort and have not had to refer for surgery in the majority of our cases.',
  },
  {
    label: 'What patients tell us',
    body:
      "Most TMJ patients have been to multiple practices before us. The shared experience: someone is finally listening to the whole symptom picture, not just the part of it that's in the mouth.",
  },
];

export function TmjSignature({ service }: TmjSignatureProps) {
  const main = practiceInfo.phones[1] ?? practiceInfo.phones[0]!;

  return (
    <article>
      {/* ─────────── Scroll-scrubbed cinematic joint sequence ─────────── */}
      <AirwayHero
        videoSrc="/videos/tmj-joint-scrub.mp4"
        videoSrcMobile="/videos/tmj-joint-scrub-mobile.mp4"
        topEyebrow={<>Signature service · Specialty</>}
        keyframes={TMJ_KEYFRAMES}
        captionTimecodes={[6.1, 8.3]}
        snapPoints={[0, 0.55, 0.7, 0.95]}
        snapMode="strict"
        autoFinishAfterLastSnap
        variant="light-centered"
        ariaLabel="How a TMJ disorder develops and how a custom splint resolves it"
        fallbackHeading={
          <>
            The jaw pain <span className="italic">has a cause.</span>
          </>
        }
      />

      {/* ─────────── Lede ─────────── */}
      <section className="bg-stone-50 py-24 md:py-36">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          {(() => {
            const [opening, ...rest] = service.body
              .split('\n\n')
              .map((p) => p.trim())
              .filter(Boolean);
            return (
              <>
                <p className="font-serif text-2xl md:text-4xl leading-[1.35] text-stone-900 tracking-tight">
                  {opening}
                </p>
                {rest.length > 0 && (
                  <div className="mt-10 space-y-6 text-stone-700 text-lg md:text-xl leading-relaxed">
                    {rest.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </section>

      {/* ─────────── Scroll-paired case-study sections ─────────── */}
      {SECTIONS.map((sec, i) => (
        <Section key={sec.label} sec={sec} index={i} />
      ))}

      {/* ─────────── CTA ─────────── */}
      <section className="bg-stone-900 text-stone-50 py-24 md:py-36">
        <div className="mx-auto max-w-4xl px-5 md:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-6xl tracking-tighter font-light leading-[1.0] mb-12">
            If your jaw clicks, your head hurts,
            <br />
            or you wake up tired —
            <br />
            <span className="italic">it's worth a conversation.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request-appointment"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-50 text-stone-900 px-8 py-4 text-base font-medium hover:bg-stone-200 transition-colors"
            >
              Schedule a TMJ consult <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
  sec: (typeof SECTIONS)[number];
  index: number;
}) {
  const isAlt = index % 2 === 1;

  return (
    <section
      className={`py-24 md:py-36 ${isAlt ? 'bg-stone-100/60' : 'bg-stone-50'}`}
    >
      <div
        className={`mx-auto max-w-7xl px-5 md:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
          isAlt ? 'lg:[direction:rtl]' : ''
        }`}
      >
        <div className="lg:col-span-7 [direction:ltr]">
          <div className="relative aspect-[4/3] overflow-hidden bg-stone-200 flex items-end p-10 md:p-14">
            {/* Editorial gradient placeholder. Replaced with the practice's
                own photo session in v2. */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(245,236,219,0.6),transparent_55%),radial-gradient(ellipse_at_70%_80%,rgba(184,85,58,0.18),transparent_55%)]" />
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
          <p className="text-stone-700 text-lg md:text-xl leading-relaxed">
            {sec.body}
          </p>
        </div>
      </div>
    </section>
  );
}
