import type { FileObject } from "imagekit/dist/libs/interfaces";
import { cacheLife, cacheTag } from "next/cache";
import { latestCollections } from "./data";
import { imagekit } from "./imagekit";
import { mockAlbums } from "./mock-works";
import type { PhotoWork } from "./types";

/**
 * "LATEST WORK" CAROUSELI — ImageKit'dan
 *
 * Qaysi kolleksiyalar chiqishi lib/data.ts dagi `latestCollections` massivida:
 * papka nomini qo'shsangiz carouselga qo'shiladi, o'chirsangiz chiqib ketadi.
 * Tartib massivdagi tartib bilan bir xil.
 *
 * Har bir papka (/photos/<nom>) ichida:
 *   • rasmlar — har biri carouselda bitta slayd ("cover-" birinchi, qolgani yuklangan tartibda),
 *     o'z nisbatida chiqadi, qirqilmaydi
 *   • Descr.rtf (yoki Descr.txt) — chap tomondagi matn:
 *       Title: ...        (ixtiyoriy; bo'lmasa papka nomi)
 *       Location: ...
 *       Date: 13.11.26
 *       Descr: ...
 *
 * Natija 5 daqiqa keshlanadi. Kalitlar bo'lmasa — vaqtinchalik ma'lumot.
 */

const CACHE = { stale: 300, revalidate: 300, expire: 86400 };

const isImage = (f: FileObject) => f.fileType === "image" || /\.(jpe?g|png|webp|avif)$/i.test(f.name);
const isDescr = (f: FileObject) => /^descr(iption)?\.(rtf|txt|md)$/i.test(f.name);
const displayName = (slug: string) => slug.replace(/-pin$/i, "");

/** RTF'ni oddiy matnga aylantiradi (TextEdit'da yozilgan qisqa matnlar uchun yetarli) */
function rtfToText(rtf: string): string {
  if (!rtf.trimStart().startsWith("{\\rtf")) return rtf;
  return rtf
    .replace(/\{\\(?:fonttbl|colortbl|stylesheet|info|\*)[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, "") // sarlavha guruhlari
    .replace(/\\'([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16))) // \'e9 → é
    .replace(/\\u(-?\d+)\??/g, (_, n) => String.fromCharCode((Number(n) + 65536) % 65536)) // unicode
    .replace(/\\(?:par|line)\b ?|\\\r?\n/g, "\n") // qator tashlash
    .replace(/\\[a-z]+-?\d* ?/gi, "") // boshqa buyruqlar
    .replace(/[{}]/g, "")
    .replace(/\\([\\{}])/g, "$1");
}

interface Meta {
  title?: string;
  client?: string;
  location?: string;
  date?: string;
  description?: string;
}

const KEYS: Record<string, keyof Meta> = {
  title: "title",
  client: "client",
  location: "location",
  date: "date",
  descr: "description",
  description: "description",
};

/** "Key: value" qatorlarini o'qiydi; tavsif keyingi qatorlarga davom etishi mumkin */
function parseDescr(text: string): Meta {
  const meta: Meta = {};
  let last: keyof Meta | null = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    const m = line.match(/^([a-z]+)\s*:\s*(.*)$/i);
    const key = m && KEYS[m[1].toLowerCase()];
    if (key) {
      meta[key] = m[2].trim();
      last = key;
    } else if (line && last) {
      meta[last] = `${meta[last] ? `${meta[last]} ` : ""}${line}`;
    }
  }
  // 13.11.26 → 13.11.2026
  if (meta.date) meta.date = meta.date.replace(/^(\d{1,2})\.(\d{1,2})\.(\d{2})$/, "$1.$2.20$3");
  return meta;
}

/** 2000×2500 → "4:5" (tanish formatlarga yaxlitlanadi) */
function formatLabel(w: number, h: number): string {
  const known = ["1:1", "4:5", "5:4", "3:4", "4:3", "2:3", "3:2", "9:16", "16:9"];
  const hit = known.find((k) => {
    const [a, b] = k.split(":").map(Number);
    return Math.abs(a / b - w / h) < 0.02;
  });
  if (hit) return hit;
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const g = gcd(w, h);
  return `${w / g}:${h / g}`;
}

async function getCollection(slug: string): Promise<PhotoWork[]> {
  const list = await imagekit!.listFiles({ path: `/photos/${slug}`, type: "file", limit: 1000, sort: "ASC_CREATED" });
  const all = list.filter((f): f is FileObject => f.type === "file");
  // "cover-" bilan boshlangan rasm birinchi slayd bo'ladi
  const isCover = (f: FileObject) => f.name.toLowerCase().startsWith("cover-");
  const images = all.filter(isImage).sort((a, b) => Number(isCover(b)) - Number(isCover(a)));
  if (images.length === 0) return [];

  const descrFile = all.find(isDescr);
  let meta: Meta = {};
  if (descrFile) {
    const res = await fetch(descrFile.url);
    if (res.ok) meta = parseDescr(rtfToText(await res.text()));
  }

  const name = displayName(slug);
  return images.map((f) => {
    const width = f.width || 1600;
    const height = f.height || 2000;
    return {
      id: `${slug}/${f.fileId}`,
      slug,
      src: f.url,
      width,
      height,
      format: formatLabel(width, height),
      client: meta.client || name,
      title: meta.title || name,
      description: meta.description ?? "",
      date: meta.date ?? "",
      location: meta.location ?? "",
    };
  });
}

export async function getLatestPhotos(): Promise<PhotoWork[]> {
  "use cache";
  cacheLife(CACHE);
  cacheTag("works", "latest");

  if (!imagekit) {
    const album = mockAlbums[0];
    return album.photos.slice(0, 6).map((p, i) => ({
      id: `${album.slug}/${i}`,
      slug: album.slug,
      src: p.src,
      width: p.width,
      height: p.height,
      format: formatLabel(p.width, p.height),
      client: album.name,
      title: album.name,
      description: "ImageKit kalitlari topilmadi — vaqtinchalik rasmlar ko'rsatilmoqda.",
      date: "",
      location: "",
    }));
  }

  // Bitta papka xato bersa — qolganlari baribir chiqadi
  const results = await Promise.allSettled(latestCollections.map(getCollection));
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}
