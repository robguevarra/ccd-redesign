'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone } from 'lucide-react';
import { practiceInfo } from '@/content/practice-info';
import { cn } from '@/lib/cn';
import { getSublabel } from '@/lib/sublabel';
import { Logo } from './logo';
import { Wordmark } from './wordmark';

const NAV_ITEMS = [
  { href: '/dental', label: 'Dental' },
  { href: '/medical', label: 'Medical' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/technology', label: 'Technology' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

interface SiteHeaderProps {
  /** When true, renders dark-on-transparent — for use on the wow-zone hero. */
  variant?: 'light' | 'dark';
  /** Optional override; otherwise resolved from current pathname. */
  sublabel?: string;
  className?: string;
}

export function SiteHeader({
  variant = 'light',
  sublabel,
  className,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const resolvedSublabel = sublabel ?? getSublabel(pathname);
  const main = practiceInfo.phones[0]!;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b backdrop-blur-md',
        variant === 'light'
          ? 'bg-stone-50/85 border-stone-200/60 text-stone-900'
          : 'bg-ink-950/60 border-ink-700/40 text-stone-100',
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8 md:py-5">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={`${practiceInfo.brandName} home`}
        >
          <Logo size={28} mobileSize={24} decorative />
          <span className="flex flex-col">
            <Wordmark variant={variant} />
            {resolvedSublabel && (
              <span className="mt-0.5 text-[9px] md:text-[10px] uppercase tracking-[0.24em] opacity-60">
                {resolvedSublabel}
              </span>
            )}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/request-appointment"
            className={cn(
              'hidden sm:inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors',
              variant === 'light'
                ? 'bg-stone-900 text-stone-50 hover:bg-stone-700'
                : 'bg-stone-100 text-ink-950 hover:bg-stone-50',
            )}
          >
            Request appointment
          </Link>
          <a
            href={`tel:${main.tel}`}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-colors',
              variant === 'light'
                ? 'border-stone-900 hover:bg-stone-900 hover:text-stone-50'
                : 'border-stone-100/50 hover:bg-stone-100 hover:text-ink-950',
            )}
            aria-label={`Call ${practiceInfo.brandName} at ${main.number}`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{main.number}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </div>
    </header>
  );
}
