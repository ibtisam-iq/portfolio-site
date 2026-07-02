import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, type PropsWithChildren } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedProjects from "./components/FeaturedProjects";
import Methodology from "./components/Methodology";
import Footer from "./components/Footer";

import HowItStarted from "./pages/HowItStarted";
import Certificates from "./pages/Certificates";
import ContactPage from "./pages/ContactPage";
import Skills from "./pages/Skills";
import NotFound from "./pages/NotFound";

const ScrollToTop = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ScrollToTop>
        <div className="min-h-screen bg-light-bg dark:bg-surface-0">
          <Navbar />

          <main id="main-content">
            <ErrorBoundary>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <FeaturedProjects />
                    <Methodology />
                  </>
                }
              />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/about" element={<HowItStarted />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </ErrorBoundary>
          </main>

          <Footer />
        </div>
      </ScrollToTop>
    </ThemeProvider>
  );
}

export default App;
