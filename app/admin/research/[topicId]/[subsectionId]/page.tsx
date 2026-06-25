import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import ScrollTopOnMount from "../../../_components/ScrollTopOnMount";
import SubsectionForm from "../../_components/SubsectionForm";
import FigureTable from "../../_components/FigureTable";

export const metadata: Metadata = { title: "서브섹션 관리 · ATM Lab" };

// Reads the session cookie + a live row → never cache.
export const dynamic = "force-dynamic";

export default async function SubsectionDetailPage({
  params,
  searchParams,
}: {
  params: { topicId: string; subsectionId: string };
  searchParams: { saved?: string };
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

      {searchParams.saved && (
        <>
          <ScrollTopOnMount />
          <p className="mb-8 rounded-2xl bg-success-soft px-4 py-2.5 text-sm text-success">
            그림이 저장되어 목록으로 돌아왔습니다.
          </p>
        </>
      )}

      {/* ── Subsection fields (deferred — needs the save button) ── */}
      <section className="mb-10 max-w-[640px]">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-ink">서브섹션 정보</h2>
          <p className="mt-1 text-sm text-ink-3">
            내용을 고친 뒤 아래{" "}
            <span className="font-medium text-ink-2">변경 사항 저장</span> 버튼을
            눌러야 반영됩니다.
          </p>
        </div>
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

      {/* ── Figures (instant — no save needed) ── */}
      <section className="border-t border-line pt-10">
        <div className="mb-1 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">그림 {sub.figures.length}장</h2>
          <Link
            href={`/admin/research/${topicId}/${subsectionId}/new`}
            className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
          >
            새 그림 추가
          </Link>
        </div>
        <p className="mb-4 text-sm text-ink-3">
          순서 변경·삭제는 <span className="font-medium text-ink-2">즉시 반영</span>
          됩니다. 따로 저장할 필요가 없어요. 그림 내용은 각 행의{" "}
          <span className="font-medium text-ink-2">수정</span>에서 바꿉니다.
        </p>
        <FigureTable topicId={topicId} subsectionId={subsectionId} figures={sub.figures} />
      </section>
    </div>
  );
}
