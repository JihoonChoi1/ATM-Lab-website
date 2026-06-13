import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import NewsTable from "./_components/NewsTable";

export const metadata: Metadata = { title: "News 관리 · ATM Lab" };

// Reads the session cookie + live rows → never cache.
export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  await requireAdmin("/admin/news");

  // date desc — the same canonical order the public board uses (order/createdAt
  // break same-date ties deterministically). No chips, search, or pagination:
  // 5 rows, and the order is computed, not curated.
  const rows = await prisma.news.findMany({
    orderBy: [{ date: "desc" }, { order: "desc" }, { createdAt: "desc" }],
    select: { id: true, date: true, title: true, published: true },
  });

  const news = rows.map((n) => ({
    ...n,
    // UTC calendar date — matches the board/detail rendering exactly.
    date: n.date.toISOString().slice(0, 10),
  }));

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.02em]">News</h1>
          <p className="mt-1 text-sm text-ink-3">
            소식 {news.length}건 — 공개 /board News 섹션과 같은 순서(날짜
            내림차순)입니다.
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
        >
          새 소식 추가
        </Link>
      </div>
      <NewsTable news={news} />
    </div>
  );
}
