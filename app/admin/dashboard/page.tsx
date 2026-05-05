import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';
import {
  listAppointmentRequests,
  listAllPosts,
} from '@/lib/supabase/queries';
import { signOut } from '../login/actions';

export const metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [requests, posts] = await Promise.all([
    listAppointmentRequests(10),
    listAllPosts(),
  ]);

  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
      <div className="flex items-center justify-between mb-12">
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900">Dashboard</h1>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            Sign out
          </button>
        </form>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        <Stat label="Published posts" value={publishedCount} />
        <Stat label="Drafts" value={draftCount} />
        <Stat label="New requests" value={requests.filter((r) => r.status === 'new').length} />
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl text-stone-900">Recent appointment requests</h2>
          </div>
          {requests.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-8 text-stone-600 text-sm">
              No requests yet. They'll appear here as patients submit the form.
            </div>
          ) : (
            <ul className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-200 overflow-hidden">
              {requests.map((r) => (
                <li key={r.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-stone-900">{r.name}</p>
                      <p className="text-sm text-stone-600 font-mono tabular-nums">
                        {r.phone}
                        {r.email && (
                          <>
                            <span className="text-stone-400"> · </span>
                            <span className="font-sans">{r.email}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.18em] text-stone-500 capitalize">
                        {r.preferred_time}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        {new Date(r.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  {r.notes && (
                    <p className="mt-3 text-sm text-stone-700 leading-relaxed">{r.notes}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl text-stone-900">Posts</h2>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-4 py-2 text-sm font-medium hover:bg-stone-700 transition-colors"
            >
              <Plus className="h-4 w-4" /> New post
            </Link>
          </div>
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-8 text-stone-600 text-sm">
              No posts yet. Create your first one.
            </div>
          ) : (
            <ul className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-200 overflow-hidden">
              {posts.slice(0, 8).map((p) => (
                <li key={p.id} className="px-5 py-4">
                  <Link
                    href={`/admin/posts/${p.id}`}
                    className="flex items-center justify-between gap-4 group"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-stone-900 truncate group-hover:underline underline-offset-4">
                        {p.title}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        Updated {new Date(p.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
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
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-2">
        {label}
      </p>
      <p className="font-serif text-4xl text-stone-900">{value}</p>
    </div>
  );
}
