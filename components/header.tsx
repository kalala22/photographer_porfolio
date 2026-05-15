import React from "react";
import { ModalType } from "@/types";
import { Aperture, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { motion } from "motion/react";

interface HeaderProps {
  onOpenModal: (type: ModalType) => void;
  scrolled: boolean;
}

export default function Header({ onOpenModal, scrolled }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background-dark/80 backdrop-blur-md py-4 border-b border-border-dark"
          : "bg-transparent py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-4 text-white hover:text-primary transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:border-primary/40 transition-all">
            <Aperture className="size-6" />
          </div>
          <h2 className="text-white text-lg font-bold tracking-widest uppercase hidden lg:block">
            Chretien Photographer
          </h2>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenModal("booking")}
            className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary hover:bg-primary/90 text-background-dark text-sm font-bold transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            {t("header.bookBtn")}
          </motion.button>
          <LanguageSwitcher />
        </div>
      </div>
    </motion.header>
  );
}
