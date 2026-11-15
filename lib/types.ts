/**
 * video-brief loyihasidagi API javoblari bilan bir xil shakl.
 * Keyinchalik mock ma'lumotlar o'rniga /api/videos va /api/folders
 * javoblarini to'g'ridan-to'g'ri ishlatish mumkin bo'ladi.
 */
export interface ApiVideo {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
}

export interface ApiPhotoFolder {
  slug: string;
  name: string;
  coverUrl: string;
  count: number;
  pinned: boolean;
}

/** Albom ichidagi bitta rasm (o'lchami bilan — to'r o'z formatida terilishi uchun) */
export interface AlbumPhoto {
  src: string;
  width: number;
  height: number;
}

/** Albom: ro'yxatdagi ma'lumot + ichidagi rasmlar */
export interface Album extends ApiPhotoFolder {
  photos: AlbumPhoto[];
}

/** Works → Video bo'limidagi bitta video */
export interface VideoWork extends ApiVideo {
  title: string;
}

/** Foto ishlaringiz uchun ishlatiladigan formatlar */
export type PhotoFormat = "4:5" | "3:2" | "2:3" | "9:16";

/** "Latest work" carouselidagi bitta slayd (bitta rasm + kolleksiya matni) */
export interface PhotoWork {
  id: string;
  /** ImageKit'dagi papka nomi (/photos/<slug>) */
  slug: string;
  src: string;
  width: number;
  height: number;
  /** Ko'rsatish uchun nisbat, masalan "4:5" */
  format: string;
  client: string;
  title: string;
  /** Chap tomondagi matn — kolleksiya almashganda shu ham almashadi */
  description: string;
  /** Suratga olingan sana, masalan "13.11.2026" */
  date: string;
  location: string;
}
