'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { MessageSquareText, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/cn';
import { weaveTextConnectUrl, type WeaveConfig } from '@/lib/weave';
import type { BusinessHours } from '@/content/schemas';
import { useWeaveLive } from './use-weave-live';

/**
 * The single Weave "Text us" surface: an on-brand button that opens a modal
 * embedding Weave's hosted Text Connect page in an iframe. Renders nothing
 * unless texting is enabled AND currently within the live schedule.
 *
 * If the embed is ever blocked by the browser, the modal still offers an
 * "Open in a new tab" link so the patient can always reach the text flow.
 */
export function WeaveTextConnect({
  config,
  hours,
  className,
  fullWidth = false,
}: {
  config: WeaveConfig;
  hours: BusinessHours[];
  className?: string;
  fullWidth?: boolean;
}) {
  const live = useWeaveLive(config, hours);
  const [open, setOpen] = useState(false);

  if (!live) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-7 py-4 text-base font-semibold shadow-sm transition-colors hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 min-h-[48px]',
          fullWidth && 'w-full sm:w-auto',
          className,
        )}
      >
        <MessageSquareText className="h-5 w-5" aria-hidden="true" />
        Text us
      </button>
      {open && (
        <WeaveModal widgetId={config.widgetId} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function WeaveModal({
  widgetId,
  onClose,
}: {
  widgetId: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const src = weaveTextConnectUrl(widgetId);

  // Close on Escape, lock body scroll, and move focus into the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-stone-900/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-md flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl h-[85vh] sm:h-[640px] sm:max-h-[85vh]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-stone-200 px-5 py-4">
          <h2 id={titleId} className="flex items-center gap-2 font-serif text-xl text-stone-900">
            <MessageSquareText className="h-5 w-5" aria-hidden="true" />
            Text us
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <iframe
          src={src}
          title="Text us — secure messaging"
          className="flex-1 w-full border-0"
          // Weave's hosted page handles its own form submission + scripts.
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
        />

        {/* Fallback if the embed is blocked: a guaranteed way to reach the flow. */}
        <div className="border-t border-stone-200 px-5 py-3 text-center">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 underline underline-offset-4"
          >
            Trouble seeing the form? Open in a new tab
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
