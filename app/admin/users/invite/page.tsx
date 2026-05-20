import { listDoctors } from '@/lib/supabase/queries';
import { InviteUserForm } from './invite-form';

export const metadata = {
  title: 'Invite user',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function InviteUserPage() {
  const doctors = await listDoctors();
  return (
    <InviteUserForm
      doctors={doctors.map((d) => ({ slug: d.slug, name: d.name }))}
    />
  );
}
