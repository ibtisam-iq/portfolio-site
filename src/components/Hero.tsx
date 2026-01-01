const Hero = () => {
  return (
    <section className="px-10 py-16 bg-[#0B0F19] text-white">

      {/* Engineering Philosophy */}
      <h1 className="text-6xl font-bold mb-4">
        I think in systems, not tools.
      </h1>

      <h2 className="text-3xl font-semibold mb-12">
        I design and build cloud infrastructure through hands-on, production-style engineering projects.
      </h2>

      {/* Buttons */}
      <div className="flex items-center gap-6">

        <a
          href="/contact"
          target="_blank"
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


    </section>
  );
};

export default Hero;




