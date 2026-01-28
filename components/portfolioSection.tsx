import { useState } from "react";
import { PORTFOLIO_ITEMS } from "@/constants";
import { useTranslation } from "react-i18next";

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

  return (
    <section
      id="portfolio"
      className="py-32 px-6 md:px-10 lg:px-20 bg-background-dark"
    >
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 border-b border-white/5 pb-16">
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              {t("portfolio.title")}
            </h2>
            <p className="text-white/50 text-xl font-light">
              {t("portfolio.subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase transition-all hover:cursor-pointer ${
                  activeFilter === f
                    ? "bg-primary text-background-dark"
                    : "bg-surface-dark text-white/50 border border-white/5"
                }`}
              >
                {t(`portfolio.filters.${f}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid with Skeleton Effect */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 md:gap-8 space-y-6 md:space-y-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid group relative overflow-hidden rounded-xl bg-surface-dark cursor-pointer shadow-xl transition-all hover:-translate-y-2"
            >
              {/* Skeleton Loader (visible tant que l'image n'est pas chargée) */}
              {!loadedImages[item.id] && (
                <div
                  className={`w-full bg-white/5 animate-pulse ${item.span === "portrait" ? "aspect-3/4" : "aspect-video"}`}
                />
              )}

              <img
                src={item.imageUrl}
                alt={item.title}
                onLoad={() => handleImageLoad(item.id)}
                className={`w-full h-auto object-cover transition-all duration-700 group-hover:scale-110 ${
                  loadedImages[item.id]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              />

              {/* Overlay (ne s'affiche que si l'image est chargée) */}
              {loadedImages[item.id] && (
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                    {t(`portfolio.filters.${item.category}`)}
                  </span>
                  <h3 className="text-white text-2xl font-bold">
                    {item.title}
                  </h3>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
