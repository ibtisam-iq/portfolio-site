// Animates a figure from zero to its final value over `duration`, on requestAnimationFrame.
// Used by the hero band, where the numbers are the argument of the page and arriving at
// them reads as counting rather than as loading.
//
// Cubic ease-out: most of the distance is covered early, so the figure is legible for most
// of the animation instead of racing at the end. A caller that needs the row not to reflow
// mid-count reserves the final width; see StatFigure's `widthOf`.

import { useEffect, useState } from "react";

export function useCountUp(target: number, duration = 1500, active = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    let start: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);

  return count;
}
