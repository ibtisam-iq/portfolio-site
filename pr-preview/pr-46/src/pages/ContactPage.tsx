// The contact page: the address, the subject picker that pre-writes the message, the terms
// a recruiter screens on, and the two clocks.

import { useRef, useState } from "react";
import { FiMail, FiCalendar, FiCopy, FiCheck } from "react-icons/fi";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import AvailabilityPill from "../components/AvailabilityPill";
import { useNow } from "../lib/useNow";
import { stats } from "../data/stats";

/**
 * One job: get the message written. Hence the subject picker, which fills the subject and
 * the first sentence; two clocks, so a reader does not do the arithmetic; and a count on
 * each channel. Every word here is already written down elsewhere, mostly in the CV.
 */

const EMAIL = "contact@ibtisam-iq.com"

const TIME_ZONE = "Asia/Karachi"
const HOME_CITY = "Islamabad"

const clockFormat = (timeZone: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit", hour12: true })

const homeClock = clockFormat(TIME_ZONE)
const homeOffset = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  timeZoneName: "shortOffset",
})

/**
 * The terms a recruiter screens on, taken from the CV rather than composed here, each
 * labelled with the question it answers. US working hours means a night shift and is
 * published deliberately; see REFERENCE.md.
 */

/*
 * `Replies` belongs in this list, not under the panel: the column is 480px at every
 * viewport, and a loose line beside two clocks always wraps. `Also` stays last.
 */
const openTo = [
  { label: "Engagement", value: "Full-time roles \u00b7 Contract work" },
  { label: "Location", value: "On-site, hybrid or remote" },
  { label: "Hours", value: "US working hours" },
  { label: "Replies", value: "Within 24 to 48 hours" },
  { label: "Also", value: "Open-source collaboration" },
]

/**
 * Setting a subject is the point. The body is one line because a prefilled paragraph reads
 * as a form letter the sender then has to delete, and deleting is friction too.
 */
const SUBJECTS = [
  { id: "role", label: "A role", subject: "A role" },
  { id: "contract", label: "Contract work", subject: "Contract work" },
  { id: "project", label: "A project", subject: "A project" },
  { id: "other", label: "Something else", subject: null },
] as const

const channels = [
  {
    icon: <FaLinkedin size={18} />,
    label: "LinkedIn",
    detail: "Profile and work history",
    shown: "linkedin.com/in/ibtisam-iq",
    href: "https://linkedin.com/in/ibtisam-iq",
  },
  {
    icon: <FaGithub size={18} />,
    // The only one of the three with a number, because it is the only one the site
    // measures. An invented figure on the other two would read as filler and be false.
    label: "GitHub",
    detail: `${stats.publicRepos} public repositories, ${stats.githubStars} stars`,
    shown: "github.com/ibtisam-iq",
    href: "https://github.com/ibtisam-iq",
  },
  {
    icon: <FiCalendar size={18} />,
    label: "Book a call",
    detail: "Pick a slot directly",
    shown: "cal.com/ibtisam-iq",
    href: "https://cal.com/ibtisam-iq",
  },
]

/** His clock and the reader's, side by side. `useNow` ticks on the minute boundary, so
 *  this cannot drift behind the footer's running clock. */
const Clocks = () => {
  const now = useNow(60000)
  const [visitorZone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch {
      return TIME_ZONE
    }
  })

  if (now === null) return null
  const offset =
    homeOffset.formatToParts(now).find((p) => p.type === "timeZoneName")?.value ?? ""
  // Nothing to compare when the reader is already here, and two identical clocks side by
  // side would read as a bug rather than as a courtesy.
  const elsewhere = visitorZone !== TIME_ZONE

  // A fragment, not a wrapping div: nesting a flex row inside the caller's pushes the reply
  // time onto a second line at every width. Returning nothing before hydration then leaves
  // that line in place rather than taking a row with it.
  return (
    <>
      <span className="inline-flex items-center gap-2 text-light-muted dark:text-text-muted">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-600 dark:bg-green-400"
        />
        {homeClock.format(now)} in {HOME_CITY}
        <span className="text-light-faint dark:text-text-faint">{offset}</span>
      </span>
      {elsewhere && (
        <span className="text-light-faint dark:text-text-faint">
          {clockFormat(visitorZone).format(now)} where you are
        </span>
      )}
    </>
  )
}

const CopyEmail = () => {
  // Clipboard writes reject on an insecure origin and when the document is not focused,
  // so the fallback selects the address instead of leaving a button that does nothing.
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle")
  const ref = useRef<HTMLSpanElement>(null)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setState("copied")
      setTimeout(() => setState("idle"), 2000)
    } catch {
      const node = ref.current
      const selection = window.getSelection()
      if (node && selection) {
        const range = document.createRange()
        range.selectNodeContents(node)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      setState("failed")
      setTimeout(() => setState("idle"), 4000)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span
        ref={ref}
        className="select-all font-mono text-base text-light-text dark:text-text-primary sm:text-lg"
      >
        {EMAIL}
      </span>
      <button
        onClick={copy}
        aria-live="polite"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-light-border px-2.5 py-1 font-mono text-[11px] text-light-muted transition-colors hover:border-teal-accent/50 hover:text-teal-accent dark:border-border-subtle dark:text-text-muted"
      >
        {state === "copied" ? <FiCheck size={12} /> : <FiCopy size={12} />}
        {state === "copied" ? "copied" : state === "failed" ? "select and copy" : "copy"}
      </button>
    </div>
  )
}

const EmailPanel = () => {
  const [chosen, setChosen] = useState<string | null>(null)
  const subject = SUBJECTS.find((s) => s.id === chosen)?.subject ?? null
  const href = subject
    ? `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`
    : `mailto:${EMAIL}`

  return (
    <div className="panel beam glow p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-teal-accent">
          <FiMail size={18} />
          <span className="text-sm font-semibold uppercase tracking-wider">Email</span>
        </div>
        <span className="label mb-0">Preferred</span>
      </div>

      <CopyEmail />

      <div className="mt-7">
        <p className="label">What is this about?</p>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => {
            const active = chosen === s.id
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={active}
                onClick={() => setChosen(active ? null : s.id)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-teal-accent/60 bg-teal-accent/10 text-teal-accent"
                    : "border-light-border text-light-muted hover:border-light-muted hover:text-light-text dark:border-border-subtle dark:text-text-muted dark:hover:border-text-muted dark:hover:text-white"
                }`}
              >
                {s.label}
              </button>
            )
          })}
        </div>
      </div>

      <a
        href={href}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-light-text px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 dark:bg-white dark:text-surface-0"
      >
        Write an email
        <span aria-hidden="true">&#8599;</span>
      </a>

      {/* Shown only once a choice is made, so the buttons visibly do something. Without it
          the picker changes an href nobody can see and reads as decoration. */}
      <p className="mt-3 h-4 font-mono text-[11px] text-light-faint dark:text-text-faint">
        {subject ? `Opens with the subject "${subject}"` : ""}
      </p>
    </div>
  )
}

const ContactPage = () => {
  useDocumentTitle("Contact")

  return (
    <div className="section-y text-light-text dark:text-text-primary">
      <div className="page-frame">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          {/* Left: who is asking, and whether he is looking. `flex-col` so `mt-auto` can
              pin the quiet facts to the floor: the grid stretches both columns to the same
              height, and this one has less to say. */}
          <div className="flex flex-col">
            <p className="eyebrow">Contact</p>
            <h1 className="title-page">
              DevOps &amp; Cloud{" "}
              <span className="text-teal-accent">
                Engineer
              </span>
            </h1>
            <p className="max-w-md text-lg text-light-muted dark:text-text-muted">
              Islamabad, Pakistan. Independent engineering projects since April 2024.
            </p>

            {/* One panel, not a floating pill above a row of tags. Whether he is looking
                and what he is looking for are the same question, and a reader scanning for
                it should find one block rather than assemble it from two. */}
            <div className="panel mt-8 p-5 sm:p-6">
              <AvailabilityPill variant="bare" />

              <div className="my-5 h-px bg-light-border dark:bg-border-subtle" />

              <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[auto_minmax(0,1fr)]">
                {openTo.map((item) => (
                  <div key={item.label} className="contents">
                    <dt className="font-mono text-[11px] uppercase leading-6 tracking-[0.2em] text-light-faint dark:text-text-faint">
                      {item.label}
                    </dt>
                    <dd className="-mt-1 text-[15px] leading-6 text-light-muted dark:text-text-muted sm:mt-0">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Clocks only, so this is one line whether or not the visitor's timezone
                differs. The 32px gap is the separator, which is the rule the two clocks
                already followed between themselves. */}
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 pt-2 font-mono text-xs md:mt-auto">
              <Clocks />
            </div>
          </div>

          {/* Right: the channels, each showing where it goes and what is behind it. */}
          <div>
            <EmailPanel />

            <div className="mt-4 grid gap-3">
              {channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="panel panel-link group flex items-center gap-4 px-5 py-4"
                >
                  <span className="shrink-0 text-light-muted transition-colors group-hover:text-teal-accent dark:text-text-muted">
                    {c.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-2.5">
                      <span className="text-sm font-semibold">{c.label}</span>
                      <span className="text-xs text-light-muted dark:text-text-muted">
                        {c.detail}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-[11px] text-light-faint dark:text-text-faint">
                      {c.shown}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-light-faint transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-text-faint"
                  >
                    &#8599;
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
