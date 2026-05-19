import Link from 'next/link';
import { Download } from 'lucide-react';
import { listAllAppointmentRequests } from '@/lib/supabase/queries';
import type { AppointmentStatus } from '@/content/schemas';
import { cn } from '@/lib/cn';

export const metadata = {
  title: 'Inquiries',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const FILTERS: Array<{ key: AppointmentStatus | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'closed', label: 'Closed' },
];

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = (FILTERS.find((f) => f.key === status)?.key ?? 'all') as
    AppointmentStatus | 'all';
  const inquiries = await listAllAppointmentRequests(filter);

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900">Inquiries</h1>
        <Link
          href={`/admin/inquiries/export${filter !== 'all' ? `?status=${filter}` : ''}`}
          className="inline-flex items-center gap-2 rounded-full border border-stone-300 text-stone-700 px-4 py-2 text-sm font-medium hover:bg-stone-100 transition-colors"
        >
          <Download className="h-4 w-4" /> Export CSV
        </Link>
      </div>

      <nav className="flex gap-2 mb-8" aria-label="Filter inquiries">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <Link
              key={f.key}
              href={f.key === 'all' ? '/admin/inquiries' : `/admin/inquiries?status=${f.key}`}
              className={cn(
                'inline-flex items-center px-4 py-1.5 text-sm rounded-full border transition-colors',
                active
                  ? 'border-stone-900 bg-stone-900 text-stone-50'
                  : 'border-stone-300 text-stone-700 hover:bg-stone-100',
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </nav>

      {inquiries.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-12 text-stone-500 text-sm text-center">
          No inquiries{filter !== 'all' && ` with status "${filter}"`}.
        </div>
      ) : (
        <ul className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-200 overflow-hidden">
          {inquiries.map((i) => (
            <li key={i.id} className="px-5 py-4">
              <Link
                href={`/admin/inquiries/${i.id}`}
                className="flex items-center justify-between gap-4 group"
              >
                <div className="min-w-0">
                  <p className="font-medium text-stone-900 group-hover:underline underline-offset-4">
                    {i.name}
                  </p>
                  <p className="text-sm text-stone-600 font-mono tabular-nums">
                    {i.phone}
                    {i.email && (
                      <>
                        <span className="text-stone-400"> · </span>
                        <span className="font-sans">{i.email}</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn(
                    'text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full inline-block',
                    i.status === 'new'
                      ? 'bg-stone-900 text-stone-50'
                      : i.status === 'contacted'
                        ? 'bg-[var(--color-accent-200)] text-[var(--color-accent-900)]'
                        : 'bg-stone-200 text-stone-700',
                  )}>
                    {i.status}
                  </span>
                  <p className="text-xs text-stone-500 mt-1">
                    {new Date(i.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric',
                    })}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
