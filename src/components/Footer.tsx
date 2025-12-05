const Footer = () => {
  return (
    <footer className="bg-[#0B0F19] text-white py-16 border-t border-gray-800">
      {/* Center container */}
      <div className="max-w-7xl mx-auto px-8">
        
        {/* 5 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-14 gap-x-12 text-center md:text-left">

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-widest text-gray-400">
              About
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">Muhammad Ibtisam Iqbal</p>
            <p className="text-sm text-gray-300 leading-relaxed">Infrastructure Engineer</p>
            <p className="text-sm text-gray-300 leading-relaxed">Building systems with discipline</p>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-widest text-gray-400">
              Social
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">X</a></li>
            </ul>
          </div>

          {/* Developer */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-widest text-gray-400">
              Developer
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a href="#">GitHub</a></li>
              <li><a href="#">Medium</a></li>
              <li><a href="#">Docker Hub</a></li>
              <li><a href="#">Credly</a></li>
              <li><a href="#">ORCID</a></li>
            </ul>
          </div>

          {/* Productivity */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-widest text-gray-400">
              Productivity
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a href="#">Raindrop.io</a></li>
              <li><a href="#">Cal.com</a></li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-widest text-gray-400">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a href="#">Docs</a></li>
              <li><a href="#">Projects</a></li>
              <li><a href="#">Blogs</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="text-center text-xs text-gray-500 mt-20 border-t border-gray-800 pt-8 tracking-wider">
          © 2025 Ibtisam IQ — Built with discipline
        </div>
      </div>
    </footer>
  );
};

export default Footer;


