'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

interface AdminNavProps {
  /** Pass through from server layout. 'owner' adds Users tab; 'front_office' sees only Inquiries. */
  role?: 'owner' | 'editor' | 'front_office' | null;
}

const BASE_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/posts', label: 'Posts' },
  { href: '/admin/doctors', label: 'Doctors' },
  { href: '/admin/patient-forms', label: 'Patient Forms' },
  { href: '/admin/inquiries', label: 'Inquiries' },
];

const FRONT_OFFICE_ITEMS = [
  { href: '/admin/inquiries', label: 'Inquiries' },
];

export function AdminNav({ role }: AdminNavProps) {
  const pathname = usePathname();

  let items: Array<{ href: string; label: string }>;
  if (role === 'front_office') {
    items = FRONT_OFFICE_ITEMS;
  } else if (role === 'owner') {
    items = [...BASE_ITEMS, { href: '/admin/users', label: 'Users' }];
  } else {
    items = BASE_ITEMS;
  }

  return (
    <nav
      aria-label="Admin sections"
      className="border-b border-stone-200 bg-white"
    >
      {/*
        Wraps to multiple rows on narrow viewports (mobile / small tablet)
        so every tab is visible without horizontal scrolling. Single row at
        wider widths since all 6 items fit comfortably.
      */}
      <ul className="mx-auto max-w-7xl px-5 md:px-8 flex flex-wrap gap-x-1 gap-y-0 -mb-px">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'inline-flex items-center px-3 py-3 text-sm border-b-2 min-h-[44px]',
                  active
                    ? 'border-stone-900 text-stone-900 font-medium'
                    : 'border-transparent text-stone-600 hover:text-stone-900',
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
