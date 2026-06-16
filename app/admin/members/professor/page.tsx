import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import ProfessorProfileForm from "../_components/ProfessorProfileForm";

export const metadata: Metadata = { title: "교수 프로필 편집 · ATM Lab" };

// Static segment — resolves before [id], so this is the professor editor, not
// an edit page for a member whose id is "professor". Reads a live row → never cache.
export const dynamic = "force-dynamic";

type Entry = { period: string; title: string; inst: string };
type Lecture = { title: string; code: string };
type Group = { group: string; items: { label: string; subs: string[] }[] };

export default async function ProfessorProfilePage() {
  await requireAdmin("/admin/members/professor");

  // Single PROFESSOR row holds the 4 structured JSON columns (7-2 left these out
  // of the generic member form).
  const prof = await prisma.member.findFirst({
    where: { role: "PROFESSOR" },
    select: {
      name: true,
      education: true,
      workHistory: true,
      researchFields: true,
      lectureSubjects: true,
    },
  });
  if (!prof) redirect("/admin/members");

  return (
    <div className="mx-auto w-full max-w-[760px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">교수 프로필 편집</h1>
        <p className="mt-1 text-sm text-ink-3">
          {prof.name} — 학력·경력·연구분야·강의 항목을 편집합니다. 이름·사진·공개 여부는{" "}
          <Link href="/admin/members" className="text-accent hover:underline">
            멤버 수정
          </Link>
          에서 관리합니다.
        </p>
      </div>
      <ProfessorProfileForm
        education={(prof.education as Entry[] | null) ?? []}
        workHistory={(prof.workHistory as Entry[] | null) ?? []}
        researchFields={(prof.researchFields as Group[] | null) ?? []}
        lectureSubjects={(prof.lectureSubjects as Lecture[] | null) ?? []}
      />
    </div>
  );
}
