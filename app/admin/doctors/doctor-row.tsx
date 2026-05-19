'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { ArrowUp, ArrowDown, Star } from 'lucide-react';
import type { DoctorRow } from '@/lib/supabase/queries';
import { reorderDoctor, setLead } from './actions';
import { cn } from '@/lib/cn';

export function DoctorRowItem({ doctor, isFirst, isLast }: {
  doctor: DoctorRow;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function move(direction: 'up' | 'down') {
    startTransition(async () => { await reorderDoctor(doctor.slug, direction); });
  }
  function promote() {
    if (doctor.isLead) return;
    startTransition(async () => { await setLead(doctor.slug); });
  }

  return (
    <li className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      {/* Portrait + name + title — full-width on mobile, flex item on desktop */}
      <Link
        href={`/admin/doctors/${doctor.slug}`}
        className="flex items-center gap-3 sm:gap-4 group min-w-0 sm:flex-1 order-1"
      >
        <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden bg-stone-200 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={doctor.portrait.src}
            alt={doctor.portrait.alt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: doctor.portrait.objectPosition ?? 'center' }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-stone-900 group-hover:underline underline-offset-4 truncate">
            {doctor.name}
          </p>
          <p className="text-sm text-stone-500 truncate">{doctor.title}</p>
        </div>
      </Link>

      {/* Controls row — separate row on mobile, inline on sm+ */}
      <div className="flex items-center gap-2 sm:gap-4 order-2 sm:order-3">
        <div className="flex flex-col gap-0.5 shrink-0">
          <button type="button" onClick={() => move('up')} disabled={pending || isFirst}
            aria-label="Move up"
            className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-stone-100 disabled:opacity-30">
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => move('down')} disabled={pending || isLast}
            aria-label="Move down"
            className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-stone-100 disabled:opacity-30">
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          type="button"
          onClick={promote}
          disabled={pending || doctor.isLead}
          title={doctor.isLead ? 'Already lead' : 'Promote to lead'}
          className={cn(
            'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap',
            doctor.isLead
              ? 'border-stone-900 bg-stone-900 text-stone-50'
              : 'border-stone-300 text-stone-600 hover:bg-stone-100 disabled:opacity-50',
          )}
        >
          <Star className="h-3 w-3" /> {doctor.isLead ? 'Lead' : 'Promote'}
        </button>
        <span className={cn(
          'shrink-0 text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full',
          doctor.active ? 'bg-stone-200 text-stone-700' : 'bg-red-100 text-red-700',
        )}>
          {doctor.active ? 'Visible' : 'Hidden'}
        </span>
      </div>
    </li>
  );
}
