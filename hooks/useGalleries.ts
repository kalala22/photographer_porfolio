import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { nanoid } from 'nanoid';
import type { Gallery } from '../lib/database.types';

export const useGalleries = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('galleries')
        .select('*, gallery_photos(count)')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const galleriesWithCount = (data || []).map((g: any) => ({
        ...g,
        photo_count: g.gallery_photos?.[0]?.count || 0,
      }));

      setGalleries(galleriesWithCount);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createGallery = useCallback(async (
    clientName: string,
    expiresAt?: string | null
  ): Promise<Gallery | null> => {
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const accessToken = nanoid(12);

      const { data, error: createError } = await supabase
        .from('galleries')
        .insert({
          client_name: clientName,
          access_token: accessToken,
          expires_at: expiresAt || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (createError) throw createError;
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, []);

  const deleteGallery = useCallback(async (id: string) => {
    setError(null);
    try {
      // Delete photos from storage first
      const { data: photos } = await supabase
        .from('gallery_photos')
        .select('photo_url')
        .eq('gallery_id', id);

      if (photos && photos.length > 0) {
        const paths = photos
          .map((p) => {
            const url = new URL(p.photo_url);
            const pathParts = url.pathname.split('/storage/v1/object/public/client-photos/');
            return pathParts[1] || null;
          })
          .filter(Boolean) as string[];

        if (paths.length > 0) {
          await supabase.storage.from('client-photos').remove(paths);
        }
      }

      // Delete gallery (cascade deletes photos rows)
      const { error: deleteError } = await supabase
        .from('galleries')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setGalleries((prev) => prev.filter((g) => g.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const getGalleryByToken = useCallback(async (token: string) => {
    const { data, error: fetchError } = await supabase
      .from('galleries')
      .select('*, gallery_photos(*)')
      .eq('access_token', token)
      .single();

    if (fetchError) throw fetchError;

    // Check expiration
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      throw new Error('Cette galerie a expiré.');
    }

    return data;
  }, []);

  const getGalleryById = useCallback(async (id: string) => {
    const { data, error: fetchError } = await supabase
      .from('galleries')
      .select('*, gallery_photos(*)')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    return data;
  }, []);

  return {
    galleries,
    isLoading,
    error,
    fetchGalleries,
    createGallery,
    deleteGallery,
    getGalleryByToken,
    getGalleryById,
  };
};
