import { notFound } from 'next/navigation';
import { getReviewRow } from '@/lib/supabase/queries';
import { ReviewEditor } from '../review-editor';

export const metadata = {
  title: 'Edit review',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = await getReviewRow(id);
  if (!review) notFound();
  return <ReviewEditor review={review} />;
}
