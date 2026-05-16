-- ============================================
-- Chretien Photographer — Supabase Schema
-- ============================================
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase
-- Dashboard > SQL Editor > New Query > Coller > Run

-- 1. Table des galeries
CREATE TABLE IF NOT EXISTS galleries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  access_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Index pour recherche rapide par token
CREATE INDEX IF NOT EXISTS idx_galleries_access_token ON galleries(access_token);

-- 2. Table des photos de galerie
CREATE TABLE IF NOT EXISTS gallery_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  title TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_photos_gallery_id ON gallery_photos(gallery_id);

-- ============================================
-- 3. Row Level Security (RLS)
-- ============================================

-- Activer RLS
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- Politique: L'admin (authentifié) peut tout faire sur ses galeries
CREATE POLICY "Admin full access to own galleries"
  ON galleries
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politique: Les visiteurs peuvent lire une galerie via token (pour /client/:token)
CREATE POLICY "Public read galleries by token"
  ON galleries
  FOR SELECT
  USING (true);

-- Politique: L'admin peut gérer les photos de ses galeries
CREATE POLICY "Admin full access to gallery photos"
  ON gallery_photos
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.id = gallery_photos.gallery_id
      AND galleries.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.id = gallery_photos.gallery_id
      AND galleries.user_id = auth.uid()
    )
  );

-- Politique: Les visiteurs peuvent lire les photos (pour affichage client)
CREATE POLICY "Public read gallery photos"
  ON gallery_photos
  FOR SELECT
  USING (true);

-- ============================================
-- 4. Storage Bucket
-- ============================================
-- Créez un bucket "client-photos" dans Supabase Dashboard > Storage
-- Configurez-le comme "public" pour que les clients puissent voir les images
-- Ou exécutez :

INSERT INTO storage.buckets (id, name, public)
VALUES ('client-photos', 'client-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Politique storage: L'admin authentifié peut uploader
CREATE POLICY "Admin can upload photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'client-photos');

-- Politique storage: L'admin peut supprimer ses photos
CREATE POLICY "Admin can delete photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'client-photos');

-- Politique storage: Tout le monde peut lire (les photos sont publiques)
CREATE POLICY "Public can read photos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'client-photos');
