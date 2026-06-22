'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ZoomIn, ZoomOut, Contrast, Eye, Sun, Underline,
  Type, RotateCcw, X, Palette,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useA11yPrefs } from './use-a11y-prefs';

/**
 * "Universal Access" symbol — a human figure (head + outstretched arms + legs)
 * enclosed in a ring. This is the Font Awesome `universal-access` glyph (the
 * same mark used as the standard web-accessibility affordance), drawn with
 * `currentColor` so it inherits the button's text color.
 */
function UniversalAccessIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M256 48c114.953 0 208 93.029 208 208 0 114.953-93.029 208-208 208-114.953 0-208-93.029-208-208 0-114.953 93.029-208 208-208m0-40C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 56C149.961 64 64 149.961 64 256s85.961 192 192 192 192-85.961 192-192S362.039 64 256 64zm0 44c19.882 0 36 16.118 36 36s-16.118 36-36 36-36-16.118-36-36 16.118-36 36-36zm117.741 98.023c-28.712 6.779-55.511 12.748-82.14 15.807.851 101.023 12.306 123.052 25.037 155.621 3.617 9.26-.957 19.698-10.217 23.315-9.261 3.617-19.699-.957-23.316-10.217-8.705-22.308-17.086-40.636-22.261-78.549h-9.686c-5.167 37.851-13.534 56.208-22.262 78.549-3.615 9.255-14.05 13.836-23.315 10.217-9.26-3.617-13.834-14.056-10.217-23.315 12.713-32.541 24.185-54.541 25.037-155.621-26.629-3.058-53.428-9.027-82.141-15.807-8.6-2.031-13.926-10.648-11.895-19.249s10.647-13.926 19.249-11.895c96.686 22.829 124.283 22.783 220.775 0 8.599-2.03 17.218 3.294 19.249 11.895 2.029 8.601-3.297 17.219-11.897 19.249z" />
    </svg>
  );
}

export function AccessibilityButton() {
  const { prefs, hydrated, update, increaseText, decreaseText, reset, anyActive } = useA11yPrefs();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  if (!hydrated) return null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close accessibility tools' : 'Open accessibility tools'}
        aria-expanded={open}
        aria-controls="accessibility-panel"
        className={cn(
          'fixed bottom-[20px] right-[20px] z-[60] inline-flex items-center justify-center',
          'h-[48px] w-[48px] rounded-full shadow-lg transition-colors',
          'bg-stone-900 text-stone-50 hover:bg-stone-700',
          anyActive && 'ring-2 ring-[var(--color-accent-600)] ring-offset-2',
        )}
      >
        {open ? (
          <X className="h-[20px] w-[20px]" aria-hidden="true" />
        ) : (
          <UniversalAccessIcon className="h-[24px] w-[24px]" />
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          id="accessibility-panel"
          role="dialog"
          aria-label="Accessibility tools"
          className={cn(
            'fixed bottom-[80px] right-[20px] z-[60] w-[288px] max-w-[calc(100vw-2.5rem)]',
            'rounded-2xl border border-stone-200 bg-white shadow-xl',
            'overflow-hidden',
          )}
        >
          <div className="px-[20px] py-[16px] border-b border-stone-200 bg-stone-50">
            <h2 className="font-serif text-[18px] text-stone-900">Accessibility tools</h2>
            <p className="text-[12px] text-stone-500 mt-1">
              Your choices save automatically on this device.
            </p>
          </div>

          <ul className="py-2 max-h-[70vh] overflow-y-auto">
            <Row
              icon={<ZoomIn className="h-[16px] w-[16px]" />}
              label={`Increase text${prefs.fontSizeStep > 1 ? ` (${[100, 115, 130, 150][prefs.fontSizeStep - 1]}%)` : ''}`}
              onClick={increaseText}
              disabled={prefs.fontSizeStep === 4}
            />
            <Row
              icon={<ZoomOut className="h-[16px] w-[16px]" />}
              label="Decrease text"
              onClick={decreaseText}
              disabled={prefs.fontSizeStep === 1}
            />
            <Row
              icon={<Palette className="h-[16px] w-[16px]" />}
              label="Grayscale"
              onClick={() => update({ grayscale: !prefs.grayscale })}
              active={prefs.grayscale}
            />
            <Row
              icon={<Contrast className="h-[16px] w-[16px]" />}
              label="High contrast"
              onClick={() => update({ highContrast: !prefs.highContrast })}
              active={prefs.highContrast}
            />
            <Row
              icon={<Eye className="h-[16px] w-[16px]" />}
              label="Negative contrast"
              onClick={() => update({ negativeContrast: !prefs.negativeContrast })}
              active={prefs.negativeContrast}
            />
            <Row
              icon={<Sun className="h-[16px] w-[16px]" />}
              label="Light background"
              onClick={() => update({ lightBackground: !prefs.lightBackground })}
              active={prefs.lightBackground}
            />
            <Row
              icon={<Underline className="h-[16px] w-[16px]" />}
              label="Underline links"
              onClick={() => update({ linksUnderline: !prefs.linksUnderline })}
              active={prefs.linksUnderline}
            />
            <Row
              icon={<Type className="h-[16px] w-[16px]" />}
              label="Readable font"
              onClick={() => update({ readableFont: !prefs.readableFont })}
              active={prefs.readableFont}
            />
            <li className="border-t border-stone-200 mt-1 pt-1">
              <Row
                icon={<RotateCcw className="h-[16px] w-[16px]" />}
                label="Reset"
                onClick={reset}
                disabled={!anyActive}
              />
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

function Row({
  icon, label, onClick, active, disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-pressed={active}
        className={cn(
          'w-full flex items-center gap-[12px] px-[20px] py-[10px] text-[14px] text-left',
          'transition-colors',
          active
            ? 'bg-stone-900 text-stone-50'
            : 'text-stone-700 hover:bg-stone-100',
          disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent',
        )}
      >
        <span className="shrink-0">{icon}</span>
        <span className="flex-1">{label}</span>
        {active && <span className="text-xs uppercase tracking-wider opacity-70">On</span>}
      </button>
    </li>
  );
}
