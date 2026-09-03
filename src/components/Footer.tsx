// The site footer: identity, the four link columns, and the live status line.

import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaDocker } from "react-icons/fa";
import { relativeTime } from "../lib/relativeTime";
import { longDate } from "../lib/provenance";
import { useNow } from "../lib/useNow";
import { useLatestPush } from "../hooks/useLatestPush";

// Ibtisam works from Islamabad, so the clock shows his time rather than the reader's.
// Naming the zone matters: a reader in another country should see that this is
// somebody else's afternoon, not a broken clock.
const TIME_ZONE = "Asia/Karachi";
const TIME_ZONE_LABEL = "Islamabad";

const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

const LiveStatus = () => {
  const now = useNow(1000);

  // The same live reading the hero uses, so the two "shipped" lines on a page never
  // disagree. See src/hooks/useLatestPush.ts.
  const lastShipped = useLatestPush();

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-xs text-light-faint dark:text-text-faint">
      <span className="inline-flex items-center gap-2 whitespace-nowrap">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-600 dark:bg-green-400"
        />
        {TIME_ZONE_LABEL}{" "}
        <span
          className="tabular-nums text-light-text dark:text-text-muted"
          // The seconds tick once a second, which is noise for a screen reader.
          aria-hidden={now !== null}
        >
          {now === null ? "--:--:--" : timeFormat.format(now)}
        </span>
      </span>

      {/* Each piece is unbreakable so a narrow screen wraps between them. Left to
          itself the line split "last shipped" across two rows and hyphenated the repo
          name mid-word. */}
      <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5">
        <span className="whitespace-nowrap">shipped</span>
        <a
          href={lastShipped.url}
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap text-light-text transition-colors hover:text-teal-accent dark:text-text-muted dark:hover:text-teal-accent"
          title={`Newest push across all public repos · ${longDate(lastShipped.pushedAt)}`}
        >
          {lastShipped.repo}
        </a>
        {now !== null && (
          <span className="whitespace-nowrap text-light-text dark:text-text-muted">
            {relativeTime(lastShipped.pushedAt, now)}
          </span>
        )}
      </span>
    </div>
  );
};

/*
 * The same five that src/components/Ecosystem.tsx names, and the homepage's list is
 * canonical. Anything a reader can use rather than a place the work lives goes under
 * Resources below.
 */
const ecosystem = [
  { label: "Projects", href: "https://projects.ibtisam-iq.com" },
  { label: "Runbook", href: "https://runbook.ibtisam-iq.com" },
  { label: "Blog", href: "https://blog.ibtisam-iq.com" },
  { label: "Nectar", href: "https://nectar.ibtisam-iq.com" },
  { label: "SilverStack", href: "https://github.com/ibtisam-iq/silver-stack" },
];

/*
 * Fetch a subdomain before adding it here. Roadmaps and Achievements were removed because
 * both serve the same 632-byte placeholder, and an uneven column costs less than a link
 * that goes nowhere.
 */
const resources = [
  { label: "Cert Vault", href: "https://cert-vault.ibtisam-iq.com" },
  { label: "SideQuest", href: "https://sidequest.ibtisam-iq.com" },
  { label: "iximiuz Labs", href: "https://labs.iximiuz.com/a/ibtisam-iq" },
];

const siteLinks = [
  { label: "About", to: "/about" },
  { label: "Tools", to: "/tools" },
  { label: "Certifications", to: "/certificates" },
  { label: "Contact", to: "/contact" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  // No fill. The surface scale is page, raised and sunk; a tinted full-width band is a
  // fourth surface with no name, and it made the footer read as one enormous card.
  return (
    <footer className="border-t border-light-border dark:border-border-subtle">
      <div className="page-frame py-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Identity */}
          <div className="col-span-2 md:col-span-1">
            <Link
              to="/"
              className="inline-block text-xl font-extrabold text-teal-accent tracking-wide"
            >
              Muhammad Ibtisam
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
              <a
                href="https://hub.docker.com/u/mibtisam"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Docker Hub"
                className="text-light-muted transition-colors hover:text-teal-accent dark:text-text-muted dark:hover:text-teal-accent"
              >
                <FaDocker size={18} />
              </a>
              <a
                href="https://labs.iximiuz.com/a/ibtisam-iq"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="iximiuz Labs"
                className="opacity-80 transition-opacity hover:opacity-100"
              >
                <img
                  src="/iximiuz-logo.png"
                  alt="iximiuz Labs"
                  className="h-[18px] w-[18px] rounded-[3.5px]"
                />
              </a>
            </div>
          </div>

          {/* Ecosystem */}
          <div>
            <p className="label">
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
            <p className="label">
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
            <p className="label">
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

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-light-border pt-6 dark:border-border-subtle">
          <LiveStatus />
          <p className="text-center font-mono text-xs text-light-faint dark:text-text-faint tracking-wide">
            &copy; {year} Muhammad Ibtisam &middot; Built with React + TypeScript
            + Tailwind + Vite
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
