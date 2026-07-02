import { useState, useMemo } from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { toolProjects, PROJECTS_URL } from "../data/toolProjects";

interface Tool {
  name: string;
}

interface Category {
  title: string;
  tools: Tool[];
}

const categories: Category[] = [
  {
    title: "Containers & Orchestration",
    tools: [
      { name: "Docker" },
      { name: "Docker Compose" },
      { name: "Docker Buildx" },
      { name: "Kubernetes" },
      { name: "kubeadm" },
      { name: "Helm" },
      { name: "Helmfile" },
      { name: "Kustomize" },
      { name: "ArgoCD" },
      { name: "Gateway API" },
      { name: "ExternalDNS" },
    ],
  },
  {
    title: "CI/CD & Automation",
    tools: [
      { name: "Jenkins" },
      { name: "GitHub Actions" },
      { name: "SonarQube" },
      { name: "Nexus" },
      { name: "Azure DevOps" },
      { name: "Maven" },
      { name: "Make" },
    ],
  },
  {
    title: "Cloud (AWS)",
    tools: [
      { name: "EC2 & VPC" },
      { name: "IAM" },
      { name: "EKS" },
      { name: "ECS" },
      { name: "S3" },
      { name: "Route 53" },
      { name: "CloudFront" },
      { name: "ACM" },
      { name: "KMS" },
      { name: "CloudFormation" },
      { name: "eksctl" },
      { name: "RDS" },
      { name: "DynamoDB" },
      { name: "SQS" },
      { name: "Lambda" },
      { name: "SNS" },
      { name: "CodeCommit & CodeDeploy" },
    ],
  },
  {
    title: "IaC & Scripting",
    tools: [
      { name: "Bash" },
      { name: "Terraform" },
      { name: "Ansible" },
      { name: "Cloudflare Tunnel" },
      { name: "AWS CLI" },
    ],
  },
  {
    title: "Linux & OS",
    tools: [
      { name: "Ubuntu / Debian" },
      { name: "RHEL / CentOS" },
      { name: "Alpine Linux" },
      { name: "systemd" },
      { name: "Nginx" },
      { name: "Networking" },
    ],
  },
  {
    title: "Security & Supply Chain",
    tools: [
      { name: "Trivy" },
      { name: "Gitleaks" },
      { name: "Hadolint" },
      { name: "cosign" },
      { name: "syft" },
    ],
  },
  {
    title: "Observability",
    tools: [
      { name: "Prometheus" },
      { name: "Grafana" },
      { name: "AlertManager" },
      { name: "Elasticsearch" },
      { name: "Kibana" },
      { name: "Filebeat" },
      { name: "Fluent Bit" },
      { name: "CloudWatch" },
    ],
  },
  {
    title: "Data & Middleware",
    tools: [
      { name: "PostgreSQL" },
      { name: "MySQL" },
      { name: "Redis" },
      { name: "RabbitMQ" },
    ],
  },
  {
    title: "Documentation",
    tools: [
      { name: "MkDocs" },
      { name: "Markdown" },
      { name: "Runbook authoring" },
    ],
  },
];

const certBadges: Record<string, string> = {
  Kubernetes: "CKA + CKAD",
  kubeadm: "CKA",
  Helm: "CKAD",
  Kustomize: "CKAD",
};

const deepening = [
  { name: "AI-Augmented DevOps", context: "Using LLMs for IaC generation, incident triage, and log analysis" },
  { name: "Policy-as-Code", context: "OPA Gatekeeper and Kyverno for cluster governance and compliance" },
  { name: "FinOps", context: "Cloud cost attribution, right-sizing, and resource optimization on AWS" },
  { name: "Progressive Delivery", context: "Canary deployments, feature flags, and automated rollback strategies" },
  { name: "Platform Engineering", context: "Internal developer platforms, self-service infrastructure, and golden paths" },
  { name: "Infrastructure Testing", context: "Terratest, policy unit tests, and automated drift detection" },
];

const allLabel = "All";

const Skills = () => {
  useDocumentTitle("Engineering Stack");
  const [active, setActive] = useState(allLabel);
  const [search, setSearch] = useState("");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    const base =
      active === allLabel
        ? categories
        : categories.filter((c) => c.title === active);

    if (!search.trim()) return base;

    const q = search.toLowerCase();
    return base
      .map((cat) => ({
        ...cat,
        tools: cat.tools.filter((t) => t.name.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.tools.length > 0);
  }, [active, search]);

  const totalTools = new Set(
    categories.flatMap((c) => c.tools.map((t) => t.name))
  ).size;

  const handleToolClick = (toolName: string) => {
    if (!toolProjects[toolName]) return;
    setSelectedTool(selectedTool === toolName ? null : toolName);
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
        }}
        aria-hidden="false"
      >
        <h1>Engineering Stack | Muhammad Ibtisam Iqbal, DevOps & Cloud Engineer</h1>
        <p>
          Docker, Kubernetes, CKA, Helm, Helmfile, Kustomize, ArgoCD, Jenkins,
          GitHub Actions, SonarQube, Nexus, Azure DevOps, Maven, AWS EC2, VPC,
          IAM, EKS, ECS, S3, Route 53, CloudFront, ACM, KMS, CloudFormation,
          eksctl, RDS, DynamoDB, SQS, Lambda, SNS, Bash, Ansible, Terraform,
          Ubuntu, RHEL, Alpine Linux, systemd, Nginx, Networking, Trivy,
          Gitleaks, Hadolint, cosign, syft, Prometheus, Grafana, AlertManager,
          Elasticsearch, Kibana, Filebeat, Fluent Bit, CloudWatch, PostgreSQL,
          MySQL, Redis, RabbitMQ, MkDocs, Runbook authoring, Cloudflare Tunnel,
          Gateway API, ExternalDNS, Docker Buildx, Docker Compose, Make,
          CI/CD pipelines, infrastructure automation, DevSecOps.
        </p>
      </div>

      <div className="min-h-screen py-24 px-6 text-light-text dark:text-text-primary">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-light-muted dark:text-text-faint">
              Engineering Stack
            </p>
            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
              Tools I{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Actually Use
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-light-muted dark:text-text-muted">
              {totalTools} tools across {categories.length} categories. Every
              one used in real infrastructure, documented in{" "}
              <a
                href="https://projects.ibtisam-iq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-accent transition-colors hover:text-teal-accent/80"
              >
                projects
              </a>{" "}
              with source code and runbooks.
            </p>
          </div>

          {/* Search */}
          <div className="mb-8 text-center">
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedTool(null);
              }}
              className="w-full rounded-lg border border-light-border bg-light-surface px-5 py-3 text-sm text-light-text placeholder:text-light-muted focus:outline-none focus:ring-2 focus:ring-purple-500/40 dark:border-border-subtle dark:bg-surface-1 dark:text-text-primary dark:placeholder:text-text-faint md:w-1/2"
            />
          </div>

          {/* Filter tabs */}
          <div className="mb-16">
            <div
              className="flex flex-wrap justify-center gap-2"
              role="tablist"
            >
              <button
                role="tab"
                aria-selected={active === allLabel}
                onClick={() => {
                  setActive(allLabel);
                  setSelectedTool(null);
                }}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  active === allLabel
                    ? "bg-light-text text-white dark:bg-white dark:text-surface-0"
                    : "border border-light-border bg-light-surface text-light-muted hover:border-light-text/30 dark:border-border-subtle dark:bg-surface-1 dark:text-text-muted dark:hover:border-text-muted/50"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.title}
                  role="tab"
                  aria-selected={active === cat.title}
                  onClick={() => {
                    setActive(cat.title);
                    setSelectedTool(null);
                  }}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                    active === cat.title
                      ? "bg-light-text text-white dark:bg-white dark:text-surface-0"
                      : "border border-light-border bg-light-surface text-light-muted hover:border-light-text/30 dark:border-border-subtle dark:bg-surface-1 dark:text-text-muted dark:hover:border-text-muted/50"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-10">
            {filteredCategories.length === 0 && (
              <p className="py-16 text-center text-light-muted dark:text-text-muted">
                No tools match "{search}"
              </p>
            )}

            {filteredCategories.map((cat) => {
              const selectedInCategory = cat.tools.some(
                (t) => t.name === selectedTool
              );

              return (
                <section key={cat.title}>
                  <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-light-muted dark:text-text-faint">
                    {cat.title}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {cat.tools.map((tool) => {
                      const projects = toolProjects[tool.name];
                      const cert = certBadges[tool.name];
                      const isSelected = selectedTool === tool.name;
                      const hasProjects = !!projects;

                      return (
                        <button
                          key={tool.name}
                          onClick={() => handleToolClick(tool.name)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                            isSelected
                              ? "border-purple-400 bg-purple-600/10 text-purple-600 dark:border-purple-400 dark:bg-purple-400/10 dark:text-purple-400"
                              : hasProjects
                                ? "border-light-border bg-light-surface text-light-text hover:border-purple-400/50 dark:border-border-subtle dark:bg-surface-1 dark:text-text-primary dark:hover:border-purple-400/40 cursor-pointer"
                                : "border-light-border bg-light-surface text-light-text dark:border-border-subtle dark:bg-surface-1 dark:text-text-primary cursor-default"
                          }`}
                        >
                          {tool.name}
                          {projects && (
                            <span className="text-[11px] tabular-nums text-light-muted dark:text-text-faint">
                              {projects.length}
                            </span>
                          )}
                          {cert && (
                            <span className="rounded bg-teal-accent/15 px-1.5 py-0.5 text-[10px] font-bold leading-none text-teal-accent">
                              {cert}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Inline project cross-reference */}
                  {selectedInCategory && selectedTool && toolProjects[selectedTool] && (
                    <div className="mt-4 rounded-xl border border-purple-400/30 bg-purple-600/5 p-5 dark:border-purple-400/20 dark:bg-purple-400/5">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm">
                          <span className="font-semibold">{selectedTool}</span>
                          <span className="text-light-muted dark:text-text-muted">
                            {" "}
                            is used in{" "}
                            {toolProjects[selectedTool].length} project
                            {toolProjects[selectedTool].length !== 1 ? "s" : ""}
                          </span>
                        </p>
                        <button
                          onClick={() => setSelectedTool(null)}
                          className="rounded-md p-1 text-light-muted transition-colors hover:text-light-text dark:text-text-faint dark:hover:text-text-primary"
                          aria-label="Close"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M1 1l12 12M13 1L1 13" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {toolProjects[selectedTool].map((name) => (
                          <a
                            key={name}
                            href={PROJECTS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-light-border bg-light-surface px-3 py-1.5 text-sm font-medium text-light-text transition-colors hover:border-purple-400/50 hover:text-purple-600 dark:border-border-subtle dark:bg-surface-1 dark:text-text-primary dark:hover:border-purple-400/30 dark:hover:text-purple-400"
                          >
                            {name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          {/* Currently Deepening */}
          <div className="mt-12 border-t border-light-border pt-10 dark:border-border-subtle">
            <p className="mb-6 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-light-muted dark:text-text-faint">
              Currently Deepening
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {deepening.map((item) => (
                <div
                  key={item.name}
                  className="flex items-start gap-3 rounded-lg border border-teal-accent/20 bg-light-surface p-4 dark:bg-surface-1"
                >
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-teal-accent" />
                  <div>
                    <p className="text-sm font-semibold text-teal-accent">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-light-muted dark:text-text-muted">
                      {item.context}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Skills;
