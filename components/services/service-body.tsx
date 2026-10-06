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
 *
 * Long-form bodies that contain heading markers (lines starting `## `) render
 * as structured copy instead — see `StructuredBody`.
 */
export function ServiceBody({ slug, body }: ServiceBodyProps) {
  const secondary = SERVICE_SECONDARY_ILLUSTRATIONS[slug];
  const textClass = 'text-stone-700 text-lg md:text-xl leading-[1.7] whitespace-pre-line';

  if (/^## /m.test(body)) {
    return <StructuredBody body={body} />;
  }

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

type ListItem = { text: string; children: string[] };

/**
 * Minimal markup for long-form, client-supplied documents (e.g. The Oncology
 * Journey). Blocks are separated by blank lines:
 *   `## ` section heading, `### ` sub-section, `#### ` minor heading,
 *   `**text**` emphasised paragraph, `• ` list item, `  ◦ ` nested item.
 * Anything else is a plain paragraph.
 */
function StructuredBody({ body }: { body: string }) {
  const textClass = 'text-stone-700 text-lg md:text-xl leading-[1.7]';

  return (
    <div className="space-y-[1.2em]">
      {body.split(/\n{2,}/).map((block, i) => {
        if (block.startsWith('#### ')) {
          return (
            <h4 key={i} className="pt-4 font-serif text-xl md:text-2xl tracking-tight text-stone-900">
              {block.slice(5)}
            </h4>
          );
        }
        if (block.startsWith('### ')) {
          return (
            <h3
              key={i}
              className="pt-8 text-sm md:text-base font-medium uppercase tracking-[0.14em] text-[var(--color-accent-600)]"
            >
              {block.slice(4)}
            </h3>
          );
        }
        if (block.startsWith('## ')) {
          return (
            <h2
              key={i}
              className="pt-12 first:pt-0 font-serif text-3xl md:text-4xl tracking-tighter text-stone-900 border-t border-stone-300 first:border-t-0 mt-4 first:mt-0"
            >
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith('**') && block.endsWith('**')) {
          return (
            <p key={i} className={`${textClass} font-medium text-stone-900`}>
              {block.slice(2, -2)}
            </p>
          );
        }
        if (block.startsWith('• ')) {
          const items: ListItem[] = [];
          for (const line of block.split('\n')) {
            const nested = line.match(/^\s+◦ (.*)$/);
            if (nested && items.length > 0) items[items.length - 1]!.children.push(nested[1]!);
            else items.push({ text: line.replace(/^• /, ''), children: [] });
          }
          return (
            <ul key={i} className={`${textClass} list-disc pl-6 space-y-1`}>
              {items.map((item, j) => (
                <li key={j}>
                  {item.text}
                  {item.children.length > 0 && (
                    <ul className="list-[circle] pl-6 mt-1 mb-3 space-y-1 text-stone-600">
                      {item.children.map((c, k) => (
                        <li key={k}>{c}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className={textClass}>
            {block}
          </p>
        );
      })}
    </div>
  );
}
