'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { practiceInfo } from '@/content/practice-info';
import type { Service } from '@/content/schemas';

interface TmjSignatureProps {
  service: Service;
}

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
  const heroRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

  return (
    <article>
      {/* ─────────── Pinned cinematic hero ─────────── */}
      <section
        ref={heroRef}
        className="relative isolate h-[120svh] bg-stone-950 text-stone-50 overflow-hidden"
      >
        <motion.div
          style={reduced ? undefined : { scale: heroScale, opacity: heroOpacity }}
          className="sticky top-0 h-screen w-full"
        >
          {/* Editorial gradient — replaces photo placeholder until v2 shoot.
              Two radial accents on near-black for depth without competing
              with the typography. */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_30%,rgba(245,236,219,0.10),transparent_55%),radial-gradient(ellipse_at_15%_80%,rgba(184,85,58,0.10),transparent_60%)]" />
          <div className="absolute inset-0 -z-10 bg-stone-950" />

          <motion.div
            style={reduced ? undefined : { y: titleY }}
            className="absolute inset-0 flex flex-col justify-end px-5 md:px-8 pb-16 md:pb-24"
          >
            <div className="mx-auto max-w-7xl w-full">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-300 mb-6">
                Signature service · Specialty
              </p>
              <h1 className="font-serif text-[clamp(4rem,14vw,12rem)] leading-[0.88] tracking-tighter text-stone-50 font-light">
                TMJ
                <br />
                <span className="italic">treatment.</span>
              </h1>
              <p className="mt-10 max-w-2xl text-stone-200 text-lg md:text-xl leading-relaxed">
                {service.summary}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─────────── Lede ─────────── */}
      <section className="bg-stone-50 py-24 md:py-36">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <p className="font-serif text-2xl md:text-4xl leading-[1.4] text-stone-900 tracking-tight">
            {service.body}
          </p>
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
