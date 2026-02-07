const Philosophy = () => {
  return (
    <section className="py-24 bg-[#0B0F19] text-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT — TEXT CONTENT */}
        <div>
          <h2 className="text-5xl font-bold mb-10 tracking-tight">
            Engineering Philosophy
          </h2>

          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>
              I don’t treat system failures as disasters. I treat them as engineering
              problems to understand and solve properly.
            </p>

            <p>
              When something breaks, I don’t panic. I slow down, observe, and try to
              understand what actually failed and why.
            </p>

            <p>
              I work with deep focus. When I start solving a problem, I stay with it
              until I understand it clearly. Losing context is one of the biggest
              reasons engineers make shallow decisions.
            </p>

            <p>
              I don’t depend on tools. I depend on understanding.
              <span className="text-gray-400"> Tools change. Principles don’t.</span>
            </p>
          </div>
        </div>

        {/* RIGHT — VISUAL ANCHOR */}
        <div className="relative border border-gray-800 rounded-xl p-6 text-gray-400 text-sm leading-relaxed">
          <div className="absolute -top-3 left-4 bg-[#0B0F19] px-3 text-xs tracking-wide text-gray-500">
            OPERATING PRINCIPLES
          </div>

          <ul className="space-y-3">
            <li>Observe before acting</li>
            <li>Preserve context</li>
            <li>Prefer clarity over speed</li>
            <li>Understand failure modes</li>
            <li>Design for predictability</li>
            <li>Optimize for long-term reliability</li>
          </ul>
        </div>

      </div>
    </section>
  );
};

export default Philosophy;
