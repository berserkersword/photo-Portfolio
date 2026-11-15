import AboutBanner from "@/components/home/AboutBanner";
import Clients from "@/components/home/Clients";
import Cta from "@/components/home/Cta";
import Definition from "@/components/home/Definition";
import Hero from "@/components/home/Hero";
import LatestWork from "@/components/home/LatestWork";
import { getLatestPhotos } from "@/lib/latest";

export default async function Home() {
  const latestPhotos = await getLatestPhotos().catch(() => []);

  return (
    <>
      <Hero />
      <Definition />
      <Clients />
      {latestPhotos.length > 0 && <LatestWork photos={latestPhotos} />}
      <AboutBanner />
      <Cta />
    </>
  );
}
