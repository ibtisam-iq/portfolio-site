import { Link } from "react-router-dom"
import type { Project } from "../data/projects"

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="h-full rounded-xl border border-gray-700 bg-[#0F172A] p-6 transition hover:border-gray-600">
      
      {/* TITLE */}
      <h3 className="text-xl font-semibold text-white mb-2">
        {project.title}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-gray-300 text-sm leading-relaxed mb-4">
        {project.shortDescription}
      </p>

      {/* TECH TAGS */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map((t) => (
          <span
            key={t}
            className="
              text-[11px]
              uppercase tracking-wide
              px-3 py-1
              rounded-full
              bg-[#020617]
              text-gray-200
              border border-gray-600
            "
          >
            {t}
          </span>
        ))}
      </div>

      {/* LINKS */}
      <div className="flex gap-4">
        <Link
          to={`/projects/${project.slug}`}
          className="text-purple-400 font-medium hover:text-purple-300 transition"
        >
          View Project →
        </Link>

        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-300 transition"
        >
          GitHub
        </a>
      </div>
    </div>
  )
}

