import { useState } from "react";

const Navbar = () => {
  const [engineeringOpen, setEngineeringOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileEngineeringOpen, setMobileEngineeringOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 md:px-10 py-5 bg-bg border-b border-gray-800 text-white relative z-50">

      {/* LOGO */}
      <a
        href="/"
        className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent tracking-wide"
      >
        Ibtisam
      </a>

      {/* Hamburger (Mobile) */}
      <button
        className="md:hidden text-2xl focus:outline-none"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* ===== Desktop Menu ===== */}
      <div className="hidden md:flex gap-8 items-center text-lg">

        <a href="/" className="hover:text-purple-400 transition">Home</a>

        <a
          href="https://projects.ibtisam-iq.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-purple-400 transition"
        >
          Projects
        </a>

        <a href="/certificates" className="hover:text-purple-400 transition">Certifications</a>

        {/* Engineering Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setEngineeringOpen(true)}
          onMouseLeave={(e) => {
            const related = e.relatedTarget as HTMLElement;
            if (!e.currentTarget.contains(related)) setEngineeringOpen(false);
          }}
        >
          <button className="hover:text-purple-400 transition">Engineering ▾</button>
          {engineeringOpen && (
            <div
              className="absolute bg-gray-800 top-full pt-2 rounded-xl shadow-lg w-[180px]"
              onMouseEnter={() => setEngineeringOpen(true)}
              onMouseLeave={() => setEngineeringOpen(false)}
            >
              <a className="block px-4 py-2 hover:bg-gray-700 rounded" href="/skills">
                Skills
              </a>
              <a
                className="block px-4 py-2 hover:bg-gray-700 rounded"
                href="https://achievements.ibtisam-iq.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Achievements
              </a>
            </div>
          )}
        </div>

        {/* Resources Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setResourcesOpen(true)}
          onMouseLeave={(e) => {
            const related = e.relatedTarget as HTMLElement;
            if (!e.currentTarget.contains(related)) setResourcesOpen(false);
          }}
        >
          <button className="hover:text-purple-400 transition">Resources ▾</button>
          {resourcesOpen && (
            <div
              className="absolute bg-gray-800 top-full pt-2 rounded-xl shadow-lg w-[220px]"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <a className="block px-4 py-2 hover:bg-gray-700 rounded" href="https://blog.ibtisam-iq.com" target="_blank" rel="noopener noreferrer">Blog</a>
              <a className="block px-4 py-2 hover:bg-gray-700 rounded" href="https://roadmaps.ibtisam-iq.com" target="_blank" rel="noopener noreferrer">Roadmaps</a>
              <a className="block px-4 py-2 hover:bg-gray-700 rounded" href="https://cert-vault.ibtisam-iq.com" target="_blank" rel="noopener noreferrer">Cert Practice Vault</a>
              <a className="block px-4 py-2 hover:bg-gray-700 rounded" href="https://nectar.ibtisam-iq.com" target="_blank" rel="noopener noreferrer">Knowledge Base</a>
            </div>
          )}
        </div>

        <a href="/about" className="hover:text-purple-400 transition">About</a>

        <a href="/contact" className="hover:text-purple-400 transition">Contact</a>

        <a
          href="/cv.pdf"
          download
          className="bg-white text-gray-900 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition"
        >
          Download CV
        </a>

      </div>

      {/* ===== Mobile Menu ===== */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 md:hidden flex flex-col gap-4 p-6 border-b border-gray-800">

          <a href="/" className="hover:text-purple-400 transition" onClick={() => setMobileMenuOpen(false)}>Home</a>

          <a
            href="https://projects.ibtisam-iq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Projects
          </a>

          <a href="/certificates" className="hover:text-purple-400 transition" onClick={() => setMobileMenuOpen(false)}>Certifications</a>

          {/* Engineering (Mobile) */}
          <div>
            <button
              className="hover:text-purple-400 transition w-full text-left"
              onClick={() => setMobileEngineeringOpen(!mobileEngineeringOpen)}
            >
              Engineering ▾
            </button>
            {mobileEngineeringOpen && (
              <div className="pl-4 mt-2 flex flex-col gap-2">
                <a className="hover:text-purple-400" href="/skills" onClick={() => setMobileMenuOpen(false)}>Skills</a>
                <a className="hover:text-purple-400" href="https://achievements.ibtisam-iq.com" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>Achievements</a>
              </div>
            )}
          </div>

          {/* Resources (Mobile) */}
          <div>
            <button
              className="hover:text-purple-400 transition w-full text-left"
              onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
            >
              Resources ▾
            </button>
            {mobileResourcesOpen && (
              <div className="pl-4 mt-2 flex flex-col gap-2">
                <a className="hover:text-purple-400" href="https://blog.ibtisam-iq.com" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>Blog</a>
                <a className="hover:text-purple-400" href="https://roadmaps.ibtisam-iq.com" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>Roadmaps</a>
                <a className="hover:text-purple-400" href="https://cert-vault.ibtisam-iq.com" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>Cert Practice Vault</a>
                <a className="hover:text-purple-400" href="https://nectar.ibtisam-iq.com" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>Knowledge Base</a>
              </div>
            )}
          </div>

          <a href="/about" className="hover:text-purple-400 transition" onClick={() => setMobileMenuOpen(false)}>About</a>

          <a href="/contact" className="hover:text-purple-400 transition" onClick={() => setMobileMenuOpen(false)}>Contact</a>

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
