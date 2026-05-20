import Link from 'next/link';
import { practiceInfo } from '@/content/practice-info';
import { getCurrentStaffUser } from '@/lib/supabase/queries';
import { AdminNav } from './_components/admin-nav';
import { signOut } from './login/actions';

export const metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getCurrentStaffUser();
  const role = me?.role ?? null;

  // Brand link goes to whichever landing page the role can actually use —
  // front_office gets bounced from /admin/dashboard to /admin/inquiries,
  // so point them straight there.
  const brandHref = role === 'front_office' ? '/admin/inquiries' : '/admin/dashboard';

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-4 flex items-center justify-between gap-4">
          <Link href={brandHref} className="font-serif text-xl tracking-tight truncate">
            {practiceInfo.brandName}
            <span className="text-stone-400 font-sans text-sm font-normal ml-2">
              · admin
            </span>
          </Link>
          <div className="flex items-center gap-4 shrink-0">
            {me && (
              <span className="hidden sm:inline text-xs text-stone-500 truncate max-w-[200px]">
                {me.displayName}
              </span>
            )}
            <Link
              href="/"
              className="hidden sm:inline text-sm text-stone-600 hover:text-stone-900 whitespace-nowrap"
            >
              View site →
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm text-stone-600 hover:text-stone-900 whitespace-nowrap"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <AdminNav role={role} />
      {children}
    </div>
  );
}
