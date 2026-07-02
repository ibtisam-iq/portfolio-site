import { useState, useEffect, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { useCountUp } from "../hooks/useCountUp";

const hidden = (delay: number): CSSProperties => ({
  opacity: 0,
  transform: "translateY(20px)",
  transition: "opacity 0.7s ease, transform 0.7s ease",
  transitionDelay: `${delay}ms`,
});

const shown = (delay: number): CSSProperties => ({
  opacity: 1,
  transform: "translateY(0)",
  transition: "opacity 0.7s ease, transform 0.7s ease",
  transitionDelay: `${delay}ms`,
});

const stats = [
  { value: 8, suffix: "", label: "Projects", animate: true },
  { value: 66, suffix: "+", label: "Tools", animate: true },
  { value: 0, suffix: "CKA + CKAD", label: "Certified", animate: false },
  { value: 0, suffix: "AWS + K8s", label: "Core Focus", animate: false },
];

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const projectCount = useCountUp(8, 1400, mounted);
  const toolCount = useCountUp(66, 1800, mounted);
  const s = (d: number) => (mounted ? shown(d) : hidden(d));

  return (
    <section className="relative overflow-hidden pt-16 pb-12 md:pt-20 md:pb-16">
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,180,216,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,180,216,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <p
            style={s(0)}
            className="text-sm font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-4"
          >
            DevOps & Cloud Engineer
          </p>

          <h1
            style={s(100)}
            className="text-5xl md:text-6xl font-bold mb-5 text-light-text dark:text-white leading-tight"
          >
            I think in{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              systems
            </span>
            , not tools.
          </h1>

          <p
            style={s(180)}
            className="font-mono text-sm tracking-wide text-teal-accent mb-6"
          >
            kubernetes · aws · ci/cd · gitops
          </p>

          <p
            style={s(250)}
            className="text-lg leading-relaxed max-w-2xl text-light-muted dark:text-gray-300 mb-10"
          >
            CKA and CKAD certified. I build Kubernetes clusters, CI/CD
            pipelines, and cloud infrastructure from first principles. Every
            project documented with source code, runbooks, and terminal
            sessions.
          </p>

          <div style={s(330)} className="flex flex-wrap items-center gap-4 mb-12">
            <Link
              to="/contact"
              className="px-7 py-3.5 bg-purple-600 text-white rounded-lg font-semibold text-base hover:bg-purple-700 transition-colors"
            >
              Contact Me
            </Link>
            <a
              href="https://projects.ibtisam-iq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-lg font-semibold text-base hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              View Projects &rarr;
            </a>
          </div>

          <div style={s(450)} className="flex flex-wrap gap-3">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="flex items-center gap-2 rounded-full border border-light-border bg-light-surface px-4 py-2 dark:border-border-subtle dark:bg-surface-1"
                style={{
                  animation: mounted
                    ? `fadeIn 0.4s ease-out ${500 + i * 100}ms both`
                    : "none",
                }}
              >
                <span className="font-mono text-sm font-semibold text-teal-accent">
                  {stat.animate
                    ? `${stat.label === "Projects" ? projectCount : toolCount}${stat.suffix}`
                    : stat.suffix}
                </span>
                <span className="text-xs text-light-muted dark:text-text-muted">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() =>
              document
                .getElementById("projects-cta")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            aria-hidden="true"
            tabIndex={-1}
            className="animate-bounce-gentle text-light-muted/50 dark:text-text-faint/50 hover:text-teal-accent dark:hover:text-teal-accent transition-colors"
          >
            <FiChevronDown size={22} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
