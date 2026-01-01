const WhyMe = () => {
  return (
    <section className="px-10 pt-10 pb-20 bg-[#0B0F19] text-white text-center">
      <div className="max-w-5xl mx-auto">

        <h2 className="text-4xl font-bold mb-6">
          Why Me?
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto text-center mb-12">
          I don’t just learn tools. I understand systems, break them, rebuild them and automate what
          others do manually. My thinking is infrastructure-first, reliability-first, and scale-first.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Engineering Mindset</h3>
            <p className="text-gray-400">
              I think in systems, failure points, and automation instead of tutorials.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Systems Thinking</h3>
            <p className="text-gray-400">
              I design before I build. I predict breakpoints before they happen.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Relentless Learning</h3>
            <p className="text-gray-400">
              I don’t stop at working systems — I perfect them.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Discipline Driven</h3>
            <p className="text-gray-400">
              I treat engineering as a long-term discipline, not a trend.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyMe;
