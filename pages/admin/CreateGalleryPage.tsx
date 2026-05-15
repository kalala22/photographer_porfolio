import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGalleries } from '../../hooks/useGalleries';
import { useGalleryPhotos } from '../../hooks/useGalleryPhotos';
import { motion } from 'motion/react';
import { FolderPlus, Upload, Loader2, ArrowRight, X, CheckCircle2 } from 'lucide-react';

const CreateGalleryPage: React.FC = () => {
  const [clientName, setClientName] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [step, setStep] = useState<'info' | 'upload' | 'done'>('info');
  const [createdToken, setCreatedToken] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { createGallery } = useGalleries();
  const { uploadPhotos, isUploading, uploadProgress } = useGalleryPhotos();

  const handleFilesSelected = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newFiles = Array.from(selectedFiles).filter(f => f.type.startsWith('image/'));
    setFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!clientName.trim()) { setError('Le nom du client est requis.'); return; }
    setIsCreating(true);
    setError('');
    try {
      const gallery = await createGallery(clientName.trim(), expiresAt || null);
      if (!gallery) throw new Error('Erreur lors de la création');
      setCreatedToken(gallery.access_token);
      if (files.length > 0) { setStep('upload'); await uploadPhotos(gallery.id, files); }
      setStep('done');
    } catch (err: any) { setError(err.message); setIsCreating(false); }
  };

  const getClientLink = () => `${window.location.origin}/client/${createdToken}`;
  const copyLink = async () => { await navigator.clipboard.writeText(getClientLink()); };

  if (step === 'done') {
    return (
      <div className="max-w-lg mx-auto py-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center border border-green-500/20 mx-auto">
            <CheckCircle2 size={36} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tighter text-white">Galerie créée !</h2>
            <p className="text-white/40 mt-2 text-sm">La galerie de <strong className="text-white">{clientName}</strong> est prête.</p>
          </div>
          <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-left">
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/30 block mb-2">Lien d'accès client</span>
            <p className="text-primary text-sm font-mono break-all">{getClientLink()}</p>
          </div>
          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={copyLink} className="flex-1 h-12 bg-primary text-black font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer">Copier le lien</motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/admin/dashboard')} className="flex-1 h-12 bg-white/5 border border-white/10 text-white font-bold rounded-xl flex items-center justify-center cursor-pointer hover:border-white/30 transition-all">Dashboard</motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 'upload') {
    return (
      <div className="max-w-lg mx-auto py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center space-y-6">
          <Loader2 size={48} className="text-primary animate-spin mx-auto" />
          <div><h2 className="text-xl font-black tracking-tighter text-white">Upload en cours...</h2><p className="text-white/40 mt-2 text-sm">{files.length} photo{files.length > 1 ? 's' : ''} en cours d'envoi</p></div>
          <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} className="h-full bg-primary rounded-full" /></div>
          <p className="text-primary font-bold text-lg">{uploadProgress}%</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="mb-8"><h1 className="text-3xl font-black tracking-tighter">Nouvelle galerie</h1><p className="text-white/40 text-sm mt-1">Créez une galerie et uploadez les photos de votre client.</p></div>
      <div className="space-y-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20"><FolderPlus size={18} className="text-primary" /></div><h2 className="text-lg font-bold">Informations</h2></div>
          <div><label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-3 ml-1">Nom du client / événement *</label><input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Ex: Mariage Dupont, Shooting Marie..." className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 text-white focus:outline-none focus:border-primary transition-colors" /></div>
          <div><label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-3 ml-1">Date d'expiration (optionnel)</label><input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 text-white focus:outline-none focus:border-primary transition-colors [color-scheme:dark]" /><p className="text-white/20 text-xs mt-2 ml-1">Laissez vide pour une galerie sans expiration.</p></div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20"><Upload size={18} className="text-primary" /></div><h2 className="text-lg font-bold">Photos</h2>{files.length > 0 && <span className="text-primary text-xs font-bold ml-auto">{files.length} sélectionnée{files.length > 1 ? 's' : ''}</span>}</div>
          <div onDrop={e => { e.preventDefault(); handleFilesSelected(e.dataTransfer.files); }} onDragOver={e => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 hover:border-primary/30 rounded-2xl p-10 text-center cursor-pointer transition-all group">
            <Upload size={32} className="text-white/20 group-hover:text-primary/50 mx-auto mb-4 transition-colors" />
            <p className="text-white/40 text-sm font-medium">Glissez-déposez vos photos ici</p>
            <p className="text-white/20 text-xs mt-1">ou cliquez pour sélectionner • JPG, PNG, WEBP</p>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={e => handleFilesSelected(e.target.files)} className="hidden" />
          </div>
          {previews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  <button onClick={e => { e.stopPropagation(); removeFile(index); }} className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><X size={12} className="text-white" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm font-medium text-center">{error}</motion.p>}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={isCreating || !clientName.trim()} className="w-full h-14 bg-primary text-black font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Créer la galerie{files.length > 0 ? ` et uploader ${files.length} photos` : ''}</span><ArrowRight size={18} /></>}
        </motion.button>
      </div>
    </div>
  );
};

export default CreateGalleryPage;
