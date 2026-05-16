'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { cn } from '@/lib/cn';

export interface AirwayHeroKeyframe {
  eyebrow: string;
  /** Display title — split on whitespace for the per-word mask reveal. */
  title: string;
  /** Indices of words to italicize. */
  italicize?: number[];
  body: ReactNode;
}

interface AirwayHeroProps {
  videoSrc?: string;
  videoSrcMobile?: string;
  topEyebrow?: ReactNode;
  keyframes: [AirwayHeroKeyframe, AirwayHeroKeyframe, AirwayHeroKeyframe];
  cta?: ReactNode;
  ariaLabel?: string;
  /** Section height as a multiplier of viewport. Defaults to 4 (400svh). */
  heightVh?: number;
  /** Reduced-motion fallback heading shown above the stacked text frames. */
  fallbackHeading: ReactNode;
  /**
   * If true, scroll progress 0 → 0.5 scrubs video time from 0 → duration,
   * and progress 0.5 → 1.0 reverses it back to 0. Creates a ping-pong
   * loop within a single scroll budget. Default false (linear scrub).
   */
  pingPong?: boolean;
  /**
   * Visual variant. 'dark-split' (default) is the original ink-950 background
   * with split desktop layout used by /medical. 'light-centered' is a white +
   * diffused-gray background with a full-bleed centered video and overlaid
   * captions (mobile-style) on every breakpoint — used by /dental for the
   * tooth-restoration cinematic.
   */
  variant?: 'dark-split' | 'light-centered';
  /**
   * Scroll progress points in [0, 1] to magnet-snap to when user input quiets.
   * If undefined or empty, no snap behavior.
   */
  snapPoints?: readonly number[];
  /**
   * When true, after the user lands on the LAST snap point in `snapPoints`,
   * the cinematic auto-advances to progress 1.0 (releasing the pin) over
   * ~1.5s following a ~1.2s linger. Cancelled instantly on any user input.
   * Useful for "settle, read, then carry the user to the next section".
   */
  autoFinishAfterLastSnap?: boolean;
  /** Render a fixed corner debug overlay with progress + video time + active frame. */
  debug?: boolean;
}

const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

// ─────── Scroll narrative — first frame shows on arrival ───────────────
//   0.00 → 0.42  Frame A — visible from page entry
//   0.42 → 0.72  Frame B
//   0.72 → 1.00  Frame C
const REVEAL_END = 0;
const FRAME_A_END = 0.42;
const FRAME_B_END = 0.72;

/**
 * Pinned scroll-scrubbed video hero with a split desktop layout. Editorial
 * restraint — no CSS tricks, no rest-state tilt. Atmospheric overlay reveals
 * the video first, captions are earned through scroll.
 */
export function AirwayHero({
  videoSrc = '/videos/sleep-apnea-airway-scrub.mp4',
  videoSrcMobile = '/videos/sleep-apnea-airway-scrub-mobile.mp4',
  topEyebrow,
  keyframes,
  cta,
  ariaLabel = 'Airway resolution sequence',
  heightVh = 4,
  fallbackHeading,
  pingPong = false,
  variant = 'dark-split',
  snapPoints,
  autoFinishAfterLastSnap = false,
  debug = false,
}: AirwayHeroProps) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeFrame, setActiveFrame] = useState(0);
  // REVEAL_END = 0 means the panel is visible at scroll progress 0 (page entry).
  // Initialize true so the caption appears immediately on mount, before the
  // rAF tick fires and confirms progress >= REVEAL_END.
  const [showPanel, setShowPanel] = useState(REVEAL_END === 0);
  const [videoReady, setVideoReady] = useState(false);
  // Tracks viewport ≥ lg breakpoint (1024px). Below lg we skip the
  // scale/translate transforms on the video — mobile GPUs don't have budget
  // to spare compositing a full-bleed video on top of seek work.
  const [isLg, setIsLg] = useState(false);

  // Single source of truth for scroll progress — written from a manual rAF
  // loop that reads getBoundingClientRect each frame. Bypasses scroll events
  // entirely, which is essential for Lenis (smooth-scroll often coalesces
  // scroll events) and for iOS Safari's touch-momentum quirks.
  const progressMV = useMotionValue(0);

  const scale = useTransform(
    progressMV,
    [0, REVEAL_END, 0.6, 1],
    [1.0, 1.0, 1.04, 1.0],
  );
  const yShift = useTransform(
    progressMV,
    [0, REVEAL_END, 1],
    ['0%', '0%', '-2%'],
  );
  const copyParallax = useTransform(
    progressMV,
    [0, REVEAL_END, 1],
    ['0%', '0%', '-5%'],
  );
  const overlayOpacity = useTransform(
    progressMV,
    [0, REVEAL_END],
    [0.7, 0.15],
  );
  const eyebrowOpacity = useTransform(
    progressMV,
    [0, REVEAL_END],
    [0.45, 0.9],
  );

  // Track lg breakpoint so the rAF tick can pick a coarser seek threshold on
  // mobile (fewer currentTime writes) and so the video wrapper can skip the
  // scale/y transforms below lg.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsLg(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const mqLg = window.matchMedia('(min-width: 1024px)');

    let raf = 0;
    let lastFrame = -1;
    let lastShow = false;
    let displayTime = 0;
    let lastSeekTime = -1;
    let warmedUp = false;

    // iOS Safari quirk: video.currentTime seeking doesn't decode frames
    // unless the video has played at least once in a user-interaction
    // context. A silent muted play→pause primes the decoder. We try on
    // loadedmetadata (works on Android + desktop) and again on first touch
    // (the only context iOS will allow play() to succeed).
    const warmUp = () => {
      if (warmedUp) return;
      warmedUp = true;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => video.pause()).catch(() => {
          // autoplay rejected on iOS — wait for touch.
          warmedUp = false;
        });
      }
    };

    const onMeta = () => {
      setVideoReady(true);
      warmUp();
    };
    // iOS: when autoplay starts, the decoder wakes up. Pause immediately so
    // scroll-driven seeks take over.
    const onPlaying = () => {
      video.pause();
      warmedUp = true;
    };
    const onFirstTouch = () => {
      warmUp();
      window.removeEventListener('touchstart', onFirstTouch);
      window.removeEventListener('pointerdown', onFirstTouch);
    };

    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('playing', onPlaying, { once: true });
    window.addEventListener('touchstart', onFirstTouch, { passive: true });
    window.addEventListener('pointerdown', onFirstTouch, { passive: true });

    if (Number.isFinite(video.duration) && video.duration > 0) {
      setVideoReady(true);
      warmUp();
    }

    const tick = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total > 0) {
        const progress = Math.max(0, Math.min(1, -rect.top / total));
        progressMV.set(progress);

        // Linear scrub from post-reveal progress. With pingPong, progress
        // 0 → 0.5 maps forward 0 → 1 and 0.5 → 1.0 maps back 1 → 0.
        let targetTime = 0;
        if (Number.isFinite(video.duration) && video.duration > 0) {
          const linearProgress =
            progress < REVEAL_END
              ? 0
              : (progress - REVEAL_END) / (1 - REVEAL_END);
          const scrubProgress = pingPong
            ? linearProgress < 0.5
              ? linearProgress * 2
              : (1 - linearProgress) * 2
            : linearProgress;
          targetTime = scrubProgress * video.duration;
        }

        displayTime += (targetTime - displayTime) * 0.18;

        // Coarser threshold on mobile: roughly halves the currentTime writes,
        // which is the main mobile-Safari bottleneck during scroll-scrub.
        const seekThreshold = mqLg.matches ? 0.04 : 0.08;
        if (
          Number.isFinite(video.duration) &&
          video.duration > 0 &&
          Math.abs(displayTime - lastSeekTime) > seekThreshold
        ) {
          video.currentTime = displayTime;
          lastSeekTime = displayTime;
        }

        const visible = progress >= REVEAL_END;
        if (visible !== lastShow) {
          lastShow = visible;
          setShowPanel(visible);
        }

        const next =
          progress < FRAME_A_END ? 0 : progress < FRAME_B_END ? 1 : 2;
        if (next !== lastFrame) {
          lastFrame = next;
          setActiveFrame(next);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('playing', onPlaying);
      window.removeEventListener('touchstart', onFirstTouch);
      window.removeEventListener('pointerdown', onFirstTouch);
      cancelAnimationFrame(raf);
    };
  }, [reduced, progressMV, pingPong]);

  // ─────── Magnet snap to snapPoints ───────
  useEffect(() => {
    if (reduced) return;
    if (!snapPoints || snapPoints.length === 0) return;
    const section = sectionRef.current;
    if (!section) return;

    const SNAP_AFTER_QUIET_MS = 450;
    const STABLE_FRAMES = 5;
    const NEAR_TOLERANCE = 0.12;

    let lastProgress = -1;
    let stable = 0;
    let snapping = false;
    let lastInputAt = performance.now();
    let autoFinishTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const cancelSnapIfRunning = () => {
      if (autoFinishTimeoutId !== null) {
        clearTimeout(autoFinishTimeoutId);
        autoFinishTimeoutId = null;
      }
      if (!snapping) return;
      const lenis = (window as Window & { __lenis?: { scrollTo: (target: number | string, opts?: Record<string, unknown>) => void } }).__lenis;
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
      const nearest = [...snapPoints].reduce((a, b) =>
        Math.abs(b - p) < Math.abs(a - p) ? b : a,
      );
      if (Math.abs(nearest - p) > NEAR_TOLERANCE) return;
      if (Math.abs(nearest - p) < 0.001) return; // already there

      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;

      const sectionTopAbsolute = rect.top + window.scrollY;
      const targetY = sectionTopAbsolute + total * nearest;

      snapping = true;
      const isLastSnap =
        autoFinishAfterLastSnap &&
        Math.abs(nearest - snapPoints[snapPoints.length - 1]!) < 0.001;

      const lenis = (window as Window & { __lenis?: { scrollTo: (target: number | string, opts?: Record<string, unknown>) => void } }).__lenis;
      if (lenis?.scrollTo) {
        lenis.scrollTo(targetY, {
          duration: 0.65,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          onComplete: () => {
            snapping = false;
            // After landing on the LAST snap point, linger ~1.2s then slowly
            // ease the page past the cinematic so the next section comes into
            // view. Cancelled by any user input via cancelSnapIfRunning.
            if (isLastSnap && autoFinishTimeoutId === null) {
              autoFinishTimeoutId = setTimeout(() => {
                autoFinishTimeoutId = null;
                const r2 = section.getBoundingClientRect();
                const total2 = r2.height - window.innerHeight;
                if (total2 <= 0) return;
                const finishY =
                  r2.top + window.scrollY + total2 + window.innerHeight * 0.4;
                snapping = true;
                lenis.scrollTo(finishY, {
                  duration: 1.5,
                  easing: (t: number) => 1 - Math.pow(1 - t, 3),
                  onComplete: () => { snapping = false; },
                });
              }, 1200);
            }
          },
        });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
        setTimeout(() => { snapping = false; }, 700);
      }
    };

    let raf = 0;
    const tick = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total > 0) {
        const p = Math.max(0, Math.min(1, -rect.top / total));

        const insidePinned = rect.top <= 0 && rect.top >= -total;
        const quietMs = performance.now() - lastInputAt;

        if (!snapping && insidePinned && quietMs > SNAP_AFTER_QUIET_MS) {
          if (Math.abs(p - lastProgress) < 0.001) {
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
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (autoFinishTimeoutId !== null) {
        clearTimeout(autoFinishTimeoutId);
      }
      window.removeEventListener('wheel', onUserInput);
      window.removeEventListener('touchmove', onUserInput);
      window.removeEventListener('touchstart', onUserInput);
      window.removeEventListener('keydown', onUserInput);
    };
  }, [reduced, progressMV, snapPoints, autoFinishAfterLastSnap]);

  // ─────── Reduced-motion fallback ───────
  if (reduced) {
    const isLight = variant === 'light-centered';
    return (
      <section className={cn(
        'relative py-24 md:py-32',
        isLight ? 'bg-stone-50 text-stone-900' : 'bg-ink-950 text-stone-50',
      )}>
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          {topEyebrow && (
            <p className={cn(
              'text-xs uppercase tracking-[0.24em] mb-6',
              isLight ? 'text-stone-500' : 'text-stone-300',
            )}>
              {topEyebrow}
            </p>
          )}
          <div className="font-serif text-[clamp(2.75rem,8vw,7rem)] leading-[0.92] tracking-tighter font-light mb-12">
            {fallbackHeading}
          </div>
          <div className="grid gap-12 md:gap-16 mt-16">
            {keyframes.map((kf, i) => (
              <div key={i} className={cn(
                'border-t pt-8',
                isLight ? 'border-stone-200' : 'border-ink-700',
              )}>
                <p className={cn(
                  'text-xs uppercase tracking-[0.24em] mb-4',
                  isLight ? 'text-stone-500' : 'text-stone-400',
                )}>
                  {kf.eyebrow} · 0{i + 1} of 03
                </p>
                <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] tracking-tight font-light mb-4">
                  <RenderTitle title={kf.title} italicize={kf.italicize} />
                </h2>
                <p className={cn(
                  'text-lg leading-relaxed max-w-2xl',
                  isLight ? 'text-stone-600' : 'text-stone-300',
                )}>
                  {kf.body}
                </p>
              </div>
            ))}
          </div>
          {cta && <div className="mt-12">{cta}</div>}
        </div>
      </section>
    );
  }

  const isLight = variant === 'light-centered';

  // ─────── Pinned scroll-scrubbed video hero ───────
  return (
    <>
    <section
      ref={sectionRef}
      className={cn(
        'relative isolate -mt-20',
        isLight ? 'bg-stone-50 text-stone-900' : 'bg-ink-950 text-stone-50',
      )}
      style={{ height: `${heightVh * 100}svh` }}
      aria-label={ariaLabel}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ─────────── Single shared video element ─────────── */}
        {/* dark-split: on desktop shifted right so left 40% sits behind copy column.
            light-centered: always full-bleed at all breakpoints. */}
        <motion.div
          style={isLg && !isLight ? { scale, y: yShift } : undefined}
          className={cn(
            'absolute inset-0',
            !isLight && 'lg:left-[40%] xl:left-[40%]',
            isLg && !isLight && 'will-change-transform',
          )}
        >
          {/* Diffused gray gradient behind video for light-centered variant */}
          {isLight && (
            <div
              aria-hidden
              className="absolute inset-0 z-0"
              style={{
                background:
                  'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(255,255,255,0.6), rgba(231,229,228,0.5) 55%, rgba(214,211,209,0.35) 100%)',
              }}
            />
          )}
          <video
            ref={videoRef}
            muted
            playsInline
            autoPlay
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              videoReady ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Browser picks the first matching <source>. ≤1024px gets the
                ~3.6MB all-intra mobile encode; wider viewports fall through to
                the full 1080p file. */}
            <source src={videoSrcMobile} media="(max-width: 1024px)" type="video/mp4" />
            <source src={videoSrc} type="video/mp4" />
          </video>
        </motion.div>

        {/* Atmospheric overlay over the video region */}
        {isLight ? (
          // Light variant: subtle white-to-transparent gradient at bottom for caption legibility
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.0) 65%)',
            }}
          />
        ) : (
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 lg:left-[40%] xl:left-[40%] bg-ink-950 pointer-events-none"
          />
        )}

        {/* ─────────── Mobile / tablet UI overlay (also used for ALL breakpoints in light-centered) ─────────── */}
        <div className={cn(
          'absolute inset-0 pointer-events-none',
          // dark-split: only shown below lg (desktop uses the split column). light-centered: always shown.
          !isLight && 'lg:hidden',
        )}>
          {/* Bottom vignette for type readability — dark variant only */}
          {!isLight && (
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(2,6,15,0.85)_0%,rgba(2,6,15,0.35)_45%,rgba(2,6,15,0.0)_70%)]" />
          )}

          {topEyebrow && (
            <motion.div
              style={{ opacity: eyebrowOpacity }}
              className={cn(
                'absolute top-20 left-1/2 -translate-x-1/2 max-w-[90vw] text-center text-[9px] uppercase tracking-[0.24em]',
                isLight ? 'text-stone-500' : 'text-stone-300',
              )}
            >
              {topEyebrow}
            </motion.div>
          )}

          <div className="absolute inset-x-0 bottom-0 px-5 pb-12 pointer-events-auto">
            <div className={cn(
              'mx-auto max-w-7xl w-full relative min-h-[40svh]',
              // On desktop for light-centered, cap the width and center
              isLight && 'lg:max-w-4xl lg:mx-auto',
            )}>
              <AnimatePresence mode="wait" initial={false}>
                {showPanel && (
                  <ActivePanel
                    key={activeFrame}
                    kf={keyframes[activeFrame]!}
                    index={activeFrame}
                    isLast={activeFrame === keyframes.length - 1}
                    cta={cta}
                    variant={isLight ? 'overlay-light' : 'overlay'}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          <ProgressDots
            count={keyframes.length}
            active={activeFrame}
            visible={showPanel}
            variant="vertical"
            light={isLight}
          />
        </div>

        {/* ─────────── Desktop UI overlay: opaque left copy column (dark-split only) ─────────── */}
        {!isLight && (
          <div className="hidden lg:block absolute inset-0">
            {/* Left copy column — opaque, sits over the video's left 40% */}
            <div
              className="absolute inset-y-0 left-0 w-[40%] grid grid-rows-[auto_1fr_auto] px-12 xl:px-16 pt-28 xl:pt-32 pb-12 xl:pb-16 z-10 overflow-hidden"
              style={{
                background:
                  'radial-gradient(ellipse at 15% 100%, rgba(31,44,69,0.4), transparent 55%), linear-gradient(180deg, var(--color-ink-950) 0%, var(--color-ink-900) 100%)',
              }}
            >
              {/* Right edge fade — copy column melts into the video */}
              <div
                aria-hidden
                className="absolute inset-y-0 right-0 w-32 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to right, transparent, rgba(2,6,15,0.7))',
                }}
              />

              {/* Top row: brand eyebrow */}
              <div>
                {topEyebrow && (
                  <motion.p
                    style={{ opacity: eyebrowOpacity }}
                    className="text-[10px] xl:text-xs uppercase tracking-[0.32em] text-stone-300"
                  >
                    {topEyebrow}
                  </motion.p>
                )}
              </div>

              {/* Center row: vertically centered active panel */}
              <motion.div
                style={{ y: copyParallax }}
                className="relative flex items-center will-change-transform"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {showPanel && (
                    <ActivePanel
                      key={activeFrame}
                      kf={keyframes[activeFrame]!}
                      index={activeFrame}
                      isLast={activeFrame === keyframes.length - 1}
                      cta={cta}
                      variant="column"
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Bottom row: progress dots */}
              <ProgressDots
                count={keyframes.length}
                active={activeFrame}
                visible={showPanel}
                variant="horizontal"
              />
            </div>

            {/* Left-edge depth shadow on the video side */}
            <div
              aria-hidden
              className="absolute inset-y-0 left-[40%] w-40 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to right, rgba(2,6,15,0.7), transparent)',
              }}
            />

            {/* Bottom vignette on video side */}
            <div className="absolute inset-y-0 left-[40%] right-0 pointer-events-none bg-[linear-gradient(to_top,rgba(2,6,15,0.5)_0%,transparent_35%)]" />
          </div>
        )}

        {/* ─────────── Centered scroll affordance (top-level overlay) ─────────── */}
        <ScrollHint visible={!showPanel} light={isLight} />
      </div>
    </section>
    {debug && (
      <DebugOverlay
        progressMV={progressMV}
        videoRef={videoRef}
      />
    )}
    </>
  );
}

/* --- Video layer ---------------------------------------------------------- */

function VideoLayer({
  videoRef,
  videoSrc,
  videoReady,
  scale,
  yShift,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoSrc: string;
  videoReady: boolean;
  scale: MotionValue<number>;
  yShift: MotionValue<string>;
}) {
  return (
    <motion.div
      style={{ scale, y: yShift }}
      className="absolute inset-0 will-change-transform"
    >
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </motion.div>
  );
}

/* --- Scroll hint with subtle pulse --------------------------------------- */

/**
 * Centered, viewport-bottom scroll affordance shown on initial load. Pulsing
 * vertical bar above an uppercase 'Scroll' label, fades out the moment the
 * user starts scrolling (driven by the `visible` prop, which is wired to
 * `!showPanel`).
 */
function ScrollHint({ visible, light = false }: { visible: boolean; light?: boolean }) {
  return (
    <motion.div
      animate={{ opacity: visible ? 0.92 : 0, y: visible ? 0 : 8 }}
      transition={{ duration: 0.6, ease: EASE_PREMIUM }}
      className="absolute bottom-28 sm:bottom-24 md:bottom-14 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-none"
    >
      <motion.span
        animate={{ scaleY: [0.3, 1, 0.3] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95],
        }}
        className={cn(
          'block w-[2px] h-12 md:h-14 origin-top rounded-full',
          light ? 'bg-stone-700/60' : 'bg-stone-50/75',
        )}
        aria-hidden="true"
      />
      <span className={cn(
        'text-xs md:text-sm uppercase tracking-[0.42em]',
        light ? 'text-stone-700/80' : 'text-stone-100/90',
      )}>
        Scroll
      </span>
    </motion.div>
  );
}

/* --- Progress indicator -------------------------------------------------- */

function ProgressDots({
  count,
  active,
  visible,
  variant,
  light = false,
}: {
  count: number;
  active: number;
  visible: boolean;
  variant: 'horizontal' | 'vertical';
  light?: boolean;
}) {
  if (variant === 'horizontal') {
    return (
      <motion.div
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="mt-10 flex items-center gap-2.5"
      >
        {Array.from({ length: count }).map((_, i) => (
          <motion.span
            key={i}
            animate={{
              width: active === i ? 32 : 8,
              opacity: active === i ? 1 : 0.3,
            }}
            transition={{ duration: 0.55, ease: EASE_PREMIUM }}
            className={cn('block h-[2px] rounded-full', light ? 'bg-stone-700' : 'bg-stone-50')}
          />
        ))}
      </motion.div>
    );
  }
  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-3"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          animate={{
            scale: active === i ? 1.5 : 1,
            opacity: active === i ? 1 : 0.3,
          }}
          transition={{ duration: 0.5, ease: EASE_PREMIUM }}
          className={cn('block h-1.5 w-1.5 rounded-full', light ? 'bg-stone-700' : 'bg-stone-50')}
        />
      ))}
    </motion.div>
  );
}

/* --- Active keyframe panel: per-word mask reveals on title ---------------- */

function ActivePanel({
  kf,
  index,
  isLast,
  cta,
  variant,
}: {
  kf: AirwayHeroKeyframe;
  index: number;
  isLast: boolean;
  cta?: ReactNode;
  variant: 'overlay' | 'overlay-light' | 'column';
}) {
  const words = kf.title.split(/\s+/).filter(Boolean);
  const titleStartDelay = 0.18;
  const wordStagger = 0.085;
  const bodyDelay = titleStartDelay + words.length * wordStagger + 0.05;

  const titleSize =
    variant === 'column'
      ? 'text-[clamp(3rem,5.5vw,6rem)]'
      : 'text-[clamp(2.25rem,6vw,5.5rem)]';
  const bodySize =
    variant === 'column' ? 'text-base xl:text-lg' : 'text-lg md:text-xl';

  const isLight = variant === 'overlay-light';
  const titleColor = isLight ? 'text-stone-900' : 'text-stone-50';
  const bodyColor = isLight ? 'text-stone-700' : 'text-stone-200';

  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={{ initial: {}, enter: {}, exit: {} }}
      className={variant === 'column' ? 'w-full' : ''}
    >
      <h1
        className={`font-serif ${titleSize} leading-[0.95] tracking-tighter ${titleColor} font-light max-w-4xl`}
      >
        <span className="inline-flex flex-wrap gap-x-[0.28em]">
          {words.map((w, i) => (
            <MaskWord
              key={`${index}-${i}-${w}`}
              delay={titleStartDelay + i * wordStagger}
              italic={kf.italicize?.includes(i) ?? false}
              light={isLight}
            >
              {w}
            </MaskWord>
          ))}
        </span>
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
        transition={{ duration: 0.85, ease: EASE_PREMIUM, delay: bodyDelay }}
        className={`mt-6 max-w-xl ${bodyColor} ${bodySize} leading-relaxed`}
      >
        {kf.body}
      </motion.p>

      {cta && isLast && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: bodyDelay + 0.12 }}
          className="mt-8"
        >
          {cta}
        </motion.div>
      )}
    </motion.div>
  );
}

function MaskWord({
  children,
  delay,
  italic,
  light = false,
}: {
  children: ReactNode;
  delay: number;
  italic: boolean;
  light?: boolean;
}) {
  // clipPath allows italic glyphs to extend past the right edge of the word
  // box (italic leans right) while still clipping vertical for the slide-up.
  return (
    <span
      className="inline-block align-bottom"
      style={{ clipPath: 'inset(-0.05em -0.4em 0 -0.05em)' }}
    >
      <motion.span
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        exit={{ y: '-110%', transition: { duration: 0.35, ease: EASE_PREMIUM } }}
        transition={{ duration: 1.0, ease: EASE_PREMIUM, delay }}
        className={cn(
          'inline-block',
          italic ? 'italic font-extralight' : '',
          light ? 'text-stone-900' : '',
        )}
      >
        {children}
      </motion.span>
    </span>
  );
}

function RenderTitle({ title, italicize }: { title: string; italicize?: number[] }) {
  if (!italicize?.length) return <>{title}</>;
  const words = title.split(/\s+/);
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className={italicize.includes(i) ? 'italic font-extralight' : ''}>
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  );
}

/* --- Debug overlay -------------------------------------------------------- */

function DebugOverlay({
  progressMV,
  videoRef,
}: {
  progressMV: MotionValue<number>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);

  useMotionValueEvent(progressMV, 'change', (v) => {
    setProgress(v);
    if (videoRef.current && Number.isFinite(videoRef.current.duration)) {
      setTime(videoRef.current.currentTime);
    }
  });

  const activeFrame =
    progress < FRAME_A_END ? 'A' : progress < FRAME_B_END ? 'B' : 'C';
  const frameRange =
    activeFrame === 'A'
      ? '0.00–0.42'
      : activeFrame === 'B'
      ? '0.42–0.72'
      : '0.72–1.00';

  return (
    <div className="fixed bottom-4 right-4 z-[1000] bg-stone-900/90 text-stone-50 font-mono text-[11px] leading-tight px-3 py-2 rounded-md backdrop-blur-sm pointer-events-none select-none">
      <div>progress: {progress.toFixed(3)}</div>
      <div>time:     {time.toFixed(2)}s</div>
      <div>frame:    {activeFrame} ({frameRange})</div>
    </div>
  );
}
