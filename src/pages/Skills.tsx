import { useState } from "react";

type Level = "Expert" | "Proficient" | "Growing";

interface Tool {
  name: string;
  level: Level;
}

interface Category {
  title: string;
  tools: Tool[];
}

const categories: Category[] = [
  {
    title: "Containers & Orchestration",
    tools: [
      { name: "Docker",      level: "Expert" },
      { name: "Kubernetes",  level: "Expert" },
      { name: "Helm",        level: "Proficient" },
      { name: "Kustomize",   level: "Proficient" },
      { name: "ArgoCD",      level: "Proficient" },
    ],
  },
  {
    title: "CI/CD & Automation",
    tools: [
      { name: "Jenkins",        level: "Expert" },
      { name: "GitHub Actions", level: "Expert" },
      { name: "SonarQube",      level: "Proficient" },
      { name: "Nexus",          level: "Proficient" },
      { name: "Azure DevOps",   level: "Proficient" },
      { name: "Maven",          level: "Proficient" },
    ],
  },
  {
    title: "Cloud — AWS",
    tools: [
      { name: "EC2 & VPC",               level: "Expert" },
      { name: "IAM",                     level: "Expert" },
      { name: "EKS",                     level: "Expert" },
      { name: "S3 & Route53",            level: "Expert" },
      { name: "ECS",                     level: "Proficient" },
      { name: "CodeCommit & CodeDeploy", level: "Proficient" },
    ],
  },
  {
    title: "IaC & Scripting",
    tools: [
      { name: "Bash",      level: "Expert" },
      { name: "Ansible",   level: "Proficient" },
      { name: "Terraform", level: "Growing" },
    ],
  },
  {
    title: "Linux & OS",
    tools: [
      { name: "Ubuntu / Debian", level: "Expert" },
      { name: "RHEL / CentOS",   level: "Proficient" },
      { name: "Networking",      level: "Proficient" },
    ],
  },
  {
    title: "Observability",
    tools: [
      { name: "Prometheus", level: "Growing" },
      { name: "Grafana",    level: "Growing" },
    ],
  },
  {
    title: "Documentation",
    tools: [
      { name: "MkDocs",   level: "Expert" },
      { name: "Markdown", level: "Expert" },
    ],
  },
];

const chipStyle: Record<Level, string> = {
  Expert:     "bg-gray-800 text-purple-300 border border-purple-800 hover:border-purple-500 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]",
  Proficient: "bg-gray-800 text-blue-300 border border-blue-800 hover:border-blue-500 hover:shadow-[0_0_12px_rgba(59,130,246,0.3)]",
  Growing:    "bg-gray-800 text-emerald-300 border border-emerald-800 hover:border-emerald-500 hover:shadow-[0_0_12px_rgba(52,211,153,0.3)]",
};

const allTitle = "All";

const Skills = () => {
  const [active, setActive] = useState<string>(allTitle);

  const visibleCategories =
    active === allTitle
      ? categories
      : categories.filter((c) => c.title === active);

  return (
    <>
      {/* Hidden ATS/SEO block */}
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
        <h1>Engineering Stack — Muhammad Ibtisam Iqbal, DevOps Engineer</h1>
        <p>
          Docker, Kubernetes, CKA, CKD, Helm, Kustomize, ArgoCD, Jenkins,
          GitHub Actions, SonarQube, Nexus, Azure DevOps, Maven, AWS EC2, VPC,
          IAM, EKS, ECS, S3, Route53, CodeCommit, CodeDeploy, Bash, Ansible,
          Terraform, Ubuntu, RHEL, Linux, Networking, Prometheus, Grafana,
          MkDocs, CI/CD pipelines, infrastructure automation, DevSecOps.
        </p>
      </div>

      <main className="min-h-screen bg-black text-white py-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <h1 className="text-5xl font-bold text-center mb-6 tracking-tight">
            Engineering Stack
          </h1>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto text-lg">
            Every tool here has been used in real infrastructure — CI/CD pipelines,
            Kubernetes clusters, and automated deployments. Not tutorials. Production systems.
          </p>

          {/* Filter Tabs */}
          <div className="flex justify-center flex-wrap gap-3 mb-16" role="tablist">
            <button
              role="tab"
              aria-selected={active === allTitle}
              onClick={() => setActive(allTitle)}
              className={`px-6 py-2 rounded-full text-sm font-semibold tracking-wide transition ${
                active === allTitle
                  ? "bg-white text-black"
                  : "bg-gray-900 border border-gray-700 hover:bg-gray-800"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.title}
                role="tab"
                aria-selected={active === cat.title}
                onClick={() => setActive(cat.title)}
                className={`px-6 py-2 rounded-full text-sm font-semibold tracking-wide transition ${
                  active === cat.title
                    ? "bg-white text-black"
                    : "bg-gray-900 border border-gray-700 hover:bg-gray-800"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Category Sections */}
          <div className="flex flex-col gap-12">
            {visibleCategories.map((cat) => (
              <section key={cat.title}>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-4">
                  {cat.title}
                </p>
                <div className="flex flex-wrap gap-3">
                  {cat.tools.map((tool) => (
                    <span
                      key={tool.name}
                      className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 cursor-default ${chipStyle[tool.level]}`}
                    >
                      {tool.name}
                    </span>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div style={{ marginTop: "3rem" }}>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-4">
              Currently Deepening
            </p>
            <div className="flex flex-wrap gap-3">
              {["Terraform", "Prometheus", "Grafana", "HashiCorp Vault"].map((item) => (
                <span
                  key={item}
                  className="bg-gray-800 border border-emerald-800 hover:border-emerald-500 text-emerald-300 text-sm px-4 py-2 rounded-2xl transition-all duration-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  );
};

export default Skills;
