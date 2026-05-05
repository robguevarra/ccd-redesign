import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { reviews } from '@/content/reviews';
import { practiceInfo } from '@/content/practice-info';

export const metadata = {
  title: 'Reviews',
  description: `What patients say about ${practiceInfo.brandName} — curated 5★ reviews from Yelp.`,
};

const SOURCE_LABEL = {
  yelp: 'Yelp',
  google: 'Google',
  facebook: 'Facebook',
} as const;

export default function ReviewsPage() {
  return (
    <>
      <section className="bg-stone-100/60 py-24 md:py-32 border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
            What patients say
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter text-stone-900 leading-[0.95]">
            5 stars,{' '}
            <span className="italic font-light">in our patients' words.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-stone-600 text-lg leading-relaxed">
            Curated from the practice's actual Yelp page. Click through to see
            them in original context, plus all reviews — including the ones we
            haven't featured here.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 md:px-8 py-20 md:py-28">
        <ul className="space-y-16 md:space-y-20">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="border-t border-stone-200 pt-10 md:pt-14"
            >
              <div className="flex items-center gap-3 mb-6 text-stone-900">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-stone-900 text-stone-900"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="font-serif text-2xl md:text-3xl leading-[1.4] text-stone-900">
                "{r.body}"
              </blockquote>
              <footer className="mt-8 text-sm text-stone-600">
                <span className="font-medium text-stone-900">{r.authorName}</span>
                <span className="text-stone-400"> · </span>
                <a
                  href={r.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-900 underline-offset-4 hover:underline"
                >
                  {SOURCE_LABEL[r.source]}
                </a>
              </footer>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-stone-900 text-stone-50 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-5 md:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-5xl tracking-tighter mb-8">
            Read every review on Yelp.
          </h2>
          <p className="text-stone-300 text-lg max-w-xl mx-auto mb-10">
            We curate the ones above for length and clarity, but everything is
            published in full at the source.
          </p>
          <a
            href={practiceInfo.socials.yelp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-stone-50 text-stone-900 px-8 py-4 text-base font-medium hover:bg-stone-200 transition-colors"
          >
            Open Yelp page <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  );
}
