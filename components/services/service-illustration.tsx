import Image from 'next/image';
import { FadeUp } from '@/components/motion/fade-up';
import {
  serviceIllustrationSrc,
  SERVICE_ILLUSTRATION_RATIO,
  SERVICE_SECONDARY_ILLUSTRATIONS,
} from '@/content/service-images';

interface ServiceIllustrationProps {
  slug: string;
  name: string;
}

/**
 * Educational illustration shown near the top of a service detail page.
 * Renders nothing when the service has no generated illustration, so it is
 * safe to drop into every service template unconditionally.
 */
export function ServiceIllustration({ slug, name }: ServiceIllustrationProps) {
  const src = serviceIllustrationSrc(slug);
  if (!src) return null;
  const secondary = SERVICE_SECONDARY_ILLUSTRATIONS[slug];
  // Anchored secondaries render inside the body copy (see <ServiceBody>);
  // only un-anchored ones stack here under the primary.
  const stackedSecondary = secondary && !secondary.anchor ? secondary : null;

  return (
    <FadeUp as="section" className="bg-stone-50 pb-16 md:pb-24">
      <div className="mx-auto max-w-3xl px-5 md:px-8 space-y-8">
        <figure className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <Image
            src={src}
            alt={`Educational illustration showing ${name.toLowerCase()}`}
            width={SERVICE_ILLUSTRATION_RATIO.width}
            height={SERVICE_ILLUSTRATION_RATIO.height}
            sizes="(min-width: 768px) 768px, 100vw"
            className="h-auto w-full"
          />
          <figcaption className="border-t border-stone-100 px-5 py-3 text-center text-xs text-stone-500">
            A simple look at {name.toLowerCase()} — for illustration only.
          </figcaption>
        </figure>
        {stackedSecondary && (
          <figure className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <Image
              src={stackedSecondary.src}
              alt={`Educational illustration showing ${stackedSecondary.caption}`}
              width={SERVICE_ILLUSTRATION_RATIO.width}
              height={SERVICE_ILLUSTRATION_RATIO.height}
              sizes="(min-width: 768px) 768px, 100vw"
              className="h-auto w-full"
            />
            <figcaption className="border-t border-stone-100 px-5 py-3 text-center text-xs text-stone-500">
              A simple look at {stackedSecondary.caption} — for illustration only.
            </figcaption>
          </figure>
        )}
      </div>
    </FadeUp>
  );
}
