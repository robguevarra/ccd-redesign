'use client';

import { useEffect, useState } from 'react';
import { isWeaveLiveNow, type WeaveConfig } from '@/lib/weave';
import type { BusinessHours } from '@/content/schemas';

/**
 * Returns whether Weave is "live" (enabled + within schedule + not blacked
 * out) right now, re-evaluated client-side. We start at `false` so SSR and the
 * first client render agree (no hydration mismatch), then flip in an effect.
 *
 * Re-checks every minute and whenever the tab regains focus, so the schedule
 * boundary (e.g. 6pm close) takes effect without a reload. `hours` are the
 * admin-edited office hours used by the business_hours schedule mode.
 */
export function useWeaveLive(config: WeaveConfig, hours: BusinessHours[]): boolean {
  const [live, setLive] = useState(false);

  useEffect(() => {
    const evaluate = () => setLive(isWeaveLiveNow(config, new Date(), hours));
    evaluate();

    const interval = setInterval(evaluate, 60_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') evaluate();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [config, hours]);

  return live;
}
