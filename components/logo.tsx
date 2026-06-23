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

const FLIP_TRANSITION = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
};

/**
 * Comfort Care practice mark. Two transparent PNG assets — `public/logos/dental-3.png`
 * (used for neutral + dental lanes) and `public/logos/medical-4.png` (used for
 * the medical lane). The swap animates as a Y-axis coin flip: the outgoing
 * mark rotates 90° forward and fades, while the new one rotates 90° in from
 * the back and fades up. Combined effect reads like a coin face turning
 * around to reveal the other side.
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
  const src = isMedical ? '/logos/medical-4.png' : '/logos/dental-3.png';

  return (
    <span
      className={cn('relative inline-block select-none', className)}
      style={{ width: size, height: size, perspective: 600 }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={isMedical ? 'medical' : 'dental'}
          initial={reduced ? { opacity: 0 } : { rotateY: -180, opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { rotateY: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { rotateY: 180, opacity: 0 }}
          transition={reduced ? { duration: 0 } : FLIP_TRANSITION}
          className="absolute inset-0"
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', willChange: 'transform, opacity' }}
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
