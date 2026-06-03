'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ArrowUpRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getLane } from '@/lib/lane';
import {
  getLaneServiceGroups,
  serviceHref,
  SERVICE_LANE_LABELS,
  SERVICE_LANE_SUBLABELS,
} from '@/content/services';
import type { ServiceLane } from '@/content/schemas';

/**
 * Header "Services under Dental / Medical" navigation.
 *
 * Implements the WAI-ARIA "disclosure navigation with top-level links" pattern
 * (https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation-hybrid/):
 * each lane is a real link (navigates + re-themes the site) PLUS a SEPARATE
 * caret disclosure button that opens a panel of that lane's services. This is
 * deliberately NOT a split button — per NN/g, a label that both navigates and
 * opens a panel is confusing and fails on touch.
 *
 * The panel is rendered separately (LaneServicesPanel) so the header can place
 * it full-width below the bar. Open/close state + keyboard handling live in the
 * header. All activation is click/keyboard — never hover.
 */

export type DisclosureLane = ServiceLane; // 'dental' | 'medical'

interface LaneDef {
  lane: DisclosureLane;
  href: string;
  glyph: string;
  label: string;
}

export const LANE_DEFS: readonly LaneDef[] = [
  { lane: 'dental', href: '/dental', glyph: 'D', label: 'Dental' },
  { lane: 'medical', href: '/medical', glyph: 'M', label: 'Medical' },
];

export const servicesPanelId = (lane: DisclosureLane) => `lane-services-${lane}`;

/* ---- Trigger: the segmented Dental | Medical control with carets -------- */

export function LaneServicesTrigger({
  variant = 'light',
  openLane,
  onToggle,
  caretRefs,
}: {
  variant?: 'light' | 'dark';
  openLane: DisclosureLane | null;
  onToggle: (lane: DisclosureLane) => void;
  caretRefs: React.MutableRefObject<Partial<Record<DisclosureLane, HTMLButtonElement | null>>>;
}) {
  const pathname = usePathname();
  const currentLane = getLane(pathname);

  return (
    <div
      role="group"
      aria-label="Practice areas"
      className={cn(
        'flex items-center gap-[4px] rounded-full p-[4px] border',
        variant === 'light'
          ? 'bg-stone-100/80 border-stone-200'
          : 'bg-stone-100/10 border-stone-100/20',
      )}
    >
      {LANE_DEFS.map((opt) => {
        const active = currentLane === opt.lane;
        const open = openLane === opt.lane;
        return (
          <div
            key={opt.lane}
            className={cn(
              'flex items-center rounded-full transition-colors',
              active &&
                (variant === 'light'
                  ? 'bg-[var(--color-accent-600)]'
                  : 'bg-stone-50'),
              !active && open && (variant === 'light' ? 'bg-stone-200/70' : 'bg-stone-100/15'),
            )}
          >
            <Link
              href={opt.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex items-center gap-[8px] rounded-full pl-[14px] pr-[8px] min-h-[40px] text-[14px]',
                'transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                variant === 'light' ? 'focus-visible:outline-stone-900' : 'focus-visible:outline-stone-50',
                active
                  ? variant === 'light'
                    ? 'text-stone-50 font-semibold'
                    : 'text-stone-900 font-semibold'
                  : variant === 'light'
                    ? 'text-stone-600 hover:text-stone-900 font-medium'
                    : 'text-stone-300 hover:text-stone-50 font-medium',
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
            <button
              type="button"
              ref={(el) => {
                caretRefs.current[opt.lane] = el;
              }}
              onClick={() => onToggle(opt.lane)}
              aria-expanded={open}
              aria-controls={servicesPanelId(opt.lane)}
              aria-label={`${open ? 'Hide' : 'Show'} ${opt.label} services`}
              className={cn(
                'inline-flex items-center justify-center rounded-full h-[32px] w-[30px] mr-[3px]',
                'transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                variant === 'light' ? 'focus-visible:outline-stone-900' : 'focus-visible:outline-stone-50',
                active
                  ? variant === 'light'
                    ? 'text-stone-50 hover:bg-stone-50/20'
                    : 'text-stone-900 hover:bg-stone-900/10'
                  : variant === 'light'
                    ? 'text-stone-500 hover:text-stone-900 hover:bg-stone-200'
                    : 'text-stone-300 hover:text-stone-50 hover:bg-stone-100/15',
              )}
            >
              <ChevronDown
                className={cn('h-[16px] w-[16px] transition-transform duration-200', open && 'rotate-180')}
                aria-hidden="true"
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ---- Panel: the dropdown of one lane's services ------------------------- */

export function LaneServicesPanel({
  lane,
  onClose,
  className,
}: {
  lane: DisclosureLane;
  onClose: () => void;
  className?: string;
}) {
  const groups = getLaneServiceGroups(lane);
  const laneLabel = SERVICE_LANE_LABELS[lane].replace(' Practice', '');

  // Opaque by default; CSS-only entrance (motion-safe) so the panel can never
  // get stranded translucent by a throttled JS animation, and motion is gated
  // behind prefers-reduced-motion.
  return (
    <div
      id={servicesPanelId(lane)}
      className={cn(
        'border-t border-stone-200 bg-stone-50 shadow-[0_24px_48px_-24px_rgba(28,25,23,0.35)]',
        'motion-safe:animate-[lane-panel-in_200ms_ease-out]',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-8 py-8">
        {/* View all — placed FIRST, explicit wording (Baymard) */}
        <Link
          href={`/${lane}`}
          onClick={onClose}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-stone-900 mb-7 border-b-2 border-stone-900/15 hover:border-stone-900 pb-1 transition-colors"
        >
          View all {laneLabel} services
          <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
        </Link>
        <p className="sr-only">{SERVICE_LANE_SUBLABELS[lane]}</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
          {groups.map((group) => (
            <div key={group.subcategory}>
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-stone-500 mb-3">
                {group.label}
              </h3>
              <ul className="space-y-2.5">
                {group.services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={serviceHref(s)}
                      onClick={onClose}
                      className="group inline-flex items-center gap-1.5 text-[15px] text-stone-700 hover:text-stone-900 transition-colors"
                    >
                      {s.name}
                      <ArrowRight
                        className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
