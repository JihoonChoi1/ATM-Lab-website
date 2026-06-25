import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { bestDetailSrc } from "@/lib/thumbnail";
import ResearchClient, { type Topic } from "./_components/ResearchClient";

// Render per request so admin edits show up immediately (no rebuild needed).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Research — ATM Lab",
  description:
    "Explore the research areas of the Advanced Thermal Management Lab at Ajou University, spanning two-phase cooling, battery thermal management, phase-change materials, and heat pump systems.",
};

export default async function ResearchPage() {
  const [rows, meta] = await Promise.all([
    prisma.researchTopic.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: {
        subsections: {
          where: { published: true },
          orderBy: { order: "asc" },
          include: { figures: { orderBy: { order: "asc" } } },
        },
      },
    }),
    prisma.researchPageMeta.findFirst(),
  ]);

  const topics: Topic[] = rows.map((t) => ({
    num: t.num,
    bg: t.bg === "bg" ? "bg" : "white",
    title: t.title,
    lead: t.lead,
    keywords: t.keywords,
    subs: t.subsections.map((s) => ({
      num: s.num,
      title: s.title,
      body: s.body,
      keywords: s.keywords,
      figures: s.figures.map((f) => ({
        w: f.width,
        h: f.height,
        caption: f.caption,
        wide: f.wide,
        // Research figures are scientific content — serve the sharp 1400px detail
        // variant (not the 600px card thumbnail), and bestDetailSrc falls back to
        // the original for GIFs so animated figures keep playing.
        imgPath: f.imgPath ? bestDetailSrc(f.imgPath) : null,
      })),
    })),
  }));

  const subtopicsCount = topics.reduce((n, t) => n + t.subs.length, 0);

  return (
    <ResearchClient
      topics={topics}
      heroHeadline={meta?.heroHeadline ?? "Engineering heat\nat every scale."}
      heroParagraph={meta?.heroParagraph ?? ""}
      yearsValue={meta?.yearsValue ?? "10+"}
      topicsCount={topics.length}
      subtopicsCount={subtopicsCount}
    />
  );
}
