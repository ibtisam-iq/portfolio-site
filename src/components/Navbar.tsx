import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";

const navItems = [
  { label: "Home", to: "/" },
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
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-200 ${
        scrolled ? "py-2.5" : "py-4"
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
          {navItems.map((item) => (
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
          ))}

          <a
            href="https://projects.ibtisam-iq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="pb-1 text-sm font-medium text-light-muted hover:text-light-text dark:text-text-muted dark:hover:text-white transition-colors"
          >
            Projects
          </a>

          <button
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-md p-2 text-light-muted transition-colors hover:bg-light-surface-2 hover:text-light-text dark:text-text-muted dark:hover:bg-surface-2 dark:hover:text-white"
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <a
            href="/cv.pdf"
            download
            className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-4 py-2 rounded font-semibold text-sm hover:bg-gray-700 dark:hover:bg-gray-300 transition"
          >
            Download CV
          </a>
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
            {navItems.map((item) => (
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
            ))}

            <a
              href="https://projects.ibtisam-iq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2.5 text-sm font-medium text-light-muted dark:text-text-muted transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Projects
            </a>

            <a
              href="/cv.pdf"
              download
              className="mt-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-4 py-2.5 rounded font-semibold text-sm hover:bg-gray-700 dark:hover:bg-gray-300 transition text-center"
              onClick={() => setMobileOpen(false)}
            >
              Download CV
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
