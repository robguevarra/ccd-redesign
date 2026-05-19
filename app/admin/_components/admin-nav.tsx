'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

interface AdminNavProps {
  /** Pass through from server layout. When 'owner', the Users tab renders. */
  role?: 'owner' | 'editor' | null;
}

const BASE_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/posts', label: 'Posts' },
  { href: '/admin/doctors', label: 'Doctors' },
  { href: '/admin/patient-forms', label: 'Patient Forms' },
  { href: '/admin/inquiries', label: 'Inquiries' },
];

export function AdminNav({ role }: AdminNavProps) {
  const pathname = usePathname();
  const items = role === 'owner'
    ? [...BASE_ITEMS, { href: '/admin/users', label: 'Users' }]
    : BASE_ITEMS;

  return (
    <nav
      aria-label="Admin sections"
      className="border-b border-stone-200 bg-white"
    >
      <ul
        className={cn(
          'mx-auto max-w-7xl px-5 md:px-8 flex gap-1 -mb-px',
          // Single row at every width — scroll horizontally if needed.
          // Hides the scrollbar to keep the editorial look while preserving
          // touch + trackpad scroll affordance.
          'overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
      >
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                className={cn(
                  'inline-flex items-center px-3 py-2.5 text-sm border-b-2',
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
