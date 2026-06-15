import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import TopicTable from "./_components/TopicTable";

export const metadata: Metadata = { title: "Research 관리 · ATM Lab" };

// Reads the session cookie + live rows → never cache.
export const dynamic = "force-dynamic";

export default async function AdminResearchPage() {
  await requireAdmin("/admin/research");

  // Same canonical order as the public page (order asc). Subsection counts feed
  // the list; total figures is shown alongside the read-only meta link.
  const rows = await prisma.researchTopic.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      num: true,
      title: true,
      published: true,
      _count: { select: { subsections: true } },
    },
  });

  const topics = rows.map((t) => ({
    id: t.id,
    num: t.num,
    title: t.title,
    subCount: t._count.subsections,
    published: t.published,
  }));

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.02em]">Research</h1>
          <p className="mt-1 text-sm text-ink-3">
            토픽 {topics.length}개 — 공개 /research 페이지와 같은 순서입니다. 토픽을 열어
            서브섹션과 그림을 관리하세요.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/research/meta"
            className="rounded-2xl border border-line px-4 py-2.5 text-sm font-medium text-ink-2 transition hover:border-accent/30 hover:text-accent"
          >
            페이지 메타 편집
          </Link>
          <Link
            href="/admin/research/new"
            className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
          >
            새 토픽 추가
          </Link>
        </div>
      </div>
      <TopicTable topics={topics} />
    </div>
  );
}
