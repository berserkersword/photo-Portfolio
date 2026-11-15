import LogoScreen from "@/components/LogoScreen";

/**
 * Sahifa ma'lumoti (ImageKit va h.k.) kutilayotganda ko'rinadigan oyna.
 * Bu fayl sahifalarni <Suspense> ichiga oladi — Next.js 16 "instant navigation"
 * talabini qondiradi va params o'qilishi haqidagi ogohlantirishni yo'qotadi.
 */
export default function Loading() {
  return <LogoScreen delayed />;
}
