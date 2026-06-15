import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import SubsectionForm from "../../_components/SubsectionForm";
import FigureTable from "../../_components/FigureTable";

export const metadata: Metadata = { title: "서브섹션 관리 · ATM Lab" };

// Reads the session cookie + a live row → never cache.
export const dynamic = "force-dynamic";

export default async function SubsectionDetailPage({
  params,
}: {
  params: { topicId: string; subsectionId: string };
}) {
  const { topicId, subsectionId } = params;
  await requireAdmin(`/admin/research/${topicId}/${subsectionId}`);

  const sub = await prisma.researchSubsection.findUnique({
    where: { id: subsectionId },
    include: {
      topic: { select: { num: true, title: true } },
      figures: {
        orderBy: { order: "asc" },
        select: { id: true, imgPath: true, caption: true, width: true, height: true },
      },
    },
  });
  // Stale link or mismatched parent → back up a level.
  if (!sub || sub.topicId !== topicId) redirect(`/admin/research/${topicId}`);

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mb-2">
        <Link
          href={`/admin/research/${topicId}`}
          className="text-sm text-accent hover:underline"
        >
          ← {sub.topic.num} {sub.topic.title}
        </Link>
      </div>
      <h1 className="mb-8 text-3xl font-bold tracking-[-0.02em]">
        <span className="font-mono text-ink-3">{sub.num}</span> {sub.title}
      </h1>

      {/* ── Subsection fields ── */}
      <section className="mb-12 max-w-[640px]">
        <h2 className="mb-4 text-lg font-semibold text-ink">서브섹션 정보</h2>
        <SubsectionForm
          topicId={topicId}
          subsection={{
            id: sub.id,
            num: sub.num,
            title: sub.title,
            body: sub.body,
            keywords: sub.keywords,
            published: sub.published,
          }}
          cancelHref={`/admin/research/${topicId}`}
        />
      </section>

      {/* ── Figures ── */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">그림 {sub.figures.length}장</h2>
          <Link
            href={`/admin/research/${topicId}/${subsectionId}/new`}
            className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
          >
            새 그림 추가
          </Link>
        </div>
        <FigureTable topicId={topicId} subsectionId={subsectionId} figures={sub.figures} />
      </section>
    </div>
  );
}
