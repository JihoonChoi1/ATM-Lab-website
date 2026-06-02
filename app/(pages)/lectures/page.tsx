import { prisma } from "@/lib/db";
import LecturesClient, { type Lecture } from "./_components/LecturesClient";

// Render per request so admin edits show up immediately (no rebuild needed).
export const dynamic = "force-dynamic";

export default async function LecturesPage() {
  const rows = await prisma.lecture.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  const lectures: Lecture[] = rows.map((l) => ({
    num: l.num,
    category: l.category === "UNDERGRADUATE" ? "Undergraduate" : "Graduate",
    title: l.title,
    paragraphs: l.paragraphs,
  }));

  return <LecturesClient lectures={lectures} />;
}
