import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PAGE_HERO_DEFAULTS } from "@/lib/page-hero-defaults";
import MembersClient, {
  type Person,
  type Alumnus,
  type Professor,
} from "./_components/MembersClient";

// Render per request so admin edits show up immediately (no rebuild needed).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Members — ATM Lab",
  description:
    "Meet the Advanced Thermal Management Lab team at Ajou University — the principal investigator, researchers, graduate students, and alumni.",
};

export default async function MembersPage() {
  const [members, meta] = await Promise.all([
    prisma.member.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
    prisma.membersPageMeta.findFirst(),
  ]);

  const profRow = members.find((m) => m.role === "PROFESSOR");

  // Card face + intro panel — the full CV renders on /members/[id]. The panel's
  // chips are the top-level item labels of the researchFields CV JSON.
  type ResearchFieldGroup = { group: string; items: { label: string; subs: string[] }[] };
  const profFields = (
    (profRow?.researchFields as unknown as ResearchFieldGroup[] | null) ?? []
  ).flatMap((g) => g.items.map((it) => it.label));

  const professor: Professor = {
    id: profRow?.id ?? null,
    name: profRow?.name ?? "이정호",
    img: profRow?.imgPath ?? "/professor.png",
    email: profRow?.email ?? null,
    fields: profFields,
  };

  const toPerson = (m: (typeof members)[number]): Person => ({
    id: m.id,
    name: m.name,
    position: m.position,
    year: m.year,
    interests: m.interests,
    email: m.email,
    img: m.imgPath,
  });

  const researchers = members.filter((m) => m.role === "RESEARCHER").map(toPerson);
  const students = members.filter((m) => m.role === "STUDENT").map(toPerson);

  const alumni: Alumnus[] = members
    .filter((m) => m.role === "ALUMNI")
    .map((m) => ({
      id: m.id,
      name: m.name,
      year: m.year ?? "",
      degree: m.degree ?? "",
      position: m.currentPosition ?? "—",
      email: m.email,
      img: m.imgPath,
    }));

  const counts = {
    pi: members.filter((m) => m.role === "PROFESSOR").length,
    researchers: researchers.length,
    students: students.length,
    alumni: alumni.length,
  };

  return (
    <MembersClient
      professor={professor}
      researchers={researchers}
      students={students}
      alumni={alumni}
      counts={counts}
      heroHeadline={meta?.heroHeadline ?? PAGE_HERO_DEFAULTS.members.heroHeadline}
      heroParagraph={meta?.heroParagraph ?? PAGE_HERO_DEFAULTS.members.heroParagraph}
    />
  );
}
