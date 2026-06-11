import { prisma } from "@/lib/db";
import HomeClient, {
  type HomeData,
  type PubItem,
  type TabKey,
} from "./_components/HomeClient";

// Render per request so admin edits show up immediately (no rebuild needed).
export const dynamic = "force-dynamic";

const pad2 = (n: number) => String(n).padStart(2, "0");
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const GALLERY_SPANS = ["col-span-2", "row-span-2", "", "", "col-span-2"];

// Legacy News.content is a stored HTML blob — flatten it to a plain-text snippet
// for the two-line preview (full article lives on /board).
function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

// Legacy periods are full dates ("2021.05.01.~2025.12.31.") which overflow the
// compact preview column — collapse to the start–end year range ("2021 — 2025").
function periodToYears(period: string): string {
  const years = period.match(/\d{4}/g);
  if (!years || years.length === 0) return period;
  const [start] = years;
  const end = years[years.length - 1];
  return start === end ? start : `${start} — ${end}`;
}

export default async function Home() {
  const [
    topics,
    projectRows,
    members,
    newsRows,
    galleryRows,
    lectureRows,
    publicationCount,
    latestAll,
    latestJournal,
    latestConference,
    latestPatent,
  ] = await Promise.all([
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
    prisma.project.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.member.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.news.findMany({ where: { published: true }, orderBy: { date: "desc" }, take: 5 }),
    prisma.galleryItem.findMany({
      where: { published: true, imgPath: { not: null } },
      orderBy: { order: "desc" },
      take: 5,
    }),
    prisma.lecture.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.publication.count({ where: { published: true } }),
    // Latest 10 per tab (year desc, then legacy order desc) so every filter is populated.
    prisma.publication.findMany({ where: { published: true }, orderBy: [{ year: "desc" }, { order: "desc" }], take: 10 }),
    prisma.publication.findMany({ where: { published: true, type: "JOURNAL" }, orderBy: [{ year: "desc" }, { order: "desc" }], take: 10 }),
    prisma.publication.findMany({ where: { published: true, type: "CONFERENCE" }, orderBy: [{ year: "desc" }, { order: "desc" }], take: 10 }),
    prisma.publication.findMany({ where: { published: true, type: "PATENT" }, orderBy: [{ year: "desc" }, { order: "desc" }], take: 10 }),
  ]);

  // ── Research cards: first non-null figure across the topic's subsections ──
  const firstFigure = (t: (typeof topics)[number]): string | null => {
    for (const s of t.subsections) {
      for (const f of s.figures) if (f.imgPath) return f.imgPath;
    }
    return null;
  };
  const research = topics.map((t, i) => ({
    num: pad2(i + 1),
    eyebrow: `Research Topic ${pad2(i + 1)}`,
    title: t.title,
    // Deep-link to the matching topic section (id = `topic-${num}` in ResearchClient).
    href: `/research#topic-${parseInt(t.num, 10)}`,
    img: firstFigure(t),
  }));
  const professorKeywords = topics.slice(0, 3).map((t) => t.title);

  // ── Projects: active first, then legacy order; preview the first four ──
  const statusRank = (s: string) => (s === "ACTIVE" ? 0 : 1);
  const projects = [...projectRows]
    .sort((a, b) => statusRank(a.status) - statusRank(b.status) || a.order - b.order)
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      period: periodToYears(p.period),
      title: p.title,
      funder: p.institution,
      active: p.status === "ACTIVE",
    }));

  // ── Publications: map each tab's latest rows (newest carries display "01") ──
  type Row = Awaited<ReturnType<typeof prisma.publication.findMany>>[number];
  const metaOf = (p: Row): string =>
    p.type === "JOURNAL"
      ? p.journal ?? ""
      : p.type === "CONFERENCE"
        ? p.conference ?? ""
        : p.applicationNo ?? "—";
  const toPub = (rows: Row[]): PubItem[] =>
    rows.map((p, i) => ({
      id: p.id,
      num: pad2(i + 1),
      year: p.year,
      title: p.title,
      meta: metaOf(p),
      detail: p.year,
      authors: p.authors ?? "",
      type: p.type,
    }));
  const publications: Record<TabKey, PubItem[]> = {
    All: toPub(latestAll),
    Journal: toPub(latestJournal),
    Conference: toPub(latestConference),
    Patent: toPub(latestPatent),
  };

  // ── Members: professor card + position-based groups ──
  const professor = members.find((m) => m.role === "PROFESSOR");
  const professorImg = professor?.imgPath ?? "/professor.png";

  const groupDefs: { label: string; match: (m: (typeof members)[number]) => boolean }[] = [
    { label: "Researchers", match: (m) => m.role === "RESEARCHER" },
    { label: "Ph.D. Students", match: (m) => m.position === "Ph.D. Course" },
    { label: "M.S. Students", match: (m) => m.position === "Master's Course" },
    { label: "Undergrad / Intern", match: (m) => m.position === "Undergraduate Intern" },
  ];
  const memberGroups = groupDefs
    .map((g) => {
      const ms = members.filter(g.match);
      return {
        label: g.label,
        count: pad2(ms.length),
        members: ms.map((m) => ({ id: m.id, initials: initialsOf(m.name), name: m.name, year: m.year })),
      };
    })
    .filter((g) => g.members.length > 0);

  // ── Lectures: category label + first paragraph as the blurb ──
  const lectures = lectureRows.map((l) => ({
    id: l.id,
    num: l.num,
    category: (l.category === "UNDERGRADUATE" ? "Undergraduate" : "Graduate") as
      | "Undergraduate"
      | "Graduate",
    title: l.title,
    desc: l.paragraphs[0] ?? "",
  }));

  // ── News: split date + flattened body ──
  const news = newsRows.map((n) => ({
    id: n.id,
    day: pad2(n.date.getUTCDate()),
    month: `${MONTHS[n.date.getUTCMonth()]} ${n.date.getUTCFullYear()}`,
    title: n.title,
    body: n.content ? htmlToText(n.content) : "",
  }));

  // ── Gallery: image-backed items in the original span layout ──
  const gallery = galleryRows.map((g, i) => ({
    id: g.id,
    src: g.imgPath!,
    cap: `${g.title} · ${g.date.getUTCFullYear()}`,
    span: GALLERY_SPANS[i] ?? "",
  }));

  // ── Hero stats: exact DB counts (no padding / "+") ──
  const memberCount = members.filter((m) => m.role !== "ALUMNI").length;
  const heroStats = [
    { value: String(publicationCount), label: "Publications" },
    { value: String(memberCount), label: "Lab members" },
    { value: String(projectRows.length), label: "Funded projects" },
  ];

  const data: HomeData = {
    heroStats,
    research,
    projects,
    publications,
    professorImg,
    professorKeywords,
    publicationCount,
    memberGroups,
    lectures,
    news,
    gallery,
  };

  return <HomeClient {...data} />;
}
