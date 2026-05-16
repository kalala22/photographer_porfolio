import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGalleries } from '../../hooks/useGalleries';
import { useGalleryPhotos } from '../../hooks/useGalleryPhotos';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Copy, Check, Upload, Trash2, Loader2, Images, X, Calendar, Link2 } from 'lucide-react';
import type { GalleryWithPhotos } from '../../lib/database.types';

const GalleryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getGalleryById } = useGalleries();
  const { photos, isUploading, uploadProgress, error, fetchPhotos, uploadPhotos, deletePhoto } = useGalleryPhotos();
  const [gallery, setGallery] = useState<GalleryWithPhotos | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await getGalleryById(id);
        setGallery(data);
        await fetchPhotos(id);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, getGalleryById, fetchPhotos]);

  const getClientLink = () => `${window.location.origin}/client/${gallery?.access_token}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(getClientLink());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || !id) return;
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;
    await uploadPhotos(id, files);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="text-center py-20">
        <p className="text-white/40">Galerie introuvable.</p>
        <Link to="/admin/dashboard" className="text-primary text-sm mt-4 inline-block">Retour</Link>
      </div>
    );
  }

  const isExpired = gallery.expires_at && new Date(gallery.expires_at) < new Date();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tighter">{gallery.client_name}</h1>
            <div className="flex items-center gap-3 text-white/30 text-xs mt-1">
              <span className="flex items-center gap-1"><Calendar size={10} />{new Date(gallery.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>•</span>
              <span>{photos.length} photos</span>
              {isExpired && <><span>•</span><span className="text-red-400">Expirée</span></>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 h-10 px-5 bg-primary text-black font-bold text-xs rounded-xl cursor-pointer">
            <Upload size={14} /> Ajouter des photos
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={e => handleUpload(e.target.files)} className="hidden" />
        </div>
      </div>

      {/* Link Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 flex-shrink-0">
            <Link2 size={18} className="text-primary" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/30 block">Lien client</span>
            <p className="text-primary text-sm font-mono truncate">{getClientLink()}</p>
          </div>
        </div>
        <button onClick={copyLink} className={`flex items-center gap-2 h-10 px-5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${copiedLink ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 border border-white/10 text-white/60 hover:text-primary hover:border-primary/30'}`}>
          {copiedLink ? <><Check size={14} /> Copié !</> : <><Copy size={14} /> Copier</>}
        </button>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/10 border border-primary/20 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between"><span className="text-sm font-bold text-white">Upload en cours...</span><span className="text-primary font-bold">{uploadProgress}%</span></div>
          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden"><motion.div animate={{ width: `${uploadProgress}%` }} className="h-full bg-primary rounded-full" /></div>
        </motion.div>
      )}

      {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">{error}</div>}

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10"><Images size={32} className="text-white/20" /></div>
          <div className="text-center space-y-2"><h3 className="text-white text-lg font-bold">Aucune photo</h3><p className="text-white/40 text-sm">Commencez par uploader les photos de votre client.</p></div>
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold text-sm rounded-2xl cursor-pointer"><Upload size={16} /> Uploader des photos</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence>
            {photos.map((photo, index) => (
              <motion.div key={photo.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ delay: index * 0.02 }} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/5">
                <img src={photo.photo_url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all" />
                <button onClick={() => deletePhoto(photo)} className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-red-400 cursor-pointer">
                  <Trash2 size={14} />
                </button>
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-bold truncate">{photo.title}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default GalleryDetailPage;
