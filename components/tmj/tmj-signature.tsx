'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { tmjImages } from '@/content/photography';
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
    image: tmjImages.scan,
  },
  {
    label: 'How we treat',
    body:
      'Custom splint therapy, bite equilibration, physical therapy coordination, and targeted muscle work. We avoid surgical intervention except as a last resort and have not had to refer for surgery in the majority of our cases.',
    image: tmjImages.treatment,
  },
  {
    label: 'What patients tell us',
    body:
      "Most TMJ patients have been to multiple practices before us. The shared experience: someone is finally listening to the whole symptom picture, not just the part of it that's in the mouth.",
    image: tmjImages.consultation,
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
        className="relative h-[120svh] bg-stone-950 text-stone-50 overflow-hidden"
      >
        <motion.div
          style={reduced ? undefined : { scale: heroScale, opacity: heroOpacity }}
          className="sticky top-0 h-screen w-full"
        >
          <Image
            src={tmjImages.hero.src}
            alt={tmjImages.hero.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 to-transparent" />

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
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  const isAlt = index % 2 === 1;

  return (
    <section
      ref={ref}
      className={`py-24 md:py-36 ${isAlt ? 'bg-stone-100/60' : 'bg-stone-50'}`}
    >
      <div
        className={`mx-auto max-w-7xl px-5 md:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
          isAlt ? 'lg:[direction:rtl]' : ''
        }`}
      >
        <div className="lg:col-span-7 [direction:ltr]">
          <div className="relative aspect-[4/3] overflow-hidden bg-stone-300">
            <motion.div
              style={reduced ? undefined : { y: imageY, scale: imageScale }}
              className="absolute inset-0"
            >
              <Image
                src={sec.image.src}
                alt={sec.image.alt}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </motion.div>
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
