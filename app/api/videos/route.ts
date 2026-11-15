import { NextResponse } from "next/server";
import type { ApiVideo } from "@/lib/types";
import { getVideos } from "@/lib/works";

export type { ApiVideo };

/** GET /api/videos — ImageKit /videos papkasidagi videolar */
export async function GET() {
  try {
    const videos = await getVideos();
    const body: ApiVideo[] = videos.map(({ fileId, name, url, thumbnailUrl }) => ({
      fileId,
      name,
      url,
      thumbnailUrl,
    }));
    return NextResponse.json(body);
  } catch (error) {
    console.error("ImageKit video fetch error:", error);
    return NextResponse.json({ error: "Videolarni olib bo'lmadi" }, { status: 500 });
  }
}
