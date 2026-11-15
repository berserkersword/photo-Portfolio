import { NextResponse } from "next/server";
import type { ApiPhotoFolder } from "@/lib/types";
import { getPhotoFolders } from "@/lib/works";

export type { ApiPhotoFolder };

/** GET /api/folders — ImageKit /photos ichidagi albomlar (pinned birinchi) */
export async function GET() {
  try {
    const folders = await getPhotoFolders();
    return NextResponse.json(folders);
  } catch (error) {
    console.error("ImageKit fetch error:", error);
    return NextResponse.json({ error: "Papkalarni olib bo'lmadi" }, { status: 500 });
  }
}
