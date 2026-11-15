import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AlbumGallery from "@/components/works/AlbumGallery";
import DiscoverMore from "@/components/works/DiscoverMore";
import { getAlbum, getPhotoFolders } from "@/lib/works";
import styles from "./album.module.css";

const decode = (slug: string) => {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
};

/**
 * Cache Components: albomlar build vaqtida oldindan tayyorlanadi.
 * Ro'yxat bo'sh bo'lsa ham kamida bitta param qaytishi shart (aks holda build xatosi) —
 * keyin qo'shilgan albomlar esa birinchi so'rovda yaratilib keshlanadi.
 */
export async function generateStaticParams() {
  const folders = await getPhotoFolders().catch(() => []);
  return folders.length ? folders.map((f) => ({ slug: f.slug })) : [{ slug: "__none__" }];
}

export async function generateMetadata({ params }: PageProps<"/works/photo/[slug]">): Promise<Metadata> {
  const album = await getAlbum(decode((await params).slug)).catch(() => null);
  return album ? { title: album.name, openGraph: { images: [album.coverUrl] } } : {};
}

export default async function AlbumPage({ params }: PageProps<"/works/photo/[slug]">) {
  const slug = decode((await params).slug);
  const [album, folders] = await Promise.all([
    getAlbum(slug).catch(() => null),
    getPhotoFolders().catch(() => []),
  ]);
  if (!album) notFound();

  // Ro'yxatdagi keyingi albom (oxiridan keyin birinchisiga qaytadi)
  const pos = folders.findIndex((f) => f.slug === album.slug);
  const next = folders[(pos + 1) % folders.length];

  return (
    <>
      <header className={styles.header}>
        <Link href="/works" className={styles.back}>
          ← All work
        </Link>
        <div className={styles.titleRow}>
          <h1 className="serif rv">
            <em>{album.name}</em>
          </h1>
          <dl className={`${styles.meta} rv`}>
            <div>
              <dt>Series</dt>
              <dd>Photo</dd>
            </div>
            <div>
              <dt>Frames</dt>
              <dd>{album.count}</dd>
            </div>
          </dl>
        </div>
      </header>

      <AlbumGallery name={album.name} photos={album.photos} />

      {next && next.slug !== album.slug && (
        <DiscoverMore href={`/works/photo/${encodeURIComponent(next.slug)}`} label={`Next: ${next.name}`} />
      )}
    </>
  );
}
