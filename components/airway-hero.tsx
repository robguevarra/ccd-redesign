'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';

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
}

const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

// ─────── Scroll narrative — earned, not given ──────────────────────────
//   0.00 → 0.15  Reveal zone — overlay fades, no caption yet
//   0.15 → 0.42  Frame A — "Sleep apnea is treatable"
//   0.42 → 0.72  Frame B — "And often, it's dental"
//   0.72 → 1.00  Frame C — "We solve this..."
const REVEAL_END = 0.15;
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
}: AirwayHeroProps) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeFrame, setActiveFrame] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
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

        // Reveal zone: video locked at 0. After: linear scrub.
        let targetTime = 0;
        if (Number.isFinite(video.duration) && video.duration > 0) {
          const videoProgress =
            progress < REVEAL_END
              ? 0
              : (progress - REVEAL_END) / (1 - REVEAL_END);
          targetTime = videoProgress * video.duration;
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
  }, [reduced, progressMV]);

  // ─────── Reduced-motion fallback ───────
  if (reduced) {
    return (
      <section className="relative bg-ink-950 text-stone-50 py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          {topEyebrow && (
            <p className="text-xs uppercase tracking-[0.24em] text-stone-300 mb-6">
              {topEyebrow}
            </p>
          )}
          <div className="font-serif text-[clamp(2.75rem,8vw,7rem)] leading-[0.92] tracking-tighter font-light mb-12">
            {fallbackHeading}
          </div>
          <div className="grid gap-12 md:gap-16 mt-16">
            {keyframes.map((kf, i) => (
              <div key={i} className="border-t border-ink-700 pt-8">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-400 mb-4">
                  {kf.eyebrow} · 0{i + 1} of 03
                </p>
                <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] tracking-tight font-light mb-4">
                  <RenderTitle title={kf.title} italicize={kf.italicize} />
                </h2>
                <p className="text-stone-300 text-lg leading-relaxed max-w-2xl">
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

  // ─────── Pinned scroll-scrubbed video hero ───────
  return (
    <section
      ref={sectionRef}
      className="relative isolate bg-ink-950 text-stone-50 -mt-20"
      style={{ height: `${heightVh * 100}svh` }}
      aria-label={ariaLabel}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ─────────── Single shared video element ─────────── */}
        {/* On mobile: full-bleed. On desktop: shifted right so the left 40% sits
            behind the opaque copy column (cleaner than two videos). */}
        <motion.div
          style={isLg ? { scale, y: yShift } : undefined}
          className={`absolute inset-0 lg:left-[40%] xl:left-[40%] ${
            isLg ? 'will-change-transform' : ''
          }`}
        >
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

        {/* Atmospheric darkening overlay over the video region */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 lg:left-[40%] xl:left-[40%] bg-ink-950 pointer-events-none"
        />

        {/* ─────────── Mobile / tablet UI overlay ─────────── */}
        <div className="lg:hidden absolute inset-0 pointer-events-none">
          {/* Bottom vignette for type readability */}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(2,6,15,0.85)_0%,rgba(2,6,15,0.35)_45%,rgba(2,6,15,0.0)_70%)]" />

          {topEyebrow && (
            <motion.div
              style={{ opacity: eyebrowOpacity }}
              className="absolute top-20 left-1/2 -translate-x-1/2 max-w-[90vw] text-center text-[9px] uppercase tracking-[0.24em] text-stone-300"
            >
              {topEyebrow}
            </motion.div>
          )}

          <div className="absolute inset-x-0 bottom-0 px-5 pb-12 pointer-events-auto">
            <div className="mx-auto max-w-7xl w-full relative min-h-[40svh]">
              <AnimatePresence mode="wait" initial={false}>
                {showPanel && (
                  <ActivePanel
                    key={activeFrame}
                    kf={keyframes[activeFrame]!}
                    index={activeFrame}
                    isLast={activeFrame === keyframes.length - 1}
                    cta={cta}
                    variant="overlay"
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
          />
        </div>

        {/* ─────────── Desktop UI overlay: opaque left copy column ─────────── */}
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

        {/* ─────────── Centered scroll affordance (top-level overlay) ─────────── */}
        <ScrollHint visible={!showPanel} />
      </div>
    </section>
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
function ScrollHint({ visible }: { visible: boolean }) {
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
        className="block w-[2px] h-12 md:h-14 bg-stone-50/75 origin-top rounded-full"
        aria-hidden="true"
      />
      <span className="text-xs md:text-sm uppercase tracking-[0.42em] text-stone-100/90">
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
}: {
  count: number;
  active: number;
  visible: boolean;
  variant: 'horizontal' | 'vertical';
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
            className="block h-[2px] rounded-full bg-stone-50"
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
          className="block h-1.5 w-1.5 rounded-full bg-stone-50"
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
  variant: 'overlay' | 'column';
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

  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={{ initial: {}, enter: {}, exit: {} }}
      className={variant === 'column' ? 'w-full' : ''}
    >
      <h1
        className={`font-serif ${titleSize} leading-[0.95] tracking-tighter text-stone-50 font-light max-w-4xl`}
      >
        <span className="inline-flex flex-wrap gap-x-[0.28em]">
          {words.map((w, i) => (
            <MaskWord
              key={`${index}-${i}-${w}`}
              delay={titleStartDelay + i * wordStagger}
              italic={kf.italicize?.includes(i) ?? false}
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
        className={`mt-6 max-w-xl text-stone-200 ${bodySize} leading-relaxed`}
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
}: {
  children: ReactNode;
  delay: number;
  italic: boolean;
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
        className={`inline-block ${italic ? 'italic font-extralight' : ''}`}
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
