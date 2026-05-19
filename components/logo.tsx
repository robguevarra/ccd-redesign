'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Lane } from '@/lib/lane';
import { cn } from '@/lib/cn';

interface LogoProps {
  /** Pixel size — applied to both width and height (logo is square). Default 28. */
  size?: number;
  /** Mobile size (≤640px). Default 24. */
  mobileSize?: number;
  className?: string;
  /** When true, the logo is decorative beside a wordmark — alt is empty. */
  decorative?: boolean;
  /**
   * Which practice mark to render. Defaults to 'neutral' = the dental mark.
   * 'medical' renders the medical SVG. The swap animates as a cross-fade +
   * subtle scale via Framer Motion.
   */
  lane?: Lane;
}

const MORPH_TRANSITION = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as const,
};

/**
 * Comfort Care practice mark. Two real SVG assets — `public/logos/dental.svg`
 * (used for neutral + dental lanes) and `public/logos/medical.svg` (used for
 * the medical lane). The swap animates as a cross-fade + subtle scale; the
 * `key` on the inner motion.span drives Framer's enter/exit.
 *
 * See: docs/superpowers/specs/2026-05-16-dentisthsu-dual-identity-system.md §2.3
 */
export function Logo({
  size = 28,
  mobileSize = 24,
  className,
  decorative = false,
  lane = 'neutral',
}: LogoProps) {
  const reduced = useReducedMotion();
  const isMedical = lane === 'medical';
  const src = isMedical ? '/logos/medical.svg' : '/logos/dental.svg';

  return (
    <span
      className={cn('relative inline-block select-none', className)}
      style={{ width: size, height: size }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={isMedical ? 'medical' : 'dental'}
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
          transition={reduced ? { duration: 0 } : MORPH_TRANSITION}
          className="absolute inset-0"
        >
          <Image
            src={src}
            alt={decorative ? '' : `Comfort Care ${isMedical ? 'Medical' : 'Dental'}`}
            width={size}
            height={size}
            sizes={`(max-width: 640px) ${mobileSize}px, ${size}px`}
            style={{ width: size, height: size }}
            className="inline-block"
            priority
          />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
