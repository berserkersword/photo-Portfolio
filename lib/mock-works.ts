import type { Album, AlbumPhoto, PhotoFormat, VideoWork } from "./types";

/**
 * VAQTINCHALIK (MOCK) MA'LUMOTLAR
 * ImageKit kalitlari .env.local da bo'lmaganda lib/works.ts shularni ishlatadi.
 */

// ---------- vaqtinchalik rasmlar (Unsplash) ----------
const SIZE: Record<PhotoFormat, [number, number]> = {
  "4:5": [1200, 1500],
  "3:2": [1800, 1200],
  "2:3": [1200, 1800],
  "9:16": [1080, 1920],
};

const photo = (id: string, format: PhotoFormat): AlbumPhoto => {
  const [width, height] = SIZE[format];
  return {
    src: `https://images.unsplash.com/photo-${id}?w=${width}&h=${height}&fit=crop&q=80&auto=format`,
    width,
    height,
  };
};

const P = {
  portrait: [
    "1494790108377-be9c29b29330",
    "1534528741775-53994a69daeb",
    "1517841905240-472988babdf9",
    "1529626455594-4ff0802cfb7e",
    "1438761681033-6461ffad8d80",
    "1500648767791-00dcc994a43e",
    "1507003211169-0a1dd7228f2d",
  ],
  wedding: [
    "1519741497674-611481863552",
    "1511285560929-80b456fea0bc",
    "1465495976277-4387d4b0b4c6",
    "1520854221256-17451cc331bf",
  ],
  city: [
    "1477959858617-67f85cf4f1df",
    "1449824913935-59a10b8d2000",
    "1514565131-fce0801e5785",
    "1480714378408-67cf0d13bc1b",
    "1505236858219-8359eb29e329",
  ],
  nature: [
    "1506744038136-46273834b3fb",
    "1470071459604-3b5ec3a7fe05",
    "1501785888041-af3ef285b470",
    "1500530855697-b586d89ba3ee",
    "1469474968028-56623f02e42e",
    "1441974231531-c6227db76b6e",
    "1447752875215-b2761acb3c5d",
    "1519681393784-d120267933ba",
    "1464822759023-fed622ff2c3b",
  ],
};

const FORMATS: PhotoFormat[] = ["4:5", "3:2", "4:5", "9:16", "3:2", "4:5"];

/** Berilgan rasm to'plamidan `count` ta rasmli albom tuzadi (formatlar aralash) */
const build = (pool: string[], count: number, offset = 0): AlbumPhoto[] =>
  Array.from({ length: count }, (_, i) =>
    photo(pool[(i + offset) % pool.length], FORMATS[(i + offset) % FORMATS.length]),
  );

export const mockAlbums: Album[] = [
  { slug: "backstage-pin", name: "Backstage", pinned: true, photos: build([...P.portrait, ...P.city], 12) },
  { slug: "bridal-atelier-pin", name: "Bridal Atelier", pinned: true, photos: build(P.wedding, 9, 1) },
  { slug: "summer-collection-2026", name: "Summer Collection 2026", pinned: false, photos: build(P.portrait, 10, 3) },
  { slug: "studio-portraits", name: "Studio Portraits", pinned: false, photos: build(P.portrait, 8, 1) },
  { slug: "city-walks", name: "City Walks", pinned: false, photos: build(P.city, 9) },
  { slug: "wild-north", name: "Wild North", pinned: false, photos: build(P.nature, 11, 2) },
  { slug: "garden-wedding", name: "Garden Wedding", pinned: false, photos: build([...P.wedding, ...P.nature], 10, 2) },
  { slug: "golden-hour", name: "Golden Hour", pinned: false, photos: build([...P.nature, ...P.portrait], 7, 4) },
  { slug: "monochrome", name: "Monochrome", pinned: false, photos: build([...P.city, ...P.portrait], 8, 3) },
].map((a) => ({ ...a, count: a.photos.length, coverUrl: a.photos[0].src }));

// ---------- vaqtinchalik vertikal videolar (Mixkit, 9:16) ----------
const mixkit = (id: number, title: string): VideoWork => ({
  fileId: `mixkit-${id}`,
  name: `${id}.mp4`,
  url: `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`,
  thumbnailUrl: `https://assets.mixkit.co/videos/${id}/${id}-thumb-720-0.jpg`,
  title,
});

export const mockVideos: VideoWork[] = [
  mixkit(34404, "Desert Edit"),
  mixkit(39767, "Weekend Trails"),
  mixkit(34487, "Night Out"),
  mixkit(1173, "Spring Notes"),
  mixkit(32809, "Rooftop Session"),
  mixkit(34421, "Studio Day"),
  mixkit(1164, "Open Water"),
  mixkit(39875, "Golden Steps"),
];
