import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PAGE_HERO_DEFAULTS } from "@/lib/page-hero-defaults";
import LecturesClient, { type Lecture } from "./_components/LecturesClient";

// Render per request so admin edits show up immediately (no rebuild needed).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lectures — ATM Lab",
  description:
    "Undergraduate and graduate courses taught by the Advanced Thermal Management Lab at Ajou University.",
};

export default async function LecturesPage() {
  const [rows, meta] = await Promise.all([
    prisma.lecture.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
    prisma.lecturesPageMeta.findFirst(),
  ]);

  const lectures: Lecture[] = rows.map((l) => ({
    id: l.id,
    num: l.num,
    category: l.category === "UNDERGRADUATE" ? "Undergraduate" : "Graduate",
    title: l.title,
    paragraphs: l.paragraphs,
  }));

  return (
    <LecturesClient
      lectures={lectures}
      heroHeadline={meta?.heroHeadline ?? PAGE_HERO_DEFAULTS.lectures.heroHeadline}
      heroParagraph={meta?.heroParagraph ?? PAGE_HERO_DEFAULTS.lectures.heroParagraph}
    />
  );
}
