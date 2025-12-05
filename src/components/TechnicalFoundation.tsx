const TechnicalFoundation = () => {
  return (
    <section className="px-10 pt-10 pb-20 bg-[#0B0F19] text-white">
      
      {/* SECTION TITLE */}
      <h2 className="text-5xl font-bold mb-12 tracking-tight">
        Technical Foundation
      </h2>

      {/* CONTENT WRAPPER */}
      <div className="max-w-4xl space-y-6 text-lg text-gray-300 leading-relaxed">

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
          every concept I studied is written, structured, and refined until fully understood. Documentation 
          became a tool for clarity, and clarity became a tool for better engineering judgment.
        </p>

        <p>
          The second habit is automation. When I kept rebuilding disposable labs and re-installing tools across 
          temporary cloud machines, I created scripts to remove the repetition. Those scripts evolved into 
          <strong className="text-purple-400 ml-1">infra-bootstrap</strong>, a collection of bootstrap scripts 
          for Kubernetes, cloud tooling, and infrastructure setups. What started as a personal time-saver grew 
          into a reusable engineering project.
        </p>

        <p>
          I developed my foundation by building, breaking, and rebuilding practical environments — not by 
          passively following tutorials. Every layer I learned (Linux, networking, containers, Kubernetes, cloud) 
          came from hands-on work and iteration.
        </p>

        <p>
          My strength is simple: I understand systems by working with them, shaping them, and forcing them to 
          behave reliably. Tools change — but this way of thinking stays.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-wrap items-center gap-4 pt-4">

          {/* Read the full story button */}
          <a
            href="/how-it-started"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Read the full story →
          </a>

          {/* View Repositories */}
          <a
            href="https://github.com/ibtisam-iq?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1E293B] hover:bg-[#334155] px-6 py-3 rounded-lg text-gray-200 font-semibold transition"
          >
            View Repositories
          </a>
        </div>

        {/* BADGES */}
        <div className="flex flex-wrap items-center gap-4 pt-6">

          {/* Nectar badge */}
          <a
            href="https://github.com/ibtisam-iq/nectar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E293B] text-sm text-gray-200 hover:bg-[#334155] transition"
          >
            <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
            Nectar <span className="opacity-60 ml-1">knowledge repo</span>
          </a>

          {/* infra-bootstrap badge */}
          <a
            href="https://github.com/ibtisam-iq/infra-bootstrap"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E293B] text-sm text-gray-200 hover:bg-[#334155] transition"
          >
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            infra-bootstrap <span className="opacity-60 ml-1">bootstrap scripts</span>
          </a>
        </div>

      </div>
    </section>
  );
};

export default TechnicalFoundation;









