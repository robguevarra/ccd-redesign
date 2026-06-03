'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  getLaneServiceGroups,
  serviceHref,
  SERVICE_LANE_LABELS,
} from '@/content/services';
import { LANE_DEFS, type DisclosureLane } from './lane-services-menu';

/** Distinct from the desktop panel id so the two can coexist in the DOM. */
const mobilePanelId = (lane: DisclosureLane) => `mobile-lane-services-${lane}`;

/**
 * Mobile services browse: Dental / Medical accordions inside the drawer.
 * Disclosure buttons (aria-expanded/controls), large tap targets, and an
 * explicit "View all [Lane] services" link FIRST in each expanded section
 * (Baymard) — never a bare tappable header. Activation is tap/keyboard only.
 */
export function MobileLaneAccordions({ onNavigate }: { onNavigate?: () => void }) {
  const [openLanes, setOpenLanes] = useState<Record<DisclosureLane, boolean>>({
    dental: false,
    medical: false,
  });
  const toggle = (lane: DisclosureLane) =>
    setOpenLanes((s) => ({ ...s, [lane]: !s[lane] }));

  return (
    <div className="flex flex-col">
      {LANE_DEFS.map((opt) => {
        const open = openLanes[opt.lane];
        const groups = getLaneServiceGroups(opt.lane);
        const laneLabel = SERVICE_LANE_LABELS[opt.lane].replace(' Practice', '');
        return (
          <div key={opt.lane} className="border-b border-stone-200">
            <button
              type="button"
              onClick={() => toggle(opt.lane)}
              aria-expanded={open}
              aria-controls={mobilePanelId(opt.lane)}
              className="w-full flex items-center justify-between gap-3 py-3 font-serif text-3xl tracking-tight text-stone-900 min-h-[44px]"
            >
              <span>{opt.label}</span>
              <ChevronDown
                className={cn(
                  'h-6 w-6 text-stone-500 transition-transform duration-200 shrink-0',
                  open && 'rotate-180',
                )}
                aria-hidden="true"
              />
            </button>

            {open && (
              <div id={mobilePanelId(opt.lane)} className="pb-5">
                <Link
                  href={`/${opt.lane}`}
                  onClick={onNavigate}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900 underline underline-offset-4 mb-5 min-h-[44px]"
                >
                  View all {laneLabel} services
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>

                <div className="space-y-6">
                  {groups.map((group) => (
                    <div key={group.subcategory}>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500 mb-2">
                        {group.label}
                      </p>
                      <ul className="flex flex-col">
                        {group.services.map((s) => (
                          <li key={s.slug}>
                            <Link
                              href={serviceHref(s)}
                              onClick={onNavigate}
                              className="block py-2.5 text-lg text-stone-700 min-h-[44px]"
                            >
                              {s.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
