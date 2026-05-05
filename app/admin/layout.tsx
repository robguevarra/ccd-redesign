import Link from 'next/link';
import { practiceInfo } from '@/content/practice-info';

export const metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="font-serif text-xl tracking-tight">
            {practiceInfo.brandName}
            <span className="text-stone-400 font-sans text-sm font-normal ml-2">
              · admin
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            View site →
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
