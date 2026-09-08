// The sticky header: the site's routes, the theme toggle, the source link and the CV, in
// a desktop bar and a mobile menu built from the same definitions.

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon, FiMenu, FiX, FiExternalLink, FiGithub } from "react-icons/fi";

/*
 * The public CV only. This is the variant cv/build-pdf.mjs writes without the phone number.
 * The private per-recruiter links are derived from a secret and must never be linked from a
 * page or ship in a build. See cv/README.md.
 */
const CV_PATH = "/cv.pdf";

const trackCv = () => {
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", "cv_open", { event_category: "CV" });
};

/*
 * One link, not a view-and-download pair: for a PDF those are the same act. Outlined rather
 * than filled, because white on the accent is 2.46:1 and because a filled button here would
 * be a second primary beside Contact.
 */
const CvLink = ({ onAction }: { onAction?: () => void }) => (
  <a
    href={CV_PATH}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => {
      trackCv();
      onAction?.();
    }}
    /*
     * The beam runs continuously here, which is decided rather than incidental: this is the
     * only `.beam` element in a sticky header. It keeps the class's slower 4.5s, and the
     * border stays neutral on hover or it paints the arc out.
     */
    className="beam inline-flex items-center gap-1.5 rounded-full border border-light-border px-3.5 py-1.5 text-sm font-medium text-light-muted transition-colors hover:text-teal-accent dark:border-border-subtle dark:text-text-muted dark:hover:text-teal-accent"
  >
    CV
    <FiExternalLink size={12} className="opacity-60" aria-hidden="true" />
    <span className="sr-only"> (PDF, opens in new tab)</span>
  </a>
);

const navItems: { label: string; to: string; external?: boolean }[] = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "https://projects.ibtisam-iq.com", external: true },
  { label: "Tools", to: "/tools" },
  { label: "Certifications", to: "/certificates" },
  { label: "About", to: "/about" },
];

// Not in the list above, deliberately: six equal links offer no next step. This is the one
// thing the bar asks for, so it is the one thing shaped like a button.
const CONTACT = { label: "Contact", to: "/contact" };

// This site's own source, not the GitHub profile. The profile is already linked from the
// hero figure and the footer; the page itself is not linked anywhere else.
const SOURCE_REPO = "https://github.com/ibtisam-iq/portfolio-site";

const SourceLink = ({ className = "" }: { className?: string }) => (
  <a
    href={SOURCE_REPO}
    target="_blank"
    rel="noopener noreferrer"
    /*
     * Two audiences, two strings. The `aria-label` is longer on purpose: it carries the
     * destination the icon carries for everyone else. Never add a third with an sr-only
     * span.
     */
    title="Source code"
    aria-label="Source code on GitHub (opens in new tab)"
    className={`rounded-md p-2 text-light-muted transition-colors hover:bg-light-surface-2 hover:text-light-text dark:text-text-muted dark:hover:bg-surface-2 dark:hover:text-white ${className}`}
  >
    <FiGithub size={17} aria-hidden="true" />
  </a>
);

const Navbar = () => {
  const { isDark, toggle } = useTheme();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    if (mobileOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-200 ${scrolled ? "py-2.5" : "py-4"
        } border-light-border bg-light-bg/80 dark:border-white/5 dark:bg-surface-0/80`}
    >
      <nav className="page-frame flex items-center justify-between">
        {/* The wordmark is the name, not the handle: the handle is already in the address
            bar, the source link and the email, and a portfolio is a person. */}

        {/* The footer says "Muhammad Ibtisam", which is the right form above a copyright
            line and keeps the page from carrying two identical links to "/". */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-teal-accent tracking-wide"
        >
          Ibtisam
        </Link>

        {/*
         * Desktop bar from `lg`, not `md`: the full bar needs about 860px, and at 768 the
         * wordmark and the first nav item touch. 768 to 1023 goes to the mobile menu.
         */}
        <div className="hidden lg:flex items-center gap-7">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.to}
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 pb-1 text-sm font-medium text-light-muted hover:text-light-text dark:text-text-muted dark:hover:text-white transition-colors"
              >
                {item.label}
                <FiExternalLink size={12} className="opacity-60" aria-hidden="true" />
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={`relative pb-1 text-sm font-medium transition-colors ${
                  isActive(item.to)
                    ? "text-teal-accent"
                    : "text-light-muted hover:text-light-text dark:text-text-muted dark:hover:text-white"
                }`}
              >
                {item.label}
                {isActive(item.to) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-teal-accent dark:bg-teal-accent" />
                )}
              </Link>
            )
          )}

          <button
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-md p-2 text-light-muted transition-colors hover:bg-light-surface-2 hover:text-light-text dark:text-text-muted dark:hover:bg-surface-2 dark:hover:text-white"
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <SourceLink />

          {/* Before Contact, so the filled pill stays the last and highest-emphasis
              thing on the bar. An outlined link after it would blunt the primary. */}
          <CvLink />

          <Link
            to={CONTACT.to}
            aria-current={isActive(CONTACT.to) ? "page" : undefined}
            className="rounded-full bg-light-text px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:opacity-90 dark:bg-white dark:text-surface-0"
          >
            {CONTACT.label}
          </Link>
        </div>

        {/* Mobile and tablet controls. See the note on the desktop bar for why `lg`. */}
        <div className="flex items-center gap-1 lg:hidden">
          <SourceLink className="p-2.5" />
          <button
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-md p-2.5 text-light-muted dark:text-text-muted"
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="rounded-md p-2.5 text-light-muted dark:text-text-muted"
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="animate-slide-up border-t border-light-border bg-light-bg dark:border-white/5 dark:bg-surface-1 lg:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.to}
                  href={item.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-2.5 text-sm font-medium text-light-muted dark:text-text-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                  <FiExternalLink size={12} className="opacity-60" aria-hidden="true" />
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(item.to)
                      ? "text-teal-accent"
                      : "text-light-muted dark:text-text-muted"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}

            <Link
              to={CONTACT.to}
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-md bg-light-text px-3 py-2.5 text-center text-sm font-semibold text-white dark:bg-white dark:text-surface-0"
            >
              {CONTACT.label}
            </Link>

            {/* Same component as the desktop bar, so the two menus cannot drift apart.
                Ordered after Contact because on a phone the primary action should be the
                one nearest the thumb. */}
            <div className="mt-2">
              <CvLink onAction={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
