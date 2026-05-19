'use client';

import { useRef, useState } from 'react';

interface PortraitFocalPickerProps {
  imageSrc: string;
  value: string;
  onChange: (objectPosition: string) => void;
}

function parsePosition(v: string): { x: number; y: number } {
  const tokens = v.trim().split(/\s+/);
  const parsePct = (s: string | undefined, fallback: number): number => {
    if (!s) return fallback;
    if (s === 'center') return 50;
    if (s.endsWith('%')) return Math.max(0, Math.min(100, Number(s.slice(0, -1))));
    return fallback;
  };
  return { x: parsePct(tokens[0], 50), y: parsePct(tokens[1], 50) };
}

export function PortraitFocalPicker({ imageSrc, value, onChange }: PortraitFocalPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(() => parsePosition(value));

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    const clamped = {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };
    setPos(clamped);
    onChange(`${clamped.x}% ${clamped.y}%`);
  }

  function reset() {
    setPos({ x: 50, y: 50 });
    onChange('center center');
  }

  return (
    <div>
      <div
        ref={containerRef}
        onClick={handleClick}
        className="relative aspect-[3/4] max-w-xs rounded-lg overflow-hidden cursor-crosshair border-2 border-stone-300 bg-stone-100"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt="Portrait focal-point preview"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: `${pos.x}% ${pos.y}%` }}
        />
        <div
          aria-hidden="true"
          className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-stone-900/60 shadow-lg pointer-events-none"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
        <span className="font-mono">{`${pos.x}% ${pos.y}%`}</span>
        <button
          type="button"
          onClick={reset}
          className="text-stone-700 hover:text-stone-900 underline underline-offset-2"
        >
          Reset to center
        </button>
      </div>
    </div>
  );
}
