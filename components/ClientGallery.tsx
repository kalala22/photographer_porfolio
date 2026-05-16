import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Download, 
  Files, 
  CheckSquare, 
  Square, 
  Loader2, 
  ArrowDownToLine,
  Grid,
  Trash2
} from 'lucide-react';

interface Photo {
  id: number | string;
  url: string;
  title?: string;
}

interface ClientGalleryProps {
  photos: Photo[];
  galleryName?: string;
}

const ClientGallery: React.FC<ClientGalleryProps> = ({ photos, galleryName }) => {
  const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);
  const [isZipping, setIsZipping] = useState(false);

  const toggleSelect = (id: number | string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(photos.map(p => p.id));
  };

  const deselectAll = () => {
    setSelectedIds([]);
  };

  const downloadSingle = (url: string, name: string) => {
    saveAs(url, name || "photo-shooting.jpg");
  };

  const downloadAsZip = async (onlySelected = false) => {
    const photosToDownload = onlySelected
      ? photos.filter(p => selectedIds.includes(p.id))
      : photos;

    if (photosToDownload.length === 0) return alert("Aucune photo sélectionnée");

    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("votre-shooting");

      const downloadPromises = photosToDownload.map(async (photo, index) => {
        const response = await fetch(photo.url);
        const blob = await response.blob();
        folder?.file(`photo-${index + 1}.jpg`, blob);
      });

      await Promise.all(downloadPromises);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "mon-shooting-chretien-kalala.zip");
    } catch (error) {
      console.error("Erreur lors de la création du ZIP:", error);
      alert("Une erreur est survenue lors du téléchargement.");
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background-dark text-white px-4 md:px-8 pb-20">
      {/* Premium Sticky Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-4 z-50 mb-12 flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
      >
        <div className="flex items-center gap-6 px-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-black tracking-tighter">Votre Sélection</h2>
            <div className="flex items-center gap-2">
               <span className="text-primary font-bold">{selectedIds.length}</span>
               <span className="text-[10px] uppercase tracking-widest text-white/40">Photos choisies sur {photos.length}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Selection Controls */}
          <div className="flex bg-black/20 rounded-2xl p-1 border border-white/5 mr-2">
            <button 
              onClick={selectAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/5 transition-colors cursor-pointer"
            >
              <CheckSquare size={14} className="text-primary" />
              Tout cocher
            </button>
            <button 
              onClick={deselectAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Trash2 size={14} className="text-white/40" />
              Reset
            </button>
          </div>

          {/* Download Buttons */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => downloadAsZip(true)}
            disabled={selectedIds.length === 0 || isZipping}
            className={`h-11 px-6 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
              selectedIds.length > 0 
                ? 'bg-primary text-black shadow-primary/20 cursor-pointer' 
                : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
            }`}
          >
            {isZipping ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            <span>Télécharger la sélection</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => downloadAsZip(false)}
            disabled={isZipping}
            className="h-11 px-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            {isZipping ? <Loader2 size={16} className="animate-spin" /> : <Files size={16} className="text-primary" />}
            <span>Tout télécharger (ZIP)</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Loading Overlay for ZIP Generation */}
      <AnimatePresence>
        {isZipping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background-dark/80 backdrop-blur-md flex flex-col items-center justify-center gap-6"
          >
            <div className="relative">
               <Loader2 size={64} className="text-primary animate-spin" />
               <Download size={24} className="absolute inset-0 m-auto text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black tracking-tighter">Préparation de votre archive...</h3>
              <p className="text-white/40 text-sm animate-pulse">Compression de vos photos haute résolution en cours.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map((photo) => {
          const isSelected = selectedIds.includes(photo.id);
          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/5"
            >
              {/* Photo Image */}
              <div 
                onClick={() => toggleSelect(photo.id)}
                className="w-full h-full cursor-pointer overflow-hidden"
              >
                <img
                  src={photo.url}
                  alt={photo.title || "Shooting item"}
                  className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                    isSelected ? 'scale-105 brightness-50' : 'group-hover:scale-110 brightness-90 group-hover:brightness-100'
                  }`}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>

              {/* Selection Checkbox (Custom) */}
              <div 
                onClick={() => toggleSelect(photo.id)}
                className="absolute top-4 left-4 z-20 cursor-pointer"
              >
                <motion.div
                  animate={{ scale: isSelected ? 1.1 : 1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-primary text-black shadow-xl' 
                      : 'bg-black/40 backdrop-blur-md border border-white/20 text-white/40 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {isSelected ? <Check size={20} strokeWidth={3} /> : <Square size={16} />}
                </motion.div>
              </div>

              {/* Individual Download Button (Hover) */}
              <div className="absolute bottom-4 right-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => downloadSingle(photo.url, `photo-${photo.id}.jpg`)}
                  className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
                >
                  <ArrowDownToLine size={20} />
                </motion.button>
              </div>

              {/* Selection Overlay Indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-primary/10 pointer-events-none ring-4 ring-primary ring-inset rounded-3xl"
                  />
                )}
              </AnimatePresence>

              {/* Photo Info (Bottom Left) */}
              <div className="absolute bottom-6 left-6 z-20 pointer-events-none translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                <span className="text-[10px] uppercase tracking-widest font-black text-primary mb-1 block">Réf: #{photo.id}</span>
                <p className="text-white font-bold text-sm truncate max-w-[150px]">
                  {photo.title || "Photo Shooting"}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientGallery;
