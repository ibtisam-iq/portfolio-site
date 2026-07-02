import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const ecosystem = [
  { label: "Projects", href: "https://projects.ibtisam-iq.com" },
  { label: "Runbook", href: "https://runbook.ibtisam-iq.com" },
  { label: "Blog", href: "https://blog.ibtisam-iq.com" },
  { label: "Roadmaps", href: "https://roadmaps.ibtisam-iq.com" },
];

const resources = [
  { label: "Knowledge Base", href: "https://nectar.ibtisam-iq.com" },
  { label: "Cert Vault", href: "https://cert-vault.ibtisam-iq.com" },
  { label: "Achievements", href: "https://achievements.ibtisam-iq.com" },
  { label: "iximiuz Labs", href: "https://labs.iximiuz.com/a/ibtisam-iq" },
];

const siteLinks = [
  { label: "About", to: "/about" },
  { label: "Skills", to: "/skills" },
  { label: "Certifications", to: "/certificates" },
  { label: "Contact", to: "/contact" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-light-border bg-light-surface dark:border-border-subtle dark:bg-surface-1">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Identity */}
          <div className="col-span-2 md:col-span-1">
            <Link
              to="/"
              className="inline-block text-xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent tracking-wide"
            >
              Ibtisam
            </Link>
            <p className="mt-1 font-mono text-xs text-light-muted dark:text-text-muted">
              DevOps & Cloud Engineer
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://github.com/ibtisam-iq"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-light-muted transition-colors hover:text-teal-accent dark:text-text-muted dark:hover:text-teal-accent"
              >
                <FaGithub size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/ibtisam-iq"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-light-muted transition-colors hover:text-teal-accent dark:text-text-muted dark:hover:text-teal-accent"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Ecosystem */}
          <div>
            <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-light-muted dark:text-text-faint">
              Ecosystem
            </p>
            <ul className="space-y-2">
              {ecosystem.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-light-muted transition-colors hover:text-teal-accent dark:text-text-muted dark:hover:text-teal-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-light-muted dark:text-text-faint">
              Resources
            </p>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-light-muted transition-colors hover:text-teal-accent dark:text-text-muted dark:hover:text-teal-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Site */}
          <div>
            <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-light-muted dark:text-text-faint">
              Site
            </p>
            <ul className="space-y-2">
              {siteLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-light-muted transition-colors hover:text-teal-accent dark:text-text-muted dark:hover:text-teal-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-light-border pt-6 dark:border-border-subtle">
          <p className="text-center font-mono text-xs text-light-muted dark:text-text-faint tracking-wide">
            &copy; {year} Muhammad Ibtisam &middot; Built with React + TypeScript
            + Tailwind + Vite
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
