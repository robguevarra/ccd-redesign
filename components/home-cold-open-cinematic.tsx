'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { Logo } from './logo';

const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

// Cycling questions in Phase 1.
const PHASE_1_QUESTIONS = ['Dental issue?', 'Medical issue?'] as const;
const PHASE_1_CYCLE_MS = 1500;

// Phase boundaries on scroll progress.
const PHASE_1_END = 0.1;
const PHASE_2_END = 0.4;
// Phase 3 = 0.4 → 1.0 (split open + diptych reveal)

interface DiptychHalf {
  lane: 'dental' | 'medical';
  href: string;
  eyebrow: string;
  title: { lead: string; emphasis: string };
  cta: string;
}

const HALVES: readonly [DiptychHalf, DiptychHalf] = [
  {
    lane: 'dental',
    href: '/dental',
    eyebrow: 'FAMILY · RESTORATIVE · COSMETIC',
    title: { lead: 'For the family you bring back', emphasis: 'every six months.' },
    cta: 'Enter dental',
  },
  {
    lane: 'medical',
    href: '/medical',
    eyebrow: 'OROFACIAL PAIN · ORAL MEDICINE',
    title: { lead: 'For pain everyone told you was', emphasis: 'permanent.' },
    cta: 'Enter medical',
  },
];

/**
 * Home page primary cinematic. Three-phase pinned scroll section:
 *   Phase 1 (0 → 30%): auto-looping grayscaled video, cycling text overlay
 *     ("Dental issue?" ⇄ "Medical issue?" on 2.5s timer)
 *   Phase 2 (30 → 60%): text transitions to "Either way." over the video
 *   Phase 3 (60 → 100%): video splits horizontally — two clipped halves
 *     translate apart, revealing the dental + medical diptych content
 *     positioned behind.
 *
 * Total scroll budget: heightVh × 100svh. Default 3 → 300svh of scroll for
 * the entire cinematic. After section releases, normal page flow resumes.
 */
export function HomeColdOpenCinematic({ heightVh = 3 }: { heightVh?: number }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoLeftRef = useRef<HTMLVideoElement>(null);
  const videoRightRef = useRef<HTMLVideoElement>(null);
  const progressMV = useMotionValue(0);
  const [questionIdx, setQuestionIdx] = useState(0);

  // Manual rAF loop reading getBoundingClientRect each frame — same pattern
  // AirwayHero uses, bypasses scroll event coalescing.
  useEffect(() => {
    if (!sectionRef.current) return;
    let rafId = 0;
    const tick = () => {
      const rect = sectionRef.current!.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = total > 0 ? Math.min(1, scrolled / total) : 0;
      progressMV.set(progress);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [progressMV]);

  // Cycle the Phase 1 question on a timer (independent of scroll).
  useEffect(() => {
    if (reduced) return; // respect reduced motion — show first question only
    const id = setInterval(() => {
      setQuestionIdx((i) => (i + 1) % PHASE_1_QUESTIONS.length);
    }, PHASE_1_CYCLE_MS);
    return () => clearInterval(id);
  }, [reduced]);

  // Sync the two video elements so they always show the same frame.
  // The right video mirrors the left.
  useEffect(() => {
    const left = videoLeftRef.current;
    const right = videoRightRef.current;
    if (!left || !right) return;
    const onTimeUpdate = () => {
      if (Math.abs(left.currentTime - right.currentTime) > 0.05) {
        right.currentTime = left.currentTime;
      }
    };
    left.addEventListener('timeupdate', onTimeUpdate);
    return () => left.removeEventListener('timeupdate', onTimeUpdate);
  }, []);

  // Phase 3 split — translate the two video halves apart.
  // At progress 0.6 → 1.0, translateX goes from 0 → ±60% of viewport width.
  const splitProgress = useTransform(progressMV, [PHASE_2_END, 1], [0, 1]);
  const leftTranslate = useTransform(splitProgress, [0, 1], ['0%', '-100%']);
  const rightTranslate = useTransform(splitProgress, [0, 1], ['0%', '100%']);

  // Phase 1 → 2 text fade.
  const phase1TextOpacity = useTransform(
    progressMV,
    [0, PHASE_1_END, PHASE_2_END],
    [1, 1, 0],
  );
  const phase2TextOpacity = useTransform(
    progressMV,
    [PHASE_1_END, (PHASE_1_END + PHASE_2_END) / 2, PHASE_2_END],
    [0, 1, 1],
  );

  // Diptych reveal opacity in Phase 3.
  const diptychOpacity = useTransform(
    progressMV,
    [PHASE_2_END, (PHASE_2_END + 1) / 2],
    [0, 1],
  );

  // Reduced-motion fallback: static video, static text, no split.
  if (reduced) {
    return (
      <section
        aria-label="Comfort Care Dental — two practices, one cinematic"
        className="relative w-full min-h-screen bg-stone-950 flex items-center justify-center overflow-hidden"
      >
        <video
          src="/videos/home-cold-open.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: 'grayscale(1) brightness(1.12) contrast(0.92)' }}
        />
        <div className="absolute inset-0 bg-white/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50/20 via-transparent to-stone-950/55" />
        <div className="relative z-10 text-center px-4 md:px-6 max-w-3xl mx-auto">
          <h1
            className="font-serif text-6xl md:text-9xl tracking-tight text-stone-950 font-medium"
            style={{ textShadow: '0 2px 30px rgba(255,255,255,0.5)' }}
          >
            {PHASE_1_QUESTIONS[0]}
          </h1>
          <p className="mt-6 text-xs md:text-sm uppercase tracking-[0.28em] text-stone-700">
            Dental issue or medical issue — Comfort Care does both
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-2">
          {HALVES.map((half) => (
            <Link
              key={half.lane}
              href={half.href}
              className={`group flex flex-col justify-between p-8 md:p-14 ${
                half.lane === 'dental'
                  ? 'bg-stone-100 text-stone-900'
                  : 'bg-[var(--color-ink-teal)] text-stone-50'
              }`}
            >
              <div>
                <Logo lane={half.lane} size={48} mobileSize={32} decorative />
                <p className="mt-6 text-[10px] tracking-[0.24em] uppercase opacity-75">
                  {half.eyebrow}
                </p>
                <h2 className="mt-3 font-serif text-2xl md:text-5xl leading-[1.05] tracking-tight max-w-[18ch]">
                  {half.title.lead}{' '}
                  <span className="italic font-light">{half.title.emphasis}</span>
                </h2>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm md:text-base font-medium">
                {half.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Comfort Care Dental — two practices, one cinematic"
      className="relative w-full"
      style={{ height: `${heightVh * 100}svh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-stone-950">
        {/* ─────────── Diptych behind the video (revealed by split) ─────────── */}
        <motion.div
          style={{ opacity: diptychOpacity }}
          className="absolute inset-0 grid grid-cols-2 z-0"
        >
          {HALVES.map((half) => (
            <Link
              key={half.lane}
              href={half.href}
              className={`group relative flex flex-col justify-between p-8 md:p-14 overflow-hidden ${
                half.lane === 'dental'
                  ? 'bg-stone-100 text-stone-900'
                  : 'bg-[var(--color-ink-teal)] text-stone-50'
              }`}
            >
              <div className="relative z-10">
                <Logo lane={half.lane} size={48} mobileSize={32} decorative />
                <p className="mt-6 text-[10px] tracking-[0.24em] uppercase opacity-75">
                  {half.eyebrow}
                </p>
                <h2 className="mt-3 font-serif text-2xl md:text-5xl leading-[1.05] tracking-tight max-w-[18ch]">
                  {half.title.lead}{' '}
                  <span className="italic font-light">{half.title.emphasis}</span>
                </h2>
              </div>
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 text-sm md:text-base font-medium">
                  {half.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* ─────────── Left video half (clipped to left, translates left in Phase 3) ─────────── */}
        <motion.div
          style={{ x: leftTranslate, clipPath: 'inset(0 50% 0 0)' }}
          className="absolute inset-0 z-10"
        >
          <video
            ref={videoLeftRef}
            src="/videos/home-cold-open.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
            style={{ filter: 'grayscale(1) brightness(1.12) contrast(0.92)' }}
          />
        </motion.div>

        {/* ─────────── Right video half (clipped to right, translates right in Phase 3) ─────────── */}
        <motion.div
          style={{ x: rightTranslate, clipPath: 'inset(0 0 0 50%)' }}
          className="absolute inset-0 z-10"
        >
          <video
            ref={videoRightRef}
            src="/videos/home-cold-open.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
            style={{ filter: 'grayscale(1) brightness(1.12) contrast(0.92)' }}
          />
        </motion.div>

        {/* ─────────── White wash above the grayscale video so black type reads ─────────── */}
        <div className="absolute inset-0 z-[15] pointer-events-none bg-white/35" />

        {/* ─────────── Stronger atmospheric vignette ─────────── */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-stone-50/20 via-transparent to-stone-950/55" />

        {/* ─────────── Phase 1 + 2 text overlay (centered, layered above video) ─────────── */}
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="text-center px-4 md:px-6 max-w-3xl mx-auto">
            {/* Phase 1: cycling questions */}
            <motion.div style={{ opacity: phase1TextOpacity }}>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={PHASE_1_QUESTIONS[questionIdx]}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: EASE_PREMIUM }}
                  className="font-serif text-6xl md:text-9xl tracking-tight text-stone-950 font-medium"
                  style={{ textShadow: '0 2px 30px rgba(255,255,255,0.5)' }}
                >
                  {PHASE_1_QUESTIONS[questionIdx]}
                </motion.h1>
              </AnimatePresence>
              <p className="mt-6 text-xs md:text-sm uppercase tracking-[0.28em] text-stone-700">
                Scroll to see what we do
              </p>
            </motion.div>

            {/* Phase 2: unified statement */}
            <motion.div
              style={{ opacity: phase2TextOpacity }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <h2
                className="font-serif text-6xl md:text-9xl tracking-tight text-stone-950 font-medium"
                style={{ textShadow: '0 2px 30px rgba(255,255,255,0.5)' }}
              >
                Either way.
              </h2>
              <p className="mt-6 text-xs md:text-sm uppercase tracking-[0.28em] text-stone-700">
                Comfort Care does both
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
