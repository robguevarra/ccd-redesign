import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { practiceInfo } from '@/content/practice-info';

export const metadata = {
  title: 'Blog',
  description: `Articles, technology updates, and clinical perspective from the doctors at ${practiceInfo.brandName}.`,
};

export default function BlogPage() {
  return (
    <>
      <section className="bg-stone-100/60 py-24 md:py-32 border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
            Blog
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter text-stone-900 leading-[0.95]">
            From the{' '}
            <span className="italic font-light">practice.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-stone-600 text-lg leading-relaxed">
            Notes on clinical technology, patient stories, and the small
            details of dentistry that we think are worth talking about.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 md:px-8 py-20 md:py-28">
        <div className="rounded-3xl border border-stone-200 bg-stone-100/40 p-12 md:p-16 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
            Coming soon
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">
            New posts arrive here.
          </h2>
          <p className="text-stone-600 max-w-md mx-auto">
            The blog will be updated by the doctors directly through the
            admin interface — first post coming with the v2 launch.
          </p>
          <Link
            href="/request-appointment"
            className="inline-flex items-center gap-2 mt-10 rounded-full bg-stone-900 text-stone-50 px-6 py-3 text-sm font-medium hover:bg-stone-700 transition-colors"
          >
            Request appointment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
