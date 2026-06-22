'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * Header practice mark. At rest it shows the crisp 512px PNG (sharp on every
 * display); during a dental⇄medical change it plays the real morph frames (a
 * high-res sprite sheet rendered from the 2500px ProRes master, Comp 1.mov) so
 * the tooth/face transition animates, then settles back to the crisp PNG.
 *
 * The sprite is one-directional (frame 0 = dental, frame 29 = medical), so:
 *   dental → medical : frames 0 → 29   (face + star emerge)
 *   medical → dental : frames 29 → 0   (the same clip, played in reverse)
 *
 * The morph is painted via a CSS mask in `currentColor`; the rest image is a
 * real <Image> (browser image scaling = no mask-downscaling jaggies). Honors
 * prefers-reduced-motion by snapping straight to the destination.
 */

const SPRITE = '/logos/morph-sprite-2.png';
const REST_PNG: Record<'dental' | 'medical', string> = {
  dental: '/logos/dental.png',
  medical: '/logos/medical-2.png',
};
const FRAMES = 30;
// The sprite is a COLS×ROWS grid (kept small in both dimensions so it stays
// under mobile GPU texture limits — a 12000px-wide single row would not).
const COLS = 6;
const ROWS = 5;
const FPS = 20; // 30 frames over ~1.5s
const DENTAL_FRAME = 0;
const MEDICAL_FRAME = FRAMES - 1;

interface LaneMarkProps {
  lane: 'dental' | 'medical';
  /** Square pixel size. Default 28. */
  size?: number;
  /** Render the mark light (white) for dark backgrounds. */
  invert?: boolean;
  className?: string;
}

function sequence(toMedical: boolean): number[] {
  const seq: number[] = [];
  if (toMedical) {
    for (let f = 0; f < FRAMES; f++) seq.push(f); // 0 → 29
  } else {
    for (let f = FRAMES - 1; f >= 0; f--) seq.push(f); // 29 → 0 (reverse)
  }
  return seq;
}

export function LaneMark({
  lane,
  size = 28,
  invert = false,
  className,
}: LaneMarkProps) {
  const reduced = useReducedMotion();
  const restFrame = lane === 'medical' ? MEDICAL_FRAME : DENTAL_FRAME;
  const [frame, setFrame] = useState(restFrame);
  const [animating, setAnimating] = useState(false);
  // The lane whose crisp rest PNG is shown. It lags `lane` through a morph so
  // the destination mark never flashes for a frame before the animation plays
  // — the rest image stays on the origin mark until the morph actually lands.
  const [settledLane, setSettledLane] = useState(lane);
  const prevLane = useRef(lane);

  useEffect(() => {
    if (prevLane.current === lane) return; // initial mount: stay at rest
    prevLane.current = lane;
    if (reduced) {
      setFrame(restFrame);
      setSettledLane(lane);
      setAnimating(false);
      return;
    }
    const seq = sequence(lane === 'medical');
    let i = 0;
    setAnimating(true);
    const id = setInterval(() => {
      setFrame(seq[i]!);
      i += 1;
      if (i >= seq.length) {
        clearInterval(id);
        setAnimating(false);
        setSettledLane(lane); // only now swap the rest PNG to the destination
      }
    }, 1000 / FPS);
    return () => clearInterval(id);
  }, [lane, reduced, restFrame]);

  const maskSize = `calc(var(--lf-s) * ${COLS}) calc(var(--lf-s) * ${ROWS})`;
  const maskPos = `calc(var(--lf-s) * ${-(frame % COLS)}) calc(var(--lf-s) * ${-Math.floor(frame / COLS)})`;

  return (
    <span
      aria-hidden="true"
      className={cn('relative inline-block select-none', className)}
      style={{
        ['--lf-s' as string]: `${size}px`,
        width: 'var(--lf-s)',
        height: 'var(--lf-s)',
      }}
    >
      {/* Crisp resting mark (hidden while the morph plays). Uses settledLane
          so it never flashes the destination before the morph runs. */}
      <Image
        src={REST_PNG[settledLane]}
        alt=""
        width={size}
        height={size}
        priority
        className={cn(invert && 'invert')}
        style={{
          width: 'var(--lf-s)',
          height: 'var(--lf-s)',
          opacity: animating ? 0 : 1,
        }}
      />
      {/* Morph frames — only mounted during a lane change. */}
      {animating && (
        <span
          className="absolute inset-0"
          style={{
            backgroundColor: 'currentColor',
            WebkitMaskImage: `url(${SPRITE})`,
            maskImage: `url(${SPRITE})`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: maskSize,
            maskSize: maskSize,
            WebkitMaskPosition: maskPos,
            maskPosition: maskPos,
          }}
        />
      )}
    </span>
  );
}
