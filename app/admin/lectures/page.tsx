import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import LecturesTable from "./_components/LecturesTable";

export const metadata: Metadata = { title: "Lectures 관리 · ATM Lab" };

// Reads the session cookie + live rows → never cache.
export const dynamic = "force-dynamic";

export default async function AdminLecturesPage() {
  await requireAdmin("/admin/lectures");

  const lectures = await prisma.lecture.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      num: true,
      category: true,
      title: true,
      published: true,
    },
  });

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.02em]">Lectures</h1>
          <p className="mt-1 text-sm text-ink-3">
            강의 {lectures.length}건 — 공개 /lectures 페이지(All 탭)와 같은 순서입니다.
          </p>
        </div>
        <Link
          href="/admin/lectures/new"
          className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
        >
          새 강의 추가
        </Link>
      </div>
      <LecturesTable lectures={lectures} />
    </div>
  );
}
