'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Menu, Phone, X } from 'lucide-react';
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
  { href: '/blog', label: 'Blog' },
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
  const [open, setOpen] = useState(false);

  // Close the drawer whenever the route changes (e.g. after tapping a link).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
              'hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-colors',
              variant === 'light'
                ? 'border-stone-900 hover:bg-stone-900 hover:text-stone-50'
                : 'border-stone-100/50 hover:bg-stone-100 hover:text-ink-950',
            )}
            aria-label={`Call ${practiceInfo.brandName} at ${main.number}`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span>{main.number}</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              'md:hidden inline-flex items-center justify-center rounded-full h-10 w-10 border transition-colors',
              variant === 'light'
                ? 'border-stone-300 hover:bg-stone-200/60'
                : 'border-stone-100/40 hover:bg-stone-100/10',
            )}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* ─────────── Mobile drawer ─────────── */}
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden fixed inset-x-0 top-[68px] bg-stone-50 transition-[opacity,transform] duration-300 ease-out',
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none',
        )}
        style={{ height: 'calc(100svh - 68px)' }}
        aria-hidden={!open}
      >
        <div className="flex flex-col h-full overflow-y-auto px-5 pt-8 pb-12">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'font-serif text-3xl tracking-tight py-3 border-b border-stone-200 flex items-center justify-between',
                    active
                      ? 'text-[var(--color-accent-600)]'
                      : 'text-stone-900',
                  )}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-600)]">
                      Current
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 flex flex-col gap-3">
            <Link
              href="/request-appointment"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-6 py-4 text-base font-medium"
            >
              Request appointment
            </Link>
            <a
              href={`tel:${main.tel}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-900 text-stone-900 px-6 py-4 text-base font-medium"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {main.number}
            </a>
            {practiceInfo.email && (
              <a
                href={`mailto:${practiceInfo.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 text-stone-700 px-6 py-4 text-base font-medium"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {practiceInfo.email}
              </a>
            )}
          </div>

          <div className="mt-auto pt-10 text-xs text-stone-500 leading-relaxed">
            <p className="uppercase tracking-[0.24em] mb-3">Visit</p>
            <p>{practiceInfo.address.street}</p>
            <p>
              {practiceInfo.address.city}, {practiceInfo.address.state}{' '}
              {practiceInfo.address.zip}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
