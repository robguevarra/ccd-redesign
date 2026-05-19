/**
 * Tiny pub-sub singleton that bridges the HomeColdOpenCinematic component
 * (which knows when the home video can play) with the LoadingScreen component
 * (which needs to know when to fade out).
 *
 * Usage:
 *   - In the video component: call markVideoReady() on canplaythrough / loadeddata
 *   - In the loading screen: subscribe via onVideoReady(fn) — fires once
 */

type Listener = () => void;

const listeners = new Set<Listener>();
let ready = false;

/** Signal that the home video has buffered enough to play. Idempotent. */
export function markVideoReady(): void {
  if (ready) return;
  ready = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

/**
 * Subscribe to the video-ready signal. If already ready, fn() is called
 * synchronously and a no-op unsubscribe is returned.
 */
export function onVideoReady(fn: Listener): () => void {
  if (ready) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Returns true if markVideoReady() has been called. */
export function isVideoReady(): boolean {
  return ready;
}
