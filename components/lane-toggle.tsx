'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { getLane, type Lane } from '@/lib/lane';

interface LaneToggleProps {
  /** Light = on a stone-50 background (default). Dark = on hero overlay. */
  variant?: 'light' | 'dark';
  className?: string;
}

interface LaneOption {
  lane: Exclude<Lane, 'neutral'>;
  href: string;
  label: string;
  glyph: string;
  hoverHint: string;
}

const OPTIONS: ReadonlyArray<LaneOption> = [
  {
    lane: 'dental',
    href: '/dental',
    label: 'Dental',
    glyph: 'D',
    hoverHint: 'Switch to the dental side',
  },
  {
    lane: 'medical',
    href: '/medical',
    label: 'Medical',
    glyph: 'M',
    hoverHint: 'Switch to the medical side',
  },
];

/**
 * Segmented Dental/Medical button group in the header. Each option is a real
 * <Link> so middle-click opens in a new tab. Active state uses fill + color
 * + weight + aria-current — three independent channels so color-blind and
 * older-patient users still read the active lane unambiguously.
 *
 * Tap targets: 40px minimum height (meets WCAG 2.2 AA SC 2.5.8; 4px shy of AAA SC 2.5.5 44px).
 * Focus ring: 2px solid outline at offset 3px, visible on keyboard tab.
 *
 * See: docs/superpowers/specs/2026-05-16-dentisthsu-dual-identity-system.md §2.2
 */
export function LaneToggle({ variant = 'light', className }: LaneToggleProps) {
  const pathname = usePathname();
  const currentLane = getLane(pathname);

  return (
    <div
      role="group"
      aria-label="Practice lane"
      className={cn(
        'flex items-center gap-[4px] rounded-full p-[4px] border',
        variant === 'light'
          ? 'bg-stone-100/80 border-stone-200'
          : 'bg-stone-100/10 border-stone-100/20',
        className,
      )}
    >
      {OPTIONS.map((opt) => {
        const active = currentLane === opt.lane;
        return (
          <Link
            key={opt.lane}
            href={opt.href}
            aria-current={active ? 'page' : undefined}
            title={opt.hoverHint}
            className={cn(
              'inline-flex flex-1 justify-center items-center gap-[8px] rounded-full px-[16px] min-h-[40px] text-[14px] font-medium',
              'transition-[background-color,color,transform] duration-300 ease-out',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
              variant === 'light'
                ? 'focus-visible:outline-stone-900'
                : 'focus-visible:outline-stone-50',
              active
                ? variant === 'light'
                  ? 'bg-[var(--color-accent-600)] text-stone-50 font-semibold scale-105'
                  : 'bg-stone-50 text-stone-900 font-semibold scale-105'
                : variant === 'light'
                ? 'text-stone-600 hover:text-stone-900'
                : 'text-stone-300 hover:text-stone-50',
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'inline-flex items-center justify-center w-[20px] h-[20px] rounded text-[10px] font-bold',
                active
                  ? variant === 'light'
                    ? 'bg-stone-50 text-[var(--color-accent-600)]'
                    : 'bg-stone-900 text-stone-50'
                  : 'bg-transparent border border-current',
              )}
            >
              {opt.glyph}
            </span>
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}
