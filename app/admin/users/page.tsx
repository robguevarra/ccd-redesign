import Link from 'next/link';
import { Plus } from 'lucide-react';
import { listStaffUsers, getCurrentStaffUser } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Users',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const me = await getCurrentStaffUser();
  if (me?.role !== 'owner') redirect('/admin/dashboard');

  const users = await listStaffUsers();

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
      <div className="flex items-center justify-between gap-3 mb-10">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-stone-900">Users</h1>
        <Link
          href="/admin/users/invite"
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-4 py-2 text-sm font-medium hover:bg-stone-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Invite user
        </Link>
      </div>

      <ul className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-200 overflow-hidden">
        {users.map((u) => (
          <li key={u.userId} className="px-5 py-4">
            <Link
              href={`/admin/users/${u.userId}`}
              className="flex items-center justify-between gap-4 group"
            >
              <div className="min-w-0">
                <p className="font-medium text-stone-900 group-hover:underline underline-offset-4 truncate">
                  {u.displayName}
                </p>
                <p className="text-sm text-stone-500 truncate">{u.email}</p>
                {u.doctorSlug && (
                  <p className="text-xs text-stone-500 mt-1 truncate">
                    Bound to doctor: <span className="font-mono">{u.doctorSlug}</span>
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className={`text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full inline-block ${
                  u.role === 'owner'
                    ? 'bg-stone-900 text-stone-50'
                    : u.role === 'front_office'
                      ? 'bg-[var(--color-accent-200)] text-[var(--color-accent-900)]'
                      : 'bg-stone-200 text-stone-700'
                }`}>
                  {u.role === 'front_office' ? 'Front Office' : u.role}
                </p>
                {!u.active && (
                  <p className="text-xs text-red-600 mt-1">Deactivated</p>
                )}
                {u.lastSignInAt && (
                  <p className="text-xs text-stone-500 mt-1">
                    Last seen{' '}
                    {new Date(u.lastSignInAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
