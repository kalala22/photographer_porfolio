import { ModalType } from "../types";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

interface CTASectionProps {
  setActiveModal: (modal: ModalType) => void;
}

export default function CTASection({ setActiveModal }: CTASectionProps) {
  const { t } = useTranslation();

  return (
    <section className="relative py-40 px-6 text-center overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.2, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          alt="Studio Blur"
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1920&auto=format&fit=crop"
        />
        <div className="absolute inset-0 bg-background-dark/80"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black tracking-tighter"
        >
          {t("cta.title")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/50 text-xl font-light leading-relaxed max-w-2xl mx-auto"
        >
          {t("cta.description")}
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveModal("booking")}
          className="inline-flex items-center justify-center rounded-lg h-16 px-12 bg-primary hover:bg-primary/90 text-background-dark text-lg font-black tracking-wide transition-all shadow-2xl cursor-pointer"
        >
          {t("cta.button")}
        </motion.button>
      </div>
    </section>
  );
}
