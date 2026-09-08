import { useSyncExternalStore } from "react";

/**
 * The current time, re-rendering only when it crosses a `resolutionMs` boundary. Returns
 * null before the first client render, so a prerendered shell shows a placeholder rather
 * than a build-time timestamp. The snapshot must stay the tick count, not the
 * millisecond, or every read is a new value and it loops.
 */
export function useNow(resolutionMs: number): number | null {
  const store = storeFor(resolutionMs);
  const tick = useSyncExternalStore(store.subscribe, store.snapshot, onServer);
  return tick === 0 ? null : tick * resolutionMs;
}

const onServer = () => 0;

// One store per resolution, cached so `subscribe` and `snapshot` keep the same identity
// across renders. Fresh closures each time would make React resubscribe on every render.
const stores = new Map<number, { subscribe: (fn: () => void) => () => void; snapshot: () => number }>();

function storeFor(resolutionMs: number) {
  let store = stores.get(resolutionMs);
  if (!store) {
    store = {
      // Aligned to the boundary, not to mount. A fixed interval leaves the clock up to a
      // full resolution behind, and accumulates drift. Recomputing the delay each tick
      // absorbs both.
      subscribe: (onChange: () => void) => {
        let id: ReturnType<typeof setTimeout>;
        const schedule = () => {
          id = setTimeout(() => {
            onChange();
            schedule();
          }, resolutionMs - (Date.now() % resolutionMs));
        };
        schedule();
        return () => clearTimeout(id);
      },
      snapshot: () => Math.floor(Date.now() / resolutionMs),
    };
    stores.set(resolutionMs, store);
  }
  return store;
}
