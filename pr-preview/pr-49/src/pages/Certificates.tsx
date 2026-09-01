// The certifications page: what is held, what is being prepared for, and how each one can
// be verified with its issuer.

import { certificates } from "../data/certificates.ts";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { StatBand, StatFigure } from "../components/StatFigure";

// Every figure below is counted from the certificate data rather than typed, so adding
// a certification updates the band without anyone remembering to.
const IN_PROGRESS = ["CKS", "AWS SAA"] as const;
const HOURS_PER_EXAM = 2;

export default function Certificates() {
  useDocumentTitle("Certifications");

  const earned = certificates.length;
  const inProgress = IN_PROGRESS.length;
  const examHours = earned * HOURS_PER_EXAM;
  const domainCount = certificates.reduce((n, c) => n + c.domains.length, 0);

  return (
    <div className="section-y text-light-text dark:text-text-primary">
      <div className="page-frame">
        {/* Header */}
        <div className="mb-12">
          <p className="eyebrow">
            Certifications
          </p>
          <h1 className="title-page">
            Professional{" "}
            <span className="text-teal-accent">
              Certifications
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-light-muted dark:text-text-muted">
            Both are performance-based: a live cluster, not a question bank. Prep
            notes are in{" "}
            <a
              href="https://cert-vault.ibtisam-iq.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-accent transition-colors hover:text-teal-accent/80"
            >
              cert-vault
            </a>
            .
          </p>

          {/* The figures rather than a sentence containing them. The strongest is the
              zero: a multiple-choice count of nought is what "performance-based" means,
              put as something a reader can check instead of a word to be trusted. */}
          <div className="mt-8">
            <StatBand>
              <StatFigure
                value={String(earned)}
                label="CNCF certifications"
                sub="both current"
                title={`${examHours} hours of live-cluster exams`}
              />
              <StatFigure
                value="0"
                label="multiple-choice questions"
                sub="in either exam"
              />
              <StatFigure
                value={String(domainCount)}
                label="exam domains"
                sub="weighted, listed below"
              />
              <StatFigure
                value={String(inProgress)}
                label="in progress"
                sub="CKS and AWS SAA"
              />
            </StatBand>
          </div>
        </div>

        {/* Earned certifications */}
        <div className="mb-16">
          <p className="label mb-6">
            Earned
          </p>

          {/*
           * Two per row from `lg`: these are peers a reader compares, and nothing in a
           * card wants a full row. `items-stretch` with `flex flex-col` and `mt-auto` on
           * the link row is what makes two cards of different height end on one line.
           */}
          <div className="grid gap-6 lg:grid-cols-2">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="panel relative flex flex-col overflow-hidden p-6 sm:p-7"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-teal-accent dark:bg-teal-accent" />

                {/* The date pill sits in the corner from `sm`, where `min-w-0` lets the
                    title reflow under it, and wraps below on a phone, where it would
                    otherwise cost the title a third of the column. */}
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 sm:flex-nowrap">
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold">{cert.title}</h2>
                    <p className="mt-1 text-sm text-light-muted dark:text-text-muted">
                      {cert.issuer}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-light-border bg-light-surface-2 px-3 py-1 font-mono text-xs text-light-muted dark:border-border-subtle dark:bg-surface-2 dark:text-text-faint">
                    {cert.date}
                  </span>
                </div>

                {/* Meta row */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-light-faint dark:text-text-faint">
                  <span>ID: {cert.id}</span>
                  <span className="hidden sm:inline">|</span>
                  <span className="text-emerald-700 dark:text-emerald-400">
                    Valid until {cert.validUntil}
                  </span>
                </div>

                {/* Capped at the same 68ch measure the About page uses. Unconstrained,
                    this line ran the full 1006px of the card at desktop, which is 144
                    characters: past about 90 the eye loses the start of the next line. */}
                <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-light-muted dark:text-text-muted">
                  {cert.notes}
                </p>

                {/* Exam domains */}

                {/*
                 * Name, bar and percentage on one line, on a fixed 112px track. A full-width
                 * track strands the number from its label and turns a 10% domain into a
                 * stub. What is left over goes to the name, which is what truncates.
                 */}
                {cert.domains.length > 0 && (
                  <div className="mt-6">
                    <p className="label">
                      Exam Domains
                    </p>
                    <div className="space-y-2">
                      {cert.domains.map((domain) => (
                        <div key={domain.name} className="flex items-center gap-3">
                          <span className="min-w-0 flex-1 truncate text-xs text-light-text dark:text-text-primary">
                            {domain.name}
                          </span>
                          <span className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-light-surface-2 sm:w-28 dark:bg-surface-2">
                            <span
                              className="block h-full rounded-full bg-teal-accent"
                              style={{ width: `${domain.weight}%` }}
                            />
                          </span>
                          <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-light-faint dark:text-text-faint">
                            {domain.weight}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* `mt-auto` so the two cards' button rows land on the same line however
                    many exam domains each one lists. */}
                <div className="mt-auto flex flex-wrap gap-3 pt-6">
                  {cert.credlyLink && (
                    <a
                      href={cert.credlyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg px-5 py-2.5 text-sm font-semibold bg-light-text text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-surface-0"
                    >
                      View Credly Badge
                    </a>
                  )}
                  {cert.vaultNotesLink && (
                    <a
                      href={cert.vaultNotesLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-light-border px-5 py-2.5 text-sm font-semibold text-light-text transition hover:border-teal-accent/50 dark:border-border-subtle dark:text-text-primary dark:hover:border-teal-accent/30"
                    >
                      View Prep Notes
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress */}
        <div className="mb-16">
          <p className="label mb-6">
            In Progress
          </p>

          {/*
           * Same two-up. The border is solid: the emerald bar, the pulsing PREPARING label
           * and the absence of any credential already say these are unearned, and a dashed
           * edge would be the only one on the site.
           */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="panel relative overflow-hidden p-6 sm:p-7">
              <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500 dark:bg-emerald-400" />

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    <span className="font-mono text-xs font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Preparing
                    </span>
                  </div>
                  <h2 className="text-xl font-bold">
                    Certified Kubernetes Security Specialist (CKS)
                  </h2>
                  <p className="mt-1 text-sm text-light-muted dark:text-text-muted">
                    Cloud Native Computing Foundation (CNCF)
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-light-muted dark:text-text-muted">
                Performance-based exam focused on Kubernetes cluster hardening,
                system hardening, supply chain security, monitoring and logging,
                and runtime security. Builds on CKA-level cluster administration.
              </p>
            </div>

            <div className="panel relative overflow-hidden p-6 sm:p-7">
              <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500 dark:bg-emerald-400" />

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    <span className="font-mono text-xs font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Preparing
                    </span>
                  </div>
                  {/* `Full Name (ABBR)` on both lines, as every other card on this page
                      does and as src/data/certificates.ts enforces for the earned pair. */}
                  <h2 className="text-xl font-bold">
                    AWS Solutions Architect Associate (SAA)
                  </h2>
                  <p className="mt-1 text-sm text-light-muted dark:text-text-muted">
                    Amazon Web Services (AWS)
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-light-muted dark:text-text-muted">
                Designing highly available, cost-efficient, and fault-tolerant
                systems on AWS. Focus areas include VPC architecture, IAM policies,
                compute and storage selection, and multi-region strategies.
              </p>
            </div>
          </div>
        </div>

        {/*
         * The two closing notes, side by side, so the page ends on one row rather than two
         * more full-width slabs. They are unequal in length, hence `justify-center` on the
         * shorter one.
         */}
        <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel flex flex-col justify-center border-teal-accent/20 p-6 text-center sm:p-7">
          <p className="mb-2 text-sm font-semibold text-teal-accent">
            Cert Vault
          </p>
          <p className="mx-auto max-w-lg text-sm text-light-muted dark:text-text-muted">
            All prep notes, study logs, and exam strategies are documented and
            searchable. Built with MkDocs, updated as I prepare for each exam.
          </p>
          <a
            href="https://cert-vault.ibtisam-iq.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-mono text-sm text-teal-accent transition-colors hover:text-teal-accent/80"
          >
            cert-vault.ibtisam-iq.com ↗
          </a>
        </div>

        {/* Independent audit callout */}
        <div className="panel flex flex-col justify-center border-teal-accent/20 p-6 text-center sm:p-7">
          <p className="mb-2 text-sm font-semibold text-teal-accent">
            Independent Audit
            <span className="ml-2 font-mono text-xs font-normal text-light-muted dark:text-text-muted">
              Aug 02, 2026
            </span>
          </p>
          <p className="mx-auto max-w-lg text-sm text-light-muted dark:text-text-muted">
            An AI research agent was given one line and no other context:
          </p>
          <p className="mx-auto mt-3 w-fit rounded-md border border-light-border px-3 py-1.5 font-mono text-xs text-light-text dark:border-border-subtle dark:text-text-primary">
            do a detailed research on ibtisam-iq
          </p>
          <p className="mx-auto mt-3 max-w-lg text-sm text-light-muted dark:text-text-muted">
            It found the sites, repositories and credentials on its own, then
            checked every claim against a source I do not control. The write-up
            covers what held up, and what did not.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-sm">
            <a
              href="https://hyperagent.com/s/otIn4z6g27aLiqccnQ4kvQ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-accent transition-colors hover:text-teal-accent/80"
            >
              The audit ↗
            </a>
            <span className="text-light-faint dark:text-text-faint">·</span>
            <a
              href="https://blog.ibtisam-iq.com/ai-agent-audit-devops-portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-accent transition-colors hover:text-teal-accent/80"
            >
              What I changed after it ↗
            </a>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
