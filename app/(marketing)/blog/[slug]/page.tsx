import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getPublishedPost } from '@/lib/supabase/queries';
import { getDoctor } from '@/content/doctors';

// Posts are Supabase-driven — render on-demand with ISR via revalidatePath
// triggered from the admin publish action.
export const revalidate = 60;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const author = getDoctor(post.authorDoctorSlug);

  return (
    <article>
      <header className="bg-stone-100/60 py-20 md:py-28 border-b border-stone-200">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-4">
            {post.publishedAt &&
              new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tighter text-stone-900 leading-[1.05]">
            {post.title}
          </h1>
          {author && (
            <p className="mt-8 text-stone-600">
              By <span className="font-medium text-stone-900">{author.name}</span>
              <span className="text-stone-400"> · </span>
              {author.title}
            </p>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 md:px-8 py-16 md:py-24">
        <div className="prose prose-stone prose-lg max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-8 prose-p:leading-[1.75]">
          <ReactMarkdown>{post.bodyMdx}</ReactMarkdown>
        </div>

        {post.tags.length > 0 && (
          <div className="mt-16 border-t border-stone-200 pt-8">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-4">
              Tagged
            </p>
            <ul className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <li
                  key={t}
                  className="text-sm text-stone-700 bg-stone-100 rounded-full px-3 py-1"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </article>
  );
}
