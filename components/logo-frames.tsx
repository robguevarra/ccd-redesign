'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * Plays the practice mark morph for the homepage cold-open ("We do both").
 *
 * Uses the SAME high-res asset and technique as the header mark (LaneMark): the
 * 2500px ProRes master baked into a 6×5 grid sprite (`morph-sprite-3.png`,
 * 400px per frame), drawn as a raster `background-image` — NOT a CSS mask.
 *
 * Why this matters: the old version masked a 240px-per-frame strip, which a DPR-3
 * phone has to UPSCALE (120px × 3 = 360 device px > 240 source) → pixelated while
 * animating. A 400px source downscales on every display → crisp. Masks are also
 * softened by mobile browsers; rasters are not.
 *
 * `loop` ping-pongs dental → medical → dental forever (frame 0 = dental, 29 =
 * medical). Otherwise it plays once. `prefers-reduced-motion` holds frame 0.
 */

const SPRITE = '/logos/morph-sprite-3.png';
const FRAMES = 30;
const COLS = 6;
const ROWS = 5;
const DEFAULT_FPS = 16;

// Ping-pong 0→29→1 so the loop never pauses on the end frames before reversing.
function loopSequence(): number[] {
  const seq: number[] = [];
  for (let f = 0; f < FRAMES; f++) seq.push(f);
  for (let f = FRAMES - 2; f > 0; f--) seq.push(f);
  return seq;
}
const ONESHOT = Array.from({ length: FRAMES }, (_, i) => i);

interface LogoFramesProps {
  /** Square pixel size. Default 28. */
  size?: number;
  /** Loop continuously (ping-pong) instead of playing once. */
  loop?: boolean;
  /** Animation speed. Default 16fps. */
  fps?: number;
  /** Change this value to replay a one-shot (forces a remount). */
  playKey?: string | number;
  /** Accessible label. Omit to render decoratively (aria-hidden). */
  label?: string;
  /** Render the mark light (white) for dark backgrounds. */
  invert?: boolean;
  className?: string;
}

export function LogoFrames({
  size = 28,
  loop = false,
  fps = DEFAULT_FPS,
  playKey,
  label,
  invert = false,
  className,
}: LogoFramesProps) {
  const reduced = useReducedMotion();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (reduced) {
      setFrame(0);
      return;
    }
    const seq = loop ? loopSequence() : ONESHOT;
    let i = 0;
    const id = setInterval(() => {
      setFrame(seq[i]!);
      i += 1;
      if (i >= seq.length) {
        if (loop) i = 0;
        else clearInterval(id);
      }
    }, 1000 / fps);
    return () => clearInterval(id);
  }, [loop, fps, reduced, playKey]);

  const spriteSize = `calc(var(--lf-s) * ${COLS}) calc(var(--lf-s) * ${ROWS})`;
  const spritePos = `calc(var(--lf-s) * ${-(frame % COLS)}) calc(var(--lf-s) * ${-Math.floor(frame / COLS)})`;

  return (
    <span
      key={playKey}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('inline-block select-none', invert && 'invert', className)}
      style={{
        ['--lf-s' as string]: `${size}px`,
        width: 'var(--lf-s)',
        height: 'var(--lf-s)',
        backgroundImage: `url(${SPRITE})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: spriteSize,
        backgroundPosition: spritePos,
      }}
    />
  );
}
