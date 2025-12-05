import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TechnicalFoundation from "./components/TechnicalFoundation";
import Philosophy from "./components/Philosophy";
import Systems from "./components/Systems";
import WhyMe from "./components/WhyMe";
import Footer from "./components/Footer";
import HowItStarted from "./pages/HowItStarted";
import Certificates from "./pages/Certificates";
import ContactPage from "./pages/ContactPage";


function App() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <TechnicalFoundation />
            <Philosophy />
            <Systems />
            <WhyMe />
          </>
        } />

        <Route path="/certificates" element={<Certificates />} />
        <Route path="/how-it-started" element={<HowItStarted />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      <Footer />
    </div>
  );
}



export default App;
