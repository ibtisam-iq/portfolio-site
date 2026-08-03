import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon, FiMenu, FiX, FiChevronDown, FiExternalLink, FiDownload } from "react-icons/fi";

const CV_PATH = "/cv.pdf";

const trackResume = (action: string) => {
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", `resume_${action}`, { event_category: "Resume" });
};

const downloadResume = async () => {
  trackResume("download");
  const res = await fetch(CV_PATH);
  const blob = await res.blob();
  const date = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Muhammad-Ibtisam-Iqbal-Resume-${date}.pdf`;
  a.click();
  URL.revokeObjectURL(a.href);
};

const ResumeDropdown = ({ onAction }: { onAction?: () => void }) => (
  <div className="group relative">
    <button className="flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-purple-500">
      Resume
      <FiChevronDown size={13} className="transition-transform duration-200 group-hover:rotate-180" />
    </button>
    <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute right-0 top-full pt-2 transition-all duration-200">
      <div className="min-w-[170px] rounded-lg border border-light-border dark:border-white/10 bg-light-bg dark:bg-surface-1 py-1 shadow-lg">
        <a
          href={CV_PATH}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => { trackResume("view"); onAction?.(); }}
          className="flex items-center gap-2.5 px-4 py-2 text-sm text-light-muted dark:text-text-muted hover:text-light-text dark:hover:text-white hover:bg-light-surface-2 dark:hover:bg-surface-2 transition-colors"
        >
          <FiExternalLink size={14} />
          View Resume
        </a>
        <button
          onClick={() => { downloadResume(); onAction?.(); }}
          className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-light-muted dark:text-text-muted hover:text-light-text dark:hover:text-white hover:bg-light-surface-2 dark:hover:bg-surface-2 transition-colors"
        >
          <FiDownload size={14} />
          Download PDF
        </button>
      </div>
    </div>
  </div>
);

// Prevent TS6133 unused variable errors
void ResumeDropdown;
void CV_PATH;
void trackResume;
void downloadResume;

const navItems: { label: string; to: string; external?: boolean }[] = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "https://projects.ibtisam-iq.com", external: true },
  { label: "Skills", to: "/skills" },
  { label: "Certifications", to: "/certificates" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

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
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 md:px-10">
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent tracking-wide"
        >
          Ibtisam
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-7">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.to}
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                className="pb-1 text-sm font-medium text-light-muted hover:text-light-text dark:text-text-muted dark:hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={`relative pb-1 text-sm font-medium transition-colors ${
                  isActive(item.to)
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-light-muted hover:text-light-text dark:text-text-muted dark:hover:text-white"
                }`}
              >
                {item.label}
                {isActive(item.to) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-purple-600 dark:bg-purple-400" />
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

          {/* <ResumeDropdown /> */}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
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
        <div className="animate-slide-up border-t border-light-border bg-light-bg dark:border-white/5 dark:bg-surface-1 md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.to}
                  href={item.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-light-muted dark:text-text-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(item.to)
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-light-muted dark:text-text-muted"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}

            {/* <a
              href={CV_PATH}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { trackResume("view"); setMobileOpen(false); }}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-light-muted dark:text-text-muted transition-colors"
            >
              View Resume
            </a>
            <button
              onClick={() => { downloadResume(); setMobileOpen(false); }}
              className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-light-muted dark:text-text-muted transition-colors"
            >
              Download Resume
            </button> */}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
