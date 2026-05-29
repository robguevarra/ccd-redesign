import { redirect } from 'next/navigation';
import {
  getCurrentStaffUser,
  readWeaveConfigForAdmin,
  readOfficeHoursForAdmin,
} from '@/lib/supabase/queries';
import { formatDayHours } from '@/lib/office-hours';
import { WeaveSettingsForm } from './settings-form';
import { OfficeHoursForm } from './office-hours-form';

export const metadata = {
  title: 'Settings',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const me = await getCurrentStaffUser();
  // Owners and front office only (front office answer the texts). Editors out.
  if (!me || (me.role !== 'owner' && me.role !== 'front_office')) {
    redirect('/admin/dashboard');
  }

  const [weave, hours] = await Promise.all([
    readWeaveConfigForAdmin(),
    readOfficeHoursForAdmin(),
  ]);

  // The Weave "only during office hours" preview reads the SAME saved hours.
  const businessHours = hours.map((h) => ({
    day: h.day,
    label: formatDayHours(h),
  }));

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-12 space-y-16">
      <header>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-stone-900 mb-2">
          Settings
        </h1>
        <p className="text-stone-600">
          Manage the “Text us” button and your office hours. Changes go live on
          the website right away.
        </p>
      </header>

      {/* Section 1 — Office hours (shown on the footer, Contact page, and Google). */}
      <section>
        <h2 className="font-serif text-xl sm:text-2xl text-stone-900 mb-1">
          Office hours
        </h2>
        <p className="text-stone-600 mb-6">
          Updates the footer, the Contact page, what Google shows, and when the
          “Text us” button appears (if it’s set to office-hours only).
        </p>
        <OfficeHoursForm initial={hours} />
      </section>

      {/* Section 2 — Text us button (Weave Text Connect). */}
      <section className="border-t border-stone-200 pt-12">
        <h2 className="font-serif text-xl sm:text-2xl text-stone-900 mb-1">
          “Text us” button
        </h2>
        <p className="text-stone-600 mb-6">
          The texting button (Weave Text Connect) on the Contact and Request
          Appointment pages.
        </p>
        <WeaveSettingsForm
          initial={weave}
          businessHours={businessHours}
          timezone={weave.timezone}
        />
      </section>
    </div>
  );
}
