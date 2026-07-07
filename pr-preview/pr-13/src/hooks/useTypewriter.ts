import { useEffect, useState } from "react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useTypewriter(lines: string[], start: boolean) {
  const [output, setOutput] = useState<string[]>([]);

  useEffect(() => {
    if (!start) return;

    if (prefersReducedMotion()) {
      setOutput(lines);
      return;
    }

    let cancelled = false;
    let lineIdx = 0;
    let charIdx = 0;
    const acc: string[] = [];

    const step = () => {
      if (cancelled || lineIdx >= lines.length) return;
      charIdx++;
      acc[lineIdx] = lines[lineIdx].slice(0, charIdx);
      setOutput([...acc]);

      if (charIdx >= lines[lineIdx].length) {
        lineIdx++;
        charIdx = 0;
        if (lineIdx < lines.length) setTimeout(step, 130);
      } else {
        setTimeout(step, 14);
      }
    };

    const kickoff = setTimeout(step, 250);
    return () => {
      cancelled = true;
      clearTimeout(kickoff);
    };
  }, [start, lines]);

  return output;
}
