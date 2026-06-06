import { prisma } from "@/lib/db";
import BoardClient, {
  type NewsItem,
  type GalleryItem,
} from "./_components/BoardClient";

// Render per request so admin edits show up immediately (no rebuild needed).
export const dynamic = "force-dynamic";

const pad2 = (n: number) => String(n).padStart(2, "0");
const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

export default async function BoardPage() {
  const [newsRows, galleryRows] = await Promise.all([
    // Newest first; highest display number is the most recent item.
    prisma.news.findMany({ where: { published: true }, orderBy: { date: "desc" } }),
    // Legacy wr_id order (NOT strict date order) — preserved via `order` desc.
    prisma.galleryItem.findMany({ where: { published: true }, orderBy: { order: "desc" } }),
  ]);

  const news: NewsItem[] = newsRows.map((n, i) => ({
    id: n.id,
    num: pad2(newsRows.length - i),
    date: fmtDate(n.date),
    title: n.title,
  }));

  const gallery: GalleryItem[] = galleryRows.map((g, i) => ({
    id: g.id,
    num: pad2(galleryRows.length - i),
    date: fmtDate(g.date),
    title: g.title,
    imgPath: g.imgPath,
  }));

  return <BoardClient news={news} gallery={gallery} />;
}
