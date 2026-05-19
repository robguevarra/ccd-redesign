import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getStaffUserById } from '@/lib/supabase/queries';
import { UserEditor } from './user-editor';

export const metadata = {
  title: 'Edit user',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await params;
  const user = await getStaffUserById(user_id);
  if (!user) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-12">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Users
      </Link>
      <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">
        {user.displayName}
      </h1>
      <p className="text-stone-500 text-sm mb-10">{user.email}</p>
      <UserEditor user={user} />
    </div>
  );
}
