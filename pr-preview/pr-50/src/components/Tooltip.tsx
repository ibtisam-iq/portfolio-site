// The site's tooltip.

import { useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Replaces the browser's `title` box, which is unstyleable, late and unreachable from a
 * keyboard. It renders through a portal: the figure band is `overflow-hidden`, so a bubble
 * inside a cell would be clipped. The contribution grid keeps native titles.
 */

interface TooltipProps {
  /** Omitted or empty renders the child with no tooltip behaviour at all. */
  text?: string;
  children: (props: TriggerProps) => ReactNode;
}

export interface TriggerProps {
  onPointerEnter?: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave?: () => void;
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
  onBlur?: () => void;
  "aria-describedby"?: string;
}

const MARGIN = 10;

export const Tooltip = ({ text, children }: TooltipProps) => {
  const id = useId();
  const [at, setAt] = useState<{ x: number; y: number } | null>(null);

  if (!text) return <>{children({})}</>;

  const open = (e: { currentTarget: HTMLElement }) => {
    const r = e.currentTarget.getBoundingClientRect();
    // Clamped to the viewport here rather than in CSS, because the bubble is centred on
    // the trigger and a trigger near either edge would otherwise push it off screen.
    const half = 150;
    const x = Math.min(
      Math.max(r.left + r.width / 2, half + MARGIN),
      window.innerWidth - half - MARGIN
    );
    setAt({ x, y: r.top });
  };
  const close = () => setAt(null);

  return (
    <>
      {children({
        onPointerEnter: open,
        onPointerLeave: close,
        onFocus: open,
        onBlur: close,
        "aria-describedby": at ? id : undefined,
      })}
      {at &&
        createPortal(
          <span
            id={id}
            role="tooltip"
            style={{ left: at.x, top: at.y - MARGIN }}
            className="pointer-events-none fixed z-80 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-light-border bg-light-surface px-3 py-1.5 font-mono text-[11px] leading-snug text-light-text shadow-[0_8px_24px_-8px_rgba(0,0,0,0.22)] dark:border-white/16 dark:bg-surface-2 dark:text-text-primary dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.9)]"
          >
            {text}
            {/* The caret. A rotated square with two of its borders showing, which is the
                only way to get a triangle whose edge matches the bubble's own border
                rather than a slightly different colour drawn with the border trick. */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-light-border bg-light-surface dark:border-white/16 dark:bg-surface-2"
            />
          </span>,
          document.body
        )}
    </>
  );
};
