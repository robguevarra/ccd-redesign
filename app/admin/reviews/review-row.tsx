'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { ArrowUp, ArrowDown, Star } from 'lucide-react';
import type { ReviewRow } from '@/lib/supabase/queries';
import { reorderReview } from './actions';
import { cn } from '@/lib/cn';

const SOURCE_LABEL: Record<string, string> = {
  yelp: 'Yelp',
  google: 'Google',
  facebook: 'Facebook',
};

export function ReviewRowItem({ review, isFirst, isLast }: {
  review: ReviewRow;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function move(direction: 'up' | 'down') {
    startTransition(async () => { await reorderReview(review.id, direction); });
  }

  return (
    <li className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <Link
        href={`/admin/reviews/${review.id}`}
        className="group min-w-0 sm:flex-1 order-1"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-stone-900 group-hover:underline underline-offset-4 truncate">
            {review.authorName}
          </span>
          <span className="inline-flex items-center gap-0.5 text-stone-500 shrink-0" aria-label={`${review.rating} of 5 stars`}>
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-stone-400 text-stone-400" />
            ))}
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-stone-400 shrink-0">
            {SOURCE_LABEL[review.source] ?? review.source}
          </span>
        </div>
        <p className="text-sm text-stone-500 line-clamp-1">{review.body}</p>
      </Link>

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
        {review.featured && (
          <span className="shrink-0 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full bg-stone-900 text-stone-50">
            <Star className="h-3 w-3" /> Featured
          </span>
        )}
        <span className={cn(
          'shrink-0 text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full',
          review.active ? 'bg-stone-200 text-stone-700' : 'bg-red-100 text-red-700',
        )}>
          {review.active ? 'Visible' : 'Hidden'}
        </span>
      </div>
    </li>
  );
}
