/** ImageKit video URL yordamchilari (brauzerda ham ishlatsa bo'ladi — kalit yo'q) */

export const isImageKit = (url: string) => /(^|\.)imagekit\.io\//.test(url) || url.includes("ik.imagekit.io");

/** ?updatedAt=... kabi mavjud query'ni saqlagan holda `tr` transformatsiya qo'shadi */
export const withTransform = (url: string, tr: string) =>
  isImageKit(url) ? `${url}${url.includes("?") ? "&" : "?"}tr=${tr}` : url;

/**
 * ImageKit adaptiv oqim (HLS) manzili — video-brief'dagi bilan bir xil.
 * /ik-master.m3u8 query'dan OLDIN qo'shilishi kerak.
 */
export const hlsUrl = (url: string) => {
  const [base] = url.split("?");
  return `${base}/ik-master.m3u8?tr=sr-240_360_480_720_1080`;
};

/** Hover-preview uchun yengil nusxa (640px balandlik, past sifat) */
export const previewUrl = (url: string) => withTransform(url, "h-640,q-50");
