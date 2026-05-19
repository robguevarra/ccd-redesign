'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

export type ToastTone = 'success' | 'info';

export interface ToastState {
  message: string;
  tone: ToastTone;
  // Internal: a key that changes per call so back-to-back showToasts retrigger the auto-dismiss.
  key: number;
}

export function useToast(defaultDurationMs = 3000) {
  const [state, setState] = useState<ToastState | null>(null);
  const timerRef = useRef<number | null>(null);

  const showToast = useCallback(
    (message: string, tone: ToastTone = 'success', durationMs?: number) => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      const ms = durationMs ?? defaultDurationMs;
      const key = Date.now();
      setState({ message, tone, key });
      timerRef.current = window.setTimeout(() => {
        setState(null);
        timerRef.current = null;
      }, ms);
    },
    [defaultDurationMs],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
    };
  }, []);

  return { state, showToast };
}

export function Toast({ state }: { state: ToastState | null }) {
  if (!state) return null;
  return (
    <div
      key={state.key}
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-8 left-1/2 -translate-x-1/2 z-50',
        'rounded-full px-6 py-3 text-sm font-medium shadow-lg',
        'transition-all duration-200',
        state.tone === 'success'
          ? 'bg-stone-900 text-stone-50'
          : 'bg-[var(--color-accent-900,#1f3d3b)] text-stone-50',
      )}
    >
      {state.message}
    </div>
  );
}
