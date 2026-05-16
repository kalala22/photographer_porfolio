import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useClientSelection } from '../hooks/useClientSelection';
import ClientGallery from '../components/ClientGallery';
import { motion } from 'motion/react';
import { Loader2, AlertTriangle, Aperture, ArrowLeft } from 'lucide-react';

const ClientGalleryPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { photos, galleryName, isLoading, error } = useClientSelection(token);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <Loader2 size={48} className="text-primary animate-spin" />
            <Aperture size={20} className="absolute inset-0 m-auto text-primary" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-white text-xl font-black tracking-tighter">
              Chargement de votre galerie
            </h2>
            <p className="text-white/40 text-sm animate-pulse">
              Préparation de vos photos...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center gap-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 max-w-md text-center"
        >
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20">
            <AlertTriangle size={36} className="text-red-400" />
          </div>
          <div className="space-y-3">
            <h2 className="text-white text-2xl font-black tracking-tighter">
              Accès impossible
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">{error}</p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-bold transition-colors"
          >
            <ArrowLeft size={16} />
            Retour au site
          </Link>
        </motion.div>
      </div>
    );
  }

  // Empty gallery
  if (photos.length === 0) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center gap-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 max-w-md text-center"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20">
            <Aperture size={36} className="text-primary" />
          </div>
          <div className="space-y-3">
            <h2 className="text-white text-2xl font-black tracking-tighter">
              Galerie en préparation
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Votre photographe n'a pas encore ajouté de photos à cette galerie. Revenez bientôt !
            </p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-bold transition-colors"
          >
            <ArrowLeft size={16} />
            Retour au site
          </Link>
        </motion.div>
      </div>
    );
  }

  // Gallery with photos
  return (
    <div className="min-h-screen bg-background-dark text-white">
      {/* Client Gallery Header */}
      <div className="pt-10 pb-6 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
              <Aperture className="text-primary w-6 h-6" />
            </div>
            <div>
              <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold block">
                Galerie privée
              </span>
              <h1 className="text-white text-xl font-black tracking-tighter">
                {galleryName}
              </h1>
            </div>
          </div>
          <span className="text-white/30 text-xs">
            {photos.length} photo{photos.length > 1 ? 's' : ''} disponible{photos.length > 1 ? 's' : ''}
          </span>
        </motion.div>
      </div>

      <ClientGallery
        photos={photos.map((p) => ({ id: p.id, url: p.url, title: p.title }))}
        galleryName={galleryName}
      />
    </div>
  );
};

export default ClientGalleryPage;
