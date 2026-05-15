import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGalleries } from '../../hooks/useGalleries';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderPlus,
  Images,
  Copy,
  Trash2,
  Loader2,
  Check,
  Clock,
  AlertCircle,
  Search,
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { galleries, isLoading, error, fetchGalleries, deleteGallery } = useGalleries();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  const getClientLink = (token: string) => {
    return `${window.location.origin}/client/${token}`;
  };

  const copyLink = async (token: string, id: string) => {
    await navigator.clipboard.writeText(getClientLink(token));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette galerie et toutes ses photos ?')) return;
    setDeletingId(id);
    await deleteGallery(id);
    setDeletingId(null);
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const filteredGalleries = galleries.filter((g) =>
    g.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPhotos = galleries.reduce((acc, g) => acc + (g.photo_count || 0), 0);
  const activeGalleries = galleries.filter((g) => !isExpired(g.expires_at));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Mes Galeries</h1>
          <p className="text-white/40 text-sm mt-1">
            Gérez vos galeries clients et partagez les liens d'accès.
          </p>
        </div>
        <Link
          to="/admin/gallery/new"
          className="flex items-center gap-2 h-11 px-6 bg-primary text-black font-bold text-sm rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          <FolderPlus size={16} />
          Nouvelle galerie
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
            Total galeries
          </span>
          <p className="text-3xl font-black text-white mt-1">{galleries.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
            Galeries actives
          </span>
          <p className="text-3xl font-black text-primary mt-1">{activeGalleries.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
            Total photos
          </span>
          <p className="text-3xl font-black text-white mt-1">{totalPhotos}</p>
        </motion.div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un client..."
          className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={32} className="text-primary animate-spin" />
          <p className="text-white/40 text-sm">Chargement des galeries...</p>
        </div>
      ) : filteredGalleries.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 gap-6"
        >
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10">
            <Images size={32} className="text-white/20" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-white text-lg font-bold">
              {searchQuery ? 'Aucun résultat' : 'Aucune galerie'}
            </h3>
            <p className="text-white/40 text-sm max-w-sm">
              {searchQuery
                ? `Aucune galerie ne correspond à "${searchQuery}".`
                : 'Créez votre première galerie pour commencer à partager vos photos avec vos clients.'}
            </p>
          </div>
          {!searchQuery && (
            <Link
              to="/admin/gallery/new"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold text-sm rounded-2xl"
            >
              <FolderPlus size={16} />
              Créer une galerie
            </Link>
          )}
        </motion.div>
      ) : (
        /* Gallery List */
        <div className="space-y-3">
          <AnimatePresence>
            {filteredGalleries.map((gallery, index) => {
              const expired = isExpired(gallery.expires_at);
              return (
                <motion.div
                  key={gallery.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.03 }}
                  className={`group bg-white/5 border rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:bg-white/[0.07] ${
                    expired ? 'border-red-500/20 opacity-60' : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        expired
                          ? 'bg-red-500/10 border border-red-500/20'
                          : 'bg-primary/10 border border-primary/20'
                      }`}
                    >
                      <Images
                        size={20}
                        className={expired ? 'text-red-400' : 'text-primary'}
                      />
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/admin/gallery/${gallery.id}`}
                        className="text-white font-bold hover:text-primary transition-colors truncate block"
                      >
                        {gallery.client_name}
                      </Link>
                      <div className="flex items-center gap-3 mt-1 text-white/30 text-xs">
                        <span>{gallery.photo_count || 0} photos</span>
                        <span>•</span>
                        <span>
                          {new Date(gallery.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        {expired && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-red-400">
                              <Clock size={10} />
                              Expirée
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => copyLink(gallery.access_token, gallery.id)}
                      className={`flex items-center gap-2 h-9 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        copiedId === gallery.id
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-white/5 text-white/60 border border-white/10 hover:border-primary/30 hover:text-primary'
                      }`}
                    >
                      {copiedId === gallery.id ? (
                        <>
                          <Check size={12} />
                          Copié !
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          Copier le lien
                        </>
                      )}
                    </button>
                    <Link
                      to={`/admin/gallery/${gallery.id}`}
                      className="h-9 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:border-white/30 transition-all flex items-center"
                    >
                      Gérer
                    </Link>
                    <button
                      onClick={() => handleDelete(gallery.id)}
                      disabled={deletingId === gallery.id}
                      className="h-9 w-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white/30 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {deletingId === gallery.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
