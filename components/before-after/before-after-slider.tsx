'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import type { BeforeAfterCase } from '@/content/before-after';

/**
 * Interactive before/after comparison slider. The "after" image is the base
 * layer; the "before" image is overlaid and clipped to the left of the handle,
 * so dragging the handle wipes between the two.
 *
 * Both images object-cover a shared 16:9 box (the source photos are uniform
 * 16:9), so the wipe stays aligned between the before and after layers.
 *
 * Accessibility: the handle is a `role="slider"` with full keyboard support
 * (arrows, Home/End). Pointer dragging works with mouse and touch. No motion is
 * animated, so `prefers-reduced-motion` needs no special handling here.
 */
export function BeforeAfterSlider({ data }: { data: BeforeAfterCase }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setFromClientX(e.clientX);
  };
  const endDrag = (e: React.PointerEvent) => {
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 5;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      setPos((p) => Math.max(0, p - step));
      e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      setPos((p) => Math.min(100, p + step));
      e.preventDefault();
    } else if (e.key === 'Home') {
      setPos(0);
      e.preventDefault();
    } else if (e.key === 'End') {
      setPos(100);
      e.preventDefault();
    }
  };

  return (
    <figure className="group">
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-stone-200 select-none touch-none cursor-ew-resize"
      >
        {/* AFTER — base layer */}
        <Image
          src={data.after.src}
          alt="After treatment"
          fill
          sizes="(min-width: 768px) 45vw, 92vw"
          placeholder="blur"
          blurDataURL={data.after.blurDataURL}
          className="object-cover"
          style={{
            objectPosition: data.after.objectPosition ?? 'center',
            transform: data.after.scale ? `scale(${data.after.scale})` : undefined,
          }}
          draggable={false}
        />

        {/* BEFORE — overlay, clipped to the left of the handle */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Image
            src={data.before.src}
            alt="Before treatment"
            fill
            sizes="(min-width: 768px) 45vw, 92vw"
            placeholder="blur"
            blurDataURL={data.before.blurDataURL}
            className="object-cover"
            style={{
              objectPosition: data.before.objectPosition ?? 'center',
              transform: data.before.scale ? `scale(${data.before.scale})` : undefined,
            }}
            draggable={false}
          />
        </div>

        {/* Corner labels */}
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-stone-900/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-50 backdrop-blur-sm">
          Before
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-[var(--color-accent-600)]/85 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm">
          After
        </span>

        {/* Divider + handle */}
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
          <button
            type="button"
            role="slider"
            aria-label="Drag to compare before and after"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            aria-valuetext={`${Math.round(pos)}% before`}
            onKeyDown={onKeyDown}
            className="pointer-events-auto absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-800 shadow-lg ring-1 ring-black/10 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-600)] focus-visible:ring-offset-2 group-hover:scale-105"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </figure>
  );
}
