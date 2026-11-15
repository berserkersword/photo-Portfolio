import type { Metadata } from "next";
import AlbumGrid from "@/components/works/AlbumGrid";
import DiscoverMore from "@/components/works/DiscoverMore";
import WorksHeader from "@/components/works/WorksHeader";
import { getPhotoFolders, getVideos } from "@/lib/works";

export const metadata: Metadata = {
  title: "Works",
  description: "Photo series and short films by islomVisual.",
};

export default async function WorksPage() {
  // ImageKit javob bermasa sahifa buzilmaydi — bo'sh ro'yxat ko'rsatiladi
  const [folders, videos] = await Promise.all([
    getPhotoFolders().catch(() => []),
    getVideos().catch(() => []),
  ]);

  return (
    <>
      <WorksHeader active="photo" photoCount={folders.length} videoCount={videos.length} />
      <AlbumGrid folders={folders} />
      <DiscoverMore href="/works/video" label="Films" />
    </>
  );
}
