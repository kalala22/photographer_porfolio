import { useState } from "react";
import { ModalType } from "../types";

interface CTASectionProps {
  setActiveModal: (modal: ModalType) => void;
}

export default function CTASection({ setActiveModal }: CTASectionProps) {
  return (
    <section className="relative py-40 px-6 text-center overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 z-0">
        <img
          alt="Studio Blur"
          className="h-full w-full object-cover opacity-10"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeR6lQs45C16zYi8aohD5pI1yV03bLf0RjbF89db9Cam_FlJxo0PIWW-cWaKQvdVb0t2wnPhGNaRgvIROFYp5_EDm8D7cTk36BhmUnkN1A3FOLUZqTSVYM_HSvtwfTAFVUWT3NRhBh0F2gUfoBYL42eBE9dafDV4nKhaM2raQVzPnl1PQgQ7jkk8dr92OH6hdfk6p0KcpVsgcBvVUCTw1usHjuVGpdKJtZZXu-njIMEcjms9QUxf9ZRBl60ouL-LORhDHHkSum63w"
        />
        <div className="absolute inset-0 bg-background-dark/80"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-10">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
          Ready to tell your story?
        </h2>
        <p className="text-white/50 text-xl font-light leading-relaxed max-w-2xl mx-auto">
          Book a session or inquire about rates for your next project. I
          specialize in capturing the moments that matter most.
        </p>
        <button
          onClick={() => setActiveModal("booking")}
          className="inline-flex items-center justify-center rounded-lg h-16 px-12 bg-primary hover:bg-primary/90 text-background-dark text-lg font-black tracking-wide transition-all shadow-2xl transform hover:-translate-y-1"
        >
          Start a Project
        </button>
      </div>
    </section>
  );
}
