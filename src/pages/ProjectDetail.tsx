import { useParams } from "react-router-dom"
import { projects } from "../data/projects"

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return <div className="p-10">Project not found</div>
  }

  return (
    <main className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-semibold mb-4">
          {project.title}
        </h1>

        <p className="text-gray-700 mb-8">
          {project.description}
        </p>

        <h2 className="text-2xl font-semibold mb-3">
          Why it matters
        </h2>

        <ul className="list-disc pl-6 mb-8">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>

        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 font-medium"
        >
          View on GitHub →
        </a>
      </div>
    </main>
  )
}
