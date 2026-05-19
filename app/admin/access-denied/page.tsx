import Link from 'next/link';
import { signOut } from '../login/actions';

export const metadata = {
  title: 'Access denied',
  robots: { index: false, follow: false },
};

export default function AccessDeniedPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 md:px-8 py-24 text-center">
      <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">
        Your account isn't authorized.
      </h1>
      <p className="text-stone-600 text-lg leading-relaxed mb-10">
        This admin is invite-only. If you should have access, ask the practice
        owner to send you an invite from the Users page.
      </p>
      <div className="flex justify-center gap-3">
        <form action={signOut}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 text-stone-700 px-6 py-3 text-sm font-medium hover:bg-stone-100 transition-colors"
          >
            Sign out
          </button>
        </form>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-6 py-3 text-sm font-medium hover:bg-stone-700 transition-colors"
        >
          Back to site
        </Link>
      </div>
    </div>
  );
}
