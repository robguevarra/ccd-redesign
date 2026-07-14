import Link from 'next/link';
import { Plus } from 'lucide-react';
import { listReviewRows } from '@/lib/supabase/queries';
import { ReviewRowItem } from './review-row';

export const metadata = {
  title: 'Reviews',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function ReviewsAdminPage() {
  const reviews = await listReviewRows();

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
      <div className="flex items-center justify-between gap-3 mb-10">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-stone-900">Reviews</h1>
        <Link
          href="/admin/reviews/new"
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-4 py-2 text-sm font-medium hover:bg-stone-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add review
        </Link>
      </div>

      {reviews.length === 0 ? (
        <p className="text-stone-500">No reviews yet. Add the first one.</p>
      ) : (
        <ul className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-200 overflow-hidden">
          {reviews.map((r, idx) => (
            <ReviewRowItem
              key={r.id}
              review={r}
              isFirst={idx === 0}
              isLast={idx === reviews.length - 1}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
