const Philosophy = () => {
  return (
    <section className="px-10 pt-10 pb-20 bg-[#0B0F19] text-white">
      <h2 className="text-5xl font-bold mb-8">
        Engineering Philosophy
      </h2>

      <div className="max-w-3xl space-y-4 text-lg text-gray-400 leading-relaxed">
        <p>
          I don’t treat system failures as disasters. I treat them as engineering problems to understand and solve properly.
        </p>

        <p>
          When something breaks, I don’t panic. I slow down, observe, and try to understand what actually failed and why.
        </p>

        <p>
          I work with deep focus. When I start solving a problem, I stay with it until I understand it clearly. Losing context is one of the biggest reasons engineers make shallow decisions.
        </p>

        <p>
          I don’t depend on tools. I depend on understanding. Tools change, principles don’t.
        </p>
      </div>
    </section>
  );
};

export default Philosophy;




