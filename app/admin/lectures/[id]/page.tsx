import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import LectureForm from "../_components/LectureForm";

export const metadata: Metadata = { title: "강의 수정 · ATM Lab" };

// Reads the session cookie + a live row → never cache.
export const dynamic = "force-dynamic";

export default async function EditLecturePage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin(`/admin/lectures/${params.id}`);

  const lecture = await prisma.lecture.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      num: true,
      category: true,
      title: true,
      paragraphs: true,
      published: true,
    },
  });
  // Stale link (row already deleted) → back to the list, not a global 404.
  if (!lecture) redirect("/admin/lectures");

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">강의 수정</h1>
        <p className="mt-1 text-sm text-ink-3">{lecture.title}</p>
      </div>
      <LectureForm lecture={lecture} />
    </div>
  );
}
