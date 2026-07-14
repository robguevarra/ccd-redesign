import { ReviewEditor } from '../review-editor';

export const metadata = {
  title: 'New review',
  robots: { index: false, follow: false },
};

export default function NewReviewPage() {
  return <ReviewEditor />;
}
