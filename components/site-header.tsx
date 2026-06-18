'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Menu, Phone, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { practiceInfo } from '@/content/practice-info';
import { cn } from '@/lib/cn';
import { getSublabel } from '@/lib/sublabel';
import { getLane } from '@/lib/lane';
import { LaneToggle } from './lane-toggle';
import {
  LaneServicesTrigger,
  LaneServicesPanel,
  type DisclosureLane,
} from './lane-services-menu';
import { MobileLaneAccordions } from './mobile-lane-accordions';
import { LaneMark } from './lane-mark';
import { Wordmark } from './wordmark';

const NAV_ITEMS = [
  { href: '/doctors', label: 'Doctors' },
  { href: '/before-after', label: 'Smile Gallery' },
  { href: '/technology', label: 'Technology' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Find Us' },
];

const MOBILE_EXTRA_ITEMS = [
  { href: '/patient-forms', label: 'Patient Forms' },
];

const SURFACE_FOR_LANE: Record<'dental' | 'medical' | 'neutral', string> = {
  dental: '#f5ede1',
  medical: '#e8f1f0',
  neutral: '#faf9f7',
};

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
  const lane = getLane(pathname);
  const main = practiceInfo.phones[0]!;
  const [open, setOpen] = useState(false);

  // Desktop "services under Dental/Medical" disclosure panel.
  const [servicesLane, setServicesLane] = useState<DisclosureLane | null>(null);
  const caretRefs = useRef<Partial<Record<DisclosureLane, HTMLButtonElement | null>>>({});
  const headerRef = useRef<HTMLElement | null>(null);
  const toggleServices = (lane: DisclosureLane) =>
    setServicesLane((cur) => (cur === lane ? null : lane));
  const closeServices = () => setServicesLane(null);

  // Close the drawer + services panel whenever the route changes.
  useEffect(() => {
    setOpen(false);
    setServicesLane(null);
  }, [pathname]);

  // Disclosure a11y: Escape closes + returns focus to the caret; clicking or
  // moving focus outside the header closes the panel. (WAI-ARIA APG.)
  useEffect(() => {
    if (!servicesLane) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const caret = caretRefs.current[servicesLane];
        setServicesLane(null);
        caret?.focus();
      }
    };
    const onOutside = (e: Event) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setServicesLane(null);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    document.addEventListener('focusin', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
      document.removeEventListener('focusin', onOutside);
    };
  }, [servicesLane]);

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
      ref={headerRef}
      data-lane={lane}
      className={cn(
        'sticky top-0 z-40 w-full border-b backdrop-blur-md',
        'transition-colors duration-500 ease-out',
        variant === 'light'
          ? 'bg-[color-mix(in_oklab,var(--color-surface)_88%,transparent)] border-stone-200/60 text-stone-900'
          : 'bg-ink-950/60 border-ink-700/40 text-stone-100',
        className,
      )}
    >
      {/* Wipe overlay — paints the new lane's surface color across the bar on lane change.
          Keyed by lane so it re-mounts; AnimatePresence handles the fade-out of the previous wipe. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`wipe-${lane}`}
          aria-hidden="true"
          className="absolute inset-0 origin-left pointer-events-none"
          style={{
            backgroundColor: variant === 'light' ? SURFACE_FOR_LANE[lane] : 'transparent',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            scaleX: { duration: 0.65, ease: [0.45, 0, 0.55, 1] },
            opacity: { duration: 0.35, ease: 'easeOut' },
          }}
        />
      </AnimatePresence>
      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between md:justify-start gap-[24px] px-[20px] py-[16px] md:px-[32px] md:py-[20px]">
        {/* LEFT — Brand */}
        <div className="md:flex-1 flex items-center justify-start">
          <Link
            href="/"
            className="flex items-center gap-[12px]"
            aria-label={`${practiceInfo.brandName} home`}
          >
            <LaneMark
              size={40}
              lane={lane === 'medical' ? 'medical' : 'dental'}
            />
            <span className="flex flex-col">
              <Wordmark variant={variant} lane={lane} />
              <span className="relative mt-0.5 block h-4 md:h-[18px] overflow-hidden text-[9px] md:text-[10px] uppercase tracking-[0.24em] opacity-60">
                <AnimatePresence mode="wait" initial={false}>
                  {resolvedSublabel && (
                    <motion.span
                      key={resolvedSublabel}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-x-0 top-0 whitespace-nowrap"
                    >
                      {resolvedSublabel}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </span>
          </Link>
        </div>

        {/* CENTER — Dental/Medical lanes with services disclosure (desktop only) */}
        <div className="hidden md:flex md:flex-1 items-center justify-center">
          <LaneServicesTrigger
            variant={variant}
            openLane={servicesLane}
            onToggle={toggleServices}
            caretRefs={caretRefs}
          />
        </div>

        {/* RIGHT — Nav + CTAs + Hamburger */}
        <div className="md:flex-1 flex items-center justify-end gap-[20px]">
          <nav className="hidden md:flex items-center gap-[18px] text-[12px]">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap opacity-80 hover:opacity-100 transition-opacity"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/request-appointment"
            className={cn(
              'hidden sm:inline-flex shrink-0 items-center rounded-full px-[16px] py-[8px] text-[14px] font-medium transition-colors whitespace-nowrap',
              variant === 'light'
                ? 'bg-stone-900 text-stone-50 hover:bg-stone-700'
                : 'bg-stone-100 text-ink-950 hover:bg-stone-50',
            )}
          >
            Request appointment
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              'md:hidden inline-flex items-center justify-center rounded-full h-[40px] w-[40px] border transition-colors',
              variant === 'light'
                ? 'border-stone-300 hover:bg-stone-200/60'
                : 'border-stone-100/40 hover:bg-stone-100/10',
            )}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? (
              <X className="h-[20px] w-[20px]" aria-hidden="true" />
            ) : (
              <Menu className="h-[20px] w-[20px]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* ─────────── Desktop services disclosure panel ─────────── */}
      {servicesLane && (
        <LaneServicesPanel
          key={servicesLane}
          lane={servicesLane}
          onClose={closeServices}
          className="hidden md:block absolute inset-x-0 top-full z-30"
        />
      )}

      {/* ─────────── Mobile toggle row (md hidden) ─────────── */}
      <div
        className={cn(
          'relative z-10 md:hidden border-t flex items-stretch',
          variant === 'light'
            ? 'border-stone-200/60'
            : 'border-ink-700/40',
        )}
      >
        <LaneToggle variant={variant} className="m-[8px] flex-1 justify-center" />
      </div>

      {/* ─────────── Mobile drawer ─────────── */}
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden fixed inset-x-0 top-[124px] bg-stone-50 transition-[opacity,transform] duration-300 ease-out',
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none',
        )}
        style={{ height: 'calc(100svh - 124px)' }}
        aria-hidden={!open}
      >
        <div className="flex flex-col h-full overflow-y-auto px-5 pt-8 pb-12">
          {/* Services, grouped under each lane */}
          <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500 mb-2">
            Services
          </p>
          <MobileLaneAccordions onNavigate={() => setOpen(false)} />

          <nav className="flex flex-col gap-1 mt-8">
            {[...NAV_ITEMS, ...MOBILE_EXTRA_ITEMS].map((item) => {
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
