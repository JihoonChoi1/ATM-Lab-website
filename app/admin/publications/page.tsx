import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import PublicationsTable from "./_components/PublicationsTable";

export const metadata: Metadata = { title: "Publications 관리 · ATM Lab" };

// Reads the session cookie + live rows → never cache.
export const dynamic = "force-dynamic";

export default async function AdminPublicationsPage() {
  await requireAdmin("/admin/publications");

  // [year desc, order desc] — the same canonical order the public pages use.
  const publications = await prisma.publication.findMany({
    orderBy: [{ year: "desc" }, { order: "desc" }],
    select: {
      id: true,
      type: true,
      year: true,
      title: true,
      authors: true,
      journal: true,
      conference: true,
      applicationNo: true,
      published: true,
    },
  });

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.02em]">Publications</h1>
          <p className="mt-1 text-sm text-ink-3">
            게재물 {publications.length}건 — 공개 /publications 페이지와 같은
            순서(연도 내림차순)입니다.
          </p>
        </div>
        <Link
          href="/admin/publications/new"
          className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
        >
          새 게재물 추가
        </Link>
      </div>
      <PublicationsTable publications={publications} />
    </div>
  );
}
