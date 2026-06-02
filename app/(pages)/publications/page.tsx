import { prisma } from "@/lib/db";
import PublicationsClient, {
  type Journal,
  type Conference,
  type Patent,
} from "./_components/PublicationsClient";

// Render per request so admin edits show up immediately (no rebuild needed).
export const dynamic = "force-dynamic";

type Row = Awaited<ReturnType<typeof prisma.publication.findMany>>[number];

// Sort a category newest-first (year desc, then legacy id desc) and assign
// descending display numbers so the most recent entry carries the highest one.
function sortAndNumber<T>(rows: Row[], map: (r: Row, num: number) => T): T[] {
  const sorted = [...rows].sort((a, b) =>
    a.year !== b.year ? b.year.localeCompare(a.year) : b.order - a.order
  );
  const total = sorted.length;
  return sorted.map((r, i) => map(r, total - i));
}

export default async function PublicationsPage() {
  const rows = await prisma.publication.findMany({ where: { published: true } });

  const journals: Journal[] = sortAndNumber(
    rows.filter((r) => r.type === "JOURNAL"),
    (r, num) => ({
      num,
      year: r.year,
      title: r.title,
      journal: r.journal ?? "",
      authors: r.authors ?? "",
      doi: r.doi,
      imgPath: r.imgPath,
    })
  );

  const conferences: Conference[] = sortAndNumber(
    rows.filter((r) => r.type === "CONFERENCE"),
    (r, num) => ({
      num,
      year: r.year,
      title: r.title,
      authors: r.authors ?? "",
      conference: r.conference ?? "",
    })
  );

  const patents: Patent[] = sortAndNumber(
    rows.filter((r) => r.type === "PATENT"),
    (r, num) => ({
      num,
      year: r.year,
      title: r.title,
      inventors: r.inventors ?? "",
      applicationNo: r.applicationNo ?? "—",
      country: r.country ?? "—",
      date: r.registeredAt ?? "—",
    })
  );

  const earliest =
    Array.from(new Set(rows.map((r) => r.year))).sort((a, b) =>
      a.localeCompare(b)
    )[0] ?? "—";

  return (
    <PublicationsClient
      journals={journals}
      conferences={conferences}
      patents={patents}
      earliest={earliest}
    />
  );
}
