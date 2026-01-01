import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0F19] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

          {/* Identity */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-300">
              Muhammad Ibtisam Iqbal
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Infrastructure Engineer
            </p>
            <p className="text-sm text-gray-500 mt-3">
              Building systems with discipline
            </p>
          </div>

          {/* Connect Icons */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/ibtisam-iq"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-gray-400 hover:text-white transition text-xl"
            >
              <FaGithub />
            </a>

            <a
              href="https://www.linkedin.com/in/ibtisam-iq"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-400 hover:text-white transition text-xl"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Bottom line */}
        <div className="text-center text-xs text-gray-500 mt-10 pt-6 border-t border-gray-800 tracking-wide">
          © {year} Ibtisam IQ — Built with discipline
        </div>

      </div>
    </footer>
  );
};

export default Footer;



