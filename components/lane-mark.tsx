'use client';

import { useEffect, useRef, useState } from 'react';
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
 * Both the morph frames and the rest image are rendered as rasters (sprite
 * background-image + <Image>), not CSS masks — so the browser's image scaling
 * keeps them sharp instead of the soft mask-downscaling. They're black line art
 * inverted to white on dark backgrounds. Honors prefers-reduced-motion by
 * snapping straight to the destination.
 */

// Header-sized morph sprite: the 2500px master downscaled (high-quality, AA
// baked in) to 128px/frame. The mark only renders at ~40px, so a 400px/frame
// sheet would be downscaled ~5× at runtime — and browsers use fast/low-quality
// (bilinear, no mipmaps) sampling while an image animates, which aliases badly
// past ~2× and made the moving mark look jagged. A display-sized sprite keeps
// the runtime downscale ≤~1.6× (DPR 2–3) so the morph stays crisp in motion.
// (The cold-open uses the full-res morph-sprite-3.png — it renders at 120px.)
const SPRITE = '/logos/morph-sprite-header-2.png';
const REST_PNG: Record<'dental' | 'medical', string> = {
  dental: '/logos/dental-3.png',
  medical: '/logos/medical-4.png',
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

  // Preload + decode the morph sprite and BOTH rest PNGs on mount. On a
  // lane-locked page only the current lane's rest PNG is otherwise fetched, so
  // the first toggle would flash a blank frame while the destination asset
  // loads/decodes at the morph→rest handoff. Warming them up avoids that.
  useEffect(() => {
    for (const src of [SPRITE, REST_PNG.dental, REST_PNG.medical]) {
      const img = new Image();
      img.src = src;
      img.decode?.().catch(() => {});
    }
  }, []);

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

  const spriteSize = `calc(var(--lf-s) * ${COLS}) calc(var(--lf-s) * ${ROWS})`;
  const spritePos = `calc(var(--lf-s) * ${-(frame % COLS)}) calc(var(--lf-s) * ${-Math.floor(frame / COLS)})`;

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
      {/* Resting marks — raw rasters scaled by the browser (crisp), matching the
          morph's sharpness instead of next/image's softened tiny variant. BOTH
          lanes are rendered as persistent layers (kept decoded), so the
          morph→rest handoff is a pure opacity swap with no blank decode gap.
          Hidden while the morph plays; settledLane keeps the origin mark shown
          until the morph lands so the destination never flashes early. */}
      {(['dental', 'medical'] as const).map((l) => (
        <span
          key={l}
          className={cn('absolute inset-0', invert && 'invert')}
          style={{
            backgroundImage: `url(${REST_PNG[l]})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'var(--lf-s) var(--lf-s)',
            backgroundPosition: 'center',
            opacity: !animating && settledLane === l ? 1 : 0,
          }}
        />
      ))}
      {/* Morph frames — only mounted during a lane change. Rendered as a raster
          sprite (not a CSS mask) so the browser's image scaling keeps it sharp;
          inverted on dark backgrounds to match the rest mark. */}
      {animating && (
        <span
          className={cn('absolute inset-0', invert && 'invert')}
          style={{
            backgroundImage: `url(${SPRITE})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: spriteSize,
            backgroundPosition: spritePos,
          }}
        />
      )}
    </span>
  );
}
