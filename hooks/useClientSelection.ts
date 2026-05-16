import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { GalleryPhoto } from '../lib/database.types';

interface ClientPhoto {
  id: string;
  url: string;
  title: string;
}

export const useClientSelection = (token?: string) => {
  const [photos, setPhotos] = useState<ClientPhoto[]>([]);
  const [galleryName, setGalleryName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('galleries')
          .select('*, gallery_photos(*)')
          .eq('access_token', token)
          .single();

        if (fetchError) {
          throw new Error('Galerie introuvable. Vérifiez votre lien.');
        }

        // Check expiration
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          throw new Error('Cette galerie a expiré. Contactez votre photographe.');
        }

        setGalleryName(data.client_name);
        setPhotos(
          (data.gallery_photos || [])
            .sort((a: GalleryPhoto, b: GalleryPhoto) => a.display_order - b.display_order)
            .map((p: GalleryPhoto) => ({
              id: p.id,
              url: p.photo_url,
              title: p.title,
            }))
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, [token]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  return {
    photos,
    galleryName,
    selectedIds,
    isLoading,
    error,
    toggleSelection,
    clearSelection,
    selectionCount: selectedIds.length,
  };
};
