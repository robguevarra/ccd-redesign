'use client';

import Image from 'next/image';
import { cn } from '@/lib/cn';

interface LaneMarkProps {
  lane: 'dental' | 'medical';
  /** Square pixel size. Default 28. */
  size?: number;
  className?: string;
}

const MARKS = ['dental', 'medical'] as const;

/**
 * Header practice mark. Both real logos are stacked; switching lane crossfades
 * from one to the other and SETTLES on the destination logo — a dental ⇄
 * medical morph (the shared moon stays put while the inner tooth ⇄ star + face
 * swaps), not a play-then-snap. A slight scale on the outgoing/incoming mark
 * gives the swap some depth. `motion-reduce` snaps with no transition.
 *
 * Note: the toggle is a morph between the two *logos* (not the supplied
 * animationSample.mp4 — that clip is a dental-only flourish that loops back to
 * dental and never reaches the medical logo, so it can't "stop on medical").
 * The mp4 frames are used for the looping homepage-hero mark via <LogoFrames>.
 */
export function LaneMark({ lane, size = 28, className }: LaneMarkProps) {
  return (
    <span
      className={cn('relative inline-block select-none', className)}
      style={{ width: size, height: size }}
    >
      {MARKS.map((mark) => {
        const active = lane === mark;
        return (
          <Image
            key={mark}
            src={`/logos/${mark}.png`}
            alt=""
            width={size}
            height={size}
            priority
            className="absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{
              width: size,
              height: size,
              opacity: active ? 1 : 0,
              transform: active ? 'scale(1)' : 'scale(0.94)',
            }}
          />
        );
      })}
    </span>
  );
}
