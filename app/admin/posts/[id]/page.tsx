import { notFound } from 'next/navigation';
import { getPost, listDoctors } from '@/lib/supabase/queries';
import { PostEditor } from '../post-editor';

export const metadata = {
  title: 'Edit post',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, doctors] = await Promise.all([getPost(id), listDoctors()]);
  if (!post) notFound();
  return <PostEditor post={post} doctors={doctors.map((d) => ({ slug: d.slug, name: d.name }))} />;
}
