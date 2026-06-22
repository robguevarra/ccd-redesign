'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Desktop "About" nav dropdown. Groups the About page with the two patient-
 * facing utility pages (Patient Forms, Financing) that previously only lived in
 * the footer, so they're reachable from the top nav without cluttering the bar.
 */
const ABOUT_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/patient-forms', label: 'Patient Forms' },
  { href: '/financing', label: 'Financing' },
];

export function AboutMenu({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Escape closes; clicking or moving focus outside the menu closes it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onOutside = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    document.addEventListener('focusin', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
      document.removeEventListener('focusin', onOutside);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 whitespace-nowrap opacity-80 hover:opacity-100 transition-opacity"
      >
        About
        <ChevronDown
          className={cn('h-3 w-3 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>
      {open && (
        // pt-3 keeps a hover "bridge" so the menu doesn't close in the gap.
        <div className="absolute right-0 top-full pt-3 min-w-[180px]">
          <ul
            className={cn(
              'rounded-xl border py-2 shadow-lg',
              variant === 'light'
                ? 'bg-white border-stone-200 text-stone-900'
                : 'bg-ink-950 border-ink-700/60 text-stone-100',
            )}
          >
            {ABOUT_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block px-4 py-2 text-[13px] whitespace-nowrap transition-colors',
                    variant === 'light' ? 'hover:bg-stone-100' : 'hover:bg-white/10',
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
