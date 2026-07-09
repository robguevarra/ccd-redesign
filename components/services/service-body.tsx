import Image from 'next/image';
import {
  SERVICE_ILLUSTRATION_RATIO,
  SERVICE_SECONDARY_ILLUSTRATIONS,
} from '@/content/service-images';

interface ServiceBodyProps {
  slug: string;
  body: string;
}

/**
 * Service body copy. For almost every service this renders the body exactly
 * as before — one paragraph block with pre-line whitespace. When the service
 * has a secondary illustration with an `anchor`, the body is split into
 * paragraphs and the figure is placed immediately after the first paragraph
 * containing the anchor phrase (e.g. the partial-denture render sits next to
 * the partial-denture explanation, per client request).
 */
export function ServiceBody({ slug, body }: ServiceBodyProps) {
  const secondary = SERVICE_SECONDARY_ILLUSTRATIONS[slug];
  const textClass = 'text-stone-700 text-lg md:text-xl leading-[1.7] whitespace-pre-line';

  if (!secondary?.anchor) {
    return <p className={textClass}>{body}</p>;
  }

  const paragraphs = body.split('\n\n');
  const anchorIdx = paragraphs.findIndex((p) => p.includes(secondary.anchor!));
  const insertAfter = anchorIdx === -1 ? paragraphs.length - 1 : anchorIdx;

  return (
    <div className="space-y-[1.6em]">
      {paragraphs.map((para, i) => (
        <div key={i} className="space-y-[1.6em]">
          <p className={textClass}>{para}</p>
          {i === insertAfter && (
            <figure className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <Image
                src={secondary.src}
                alt={`Educational illustration showing ${secondary.caption}`}
                width={SERVICE_ILLUSTRATION_RATIO.width}
                height={SERVICE_ILLUSTRATION_RATIO.height}
                sizes="(min-width: 768px) 768px, 100vw"
                className="h-auto w-full"
              />
              <figcaption className="border-t border-stone-100 px-5 py-3 text-center text-xs text-stone-500">
                A simple look at {secondary.caption} — for illustration only.
              </figcaption>
            </figure>
          )}
        </div>
      ))}
    </div>
  );
}
