// True once the element has entered the viewport, and true from then on: this drives
// one-shot reveals, so the observer disconnects on first intersection.

// The 1200ms timer is a floor, not a duration. If the observer never fires the content
// would stay hidden permanently, and revealing late is recoverable where that is not.

import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, ...options },
    );

    observer.observe(el);

    const fallback = setTimeout(() => setInView(true), 1200);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}
