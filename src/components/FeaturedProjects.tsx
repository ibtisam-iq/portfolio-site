import { useInView } from "../hooks/useInView";
import { RevealChild } from "./Reveal";

const projects = [
  {
    title: "Microservices GitOps on EKS",
    description:
      "Deployed 10 microservices on Amazon EKS with Terraform, 3 CI pipelines, and fully automated GitOps delivery via ArgoCD Image Updater. Configured Gateway API routing, ExternalDNS, and observability with Prometheus and the Elastic Stack.",
    tech: ["Terraform", "Amazon EKS", "ArgoCD", "Gateway API", "Prometheus"],
    url: "https://projects.ibtisam-iq.com",
  },
  {
    title: "SilverStack CI/CD Platform",
    description:
      "Built a self-hosted CI/CD platform (Jenkins, SonarQube, Nexus) on microVMs with 5 custom OCI rootfs images using systemd as PID 1. Configured Cloudflare Tunnels for CGNAT traversal and published each environment as a publicly accessible playground.",
    tech: ["systemd", "Jenkins", "Cloudflare Tunnel", "GitHub Actions", "Docker"],
    url: "https://projects.ibtisam-iq.com",
  },
  {
    title: "14-Stage DevSecOps Pipeline",
    description:
      "Built a 14-stage CI pipeline for three codebases and implemented it identically on Jenkins and GitHub Actions. Integrated 3-pass Trivy scanning, SonarQube quality gates, and triple-registry publishing (GHCR, Docker Hub, Nexus).",
    tech: ["Jenkins", "GitHub Actions", "Trivy", "SonarQube", "Docker"],
    url: "https://projects.ibtisam-iq.com",
  },
  {
    title: "DebugBox",
    description:
      "Built an open-source Kubernetes debugging toolkit with 3 Alpine variants (14MB to 104MB), 93% smaller than netshoot. Automated multi-arch builds with Trivy gating, in-container smoke tests, and MkDocs documentation.",
    tech: ["Alpine Linux", "Docker Buildx", "Trivy", "GitHub Actions", "Bash"],
    url: "https://projects.ibtisam-iq.com",
  },
];

const FeaturedProjects = () => {
  const { ref, inView } = useInView();

  return (
    <section
      id="projects-cta"
      className="py-20 text-light-text dark:text-text-primary"
      ref={ref}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <RevealChild visible={inView} delay={0}>
          <p className="text-sm font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-4">
            Featured Projects
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight max-w-3xl">
            Built from scratch.{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Documented in detail.
            </span>
          </h2>
          <p className="text-light-muted dark:text-text-muted text-lg leading-relaxed mb-12 max-w-2xl">
            Every project is real infrastructure: CI/CD pipelines, Kubernetes
            clusters, containerized stacks, and automated deployments.
          </p>
        </RevealChild>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <RevealChild
              key={project.title}
              visible={inView}
              delay={100 + i * 100}
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full rounded-xl border border-light-border dark:border-border-subtle bg-light-surface dark:bg-surface-1 p-8 transition hover:border-purple-400/50 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(124,58,237,0.15)]"
              >
                <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                <p className="text-light-muted dark:text-text-muted text-sm leading-relaxed mb-6">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-light-surface-2 dark:bg-surface-2 text-light-muted dark:text-text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            </RevealChild>
          ))}
        </div>

        <RevealChild visible={inView} delay={600}>
          <div className="text-center mt-12">
            <a
              href="https://projects.ibtisam-iq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-purple-600 dark:text-purple-400 font-semibold text-lg hover:text-purple-500 dark:hover:text-purple-300 transition"
            >
              View all projects &rarr;
            </a>
          </div>
        </RevealChild>
      </div>
    </section>
  );
};

export default FeaturedProjects;
