// The homepage's project cards, from the projects repository by way of
// src/data/generated.ts. Selection and order are that repository's `homepage` flag, so
// nothing here decides what appears.

import { useInView } from "../hooks/useInView";
import { RevealChild } from "./Reveal";
import {
  homepageProjects as projects,
  PROJECT_COUNT,
  PROJECTS_URL,
} from "../data/generated";

const FeaturedProjects = () => {
  const { ref, inView } = useInView();

  return (
    <section
      id="projects-cta"
      className="section-y text-light-text dark:text-text-primary"
      ref={ref}
    >
      <div className="page-frame">
        {/* One rule across the site: a section-level action lives in that section's
            header row, right-aligned. */}
        <RevealChild visible={inView} delay={0}>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <p className="eyebrow">Featured Projects</p>
              <h2 className="title-section max-w-3xl">
                Built from scratch.{" "}
                <span className="text-teal-accent">
                  Documented in detail.
                </span>
              </h2>
            </div>

            <a
              href={PROJECTS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-lg border border-light-border px-4 py-2 text-sm font-medium text-light-muted transition-colors hover:border-teal-accent/50 hover:text-teal-accent dark:border-border-subtle dark:text-text-muted dark:hover:text-teal-accent"
            >
              View all {PROJECT_COUNT} projects
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              >
                &#8599;
              </span>
            </a>
          </div>
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
                className="panel panel-link block h-full p-6"
              >
                <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-light-muted dark:text-text-muted">
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
      </div>
    </section>
  );
};

export default FeaturedProjects;
