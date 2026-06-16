'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * Header practice mark, driven by the real animation frames (the transparent
 * sprite from animationSample.mp4 — see <LogoFrames>). The clip cycles between
 * a dental state (frame 0, tooth) and a medical state (frame ~14, star + face),
 * so the Dental⇄Medical toggle plays the actual frames *between those two
 * points* and stops on the destination frame — a real cut of the clip, not a
 * crossfade or a play-then-snap.
 *
 *   dental → medical : frames 0 → 14   (face + star emerge)
 *   medical → dental : frames 14 → 28  (recede; 28 == the dental frame)
 *
 * Painted via a CSS mask in `currentColor` (transparent, themes on any
 * background). Honors prefers-reduced-motion by snapping to the rest frame.
 */

const SPRITE = '/logos/morph-sprite.png';
const FRAMES = 29;
const FPS = 10; // matches the source clip
const DENTAL_FRAME = 0;
const MEDICAL_FRAME = 14;

interface LaneMarkProps {
  lane: 'dental' | 'medical';
  /** Square pixel size. Default 28. */
  size?: number;
  className?: string;
}

function sequence(toMedical: boolean): number[] {
  const seq: number[] = [];
  if (toMedical) {
    for (let f = DENTAL_FRAME; f <= MEDICAL_FRAME; f++) seq.push(f);
  } else {
    // recede through the back half, landing on the dental frame
    for (let f = MEDICAL_FRAME; f < FRAMES; f++) seq.push(f);
    seq.push(DENTAL_FRAME);
  }
  return seq;
}

export function LaneMark({ lane, size = 28, className }: LaneMarkProps) {
  const reduced = useReducedMotion();
  const restFrame = lane === 'medical' ? MEDICAL_FRAME : DENTAL_FRAME;
  const [frame, setFrame] = useState(restFrame);
  const prevLane = useRef(lane);

  useEffect(() => {
    if (prevLane.current === lane) return; // initial mount: stay on rest frame
    const wasLane = prevLane.current;
    prevLane.current = lane;
    if (reduced) {
      setFrame(restFrame);
      return;
    }
    // only animate on an actual dental⇄medical change
    if (wasLane === lane) return;
    const seq = sequence(lane === 'medical');
    let i = 0;
    const id = setInterval(() => {
      setFrame(seq[i]!);
      i += 1;
      if (i >= seq.length) clearInterval(id);
    }, 1000 / FPS);
    return () => clearInterval(id);
  }, [lane, reduced, restFrame]);

  const maskSize = `calc(var(--lf-s) * ${FRAMES}) var(--lf-s)`;
  const maskPos = `calc(var(--lf-s) * ${-frame}) 0`;

  return (
    <span
      aria-hidden="true"
      className={cn('inline-block select-none', className)}
      style={{
        ['--lf-s' as string]: `${size}px`,
        width: 'var(--lf-s)',
        height: 'var(--lf-s)',
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
  );
}
