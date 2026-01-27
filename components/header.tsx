import React from "react";
import { ModalType } from "@/types";
import { Aperture, Menu } from "lucide-react";

interface HeaderProps {
  onOpenModal: (type: ModalType) => void;
  scrolled: boolean;
}

export default function Header({ onOpenModal, scrolled }: HeaderProps) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background-dark/80 backdrop-blur-md py-4 border-b border-border-dark"
          : "bg-transparent py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4 text-white hover:text-primary transition-colors cursor-pointer group">
          <div className="flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:border-primary/40 transition-all">
            <Aperture className="size-6" />
          </div>
          <h2 className="text-white text-lg font-bold tracking-widest uppercase hidden lg:block">
            Chretien Photographer
          </h2>
        </div>

        {/* Links */}
        {/* <div className="hidden lg:flex items-center gap-10">
          {["Portfolio", "Bio", "Journal", "Contact"].map((link) => (
            <a
              key={link}
              className="text-white/80 text-sm font-medium hover:text-primary transition-all relative group"
              href={`#${link.toLowerCase()}`}
            >
              {link}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div> */}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onOpenModal("booking")}
            className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary hover:bg-primary/90 text-background-dark text-sm font-bold transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            Book Now
          </button>
          {/* <button className="lg:hidden flex items-center justify-center text-white p-2">
            <Menu className="size-8" />
          </button> */}
        </div>
      </div>
    </header>
  );
}
