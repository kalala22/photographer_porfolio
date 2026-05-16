export interface Gallery {
  id: string;
  client_name: string;
  access_token: string;
  expires_at: string | null;
  created_at: string;
  user_id: string;
  photo_count?: number;
}

export interface GalleryPhoto {
  id: string;
  gallery_id: string;
  photo_url: string;
  title: string;
  display_order: number;
  created_at: string;
}

export interface GalleryWithPhotos extends Gallery {
  gallery_photos: GalleryPhoto[];
}
