import { PostEditor } from '../post-editor';

export const metadata = {
  title: 'New post',
  robots: { index: false, follow: false },
};

export default function NewPostPage() {
  return <PostEditor />;
}
