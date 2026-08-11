import { FiMail, FiCalendar } from "react-icons/fi";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const openTo = [
  "Full-time roles",
  "Contract work",
  "Open-source collaboration",
  "Technical discussions",
];

const contacts = [
  {
    icon: <FiMail size={20} />,
    label: "Email Me Directly",
    href: "mailto:contact@ibtisam-iq.com",
    external: false,
    preferred: true,
  },
  {
    icon: <FaLinkedin size={20} />,
    label: "Connect on LinkedIn",
    href: "https://linkedin.com/in/ibtisam-iq",
    external: true,
    preferred: false,
  },
  {
    icon: <FaGithub size={20} />,
    label: "View on GitHub",
    href: "https://github.com/ibtisam-iq",
    external: true,
    preferred: false,
  },
  {
    icon: <FiCalendar size={20} />,
    label: "Book a Call",
    href: "https://cal.com/ibtisam-iq",
    external: true,
    preferred: false,
  },
];

const ContactPage = () => {
  useDocumentTitle("Contact");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-light-text dark:text-text-primary md:px-10">
      <div className="w-full max-w-lg text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-light-muted dark:text-text-faint">
          Contact
        </p>
        <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
          Let's Build Something{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Serious
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-md text-lg text-light-muted dark:text-text-muted">
          Open to conversations around infrastructure, DevOps systems, cloud
          architecture, and real-world engineering problems.
        </p>

        {/* Open to */}
        <div className="mb-12">
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-light-muted dark:text-text-faint">
            Currently open to
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {openTo.map((item) => (
              <span
                key={item}
                className="rounded-full border border-light-border bg-light-surface px-4 py-1.5 text-sm text-light-text dark:border-border-subtle dark:bg-surface-1 dark:text-text-primary"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Contact methods */}
        <div className="flex flex-col gap-4">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              {...(c.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group flex items-center justify-center gap-3 rounded-xl border border-light-border bg-light-surface px-8 py-4 text-base font-semibold transition-colors hover:border-purple-400/50 hover:text-purple-600 dark:border-border-subtle dark:bg-surface-1 dark:hover:border-purple-400/30 dark:hover:text-purple-400"
            >
              <span className="text-light-muted transition-colors group-hover:text-purple-600 dark:text-text-muted dark:group-hover:text-purple-400">
                {c.icon}
              </span>
              {c.label}
              {c.preferred && (
                <span className="rounded bg-purple-600/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:bg-purple-400/10 dark:text-purple-400">
                  Preferred
                </span>
              )}
            </a>
          ))}
        </div>

        {/* Response note */}
        <p className="mt-10 text-sm text-light-muted dark:text-text-muted">
          I typically respond within 24-48 hours. For urgent matters, email
          works best.
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
