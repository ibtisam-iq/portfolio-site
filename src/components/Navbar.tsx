import { useState } from "react";

const Navbar = () => {
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-10 py-5 bg-bg border-b border-gray-800 text-white relative z-50">
      
      {/* LOGO → Home */}
      <a
        href="/"
        className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent tracking-wide"
      >
        Ibtisam
      </a>

      <div className="flex gap-8 items-center text-lg">

        {/* Home */}
        <a href="/" className="hover:text-purple-400 transition">Home</a>

        {/* Docs - External */}
        <a
          href="https://docs.ibtisam-iq.com"
          target="_blank"
          className="hover:text-purple-400 transition"
        >
          Docs
        </a>

        {/* ===== Portfolio Dropdown ===== */}
        <div
          className="relative"
          onMouseEnter={() => setPortfolioOpen(true)}
          onMouseLeave={(e) => {
            const related = e.relatedTarget as HTMLElement;
            if (!e.currentTarget.contains(related)) {
              setPortfolioOpen(false);
            }
          }}
        >
          <button className="hover:text-purple-400 transition">
            Portfolio ▾
          </button>

          {portfolioOpen && (
            <div
              className="absolute bg-gray-800 top-full pt-2 rounded-xl shadow-lg w-[200px]"
              onMouseEnter={() => setPortfolioOpen(true)}
              onMouseLeave={() => setPortfolioOpen(false)}
            >
              {/* Internal Links – Same tab */}
              <a className="block px-4 py-2 hover:bg-gray-700 rounded" href="/skills">
                Skills
              </a>

              {/* External – New tab */}
              <a
                className="block px-4 py-2 hover:bg-gray-700 rounded"
                href="https://projects.ibtisam-iq.com"
                target="_blank"
              >
                Projects
              </a>

              {/* Internal */}
              <a className="block px-4 py-2 hover:bg-gray-700 rounded" href="/certificates">
                Certificates
              </a>

              {/* External */}
              <a
                className="block px-4 py-2 hover:bg-gray-700 rounded"
                href="https://achievements.ibtisam-iq.com"
                target="_blank"
              >
                Achievements
              </a>
            </div>
          )}
        </div>

        {/* ✅ New Page - Internal */}
        <a
          href="/how-it-started"
          className="hover:text-purple-400 transition flex items-center gap-2"
       >
          How it started
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>

       </a>


        {/* ===== Resources Dropdown ===== */}
        <div
          className="relative"
          onMouseEnter={() => setResourcesOpen(true)}
          onMouseLeave={(e) => {
            const related = e.relatedTarget as HTMLElement;
            if (!e.currentTarget.contains(related)) {
              setResourcesOpen(false);
            }
          }}
        >
          <button className="hover:text-purple-400 transition">
            Resources ▾
          </button>

          {resourcesOpen && (
            <div
              className="absolute bg-[#111827] backdrop-blur-lg top-full pt-2 rounded-xl shadow-lg w-[200px]"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              {/* External */}
              <a
                className="block px-4 py-2 hover:bg-gray-700 rounded"
                href="https://blogs.ibtisam-iq.com"
                target="_blank"
              >
                Blogs
              </a>

              <a
                className="block px-4 py-2 hover:bg-gray-700 rounded"
                href="https://roadmaps.ibtisam-iq.com"
                target="_blank"
              >
                Roadmaps
              </a>

              <a
                className="block px-4 py-2 hover:bg-gray-700 rounded"
                href="https://cert-prep.ibtisam-iq.com"
                target="_blank"
              >
                Certificate Prep
              </a>
            </div>
          )}
        </div>

        {/* Services - External */}
        <a
          href="https://ibtisamx.com"
          target="_blank"
          className="hover:text-purple-400 transition"
        >
          Services
        </a>

        {/* Contact - Internal */}
        <a href="/contact" className="hover:text-purple-400 transition">
          Contact
        </a>

        {/* Download CV */}
        <a
          href="/cv.pdf"
          download
          className="bg-white text-gray-900 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition"
        >
          Download CV
        </a>

      </div>
    </nav>
  );
};

export default Navbar;
