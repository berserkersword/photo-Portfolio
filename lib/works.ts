import type { FileObject, FolderObject } from "imagekit/dist/libs/interfaces";
import { cacheLife, cacheTag } from "next/cache";
import { imagekit } from "./imagekit";
import { mockAlbums, mockVideos } from "./mock-works";
import type { Album, AlbumPhoto, ApiPhotoFolder, VideoWork } from "./types";

/**
 * WORKS MA'LUMOTLARI — ImageKit'dan (video-brief/app/api bilan bir xil mantiq)
 *
 *   getPhotoFolders()  →  GET /api/folders          (/photos ichidagi papkalar)
 *   getAlbum(slug)     →  GET /api/folders/[slug]   (/photos/<slug> ichidagi rasmlar)
 *   getVideos()        →  GET /api/videos           (/videos ichidagi videolar)
 *
 * ImageKit qoidalari (video-brief'dagidek):
 *   • papka nomi "-pin" bilan tugasa — ro'yxatda tepaga qadaladi, nomda ko'rinmaydi
 *   • "cover-" bilan boshlanadigan rasm — albom muqovasi (bo'lmasa birinchi rasm)
 *   • bo'sh papkalar ko'rsatilmaydi
 *
 * Natija 5 daqiqa keshlanadi (avvalgi `revalidate = 300` bilan bir xil).
 * .env.local da kalitlar bo'lmasa — vaqtinchalik (mock) ma'lumot qaytadi.
 */

const CACHE = { stale: 300, revalidate: 300, expire: 86400 };

const isImage = (f: FileObject) => f.fileType === "image" || /\.(jpe?g|png|webp|avif)$/i.test(f.name);
const isVideo = (f: FileObject) => f.fileType !== "image" && /\.(mp4|mov|webm|mkv)$/i.test(f.name);
const files = (list: (FileObject | FolderObject)[]) => list.filter((f): f is FileObject => f.type === "file");
const displayName = (slug: string) => slug.replace(/-pin$/i, "");

/** ImageKit papkasidagi rasmlar (yaratilgan tartibda) */
async function listImages(path: string): Promise<FileObject[]> {
  const list = await imagekit!.listFiles({ path, type: "file", limit: 1000, sort: "ASC_CREATED" });
  return files(list).filter(isImage);
}

const coverOf = (images: FileObject[]) =>
  images.find((f) => f.name.toLowerCase().startsWith("cover-")) ?? images[0];

/** GET /api/folders — pinned albomlar birinchi, bo'shlari chiqarib tashlanadi */
export async function getPhotoFolders(): Promise<ApiPhotoFolder[]> {
  "use cache";
  cacheLife(CACHE);
  cacheTag("works", "folders");

  if (!imagekit) {
    const list = mockAlbums.map(({ slug, name, coverUrl, count, pinned }) => ({ slug, name, coverUrl, count, pinned }));
    return [...list.filter((f) => f.pinned), ...list.filter((f) => !f.pinned)];
  }

  const folderItems = await imagekit.listFiles({ path: "/photos", type: "folder", limit: 100 });
  const folders = await Promise.all(
    folderItems
      .filter((f): f is FolderObject => f.type === "folder")
      .map(async (folder): Promise<ApiPhotoFolder> => {
        const images = await listImages(folder.folderPath);
        return {
          slug: folder.name, // o'zgartirmang: /photos/${slug} yo'li uchun kerak
          name: displayName(folder.name),
          coverUrl: coverOf(images)?.url ?? "",
          count: images.length,
          pinned: /-pin$/i.test(folder.name),
        };
      }),
  );

  const nonEmpty = folders.filter((f) => f.count > 0);
  return [...nonEmpty.filter((f) => f.pinned), ...nonEmpty.filter((f) => !f.pinned)];
}

/** GET /api/folders/[slug] — albom va uning rasmlari (o'lchamlari bilan) */
export async function getAlbum(slug: string): Promise<Album | null> {
  "use cache";
  cacheLife(CACHE);
  cacheTag("works", `album:${slug}`);

  if (!imagekit) return mockAlbums.find((a) => a.slug === slug) ?? null;

  const images = await listImages(`/photos/${slug}`);
  if (images.length === 0) return null;

  const photos: AlbumPhoto[] = images.map((f) => ({
    src: f.url,
    // eski fayllarda o'lcham yo'q bo'lsa 4:5 deb olinadi
    width: f.width || 1200,
    height: f.height || 1500,
  }));

  return {
    slug,
    name: displayName(slug),
    coverUrl: coverOf(images)?.url ?? photos[0].src,
    count: photos.length,
    pinned: /-pin$/i.test(slug),
    photos,
  };
}

/** GET /api/videos — /videos papkasidagi videolar */
export async function getVideos(): Promise<VideoWork[]> {
  "use cache";
  cacheLife(CACHE);
  cacheTag("works", "videos");

  if (!imagekit) return mockVideos;

  const list = await imagekit.listFiles({ path: "/videos", type: "file", limit: 1000, sort: "ASC_CREATED" });

  return files(list)
    .filter(isVideo)
    .map((v) => {
      // v.url ichida ?updatedAt=... bo'lishi mumkin — /ik-thumbnail.jpg query'dan OLDIN qo'shiladi
      const [baseUrl, query] = v.url.split("?");
      return {
        fileId: v.fileId,
        name: v.name,
        url: v.url,
        thumbnailUrl: `${baseUrl}/ik-thumbnail.jpg${query ? `?${query}` : ""}`,
        title: v.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
      };
    });
}
