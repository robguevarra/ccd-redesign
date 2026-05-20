'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'ccd-a11y-prefs-v1';

export type FontSizeStep = 1 | 2 | 3 | 4; // 100% / 115% / 130% / 150%

export interface A11yPrefs {
  fontSizeStep: FontSizeStep;
  grayscale: boolean;
  highContrast: boolean;
  negativeContrast: boolean;
  lightBackground: boolean;
  linksUnderline: boolean;
  readableFont: boolean;
}

export const DEFAULT_PREFS: A11yPrefs = {
  fontSizeStep: 1,
  grayscale: false,
  highContrast: false,
  negativeContrast: false,
  lightBackground: false,
  linksUnderline: false,
  readableFont: false,
};

function read(): A11yPrefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<A11yPrefs>;
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return DEFAULT_PREFS;
  }
}

function applyToDocument(prefs: A11yPrefs) {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;

  // Font size step — strip old class first
  html.classList.remove(
    'a11y-font-size-1', 'a11y-font-size-2', 'a11y-font-size-3', 'a11y-font-size-4',
  );
  html.classList.add(`a11y-font-size-${prefs.fontSizeStep}`);

  // Boolean toggles
  const toggleClass = (cond: boolean, cls: string) => {
    if (cond) html.classList.add(cls);
    else html.classList.remove(cls);
  };
  toggleClass(prefs.grayscale, 'a11y-grayscale');
  toggleClass(prefs.highContrast, 'a11y-high-contrast');
  toggleClass(prefs.negativeContrast, 'a11y-negative');
  toggleClass(prefs.lightBackground, 'a11y-light-bg');
  toggleClass(prefs.linksUnderline, 'a11y-link-underline');
  toggleClass(prefs.readableFont, 'a11y-readable-font');
}

export function useA11yPrefs() {
  const [prefs, setPrefs] = useState<A11yPrefs>(DEFAULT_PREFS);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate once after mount to avoid SSR/CSR mismatch.
  useEffect(() => {
    const loaded = read();
    setPrefs(loaded);
    setHydrated(true);
    applyToDocument(loaded);
  }, []);

  // Sync DOM whenever prefs change post-hydration.
  useEffect(() => {
    if (!hydrated) return;
    applyToDocument(prefs);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Quota exceeded / private mode — silent.
    }
  }, [prefs, hydrated]);

  const update = useCallback((patch: Partial<A11yPrefs>) => {
    setPrefs((p) => ({ ...p, ...patch }));
  }, []);

  const increaseText = useCallback(() => {
    setPrefs((p) => ({
      ...p,
      fontSizeStep: (Math.min(4, p.fontSizeStep + 1)) as FontSizeStep,
    }));
  }, []);

  const decreaseText = useCallback(() => {
    setPrefs((p) => ({
      ...p,
      fontSizeStep: (Math.max(1, p.fontSizeStep - 1)) as FontSizeStep,
    }));
  }, []);

  const reset = useCallback(() => {
    setPrefs(DEFAULT_PREFS);
  }, []);

  const anyActive =
    prefs.fontSizeStep !== 1 ||
    prefs.grayscale ||
    prefs.highContrast ||
    prefs.negativeContrast ||
    prefs.lightBackground ||
    prefs.linksUnderline ||
    prefs.readableFont;

  return { prefs, hydrated, update, increaseText, decreaseText, reset, anyActive };
}
