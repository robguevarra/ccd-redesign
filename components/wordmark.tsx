'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Lane } from '@/lib/lane';
import { cn } from '@/lib/cn';

interface WordmarkProps {
  className?: string;
  variant?: 'light' | 'dark';
  /**
   * Which brand identity to render. Defaults to 'neutral' = the practice
   * brand ("Comfort Care Dental"). Medical lane swaps to the doctor's
   * professional credentials ("Brien Hsu, DDS MS & Associates"), which is
   * the legal entity for the medical side of the practice.
   */
  lane?: Lane;
}

const TRANSITION = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

/**
 * Lane-aware brand wordmark. Renders one of two identities and cross-fades
 * between them when the lane changes — driven by AnimatePresence keyed on
 * the lane string.
 *
 *   neutral / dental  →  "Comfort Care Dental"
 *   medical           →  "Brien Hsu, DDS MS & Associates"
 *
 * Composed in HTML + Tailwind (not SVG text) so the layout adapts naturally
 * to variable string widths. Uses the Fraunces serif via --font-serif.
 */
export function Wordmark({
  className,
  variant = 'light',
  lane = 'neutral',
}: WordmarkProps) {
  const reduced = useReducedMotion();
  const isMedical = lane === 'medical';
  const color = variant === 'light' ? 'text-current' : 'text-stone-50';

  return (
    <span
      aria-label={isMedical ? 'Brien Hsu, DDS, MS & Associates' : 'Comfort Care Dental'}
      className={cn(
        'relative inline-block font-serif whitespace-nowrap leading-none',
        color,
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={isMedical ? 'medical' : 'dental'}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={reduced ? { duration: 0 } : TRANSITION}
          className="inline-flex items-baseline gap-[0.22em] tracking-[-0.02em]"
        >
          {isMedical ? (
            <>
              {/* Whole name carries equal weight — client asked that "Hsu" not
                  render lighter than "Brien". */}
              <span className="font-normal text-[18px] md:text-[21px]">Brien</span>
              <span className="font-normal text-[18px] md:text-[21px]">Hsu,</span>
              <span className="font-normal text-[11px] md:text-[12px] tracking-[0.06em] uppercase opacity-80">
                DDS, MS &amp; Associates
              </span>
            </>
          ) : (
            <>
              <span className="font-normal text-[22px] md:text-[26px]">Comfort</span>
              <span className="font-light italic text-[22px] md:text-[26px]">Care</span>
              <span className="font-normal text-[22px] md:text-[26px]">Dental</span>
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
