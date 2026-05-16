import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { GalleryPhoto } from '../lib/database.types';

export const useGalleryPhotos = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = useCallback(async (galleryId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('gallery_photos')
        .select('*')
        .eq('gallery_id', galleryId)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;
      setPhotos(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const uploadPhotos = useCallback(async (galleryId: string, files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const totalFiles = files.length;
      let completed = 0;

      // Get current max order
      const { data: existing } = await supabase
        .from('gallery_photos')
        .select('display_order')
        .eq('gallery_id', galleryId)
        .order('display_order', { ascending: false })
        .limit(1);

      let currentOrder = existing?.[0]?.display_order ?? 0;

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${galleryId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('client-photos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('client-photos')
          .getPublicUrl(fileName);

        currentOrder++;

        // Insert record in DB
        const { error: insertError } = await supabase
          .from('gallery_photos')
          .insert({
            gallery_id: galleryId,
            photo_url: urlData.publicUrl,
            title: file.name.replace(/\.[^/.]+$/, ''),
            display_order: currentOrder,
          });

        if (insertError) throw insertError;

        completed++;
        setUploadProgress(Math.round((completed / totalFiles) * 100));
      }

      // Refresh photos
      await fetchPhotos(galleryId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [fetchPhotos]);

  const deletePhoto = useCallback(async (photo: GalleryPhoto) => {
    setError(null);
    try {
      // Extract storage path from URL
      const url = new URL(photo.photo_url);
      const pathParts = url.pathname.split('/storage/v1/object/public/client-photos/');
      const storagePath = pathParts[1];

      if (storagePath) {
        await supabase.storage.from('client-photos').remove([storagePath]);
      }

      const { error: deleteError } = await supabase
        .from('gallery_photos')
        .delete()
        .eq('id', photo.id);

      if (deleteError) throw deleteError;

      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  return {
    photos,
    isUploading,
    uploadProgress,
    error,
    fetchPhotos,
    uploadPhotos,
    deletePhoto,
  };
};
