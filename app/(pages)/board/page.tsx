import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PAGE_HERO_DEFAULTS } from "@/lib/page-hero-defaults";
import BoardClient, {
  type NewsItem,
  type GalleryItem,
} from "./_components/BoardClient";

// Render per request so admin edits show up immediately (no rebuild needed).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Board — ATM Lab",
  description:
    "Latest news and the photo gallery of the Advanced Thermal Management Lab at Ajou University.",
};

const pad2 = (n: number) => String(n).padStart(2, "0");
const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

export default async function BoardPage() {
  const [newsRows, galleryRows, meta] = await Promise.all([
    // Newest first; highest display number is the most recent item. Ties
    // (same calendar date) fall back to legacy wr_id (`order`), then
    // createdAt — deterministic, not curation.
    prisma.news.findMany({
      where: { published: true },
      orderBy: [{ date: "desc" }, { order: "desc" }, { createdAt: "desc" }],
    }),
    prisma.galleryItem.findMany({
      where: { published: true },
      orderBy: [{ date: "desc" }, { order: "desc" }, { createdAt: "desc" }],
    }),
    prisma.boardPageMeta.findFirst(),
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

  return (
    <BoardClient
      news={news}
      gallery={gallery}
      heroHeadline={meta?.heroHeadline ?? PAGE_HERO_DEFAULTS.board.heroHeadline}
      heroParagraph={meta?.heroParagraph ?? PAGE_HERO_DEFAULTS.board.heroParagraph}
    />
  );
}
