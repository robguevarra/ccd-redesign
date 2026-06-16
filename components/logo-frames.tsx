'use client';

import type { CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * Plays the practice's real logo animation — the 29 frames of the supplied
 * `animationSample.mp4` (moon "coming alive": a face profile + star emerge and
 * recede with the tooth present throughout, looping back to the start).
 *
 * The frames are baked into a transparent horizontal sprite sheet
 * (`public/logos/morph-sprite.png`, 29×160px) and revealed with a CSS mask, so
 * the mark is transparent AND painted in `currentColor` (themes on any
 * background). A `steps(29)` animation walks the mask across the strip.
 *
 * `loop` runs it forever (homepage hero). Otherwise it plays once — change
 * `playKey` to replay (the element remounts). Honors `prefers-reduced-motion`
 * by holding the first frame.
 */

const SPRITE = '/logos/morph-sprite.png';
const FRAMES = 29;
const DURATION_S = 2.9; // 29 frames @ 10fps, matching the source mp4

interface LogoFramesProps {
  /** Square pixel size. Default 28. */
  size?: number;
  /** Loop continuously instead of playing once. */
  loop?: boolean;
  /** Change this value to replay a one-shot (forces a remount). */
  playKey?: string | number;
  /** Accessible label. Omit to render decoratively (aria-hidden). */
  label?: string;
  className?: string;
}

export function LogoFrames({
  size = 28,
  loop = false,
  playKey,
  label,
  className,
}: LogoFramesProps) {
  const reduced = useReducedMotion();
  const maskValue = `url(${SPRITE})`;
  const maskSize = `calc(var(--lf-s) * ${FRAMES}) var(--lf-s)`;

  const style: CSSProperties = {
    // custom prop consumed by the @keyframes (see globals.css)
    ['--lf-s' as string]: `${size}px`,
    width: 'var(--lf-s)',
    height: 'var(--lf-s)',
    backgroundColor: 'currentColor',
    WebkitMaskImage: maskValue,
    maskImage: maskValue,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: maskSize,
    maskSize: maskSize,
    WebkitMaskPosition: '0 0',
    maskPosition: '0 0',
    animation: reduced
      ? undefined
      : `logo-frames ${DURATION_S}s steps(${FRAMES}) ${loop ? 'infinite' : '1 both'}`,
  };

  return (
    <span
      key={playKey}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('inline-block select-none', className)}
      style={style}
    />
  );
}
