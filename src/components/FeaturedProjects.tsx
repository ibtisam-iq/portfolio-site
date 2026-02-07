import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import { ProjectCard } from "./ProjectCard";

const FeaturedProjects = () => {
  const featured = projects.slice(0, 5);
  const [active, setActive] = useState(0);

  // auto-slide
  useEffect(() => {
    if (featured.length <= 1) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % featured.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featured.length]);

  return (
    <section className="py-24 bg-gradient-to-b from-[#0B0F19] via-black to-[#0B0F19] text-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT — TEXT */}
        <div>
          <h2 className="text-5xl font-bold mb-6 tracking-tight">
            Featured Engineering Projects
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            These projects represent how I think as an engineer — designing systems,
            understanding failure modes, and building infrastructure that behaves
            predictably under real conditions.
          </p>

          <Link
            to="/projects"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            View all projects →
          </Link>
        </div>

        {/* RIGHT — SLIDER */}
        <div className="relative overflow-hidden">

          {/* TRACK */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${active * 100}%)`,
            }}
          >
            {featured.map((project) => (
              <div key={project.slug} className="min-w-full px-2">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>

          {/* DOTS */}
          <div className="flex justify-center gap-2 mt-6">
            {featured.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  active === index
                    ? "bg-purple-500"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default FeaturedProjects;




