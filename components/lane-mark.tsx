'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * Header practice mark. At rest it shows the crisp 512px PNG (sharp on every
 * display); during a dental⇄medical change it plays the real morph frames (the
 * transparent sprite from animationSample.mp4) so the tooth/face transition
 * animates, then settles back to the crisp PNG.
 *
 *   dental → medical : frames 0 → 14   (face + star emerge)
 *   medical → dental : frames 14 → 28  (recede; 28 == the dental frame)
 *
 * The morph is painted via a CSS mask in `currentColor`; the rest image is a
 * real <Image> (browser image scaling = no mask-downscaling jaggies). Honors
 * prefers-reduced-motion by snapping straight to the destination.
 */

const SPRITE = '/logos/morph-sprite.png';
const REST_PNG: Record<'dental' | 'medical', string> = {
  dental: '/logos/dental.png',
  medical: '/logos/medical-2.png',
};
const FRAMES = 29;
const FPS = 10; // matches the source clip
const DENTAL_FRAME = 0;
const MEDICAL_FRAME = 14;

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
    for (let f = DENTAL_FRAME; f <= MEDICAL_FRAME; f++) seq.push(f);
  } else {
    // recede through the back half, landing on the dental frame
    for (let f = MEDICAL_FRAME; f < FRAMES; f++) seq.push(f);
    seq.push(DENTAL_FRAME);
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

  const maskSize = `calc(var(--lf-s) * ${FRAMES}) var(--lf-s)`;
  const maskPos = `calc(var(--lf-s) * ${-frame}) 0`;

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
