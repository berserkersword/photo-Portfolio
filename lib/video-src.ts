/** ImageKit video URL yordamchilari (brauzerda ham ishlatsa bo'ladi — kalit yo'q) */

export const isImageKit = (url: string) => /(^|\.)imagekit\.io\//.test(url) || url.includes("ik.imagekit.io");

/** ?updatedAt=... kabi mavjud query'ni saqlagan holda `tr` transformatsiya qo'shadi */
export const withTransform = (url: string, tr: string) =>
  isImageKit(url) ? `${url}${url.includes("?") ? "&" : "?"}tr=${tr}` : url;

/**
 * ImageKit adaptiv oqim (HLS) manzili. /ik-master.m3u8 query'dan OLDIN qo'shiladi.
 * sr-… raqamlari videoning UZUN tomoni bo'yicha: vertikal 1080×1920 video uchun
 * "1080" atigi 608×1080 bo'ladi, shuning uchun 1440 va 2160 ham kerak —
 * 2160 asl 1080×1920 ni beradi (ImageKit asl o'lchamdan kattalashtirmaydi).
 */
export const hlsUrl = (url: string) => {
  const [base] = url.split("?");
  return `${base}/ik-master.m3u8?tr=sr-360_480_720_1080_1440_2160`;
};

/** Hover-preview uchun yengil nusxa (640px balandlik, past sifat) */
export const previewUrl = (url: string) => withTransform(url, "h-640,q-50");
