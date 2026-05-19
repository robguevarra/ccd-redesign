import { listAllAppointmentRequests, getCurrentStaffUser } from '@/lib/supabase/queries';
import type { AppointmentStatus } from '@/content/schemas';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function csvEscape(value: string | null | undefined): string {
  if (value == null) return '';
  const needsQuote = /[",\n]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuote ? `"${escaped}"` : escaped;
}

export async function GET(request: Request) {
  const me = await getCurrentStaffUser();
  if (!me) return new NextResponse('Unauthorized', { status: 401 });

  const url = new URL(request.url);
  const status = url.searchParams.get('status') as AppointmentStatus | 'all' | null;
  const inquiries = await listAllAppointmentRequests(status ?? 'all');

  const header = [
    'created_at', 'name', 'phone', 'email', 'preferred_time',
    'status', 'notes', 'internal_notes',
  ].join(',');
  const rows = inquiries.map((i) => [
    csvEscape(i.createdAt), csvEscape(i.name), csvEscape(i.phone),
    csvEscape(i.email), csvEscape(i.preferredTime), csvEscape(i.status),
    csvEscape(i.notes), csvEscape(i.internalNotes),
  ].join(','));
  const body = [header, ...rows].join('\n');
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="inquiries-${date}.csv"`,
    },
  });
}
