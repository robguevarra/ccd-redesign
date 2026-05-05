import { notFound } from 'next/navigation';
import { getPost } from '@/lib/supabase/queries';
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
  const post = await getPost(id);
  if (!post) notFound();
  return <PostEditor post={post} />;
}
