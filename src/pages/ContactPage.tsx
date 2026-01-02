const ContactPage = () => {
  return (
    <div className="bg-[#0B0F19] text-white min-h-screen flex flex-col items-center justify-center px-6 md:px-10">

      {/* Heading */}
      <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-center">
        Let’s Build Something Serious
      </h1>

      {/* Sub Text */}
      <p className="text-gray-400 mb-12 text-center max-w-2xl text-lg leading-relaxed">
        I’m always open to meaningful conversations around infrastructure,
        DevOps systems, cloud architecture, and real-world engineering problems.
        If you’re serious about building — we can talk.
      </p>

      {/* Contact Cards */}
      <div className="flex flex-col gap-6 text-lg items-center w-full max-w-md">

        {/* EMAIL */}
        <a
          href="mailto:contact@ibtisam-iq.com"
          className="w-full border border-gray-700 px-8 py-4 rounded-xl text-center hover:bg-white hover:text-black transition font-semibold"
        >
          📧 Email Me Directly
        </a>

        {/* LINKEDIN */}
        <a
          href="https://linkedin.com/in/ibtisam-iq"
          target="_blank"
          className="w-full border border-gray-700 px-8 py-4 rounded-xl text-center hover:bg-white hover:text-black transition font-semibold"
        >
          💼 Connect on LinkedIn
        </a>

        {/* MEETING */}
        <a
          href="https://cal.com/ibtisam-iq"
          target="_blank"
          className="w-full border border-gray-700 px-8 py-4 rounded-xl text-center hover:bg-white hover:text-black transition font-semibold"
        >
          📅 Book a Strategy Call
        </a>

      </div>

    </div>
  );
};

export default ContactPage;

