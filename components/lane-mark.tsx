'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { LogoFrames } from './logo-frames';
import { cn } from '@/lib/cn';

interface LaneMarkProps {
  lane: 'dental' | 'medical';
  /** Square pixel size. Default 28. */
  size?: number;
  className?: string;
}

/**
 * Header practice mark. At rest it shows the static lane logo (so the header
 * always reflects the current practice). When the lane changes — i.e. the user
 * toggles Dental ⇄ Medical — it plays the real logo animation once (the actual
 * mp4 frames via <LogoFrames>) as a flourish, then settles back to the new
 * lane's static mark. Honors prefers-reduced-motion (no flourish).
 */
export function LaneMark({ lane, size = 28, className }: LaneMarkProps) {
  const reduced = useReducedMotion();
  const [playToken, setPlayToken] = useState(0);
  const [playing, setPlaying] = useState(false);
  const prev = useRef(lane);

  useEffect(() => {
    if (prev.current === lane) return;
    prev.current = lane;
    if (reduced) return;
    setPlayToken((t) => t + 1);
    setPlaying(true);
    const id = setTimeout(() => setPlaying(false), 2900); // matches the 2.9s sequence
    return () => clearTimeout(id);
  }, [lane, reduced]);

  const src = lane === 'medical' ? '/logos/medical.png' : '/logos/dental.png';

  return (
    <span
      className={cn('relative inline-block select-none', className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        priority
        style={{ width: size, height: size }}
        className={cn(
          'absolute inset-0 transition-opacity duration-300',
          playing ? 'opacity-0' : 'opacity-100',
        )}
      />
      {playing && (
        <LogoFrames
          playKey={playToken}
          size={size}
          className="absolute inset-0"
        />
      )}
    </span>
  );
}
