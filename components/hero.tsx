'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { useRef } from 'react';
import { practiceInfo } from '@/content/practice-info';

// Lazy-load the 3D Canvas client-side so we don't ship Three.js to first paint.
const HeroCanvas = dynamic<{ scrollProgress: ReturnType<typeof useScroll>['scrollYProgress'] }>(
  () => import('./hero-canvas').then((m) => m.HeroCanvas),
  {
    ssr: false,
    loading: () => null,
  },
);

const HEADLINE_LINE_1 = ['Considered', 'dentistry,'];
const HEADLINE_LINE_2 = ['in', 'Rancho', 'Cucamonga'];
const HEADLINE_LINE_3 = ['since', '1999.'];

/**
 * Master spec §5 wow zone. Full-viewport scroll-choreographed hero with a
 * 3D abstract form, scroll-driven scale-out as you leave the section, and
 * character-staggered text entry.
 */
export function Hero() {
  const main = practiceInfo.phones[1] ?? practiceInfo.phones[0]!;
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-driven scale + opacity for the hero composition as it leaves.
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const canvasY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <section
      ref={containerRef}
      className="relative isolate min-h-[100svh] overflow-hidden bg-stone-950 text-stone-50"
      aria-label="Hero"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_70%_20%,rgba(245,236,219,0.18),transparent_55%),radial-gradient(ellipse_at_15%_80%,rgba(184,85,58,0.12),transparent_55%)]" />

      {/* 3D Canvas — pinned to the right half on desktop, full-bleed on mobile (low opacity) */}
      <motion.div
        style={reduced ? undefined : { opacity: canvasOpacity, y: canvasY }}
        className="absolute inset-0 -z-10 md:left-1/2 pointer-events-none opacity-50 md:opacity-100"
      >
        <HeroCanvas scrollProgress={scrollYProgress} />
      </motion.div>

      {/* Foreground composition */}
      <div className="relative mx-auto max-w-7xl px-5 md:px-8 pt-28 md:pt-44 pb-24 md:pb-32 min-h-[100svh] flex flex-col justify-between">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="text-xs uppercase tracking-[0.24em] text-stone-400"
        >
          {practiceInfo.brandName} · {practiceInfo.address.city}, CA
        </motion.p>

        <motion.div
          style={reduced ? undefined : { scale: titleScale, opacity: titleOpacity }}
          className="max-w-3xl md:max-w-2xl lg:max-w-3xl"
        >
          <h1 className="font-serif text-[clamp(2.75rem,7vw,7rem)] leading-[0.95] tracking-tighter font-light">
            <WordReveal words={HEADLINE_LINE_1} />
            <br />
            <WordReveal
              words={HEADLINE_LINE_2}
              italicize={[0]}
              startDelay={HEADLINE_LINE_1.length * 0.08}
            />
            <br />
            <WordReveal
              words={HEADLINE_LINE_3}
              startDelay={(HEADLINE_LINE_1.length + HEADLINE_LINE_2.length) * 0.08}
            />
          </h1>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.4 }}
            className="max-w-md text-base md:text-lg text-stone-300 leading-relaxed"
          >
            Six doctors, in-house specialists across endodontics, oral surgery,
            and orthodontics. Two specialty CT scanners, one digital scanning
            workflow, and a clinical microscope.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.55 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              href="/request-appointment"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-50 text-stone-950 px-7 py-3.5 text-sm font-medium hover:bg-stone-200 transition-colors"
            >
              Request appointment
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={`tel:${main.tel}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-50/70 text-stone-50 px-7 py-3.5 text-sm font-medium hover:bg-stone-50 hover:text-stone-950 transition-colors"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {main.number}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0.4] }}
        transition={{ duration: 3, delay: 2, repeat: Infinity, repeatType: 'mirror' }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.32em] text-stone-400"
      >
        Scroll
      </motion.div>
    </section>
  );
}

function WordReveal({
  words,
  italicize = [],
  startDelay = 0,
}: {
  words: string[];
  italicize?: number[];
  startDelay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <span className="inline-flex flex-wrap gap-x-[0.3em] overflow-hidden">
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span
            initial={reduced ? false : { y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1],
              delay: startDelay + i * 0.085,
            }}
            className={`inline-block ${italicize.includes(i) ? 'italic font-extralight' : ''}`}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
