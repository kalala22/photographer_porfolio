import React from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "fr" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/40 transition-all group overflow-hidden relative cursor-pointer"
      aria-label="Toggle language"
    >
      <Languages className="size-4 text-white/60 group-hover:text-primary transition-colors" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 group-hover:text-white">
        {i18n.language === "en" ? "FR" : "EN"}
      </span>

      {/* Subtle indicator */}
      <span className="absolute bottom-0 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
    </button>
  );
}
