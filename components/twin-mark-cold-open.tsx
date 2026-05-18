'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { Logo } from './logo';

interface ColdOpenHalf {
  lane: 'dental' | 'medical';
  href: string;
  eyebrow: string;
  /** Provisional copy per spec §2.1; revise before pitch. */
  title: { lead: string; emphasis: string };
  cta: string;
  /** Placeholder photo until real photography lands. */
  photo: { src: string; alt: string };
}

const HALVES: readonly [ColdOpenHalf, ColdOpenHalf] = [
  {
    lane: 'dental',
    href: '/dental',
    eyebrow: 'FAMILY · RESTORATIVE · COSMETIC',
    title: {
      lead: 'For the family you bring back',
      emphasis: 'every six months.',
    },
    cta: 'Enter dental',
    photo: {
      src: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1200&q=75&auto=format',
      alt: '',
    },
  },
  {
    lane: 'medical',
    href: '/medical',
    eyebrow: 'OROFACIAL PAIN · ORAL MEDICINE',
    title: {
      lead: 'For pain everyone told you was',
      emphasis: 'permanent.',
    },
    cta: 'Enter medical',
    photo: {
      src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=75&auto=format',
      alt: '',
    },
  },
];

/**
 * Frame 0 cold open — the first 100svh on /. Editorial diptych showing both
 * practices, both logos, both CTAs above the fold. Sits above the AirwayHero.
 *
 * Desktop: two halves side-by-side, separated by a 1px hairline divider.
 * Mobile: vertical stack.
 *
 * Each half is a clickable Link to /dental or /medical. CTAs are also
 * tappable separately for clarity. Photos lazy-load with LQIP blur.
 *
 * Micro-interactions (all gated behind prefers-reduced-motion):
 *   1. Stagger entry — logo+eyebrow+title fade-up at 0ms and 200ms per half
 *   2. CTA fade-up — delayed 300ms beyond the half's title entry
 *   3. Hairline divider draw — scaleY/scaleX 0→1 on mount (500ms, ease-out)
 *   4. Hover lift — scale(1.015) via motion-safe Tailwind variant
 *   5. Grayscale photo to color on hover (CSS transition, 700ms)
 *   6. CTA underline slides in on hover (CSS transform scaleX 0→1)
 *   7. Scroll-cue pulse (CSS keyframe, see globals.css)
 *
 * See: docs/superpowers/specs/2026-05-16-dentisthsu-dual-identity-system.md §2.1
 */
export function TwinMarkColdOpen() {
  const reduced = useReducedMotion();

  const fadeUp = reduced
    ? {
        initial: false as const,
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      aria-label="Comfort Care Dental — two practices, one roof"
      className="relative min-h-[100svh] grid grid-cols-1 md:grid-cols-2"
    >
      {HALVES.map((half, i) => (
        <Link
          key={half.lane}
          href={half.href}
          data-lane={half.lane}
          className={cn(
            'group relative flex flex-col justify-between p-5 md:p-14 min-h-[44svh] md:min-h-[100svh] overflow-hidden',
            'transition-transform duration-300 ease-out motion-safe:hover:scale-[1.015] motion-safe:focus-within:scale-[1.015]',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-8px]',
            half.lane === 'dental'
              ? 'bg-stone-100 text-stone-900 focus-visible:outline-stone-900'
              : 'bg-[var(--color-ink-teal)] text-stone-50 focus-visible:outline-stone-50',
            // Hairline divider: top border on second half (mobile only).
            i === 0
              ? ''
              : 'border-t md:border-t-0 border-stone-300/20',
          )}
        >
          {/* Top: logo + eyebrow + title */}
          <motion.div
            className="relative z-10"
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ ...fadeUp.transition, delay: reduced ? 0 : i * 0.2 }}
          >
            <Logo lane={half.lane} size={48} mobileSize={32} decorative />
            <p className="mt-6 text-[10px] tracking-[0.24em] uppercase opacity-75">
              {half.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-2xl md:text-5xl leading-[1.05] tracking-tight max-w-[18ch]">
              {half.title.lead}{' '}
              <span className="italic font-light">{half.title.emphasis}</span>
            </h2>
          </motion.div>

          {/* Middle: editorial photo */}
          <div className="relative my-4 md:my-12 h-24 md:h-auto md:flex-1 aspect-auto md:aspect-auto overflow-hidden bg-stone-200/30">
            <Image
              src={half.photo.src}
              alt={half.photo.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
              priority={i === 0}
            />
          </div>

          {/* Bottom: CTA */}
          <motion.div
            className="relative z-10"
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ ...fadeUp.transition, delay: reduced ? 0 : i * 0.2 + 0.3 }}
          >
            <span
              className={cn(
                'inline-flex items-center gap-2 text-sm md:text-base font-medium',
                'relative after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px',
                'after:origin-left after:scale-x-0 after:bg-current group-hover:after:scale-x-100',
                'after:transition-transform after:duration-300',
              )}
            >
              {half.cta}
              <ArrowRight
                className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </span>
          </motion.div>
        </Link>
      ))}

      {/* Hairline divider — draws on entry. Vertical on md+, horizontal below md. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute z-[1] bg-stone-300/40 hidden md:block md:left-1/2 md:top-0 md:bottom-0 md:w-px"
        style={{ transformOrigin: 'center' }}
        initial={reduced ? false : { scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.4, ease: 'easeOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute z-[1] bg-stone-300/40 md:hidden left-0 right-0 top-1/2 h-px"
        style={{ transformOrigin: 'center' }}
        initial={reduced ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.4, ease: 'easeOut' }}
      />

      {/* Scroll cue — centered at bottom, only on desktop where both halves
          can share it. Pulses opacity; hidden under reduced-motion via CSS. */}
      <div
        aria-hidden="true"
        className="hidden md:flex absolute inset-x-0 bottom-6 justify-center pointer-events-none"
      >
        <div className="cold-open-scroll-cue h-8 w-px bg-stone-400/50" />
      </div>
    </section>
  );
}
