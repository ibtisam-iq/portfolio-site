const Hero = () => {
  return (
    <section className="pt-16 pb-4 bg-[#0B0F19] text-white">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        <h1 className="text-6xl font-bold mb-4">
          I think in systems, not tools.
        </h1>

        <h2 className="text-3xl font-semibold mb-12 max-w-3xl">
          I design and build cloud infrastructure through hands-on, production-style engineering projects.
        </h2>

        <div className="flex items-center gap-6">
          <a
            href="/contact"
            className="px-8 py-4 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition"
          >
            Contact Me
          </a>
          <a
            href="/cv.pdf"
            download
            className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-black transition"
          >
            Download CV
          </a>
        </div>

      </div>
    </section>
  );
};

export default Hero;
