import React, { useState, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "motion/react";
import { ContactModal } from "./components/ContactModal";
import { ModalType } from "./types";
import Footer from "./components/footer";
import CTASection from "./components/cta-section";
import PortfolioSection from "./components/portfolioSection";
import Header from "./components/header";
import { ArrowRight, MapPinHouse } from "lucide-react";

// Liste des images pour le défilement
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1920&auto=format&fit=crop",
];

const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [scrolled, setScrolled] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logique du défilement des images (toutes les 5 secondes)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const sectionVariants: Variants = {
    offscreen: { opacity: 0, y: 50 },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", bounce: 0.3, duration: 0.8 },
    },
  };

  return (
    <div className="min-h-screen bg-background-dark text-white selection:bg-primary selection:text-background-dark">
      <Header onOpenModal={setActiveModal} scrolled={scrolled} />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Slideshow Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-background-dark z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] z-10"></div>

          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={HERO_IMAGES[currentImageIndex]}
              alt="Photography Backdrop"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.9, scale: 1.05 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center space-y-8 max-w-5xl px-4">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 64 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="w-px bg-linear-to-b from-transparent via-primary to-transparent mx-auto opacity-80 mb-8"
          ></motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-5xl md:text-8xl font-black tracking-tighter leading-none hero-text-shadow"
            >
              Chretien Kalala
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto"
            >
              Capturing moments, telling stories.
            </motion.p>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-6 items-center justify-center">
            <button
              onClick={() => setActiveModal("booking")}
              className="flex min-w-[180px] items-center justify-center rounded-lg h-14 px-10 bg-primary hover:bg-primary/90 text-background-dark text-base font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(242,166,13,0.3)] transform hover:-translate-y-1 cursor-pointer"
            >
              Book a Session
              <ArrowRight className="ml-2 size-5" />
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("portfolio")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex min-w-[180px] items-center justify-center rounded-lg h-14 px-10 border border-white/30 hover:border-white text-white hover:bg-white/5 text-base font-medium transition-all cursor-pointer"
            >
              View Portfolio
            </button>
          </div>
        </div>

        {/* UI Elements (Scroll Indicator, Stats, Location) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-60">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold">
            Explore
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowRight className="rotate-90 size-6" />
          </motion.div>
        </div>

        <div className="absolute bottom-12 right-20 z-20 hidden xl:flex flex-col gap-8 border-l border-white/10 pl-8">
          <div>
            <span className="block text-primary text-3xl font-black">5+</span>
            <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
              Years of Vision
            </span>
          </div>
          <div>
            <span className="block text-primary text-3xl font-black">100+</span>
            <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
              Stories Told
            </span>
          </div>
        </div>

        <div className="absolute bottom-12 left-20 z-20 hidden lg:flex items-center gap-3 text-white/40">
          <MapPinHouse size={18} />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
            Based in Kinshasa, RDC
          </span>
        </div>
      </section>

      {/* Sections suivantes */}
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: "some" }}
        variants={sectionVariants}
      >
        <PortfolioSection />
      </motion.div>

      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: "some" }}
        variants={sectionVariants}
      >
        <CTASection setActiveModal={setActiveModal} />
      </motion.div>

      <Footer />

      {activeModal === "booking" && (
        <ContactModal
          isOpen={activeModal === "booking"}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

export default App;
