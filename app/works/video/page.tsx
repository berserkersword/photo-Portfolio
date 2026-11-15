import type { Metadata } from "next";
import DiscoverMore from "@/components/works/DiscoverMore";
import VideoGrid from "@/components/works/VideoGrid";
import WorksHeader from "@/components/works/WorksHeader";
import { getPhotoFolders, getVideos } from "@/lib/works";

export const metadata: Metadata = {
  title: "Films",
  description: "Short films and reels by islomVisual.",
};

export default async function WorksVideoPage() {
  // ImageKit javob bermasa sahifa buzilmaydi — bo'sh ro'yxat ko'rsatiladi
  const [folders, videos] = await Promise.all([
    getPhotoFolders().catch(() => []),
    getVideos().catch(() => []),
  ]);

  return (
    <>
      <WorksHeader active="video" photoCount={folders.length} videoCount={videos.length} />
      <VideoGrid videos={videos} />
      <DiscoverMore href="/works" label="Photos" />
    </>
  );
}
