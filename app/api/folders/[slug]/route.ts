import { NextResponse } from "next/server";
import { getAlbum } from "@/lib/works";

/** GET /api/folders/[slug] — albomdagi rasmlar URL ro'yxati */
export async function GET(_request: Request, { params }: RouteContext<"/api/folders/[slug]">) {
  const { slug } = await params;

  try {
    const album = await getAlbum(slug);
    const imageUrls = album?.photos.map((p) => p.src) ?? [];

    // CDN'da 5 daqiqa keshlanadi, keyin fonda yangilanadi
    return NextResponse.json(imageUrls, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400" },
    });
  } catch (error) {
    console.error("ImageKit fetch error:", error);
    return NextResponse.json({ error: "Rasmlarni olib bo'lmadi" }, { status: 500 });
  }
}
