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
const PHASE_1_CYCLE_MS = 1300;

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
 *   Phase 1 (0 → 10%): auto-looping video, cycling text overlay
 *     ("Dental issue?" ⇄ "Medical issue?" on 1.3s timer)
 *   Phase 2 (13 → 48%): text transitions to "We do both." over the video
 *   Phase 3 (42 → 100%): video splits — two clipped halves translate apart,
 *     revealing the dental + medical diptych content positioned behind.
 *     Desktop: horizontal split. Mobile: vertical split.
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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

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

  // Phase 3 split — translate the two video halves apart (60% → 90%).
  const splitProgress = useTransform(progressMV, [0.60, 0.90], [0, 1]);

  // Desktop: horizontal split — left translates left, right translates right.
  const xLeft = useTransform(splitProgress, [0, 1], ['0%', '-100%']);
  const xRight = useTransform(splitProgress, [0, 1], ['0%', '100%']);
  // Mobile: vertical split — top translates up, bottom translates down.
  const yTop = useTransform(splitProgress, [0, 1], ['0%', '-100%']);
  const yBottom = useTransform(splitProgress, [0, 1], ['0%', '100%']);

  // Phase 1 cycling questions: visible 0-15%, fades 15-22%.
  const phase1TextOpacity = useTransform(progressMV, [0, 0.15, 0.22], [1, 1, 0]);
  // Phase 2 unified statement: enters 22-30%, stays until 60%, exits 60-72%.
  const phase2TextOpacity = useTransform(progressMV, [0.22, 0.30, 0.60, 0.72], [0, 1, 1, 0]);
  // Phase 2 entry — scale up + translate up so the headline LANDS rather than just fades.
  const phase2Scale = useTransform(progressMV, [0.22, 0.30], [0.92, 1]);
  const phase2Y = useTransform(progressMV, [0.22, 0.30], [28, 0]);
  // White glow plate behind Phase 2 text — fades in with Phase 2 and out with it.
  const phase2GlowOpacity = useTransform(progressMV, [0.22, 0.30, 0.60, 0.72], [0, 1, 1, 0]);

  // Diptych fades in slightly trailing Phase 2 exit, fully visible by 88%.
  const diptychOpacity = useTransform(progressMV, [0.65, 0.88], [0, 1]);

  // ─────── Magnet snap between cinematic phases ────────────────────────────
  // Adapted from components/why-patients-stay.tsx. Pulls to discrete snap
  // points when user input is quiet AND progress is stable, so each scroll
  // gesture lands cleanly on: top, "We do both." midpoint, split-complete.
  // Bypassed under prefers-reduced-motion.
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    // Snap points in [0,1] scroll progress: top, Phase 2 settled, diptych fully revealed.
    const SNAP_POINTS = [0, 0.30, 0.85] as const;
    const SNAP_AFTER_QUIET_MS = 450;
    const STABLE_FRAMES = 5; // ~83ms at 60fps
    const NEAR_TOLERANCE = 0.015; // don't re-snap if already within 1.5%
    const SNAP_ATTRACTION = 0.12; // only pull if within 12% of a snap point

    let lastProgress = -1;
    let stable = 0;
    let snapping = false;
    let lastInputAt = performance.now();
    let snapRafId = 0;

    const cancelSnapIfRunning = () => {
      if (!snapping) return;
      const lenis = window.__lenis;
      if (lenis?.scrollTo) {
        lenis.scrollTo(window.scrollY, { immediate: true });
      }
      snapping = false;
    };

    const onUserInput = () => {
      lastInputAt = performance.now();
      stable = 0;
      cancelSnapIfRunning();
    };

    window.addEventListener('wheel', onUserInput, { passive: true });
    window.addEventListener('touchmove', onUserInput, { passive: true });
    window.addEventListener('touchstart', onUserInput, { passive: true });
    window.addEventListener('keydown', onUserInput);

    const snapTo = (p: number) => {
      // Find nearest snap point
      const nearest = SNAP_POINTS.reduce((a, b) =>
        Math.abs(b - p) < Math.abs(a - p) ? b : a,
      );

      // Skip if already close enough
      if (Math.abs(nearest - p) < NEAR_TOLERANCE) return;
      // Skip if not within attraction radius of any snap point
      if (Math.abs(nearest - p) > SNAP_ATTRACTION) return;

      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;

      const sectionTopAbsolute = rect.top + window.scrollY;
      const targetY = sectionTopAbsolute + total * nearest;

      snapping = true;
      const lenis = window.__lenis;
      if (lenis?.scrollTo) {
        lenis.scrollTo(targetY, {
          duration: 0.65,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          onComplete: () => {
            snapping = false;
          },
        });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
        setTimeout(() => {
          snapping = false;
        }, 700);
      }
    };

    const tick = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total > 0) {
        const p = Math.max(0, Math.min(1, -rect.top / total));

        const insidePinned = rect.top <= 0 && rect.top >= -total;
        const quietMs = performance.now() - lastInputAt;

        if (!snapping && insidePinned && quietMs > SNAP_AFTER_QUIET_MS) {
          if (Math.abs(p - lastProgress) < 0.0005) {
            stable++;
            if (stable === STABLE_FRAMES) {
              snapTo(p);
              stable = 0;
            }
          } else {
            stable = 0;
          }
        }
        lastProgress = p;
      }
      snapRafId = requestAnimationFrame(tick);
    };
    snapRafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(snapRafId);
      window.removeEventListener('wheel', onUserInput);
      window.removeEventListener('touchmove', onUserInput);
      window.removeEventListener('touchstart', onUserInput);
      window.removeEventListener('keydown', onUserInput);
    };
  }, [reduced]);

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
          style={{ filter: 'grayscale(0.7) brightness(0.95) contrast(1.05)' }}
        />
        {/* ─────────── Vignette for text legibility ─────────── */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/15 via-stone-950/20 to-stone-950/50" />
        <div className="relative z-10 text-center px-4 md:px-6 max-w-3xl mx-auto">
          <h1
            className="font-serif text-7xl md:text-[10rem] tracking-tight text-stone-50"
            style={{ textShadow: '0 2px 28px rgba(0,0,0,0.5), 0 0 80px rgba(0,0,0,0.25)' }}
          >
            {PHASE_1_QUESTIONS[0]}
          </h1>
          <p className="mt-6 text-xs md:text-sm uppercase tracking-[0.28em] text-stone-100/85">
            Dental issue or medical issue — Comfort Care does both
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1">
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
          className="absolute inset-0 grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 z-0"
        >
          {HALVES.map((half) => (
            <Link
              key={half.lane}
              href={half.href}
              className={`group relative flex flex-col justify-between p-8 md:p-14 pt-32 md:pt-28 pb-10 md:pb-14 overflow-hidden ${
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

        {/* ─────────── Left video half (clipped; desktop: left half / mobile: top half) ─────────── */}
        <motion.div
          style={{
            x: isMobile ? 0 : xLeft,
            y: isMobile ? yTop : 0,
            clipPath: isMobile ? 'inset(0 0 50% 0)' : 'inset(0 50% 0 0)',
          }}
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
            style={{ filter: 'grayscale(0.7) brightness(0.95) contrast(1.05)' }}
          />
        </motion.div>

        {/* ─────────── Right video half (clipped; desktop: right half / mobile: bottom half) ─────────── */}
        <motion.div
          style={{
            x: isMobile ? 0 : xRight,
            y: isMobile ? yBottom : 0,
            clipPath: isMobile ? 'inset(50% 0 0 0)' : 'inset(0 0 0 50%)',
          }}
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
            style={{ filter: 'grayscale(0.7) brightness(0.95) contrast(1.05)' }}
          />
        </motion.div>

        {/* ─────────── Vignette for text legibility ─────────── */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-stone-950/15 via-stone-950/20 to-stone-950/50" />

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
                  className="font-serif text-7xl md:text-[10rem] tracking-tight text-stone-50"
                  style={{ textShadow: '0 2px 28px rgba(0,0,0,0.5), 0 0 80px rgba(0,0,0,0.25)' }}
                >
                  {PHASE_1_QUESTIONS[questionIdx]}
                </motion.h1>
              </AnimatePresence>
              <p className="mt-6 text-xs md:text-sm uppercase tracking-[0.28em] text-stone-100/85">
                Scroll to see what we do
              </p>
            </motion.div>

            {/* Phase 2 white glow plate — gives black headline contrast against the video */}
            <motion.div
              aria-hidden="true"
              style={{ opacity: phase2GlowOpacity }}
              className="absolute inset-0 pointer-events-none flex items-center justify-center z-[28]"
            >
              <div className="w-[150%] h-[55%] bg-white/45 blur-3xl rounded-full" />
            </motion.div>

            {/* Phase 2: unified statement */}
            <motion.div
              style={{ opacity: phase2TextOpacity }}
              className="absolute inset-0 flex flex-col items-center justify-center z-30"
            >
              <motion.h2
                style={{ scale: phase2Scale, y: phase2Y }}
                className="font-serif text-8xl md:text-[13rem] tracking-tight text-stone-950 font-medium leading-[0.95]"
              >
                We do both.
              </motion.h2>
              <motion.p
                style={{ scale: phase2Scale, y: phase2Y }}
                className="mt-6 text-xs md:text-sm uppercase tracking-[0.28em] text-stone-800"
              >
                Comfort Care · dental and medical
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
