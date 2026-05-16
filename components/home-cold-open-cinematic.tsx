'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  AnimatePresence,
} from 'framer-motion';

const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

// Cycling questions in Phase 1.
const PHASE_1_QUESTIONS = ['Dental issue?', 'Medical issue?'] as const;
const PHASE_1_CYCLE_MS = 1300;

// Phase boundaries (for documentation — actual values inlined in useTransform calls below):
// Phase 1: 0 → 20%, fade 20–26%
// Phase 2: 26–38% enter, 68–78% exit
// Split: 75–92%, Reveal: 78–92%, releases at 100%

/**
 * Home page primary cinematic. Three-phase pinned scroll section:
 *   Phase 1 (0 → 20%): auto-looping video, cycling text overlay
 *     ("Dental issue?" ⇄ "Medical issue?" on 1.3s timer)
 *   Phase 2 (26 → 68%): text transitions to "We do both." over the video
 *   Exit (75 → 92%): video halves slide apart, revealing embedded
 *     "Two practices, under one roof." content below at z-0.
 *
 * Total scroll budget: heightVh × 100svh. Default 1.8 → 180svh of scroll.
 * The outer section uses -mt-[var(--header-h)] to pull under the sticky
 * header so the pin engages from scroll-y 0 (no pre-pin drift).
 * After section releases, normal page flow resumes.
 */
export function HomeColdOpenCinematic({ heightVh = 1.6 }: { heightVh?: number }) {
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

  // Split: video halves slide apart 75% → 92%, fully off-screen by reveal-settled.
  const splitProgress = useTransform(progressMV, [0.75, 0.92], [0, 1]);

  // Desktop: horizontal split — left translates left, right translates right.
  const xLeft = useTransform(splitProgress, [0, 1], ['0%', '-100%']);
  const xRight = useTransform(splitProgress, [0, 1], ['0%', '100%']);
  // Mobile: vertical split — top translates up, bottom translates down.
  const yTop = useTransform(splitProgress, [0, 1], ['0%', '-100%']);
  const yBottom = useTransform(splitProgress, [0, 1], ['0%', '100%']);

  // Phase 1 cycling questions: visible 0-20%, fades 20-26%.
  const phase1TextOpacity = useTransform(progressMV, [0, 0.20, 0.26], [1, 1, 0]);
  // Phase 2 unified statement: enters 26-38%, stays until 68%, exits 68-78%.
  const phase2TextOpacity = useTransform(progressMV, [0.26, 0.38, 0.68, 0.78], [0, 1, 1, 0]);
  // Phase 2 entry — scale + translate so the headline lands.
  const phase2Scale = useTransform(progressMV, [0.26, 0.38], [0.92, 1]);
  const phase2Y = useTransform(progressMV, [0.26, 0.38], [28, 0]);
  // White glow plate behind Phase 2.
  const phase2GlowOpacity = useTransform(progressMV, [0.26, 0.38, 0.68, 0.78], [0, 1, 1, 0]);

  // "Two practices, under one roof" reveal — fades in as the split opens (0.78 → 0.92).
  const revealOpacity = useTransform(progressMV, [0.78, 0.92], [0, 1]);
  // Reveal y-entry — slides up softly with the fade-in.
  const revealY = useTransform(progressMV, [0.78, 0.92], [24, 0]);

  // ─────── Magnet snap between cinematic phases ────────────────────────────
  // Two snap points: top (Phase 1) and Phase 2 settled (~middle of Phase 2's window).
  // Bypassed under prefers-reduced-motion.
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    // Snap points in [0,1] scroll progress: top, Phase 2 settled, reveal settled.
    const SNAP_POINTS = [0, 0.40, 0.92] as const;
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
      </section>
    );
  }

  // Header height for the negative-margin trick + safe-area padding.
  // Desktop: ~80px (brand row). Mobile: ~132px (brand row + lane toggle row).
  const headerH = isMobile ? 132 : 80;

  return (
    <section
      ref={sectionRef}
      aria-label="Comfort Care Dental — two practices, one cinematic"
      className="relative isolate w-full"
      style={{
        height: `${heightVh * 100}svh`,
        marginTop: `-${headerH}px`,
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-stone-950">
        {/* Embedded reveal: Two practices, under one roof. Sits at z-0 behind the video.
            Becomes visible as the video halves split apart (Phase 3, 0.78 → 0.92). */}
        <motion.div
          style={{ opacity: revealOpacity, y: revealY, paddingTop: `${headerH}px` }}
          className="absolute inset-0 flex flex-col items-center justify-center z-0 px-6 pointer-events-none"
        >
          <div className="text-center max-w-5xl pointer-events-auto">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-300/80 mb-6 md:mb-8">
              Comfort Care · est. 1999
            </p>
            <h2 className="font-serif text-6xl md:text-[10rem] leading-[0.95] tracking-tight text-stone-50">
              Two practices,{' '}
              <span className="italic font-light">under one roof.</span>
            </h2>
            <p className="mt-8 md:mt-10 text-base md:text-lg text-stone-300/85 max-w-xl mx-auto leading-relaxed">
              Family dentistry and complex orofacial pain care, in the same office,
              with the same team, since 1999.
            </p>
            <div className="mt-10 md:mt-14 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/dental"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-50 text-stone-950 px-8 py-4 text-sm md:text-base font-medium hover:bg-stone-200 transition-colors min-h-12"
              >
                Enter dental
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/medical"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-50/60 text-stone-50 px-8 py-4 text-sm md:text-base font-medium hover:bg-stone-50/10 transition-colors min-h-12"
              >
                Enter medical
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
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
