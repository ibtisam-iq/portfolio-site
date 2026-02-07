const TechnicalFoundation = () => {
  return (
    <section className="py-24 bg-[#0B0F19] text-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT — TEXT CONTENT */}
        <div>
          <h2 className="text-5xl font-bold mb-10 tracking-tight">
            Technical Foundation
          </h2>

          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>
              I didn’t come from a CS background. My education was rooted in medical sciences and agriculture,
              so I had to build my entire technical base myself — one concept, one tool, and one system at a time.
            </p>

            <p>
              Very early in my learning I realized something important about myself: I think in systems. Whenever
              a task repeats, my instinct is to design a cleaner, more predictable workflow rather than perform
              the same steps again. That mindset naturally pushed me toward infrastructure and automation.
            </p>

            <p>
              One habit shaped everything I know today — I document what I learn. Over time this became
              <strong className="text-pink-400 ml-1">Nectar</strong>, my long-form engineering knowledge system where
              every concept I studied is written, structured, and refined until fully understood.
            </p>

            <p>
              The second habit is automation. When I kept rebuilding disposable labs and re-installing tools across
              temporary cloud machines, I created scripts to remove the repetition. Those scripts evolved into
              <strong className="text-purple-400 ml-1">infra-bootstrap</strong>, reusable infrastructure bootstrap
              systems.
            </p>

            <p>
              My foundation was built by designing, breaking, and rebuilding real environments — not by
              passively following tutorials. Tools change. System thinking stays.
            </p>
          </div>

          {/* CTA BUTTONS */}
          <div className="flex flex-wrap items-center gap-4 pt-8">
            <a
              href="/how-it-started"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Read the full story →
            </a>

            <a
              href="https://github.com/ibtisam-iq?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1E293B] hover:bg-[#334155] px-6 py-3 rounded-lg text-gray-200 font-semibold transition"
            >
              View Repositories
            </a>
          </div>
        </div>

        {/* RIGHT — VISUAL ANCHOR */}
        <div className="relative border border-gray-800 rounded-xl p-6 text-gray-400 text-sm leading-relaxed">
          <div className="absolute -top-3 left-4 bg-[#0B0F19] px-3 text-xs tracking-wide text-gray-500">
            FOUNDATION SIGNALS
          </div>

          <ul className="space-y-3">
            <li>Linux internals & process model</li>
            <li>Networking fundamentals & traffic flow</li>
            <li>Containers & image optimization</li>
            <li>Kubernetes cluster behavior</li>
            <li>Cloud infrastructure primitives</li>
            <li>Automation & repeatability</li>
          </ul>

          {/* BADGES */}
          <div className="flex flex-wrap gap-3 pt-6">
            <a
              href="https://github.com/ibtisam-iq/nectar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E293B] text-sm text-gray-200 hover:bg-[#334155] transition"
            >
              <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
              Nectar
            </a>

            <a
              href="https://github.com/ibtisam-iq/infra-bootstrap"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E293B] text-sm text-gray-200 hover:bg-[#334155] transition"
            >
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              infra-bootstrap
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TechnicalFoundation;
