import { useState } from "react";

const Navbar = () => {
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 md:px-10 py-5 bg-bg border-b border-gray-800 text-white relative z-50">
      
      {/* LOGO → Home */}
      <a
        href="/"
        className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent tracking-wide"
      >
        Ibtisam
      </a>

      {/* Hamburger Menu Button (Mobile Only) */}
      <button
        className="md:hidden text-2xl focus:outline-none"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* Desktop Menu (Hidden on Mobile) */}
      <div className="hidden md:flex gap-8 items-center text-lg">

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
              <a className="block px-4 py-2 hover:bg-gray-700 rounded" href="/skills">
                Skills
              </a>
              <a
                className="block px-4 py-2 hover:bg-gray-700 rounded"
                href="https://projects.ibtisam-iq.com"
                target="_blank"
              >
                Projects
              </a>
              <a className="block px-4 py-2 hover:bg-gray-700 rounded" href="/certificates">
                Certificates
              </a>
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

        {/* How it started */}
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

        {/* Services */}
        <a
          href="https://ibtisamx.com"
          target="_blank"
          className="hover:text-purple-400 transition"
        >
          Services
        </a>

        {/* Contact */}
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

      {/* Mobile Menu (Shows when hamburger is clicked) */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 md:hidden flex flex-col gap-4 p-6 border-b border-gray-800">
          
          <a href="/" className="hover:text-purple-400 transition" onClick={() => setMobileMenuOpen(false)}>
            Home
          </a>

          <a
            href="https://docs.ibtisam-iq.com"
            target="_blank"
            className="hover:text-purple-400 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Docs
          </a>

          {/* Portfolio Section */}
          <div>
            <button 
              className="hover:text-purple-400 transition w-full text-left"
              onClick={() => setPortfolioOpen(!portfolioOpen)}
            >
              Portfolio ▾
            </button>
            {portfolioOpen && (
              <div className="pl-4 mt-2 flex flex-col gap-2">
                <a className="hover:text-purple-400" href="/skills" onClick={() => setMobileMenuOpen(false)}>
                  Skills
                </a>
                <a className="hover:text-purple-400" href="https://projects.ibtisam-iq.com" target="_blank" onClick={() => setMobileMenuOpen(false)}>
                  Projects
                </a>
                <a className="hover:text-purple-400" href="/certificates" onClick={() => setMobileMenuOpen(false)}>
                  Certificates
                </a>
                <a className="hover:text-purple-400" href="https://achievements.ibtisam-iq.com" target="_blank" onClick={() => setMobileMenuOpen(false)}>
                  Achievements
                </a>
              </div>
            )}
          </div>

          <a
            href="/how-it-started"
            className="hover:text-purple-400 transition flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            How it started
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
          </a>

          {/* Resources Section */}
          <div>
            <button 
              className="hover:text-purple-400 transition w-full text-left"
              onClick={() => setResourcesOpen(!resourcesOpen)}
            >
              Resources ▾
            </button>
            {resourcesOpen && (
              <div className="pl-4 mt-2 flex flex-col gap-2">
                <a className="hover:text-purple-400" href="https://blogs.ibtisam-iq.com" target="_blank" onClick={() => setMobileMenuOpen(false)}>
                  Blogs
                </a>
                <a className="hover:text-purple-400" href="https://roadmaps.ibtisam-iq.com" target="_blank" onClick={() => setMobileMenuOpen(false)}>
                  Roadmaps
                </a>
                <a className="hover:text-purple-400" href="https://cert-prep.ibtisam-iq.com" target="_blank" onClick={() => setMobileMenuOpen(false)}>
                  Certificate Prep
                </a>
              </div>
            )}
          </div>

          <a
            href="https://ibtisamx.com"
            target="_blank"
            className="hover:text-purple-400 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Services
          </a>

          <a href="/contact" className="hover:text-purple-400 transition" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </a>

          <a
            href="/cv.pdf"
            download
            className="bg-white text-gray-900 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition text-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            Download CV
          </a>

        </div>
      )}
    </nav>
  );
};

export default Navbar;
