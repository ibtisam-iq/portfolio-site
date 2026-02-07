import { projects } from "../data/projects"
import { ProjectCard } from "../components/ProjectCard"

export default function Projects() {
  return (
    <main className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-semibold mb-10">
          Engineering Projects
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </main>
  )
}
