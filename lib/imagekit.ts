import ImageKit from "imagekit";

/**
 * ImageKit server klienti (video-brief/lib/imagekit.ts bilan bir xil).
 * Private key ishlatadi — faqat serverda (route handler / server component)
 * import qiling, hech qachon "use client" fayllarda emas.
 *
 * Kalitlar .env.local da:
 *   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
 *   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
 *   IMAGEKIT_PRIVATE_KEY
 * Kalitlar bo'lmasa `imagekit` = null va sayt vaqtinchalik ma'lumot bilan ishlaydi.
 */
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

export const imagekit =
  publicKey && privateKey && urlEndpoint
    ? new ImageKit({ publicKey, privateKey, urlEndpoint })
    : null;
