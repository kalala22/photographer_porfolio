
import React, { useState, useEffect } from 'react';
import BookingModal from './components/BookingModal';
import { ModalType } from './types';
import { getAIAssistance } from './services/geminiService';
import Footer from './components/footer';
import CTASection from './components/cta-section';
import PortfolioSection from './components/portfolioSection';

const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [aiLoading, setAILoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const handleAISuggestion = async () => {
    setAILoading(true);
    // Mock user vision for example
    const suggestion = await getAIAssistance("Moody, high contrast, cinematic mountains", "Landscape/Editorial");
    setAILoading(false);
    if (suggestion) {
      alert(`AI Suggestions:\nRecommended: ${suggestion.recommendedPackage}\nAdvice: ${suggestion.advice}`);
    } else {
      alert("AI Assistant is currently offline. Please contact Chretien directly.");
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-white selection:bg-primary selection:text-background-dark">
      
      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background-dark/80 backdrop-blur-md py-4 border-b border-border-dark' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20 flex items-center justify-between">
          <div className="flex items-center gap-4 text-white hover:text-primary transition-colors cursor-pointer group">
            <div className="flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:border-primary/40 transition-all">
              <span className="material-symbols-outlined text-xl">camera</span>
            </div>
            <h2 className="text-white text-lg font-bold tracking-widest uppercase">Chretien Photographer</h2>
          </div>
          
          <nav className="hidden lg:flex items-center gap-10">
            {['Portfolio', 'Bio', 'Journal', 'Contact'].map(link => (
              <a key={link} className="text-white/80 text-sm font-medium hover:text-primary transition-all relative group" href={`#${link.toLowerCase()}`}>
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveModal('booking')}
              className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary hover:bg-primary/90 text-background-dark text-sm font-bold transition-all shadow-lg shadow-primary/20"
            >
              Book Now
            </button>
            <button className="lg:hidden flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background-dark z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] z-10"></div>
          <img 
            alt="Dramatic Landscape"
            className="h-full w-full object-cover opacity-90 scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBYYPaCsTkZjSjExt5NGahdQ98pYWA9yIcHyHUSDfXsdjUb_9LBDw_7tmCtp5rgeemYLmXWQj1lsEw_hXxU2uDA2sjxaiaRnYKidMDaMaBD7sWrZnBpHGYzbi-h1Ah9hViDmSC3JPseaj2pnTw_4Ev0bxZHJeAwgqwZ7REr9Plr7GA0fdwkfSAq-YngYfFGGgNqmdWlfZ6EkBtxrtLN-56F1GqLVf6yPn5LWj2TN0h53NZPn_RkBOdVcIlJ6H7VptQL7N-V4nLAYw"
          />
        </div>

        <div className="relative z-20 text-center space-y-8 max-w-5xl px-4 animate-fade-in-up">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary to-transparent mx-auto opacity-80 mb-8"></div>
          <div className="space-y-4">
            <h1 className="text-white text-5xl md:text-8xl font-black tracking-tighter leading-none hero-text-shadow">
              Chretien Kalala
            </h1>
            <p className="text-white/80 text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto">
              Capturing moments, telling stories.
            </p>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row gap-6 items-center justify-center">
            <button 
              onClick={() => setActiveModal('booking')}
              className="flex min-w-[180px] items-center justify-center rounded-lg h-14 px-10 bg-primary hover:bg-primary/90 text-background-dark text-base font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(242,166,13,0.3)] transform hover:-translate-y-1"
            >
              Book a Session
              <span className="material-symbols-outlined ml-2 text-lg">arrow_forward</span>
            </button>
            <button 
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex min-w-[180px] items-center justify-center rounded-lg h-14 px-10 border border-white/30 hover:border-white text-white hover:bg-white/5 text-base font-medium transition-all"
            >
              View Portfolio
            </button>
          </div>
        </div>

        {/* Floating AI Helper */}
        <button 
          onClick={handleAISuggestion}
          disabled={aiLoading}
          className="fixed bottom-10 right-10 z-50 size-16 rounded-full bg-surface-dark border border-primary/40 flex items-center justify-center shadow-2xl hover:scale-110 transition-all group"
        >
          {aiLoading ? (
            <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full"></div>
          ) : (
            <>
              <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
              <span className="absolute right-full mr-4 bg-primary text-background-dark px-3 py-1 rounded text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">AI Consultant</span>
            </>
          )}
        </button>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce-slow opacity-60">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Explore</span>
          <span className="material-symbols-outlined text-3xl">keyboard_arrow_down</span>
        </div>

        {/* Stats */}
        <div className="absolute bottom-12 right-20 z-20 hidden xl:flex flex-col gap-8 border-l border-white/10 pl-8">
          <div>
            <span className="block text-primary text-3xl font-black">10+</span>
            <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Years of Vision</span>
          </div>
          <div>
            <span className="block text-primary text-3xl font-black">500+</span>
            <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Stories Told</span>
          </div>
        </div>

        {/* Location */}
        <div className="absolute bottom-12 left-20 z-20 hidden lg:flex items-center gap-3 text-white/40">
          <span className="material-symbols-outlined text-primary text-sm">location_on</span>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Based in Berlin, Germany</span>
        </div>
      </section>

      {/* Portfolio Section */}
      <PortfolioSection />

      {/* CTA Section */}
      <CTASection />

     <Footer />

      {/* Booking Modal */}
      {activeModal === 'booking' && (
        <BookingModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};

export default App;
