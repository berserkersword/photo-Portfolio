import LogoScreen from "@/components/LogoScreen";

/**
 * Albom ochilayotganda (masalan bir albomdan boshqasiga o'tganda) ko'rinadigan oyna.
 * Bu segmentning o'z <Suspense> chegarasi — params shu chegara ichida o'qiladi,
 * shuning uchun Next.js "instant-shell-url-data" xatosi chiqmaydi.
 */
export default function AlbumLoading() {
  return <LogoScreen delayed />;
}
