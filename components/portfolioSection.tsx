import { useState } from "react";
import { PORTFOLIO_ITEMS } from "@/constants";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

export default function PortfolioSection() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("All");
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const filters = [
    "All",
    "Weddings",
    "Corporate",
    "Portraits",
    "Landscape",
    "Street",
    "Macro",
  ];

  const filteredItems =
    activeFilter === "All"
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeFilter);

  // Fonction pour marquer une image comme chargée
  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="portfolio"
      className="py-32 px-6 md:px-10 lg:px-20 bg-background-dark"
    >
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 border-b border-white/5 pb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 max-w-2xl"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              {t("portfolio.title")}
            </h2>
            <p className="text-white/50 text-xl font-light">
              {t("portfolio.subtitle")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-4"
          >
            {filters.map((f) => (
              <motion.button
                key={f}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase transition-all hover:cursor-pointer ${
                  activeFilter === f
                    ? "bg-primary text-background-dark"
                    : "bg-surface-dark text-white/50 border border-white/5"
                }`}
              >
                {t(`portfolio.filters.${f}`)}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Masonry Grid with Skeleton Effect */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 md:gap-8 space-y-6 md:space-y-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -10 }}
                className="break-inside-avoid group relative overflow-hidden rounded-xl bg-surface-dark cursor-pointer shadow-xl transition-all"
              >
                {/* Skeleton Loader */}
                {!loadedImages[item.id] && (
                  <div
                    className={`w-full bg-white/5 animate-pulse ${item.span === "portrait" ? "aspect-3/4" : "aspect-video"}`}
                  />
                )}

                <motion.img
                  src={item.imageUrl}
                  alt={item.title}
                  onLoad={() => handleImageLoad(item.id)}
                  animate={{
                    opacity: loadedImages[item.id] ? 1 : 0,
                    scale: loadedImages[item.id] ? 1 : 1.1,
                  }}
                  transition={{ duration: 0.7 }}
                  className="w-full h-auto object-cover group-hover:scale-110"
                />

                {/* Overlay */}
                {loadedImages[item.id] && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-8"
                  >
                    <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                      {t(`portfolio.filters.${item.category}`)}
                    </span>
                    <h3 className="text-white text-2xl font-bold">
                      {item.title}
                    </h3>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
