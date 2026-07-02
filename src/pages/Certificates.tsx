import { certificates } from "../data/certificates.ts";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function Certificates() {
  useDocumentTitle("Certifications");

  return (
    <div className="min-h-screen py-24 px-6 text-light-text dark:text-text-primary">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-light-muted dark:text-text-faint">
            Certifications
          </p>
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Professional{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Certifications
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-light-muted dark:text-text-muted">
            {certificates.length} active certifications, both performance-based
            exams. No multiple choice. All prep notes are documented in{" "}
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
        </div>

        {/* Earned certifications */}
        <div className="mb-16">
          <p className="mb-6 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-light-muted dark:text-text-faint">
            Earned
          </p>

          <div className="space-y-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="relative overflow-hidden rounded-xl border border-light-border bg-light-surface p-8 dark:border-border-subtle dark:bg-surface-1"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-purple-600 dark:bg-purple-400" />

                {/* Title row */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
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
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-light-muted dark:text-text-faint">
                  <span>ID: {cert.id}</span>
                  <span className="hidden sm:inline">|</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Valid until {cert.validUntil}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-light-muted dark:text-text-muted">
                  {cert.notes}
                </p>

                {/* Exam domains */}
                {cert.domains.length > 0 && (
                  <div className="mt-6">
                    <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-light-muted dark:text-text-faint">
                      Exam Domains
                    </p>
                    <div className="space-y-2.5">
                      {cert.domains.map((domain) => (
                        <div key={domain.name} className="flex items-center gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-baseline justify-between gap-2">
                              <span className="truncate text-xs text-light-text dark:text-text-primary">
                                {domain.name}
                              </span>
                              <span className="shrink-0 font-mono text-[11px] tabular-nums text-light-muted dark:text-text-faint">
                                {domain.weight}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-light-surface-2 dark:bg-surface-2">
                              <div
                                className="h-full rounded-full bg-purple-600 dark:bg-purple-400"
                                style={{ width: `${domain.weight}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {cert.credlyLink && (
                    <a
                      href={cert.credlyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                    >
                      View Credly Badge
                    </a>
                  )}
                  {cert.vaultNotesLink && (
                    <a
                      href={cert.vaultNotesLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-light-border px-5 py-2.5 text-sm font-semibold text-light-text transition hover:border-purple-400/50 dark:border-border-subtle dark:text-text-primary dark:hover:border-purple-400/30"
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
          <p className="mb-6 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-light-muted dark:text-text-faint">
            In Progress
          </p>

          <div className="relative overflow-hidden rounded-xl border border-dashed border-light-border bg-light-surface p-8 dark:border-border-subtle dark:bg-surface-1">
            <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500 dark:bg-emerald-400" />

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="font-mono text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Preparing
                  </span>
                </div>
                <h2 className="text-xl font-bold">
                  AWS Solutions Architect Associate
                </h2>
                <p className="mt-1 text-sm text-light-muted dark:text-text-muted">
                  Amazon Web Services
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-light-muted dark:text-text-muted">
              Designing highly available, cost-efficient, and fault-tolerant
              systems on AWS. Focus areas include VPC architecture, IAM policies,
              compute and storage selection, and multi-region strategies.
            </p>
          </div>
        </div>

        {/* Cert Vault callout */}
        <div className="rounded-xl border border-teal-accent/20 bg-light-surface p-8 text-center dark:bg-surface-1">
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
      </div>
    </div>
  );
}
