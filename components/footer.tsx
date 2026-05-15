import { Aperture } from "lucide-react";
import SocialMedia from "./SocialMedia";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="bg-black py-20 px-6 md:px-10 lg:px-20 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <motion.div
            whileHover={{ x: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="flex items-center gap-4 group cursor-default"
          >
            <span className="material-symbols-outlined text-primary text-3xl">
              <Aperture />
            </span>
            <h2 className="text-2xl font-black tracking-widest uppercase">
              Chretien Kalala
            </h2>
          </motion.div>

          <SocialMedia />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-6 text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold">
          <p>© 2026 Chretien Kalala Photography. {t("footer.rights")}</p>
          <p>{t("footer.tagline")}</p>
        </div>
      </div>
    </motion.footer>
  );
}
