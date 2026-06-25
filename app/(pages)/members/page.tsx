import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { bestDetailSrc } from "@/lib/thumbnail";
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

type Entry = { period: string; title: string; inst: string };
type LectureSubject = { title: string; code: string };

export default async function MembersPage() {
  const [members, meta] = await Promise.all([
    prisma.member.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
    prisma.membersPageMeta.findFirst(),
  ]);

  const profRow = members.find((m) => m.role === "PROFESSOR");

  const professor: Professor = {
    name: profRow?.name ?? "이정호",
    // Hero portrait is the one full-size image on /members (cards use Thumb);
    // serve its detail variant (8-5).
    img: profRow?.imgPath ? bestDetailSrc(profRow.imgPath) : null,
    education: (profRow?.education as unknown as Entry[]) ?? [],
    workHistory: (profRow?.workHistory as unknown as Entry[]) ?? [],
    researchFields:
      (profRow?.researchFields as unknown as Professor["researchFields"]) ?? [],
    lectureSubjects: (profRow?.lectureSubjects as unknown as LectureSubject[]) ?? [],
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
