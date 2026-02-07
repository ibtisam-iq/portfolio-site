const WhyMe = () => {
  return (
    <section className="py-24 bg-[#0B0F19] text-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT — TEXT CONTENT */}
        <div>
          <h2 className="text-5xl font-bold mb-10 tracking-tight">
            Why Me?
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            I don’t just learn tools. I understand systems, break them, rebuild them,
            and automate what others do manually. My thinking is infrastructure-first,
            reliability-first, and scale-first.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">
                Engineering Mindset
              </h3>
              <p className="text-gray-400">
                I think in systems, failure points, and automation instead of tutorials.
              </p>
            </div>

            <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">
                Systems Thinking
              </h3>
              <p className="text-gray-400">
                I design before I build and predict breakpoints before they happen.
              </p>
            </div>

            <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">
                Relentless Learning
              </h3>
              <p className="text-gray-400">
                I don’t stop at working systems — I refine them until they are stable.
              </p>
            </div>

            <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">
                Discipline Driven
              </h3>
              <p className="text-gray-400">
                I treat engineering as a long-term discipline, not a short-term trend.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — VISUAL ANCHOR */}
        <div className="relative border border-gray-800 rounded-xl p-6 text-gray-400 text-sm leading-relaxed">
          <div className="absolute -top-3 left-4 bg-[#0B0F19] px-3 text-xs tracking-wide text-gray-500">
            DIFFERENTIATORS
          </div>

          <ul className="space-y-3">
            <li>Infrastructure-first thinking</li>
            <li>Failure-aware design mindset</li>
            <li>Strong documentation habits</li>
            <li>Automation over repetition</li>
            <li>Hands-on system rebuilding</li>
            <li>Long-term engineering focus</li>
          </ul>
        </div>

      </div>
    </section>
  );
};

export default WhyMe;
