/**
 * Saytdagi statik ma'lumotlar.
 * Hero videosi: public/main.mp4 (components/home/Hero.tsx).
 */

export const site = {
  name: "islomVisual",
  owner: "Islom",
  email: "lamjarred063@gmail.com",
  phone: "+998 90 901 55 27",
  socials: {
    instagram: "https://instagram.com/islom.filmic",
    telegram: "https://t.me/who_islom",
    youtube: "https://youtube.com/",
  },
};

/**
 * "Latest work" carouselida chiqadigan kolleksiyalar — ImageKit'dagi
 * /photos ichidagi papka nomlari (aynan shunday yoziladi, "-pin" bilan).
 * Qo'shish: nomini massivga yozing. Olib tashlash: o'chiring. Tartib shu yerdagidek.
 * Rasmlar va matn (Descr.rtf) o'sha papkadan olinadi — lib/latest.ts
 */
export const latestCollections: string[] = ["Anidam-pin"];

/** "Trusted by" bo'limi — logotiplaringiz tayyor bo'lgach rasm bilan almashtiriladi */
/**
 * "Trusted by" — mijozlar logotiplari: public/clients/<slug>.svg
 * (krem rangda, vektor). `ratio` = kenglik / balandlik — logotiplar
 * ko'zga bir xil kattalikda ko'rinishi uchun o'lcham shunga qarab hisoblanadi.
 */
export const clients: { name: string; slug: string; ratio: number; scale?: number }[] = [
  { name: "Melora", slug: "melora", ratio: 1.44 },
  { name: "Liliya Dulat", slug: "liliya-dulat", ratio: 2.54, scale: 1.15 },
  { name: "Kapsalan", slug: "kapsalan", ratio: 8.77 },
  { name: "Cherry Mx", slug: "cherry-mx", ratio: 0.94, scale: 1.25 },
  { name: "Materia", slug: "materia", ratio: 2.27 },
  { name: "Kipchokov Valijon", slug: "kipchokov-valijon", ratio: 1.36 },
  { name: "Rano collection", slug: "rano-collection", ratio: 0.63 },
  { name: "Anidám collection", slug: "anidam", ratio: 2.66 },
  { name: "Sebil ipagim", slug: "sebil-ipagim", ratio: 1.73, scale: 1.3 },
  { name: "Safia café & bakery", slug: "safia", ratio: 1.76, scale: 0.9 },
];

export const images = {
  about:
    "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=2000&q=80&auto=format&fit=crop",
  cta: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=2000&q=80&auto=format&fit=crop",
};
