import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { listPublishedPosts } from '@/lib/supabase/queries';
import { practiceInfo } from '@/content/practice-info';

export const metadata = {
  title: 'Blog',
  description: `Articles, technology updates, and clinical perspective from the doctors at ${practiceInfo.brandName}.`,
};

// Re-rendered on demand via revalidateTag('blog-posts') from the admin
// publish action. Public reads cached otherwise.
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await listPublishedPosts();

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
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-stone-100/40 p-12 md:p-16 text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
              Coming soon
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">
              New posts arrive here.
            </h2>
            <p className="text-stone-600 max-w-md mx-auto">
              The doctors update this directly through the admin interface.
              Check back soon — or request an appointment in the meantime.
            </p>
            <Link
              href="/request-appointment"
              className="inline-flex items-center gap-2 mt-10 rounded-full bg-stone-900 text-stone-50 px-6 py-3 text-sm font-medium hover:bg-stone-700 transition-colors"
            >
              Request appointment <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <ul className="grid gap-12 md:gap-16">
            {posts.map((p) => (
              <li key={p.id} className="border-t border-stone-200 pt-8 md:pt-12">
                <Link href={`/blog/${p.slug}`} className="group block">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-3">
                    {p.publishedAt
                      ? new Date(p.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : ''}
                  </p>
                  <h2 className="font-serif text-3xl md:text-5xl tracking-tighter text-stone-900 mb-4 group-hover:underline underline-offset-4 decoration-stone-400">
                    {p.title}
                  </h2>
                  {p.excerpt && (
                    <p className="text-stone-600 text-lg leading-relaxed max-w-3xl">
                      {p.excerpt}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 mt-6 text-sm font-medium text-stone-900 group-hover:gap-2 transition-all">
                    Read <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
