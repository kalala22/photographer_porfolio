
import React, { useState, useEffect } from 'react';
import { PORTFOLIO_ITEMS, PRIMARY_COLOR } from './constants';
import BookingModal from './components/BookingModal';
import { ModalType } from './types';
import { getAIAssistance } from './services/geminiService';
import Footer from './components/footer';

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

  const filters = ['All', 'Weddings', 'Corporate', 'Portraits', 'Lifestyle', 'Events', 'Architecture', 'Editorial', 'Product'];
  const filteredItems = activeFilter === 'All' 
    ? PORTFOLIO_ITEMS 
    : PORTFOLIO_ITEMS.filter(item => item.category === activeFilter);

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
      <section id="portfolio" className="py-32 px-6 md:px-10 lg:px-20 bg-background-dark">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="flex flex-col md:row items-end justify-between gap-12 border-b border-white/5 pb-16 md:flex-row">
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">Selected Works</h2>
              <p className="text-white/50 text-xl font-light leading-relaxed">
                Capturing moments of raw emotion and structured beauty. A visual exploration of humanity and light.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {filters.map(f => (
                <button 
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${activeFilter === f ? 'bg-primary text-background-dark' : 'bg-surface-dark text-white/50 hover:text-white border border-white/5'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                className={`group relative overflow-hidden rounded-xl bg-surface-dark cursor-pointer shadow-xl transition-all hover:-translate-y-2 ${item.span === 'portrait' ? 'row-span-2 aspect-[3/4]' : item.span === 'landscape' ? 'aspect-[16/10]' : 'aspect-square'}`}
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2">{item.category}</span>
                  <h3 className="text-white text-2xl font-bold">{item.title}</h3>
                  <div className="mt-6 flex items-center gap-3 text-white/70 text-sm font-bold group-hover:text-white transition-colors">
                    View Project
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-10">
            <button className="flex items-center gap-4 px-10 py-5 rounded-full border border-white/10 text-white/50 hover:text-primary hover:border-primary transition-all group font-bold text-sm tracking-widest uppercase">
              Load More Works
              <span className="material-symbols-outlined transition-transform group-hover:translate-y-1">expand_more</span>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 px-6 text-center overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 z-0">
          <img alt="Studio Blur" className="h-full w-full object-cover opacity-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeR6lQs45C16zYi8aohD5pI1yV03bLf0RjbF89db9Cam_FlJxo0PIWW-cWaKQvdVb0t2wnPhGNaRgvIROFYp5_EDm8D7cTk36BhmUnkN1A3FOLUZqTSVYM_HSvtwfTAFVUWT3NRhBh0F2gUfoBYL42eBE9dafDV4nKhaM2raQVzPnl1PQgQ7jkk8dr92OH6hdfk6p0KcpVsgcBvVUCTw1usHjuVGpdKJtZZXu-njIMEcjms9QUxf9ZRBl60ouL-LORhDHHkSum63w" />
          <div className="absolute inset-0 bg-background-dark/80"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Ready to tell your story?</h2>
          <p className="text-white/50 text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Book a session or inquire about rates for your next project. I specialize in capturing the moments that matter most.
          </p>
          <button 
            onClick={() => setActiveModal('booking')}
            className="inline-flex items-center justify-center rounded-lg h-16 px-12 bg-primary hover:bg-primary/90 text-background-dark text-lg font-black tracking-wide transition-all shadow-2xl transform hover:-translate-y-1"
          >
            Start a Project
          </button>
        </div>
      </section>

     <Footer />

      {/* Booking Modal */}
      {activeModal === 'booking' && (
        <BookingModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};

export default App;
