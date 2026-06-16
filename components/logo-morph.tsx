'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import {
  LOGO_VIEWBOX,
  DENTAL_MARK_PATH,
  MEDICAL_MARK_PATH,
} from '@/content/logo-marks';

type Mark = 'dental' | 'medical';

interface LogoMorphProps {
  /** Square pixel size. Default 28. */
  size?: number;
  /**
   * Target mark to show. When this prop changes the component crossfades to it
   * (the one-shot "morph on toggle" behavior). Ignored when `loop` is set.
   */
  lane?: Mark;
  /** Continuously ping-pong between the two marks (homepage hero use). */
  loop?: boolean;
  /** Seconds for one morph. Default 0.7. */
  duration?: number;
  /** Seconds to hold each mark before morphing again, in loop mode. Default 1.6. */
  loopHold?: number;
  /** Accessible label. Omit to render the mark as decorative (aria-hidden). */
  label?: string;
  className?: string;
}

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

/**
 * Animated Comfort Care practice mark. Both traced marks share a 1400×1400
 * viewBox with the moon in the same place, so crossfading between them reads as
 * "the moon stays while the inner content morphs" — tooth (dental) ⇄ star +
 * face profile (medical). The outgoing mark fades + eases back slightly while
 * the incoming one fades + settles forward, giving the dissolve some depth.
 *
 * The crossfade is plain CSS (opacity + transform transitions) so it tracks the
 * `lane` prop deterministically on every re-render, including client-side route
 * changes. Drawn with `currentColor`, so the parent controls the color (works
 * on light and dark surfaces). Honors `prefers-reduced-motion` by snapping.
 * See the 2026-06-16 logo/animation decision-log entry.
 */
export function LogoMorph({
  size = 28,
  lane = 'dental',
  loop = false,
  duration = 0.7,
  loopHold = 1.6,
  label,
  className,
}: LogoMorphProps) {
  const reduced = useReducedMotion();
  const [loopMark, setLoopMark] = useState<Mark>('dental');

  // Loop mode: flip the target on an interval (hold + morph per cycle).
  useEffect(() => {
    if (!loop || reduced) return;
    const period = (loopHold + duration) * 1000;
    const id = setInterval(
      () => setLoopMark((m) => (m === 'dental' ? 'medical' : 'dental')),
      period,
    );
    return () => clearInterval(id);
  }, [loop, reduced, loopHold, duration]);

  const target: Mark = loop ? loopMark : lane;
  const transition = reduced
    ? undefined
    : `opacity ${duration}s ${EASE}, transform ${duration}s ${EASE}`;

  const marks: { key: Mark; d: string }[] = [
    { key: 'dental', d: DENTAL_MARK_PATH },
    { key: 'medical', d: MEDICAL_MARK_PATH },
  ];

  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      width={size}
      height={size}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('inline-block select-none', className)}
    >
      {marks.map(({ key, d }) => {
        const active = key === target;
        return (
          <path
            key={key}
            d={d}
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            style={{
              opacity: active ? 1 : 0,
              transform: reduced || active ? 'scale(1)' : 'scale(0.96)',
              transformBox: 'view-box',
              transformOrigin: 'center',
              transition,
            }}
          />
        );
      })}
    </svg>
  );
}
