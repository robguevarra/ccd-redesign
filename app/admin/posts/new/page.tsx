import { PostEditor } from '../post-editor';
import { listDoctors } from '@/lib/supabase/queries';

export const metadata = {
  title: 'New post',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  const doctors = await listDoctors();
  return <PostEditor doctors={doctors.map((d) => ({ slug: d.slug, name: d.name }))} />;
}
