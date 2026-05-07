'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface Panel {
  eyebrow: string;
  title: string;
  /** Word indices to italicize. Title is split on whitespace. */
  italicize: number[];
  body: string;
  cta: string;
  href: string;
}

const PANELS: Panel[] = [
  {
    eyebrow: 'Why patients stay',
    title: 'The gentle dentist, still.',
    italicize: [3],
    body: 'Twenty-five years on Kenyon Way. Dr. Brien Hsu earned the nickname his second year in practice, and a generation of Rancho Cucamonga families has stayed with him since. The office grew around them, never the other way around.',
    cta: 'The story so far',
    href: '/about',
  },
  {
    eyebrow: 'How we work',
    title: 'Conservative, by design.',
    italicize: [2],
    body: "We choose the least invasive treatment that works. Splint therapy before surgery for TMJ. Composite before crowns when the tooth allows it. Watching a small lesion before biopsying it. We don't intervene unless intervention is the right call — and when it is, we do the work well, with the equipment to back it up.",
    cta: 'See our technology',
    href: '/technology',
  },
  {
    eyebrow: 'Who we serve',
    title: 'Same office, same family.',
    italicize: [2, 3],
    body: 'Long tenure means we remember your case, your kids, and how your bite has changed since 2007. We treat the children of the people we first treated thirty years ago — alongside a board-certified oral surgeon, a board-certified endodontist, and two family dentists who know your name. Continuity by design, not by accident.',
    cta: 'Meet the team',
    href: '/doctors',
  },
];

const HEIGHT_VH = 3; // 300svh: enough scroll budget to translate from panel 1 → panel 3

function RenderTitle({
  title,
  italicize,
}: {
  title: string;
  italicize: number[];
}) {
  const words = title.split(/\s+/);
  return (
    <>
      {words.map((w, i) => (
        <span
          key={i}
          className={
            italicize.includes(i) ? 'italic font-extralight' : undefined
          }
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  );
}

/**
 * Pinned horizontal scroll section. The outer wrapper is 300svh tall;
 * the inner pinned content stays anchored to the top of the viewport
 * while the user scrolls. Vertical scroll progress translates the panel
 * row horizontally — panel 1 → 2 → 3 — and once progress reaches 1,
 * normal vertical scroll resumes for the next section. Same scroll-jack
 * pattern as the AirwayHero, including the manual rAF read of
 * getBoundingClientRect that bypasses Lenis's event coalescing.
 *
 * Reduced-motion fallback: stack the three panels vertically with no
 * pinning, no horizontal translation, native scroll behavior.
 */
export function WhyPatientsStay() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const progress = useMotionValue(0);

  // Show 3 panels side by side; translate the row to center each in turn.
  // At progress 0   we show panel 1 (x = 0)
  // At progress 0.5 we show panel 2 (x = -100vw)
  // At progress 1   we show panel 3 (x = -200vw)
  // Total row width = 300vw, total translation = -200vw = -66.667%.
  const x = useTransform(progress, [0, 1], ['0%', '-66.6667%']);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    // Scroll-end snap state: when progress stops changing for ~150ms while
    // the user is mid-section, smoothly pull to the nearest panel boundary
    // (0, 0.5, or 1). Mirrors Apple/Stripe's "magnet" feel without fighting
    // active scroll input.
    const SNAP_POINTS = [0, 0.5, 1] as const;
    const STABLE_FRAMES = 10; // ~167ms at 60fps
    const NEAR_TOLERANCE = 0.02; // already snapped
    let lastProgress = -1;
    let stable = 0;
    let snapping = false;

    const snapTo = (p: number) => {
      const nearest = SNAP_POINTS.reduce((a, b) =>
        Math.abs(b - p) < Math.abs(a - p) ? b : a,
      );
      if (Math.abs(nearest - p) < NEAR_TOLERANCE) return;

      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;

      const sectionTopAbsolute = rect.top + window.scrollY;
      const targetY = sectionTopAbsolute + total * nearest;

      snapping = true;
      const lenis = window.__lenis;
      if (lenis?.scrollTo) {
        lenis.scrollTo(targetY, {
          duration: 0.7,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          onComplete: () => {
            snapping = false;
          },
        });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
        // Fallback: assume snap completes in roughly 700ms.
        setTimeout(() => {
          snapping = false;
        }, 800);
      }
    };

    let raf = 0;
    const tick = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total > 0) {
        const p = Math.max(0, Math.min(1, -rect.top / total));
        progress.set(p);

        const idx = p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2;
        setActive(idx);

        // Only snap when fully inside the pinned section (not at the very
        // top approaching it, not past the bottom leaving it).
        const insidePinned = rect.top <= 0 && rect.top >= -total;

        if (!snapping && insidePinned) {
          if (Math.abs(p - lastProgress) < 0.0005) {
            stable++;
            if (stable === STABLE_FRAMES) {
              snapTo(p);
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
    return () => cancelAnimationFrame(raf);
  }, [reduced, progress]);

  // ─────── Reduced-motion fallback: stacked vertical panels ───────
  if (reduced) {
    return (
      <section className="bg-stone-50 border-y border-[var(--color-accent-200)]">
        {PANELS.map((panel, i) => (
          <article
            key={panel.title}
            className="mx-auto max-w-5xl px-5 md:px-8 py-24 md:py-32 border-t border-stone-200 first:border-t-0"
          >
            <div className="flex items-start justify-between mb-8">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent-600)]">
                {panel.eyebrow}
              </p>
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-stone-400">
                {String(i + 1).padStart(2, '0')} / {String(PANELS.length).padStart(2, '0')}
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl tracking-tighter text-stone-900 leading-[0.95] font-light max-w-4xl">
              <RenderTitle title={panel.title} italicize={panel.italicize} />
            </h2>
            <p className="mt-8 max-w-3xl text-stone-700 text-lg md:text-xl leading-relaxed">
              {panel.body}
            </p>
            <Link
              href={panel.href}
              className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-[var(--color-accent-600)] hover:text-[var(--color-accent-900)] transition-colors"
            >
              {panel.cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>
        ))}
      </section>
    );
  }

  // ─────── Pinned scroll-driven horizontal panel row ───────
  return (
    <section
      ref={sectionRef}
      className="relative bg-stone-50 border-y border-[var(--color-accent-200)]"
      style={{ height: `${HEIGHT_VH * 100}svh` }}
      aria-label="Why patients stay — three reasons"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        <motion.ol
          style={{ x }}
          className="flex w-[300vw] will-change-transform"
        >
          {PANELS.map((panel, i) => (
            <li
              key={panel.title}
              className="w-screen shrink-0 h-full flex items-center"
            >
              <article className="mx-auto max-w-5xl w-full px-5 md:px-8">
                <div className="flex items-start justify-between mb-10 md:mb-14">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent-600)]">
                    {panel.eyebrow}
                  </p>
                  <span className="font-mono text-xs uppercase tracking-[0.24em] text-stone-400">
                    {String(i + 1).padStart(2, '0')} /{' '}
                    {String(PANELS.length).padStart(2, '0')}
                  </span>
                </div>
                <h2 className="font-serif text-[clamp(2.5rem,7vw,7rem)] tracking-tighter text-stone-900 leading-[0.92] font-light max-w-4xl">
                  <RenderTitle title={panel.title} italicize={panel.italicize} />
                </h2>
                <p className="mt-10 md:mt-14 max-w-3xl text-stone-700 text-lg md:text-2xl leading-relaxed font-light">
                  {panel.body}
                </p>
                <Link
                  href={panel.href}
                  className="inline-flex items-center gap-2 mt-8 md:mt-12 text-sm font-medium text-[var(--color-accent-600)] hover:text-[var(--color-accent-900)] transition-colors"
                >
                  {panel.cta}{' '}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            </li>
          ))}
        </motion.ol>

        {/* ─── Progress dots (always visible while pinned) ─── */}
        <div className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none">
          {PANELS.map((_, i) => (
            <motion.span
              key={i}
              animate={{
                width: active === i ? 32 : 8,
                opacity: active === i ? 1 : 0.4,
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="block h-[2px] rounded-full bg-[var(--color-accent-600)]"
            />
          ))}
        </div>

        {/* ─── First-panel scroll affordance ─── */}
        <motion.div
          animate={{ opacity: active === 0 ? 0.7 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-10 right-5 md:right-12 hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-stone-500 pointer-events-none"
        >
          <span>Keep scrolling</span>
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </motion.div>
        <motion.div
          animate={{ opacity: active === 0 ? 0.6 : 0 }}
          transition={{ duration: 0.4 }}
          className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-stone-500 pointer-events-none"
        >
          <ChevronDown className="h-5 w-5 motion-safe:animate-bounce" aria-hidden="true" />
          <p className="text-[10px] uppercase tracking-[0.32em]">Keep scrolling</p>
        </motion.div>
      </div>
    </section>
  );
}
