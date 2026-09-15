import { useEffect, useRef } from "react";

/**
 * A drifting particle field behind the hero, on the landing page only. Decoration, so it
 * must cost nothing when unwatched: reduced motion renders nothing at all, an
 * IntersectionObserver stops the loop once the hero is scrolled past, and
 * `visibilitychange` stops it when the tab is hidden. Both gates go through `run`/`stop`,
 * so the loop is never scheduled twice.
 */

const LINK_DISTANCE = 130;
const DENSITY = 1 / 12000; // particles per CSS pixel of hero area
const MAX_PARTICLES = 90;

// One accent, two alphas: a light page reflects far more back, so the value that reads as
// a faint constellation on black reads as dirt on white. Anything here that resolves into
// a shape is too strong, because motion takes the first look on the page.
const INK = {
  dark: { dot: 0.26, link: 0.09 },
  light: { dot: 0.18, link: 0.05 },
};

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

const AmbientCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let onScreen = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(MAX_PARTICLES, Math.round(width * height * DENSITY));
      // Kept rather than regenerated, so a resize does not restart the field.
      while (particles.length > target) particles.pop();
      while (particles.length < target) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: 0.8 + Math.random() * 1.2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Read once per frame, not per particle. The theme can change under the canvas at
      // any time and there is no reason to subscribe for a classList check this cheap.
      const ink = document.documentElement.classList.contains("dark")
        ? INK.dark
        : INK.light;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x += width;
        if (p.x > width) p.x -= width;
        if (p.y < 0) p.y += height;
        if (p.y > height) p.y -= height;
      }

      // O(n^2), which is why the count is capped. At 90 particles that is about 4,000
      // comparisons a frame; the cap is what stops a 4K display from turning this into
      // 40,000. A phone works out to roughly 25 particles and 300 comparisons.
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DISTANCE) continue;
          ctx.strokeStyle = `rgba(0, 180, 216, ${(1 - dist / LINK_DISTANCE) * ink.link})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = `rgba(0, 180, 216, ${ink.dot})`;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const run = () => {
      if (frame || !onScreen || document.hidden) return;
      frame = requestAnimationFrame(draw);
    };

    resize();
    run();

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) run();
        else stop();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : run());
    document.addEventListener("visibilitychange", onVisibility);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
};

export default AmbientCanvas;
