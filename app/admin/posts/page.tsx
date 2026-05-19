import Link from 'next/link';
import { Plus } from 'lucide-react';
import { listAllPosts } from '@/lib/supabase/queries';

export const metadata = {
  title: 'Posts',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function PostsAdminPage() {
  const posts = await listAllPosts();

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-4 py-2 text-sm font-medium hover:bg-stone-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-12 text-stone-500 text-sm text-center">
          No posts yet. Click "New post" to write the first one.
        </div>
      ) : (
        <ul className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-200 overflow-hidden">
          {posts.map((p) => (
            <li key={p.id} className="px-5 py-4">
              <Link
                href={`/admin/posts/${p.id}`}
                className="flex items-center justify-between gap-4 group"
              >
                <div className="min-w-0">
                  <p className="font-medium text-stone-900 group-hover:underline underline-offset-4 truncate">
                    {p.title}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Updated{' '}
                    {new Date(p.updatedAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full ${
                    p.status === 'published'
                      ? 'bg-stone-900 text-stone-50'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {p.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
