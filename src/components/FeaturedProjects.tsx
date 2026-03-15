const ProjectsCTA = () => {
  return (
    <section className="pt-12 pb-16 bg-[#0B0F19] text-white">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        <p className="text-sm font-semibold uppercase tracking-widest text-purple-400 mb-4">
          My Work
        </p>

        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight max-w-3xl">
          I don't just read documentation —{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            I build, deploy, and document production-grade systems.
          </span>
        </h2>

        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-2xl">
          Every project is real infrastructure — CI/CD pipelines, Kubernetes clusters,
          containerized stacks, and automated deployments. Built from scratch. Documented in detail.
        </p>

        <a
          href="https://projects.ibtisam-iq.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition"
        >
          Explore My Projects →
        </a>

      </div>
    </section>
  );
};

export default ProjectsCTA;
