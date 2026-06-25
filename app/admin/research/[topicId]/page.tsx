import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import ScrollTopOnMount from "../../_components/ScrollTopOnMount";
import TopicForm from "../_components/TopicForm";
import SubsectionTable from "../_components/SubsectionTable";

export const metadata: Metadata = { title: "토픽 관리 · ATM Lab" };

// Reads the session cookie + a live row → never cache.
export const dynamic = "force-dynamic";

export default async function TopicDetailPage({
  params,
  searchParams,
}: {
  params: { topicId: string };
  searchParams: { saved?: string };
}) {
  await requireAdmin(`/admin/research/${params.topicId}`);

  const topic = await prisma.researchTopic.findUnique({
    where: { id: params.topicId },
    include: {
      subsections: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          num: true,
          title: true,
          published: true,
          _count: { select: { figures: true } },
        },
      },
    },
  });
  // Stale link (row already deleted) → back to the list, not a global 404.
  if (!topic) redirect("/admin/research");

  const subsections = topic.subsections.map((s) => ({
    id: s.id,
    num: s.num,
    title: s.title,
    figCount: s._count.figures,
    published: s.published,
  }));

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mb-2">
        <Link href="/admin/research" className="text-sm text-accent hover:underline">
          ← Research
        </Link>
      </div>
      <h1 className="mb-8 text-3xl font-bold tracking-[-0.02em]">
        <span className="font-mono text-ink-3">{topic.num}</span> {topic.title}
      </h1>

      {searchParams.saved && (
        <>
          <ScrollTopOnMount />
          <p className="mb-8 rounded-2xl bg-success-soft px-4 py-2.5 text-sm text-success">
            서브섹션이 저장되어 목록으로 돌아왔습니다.
          </p>
        </>
      )}

      {/* ── Topic fields (deferred — needs the save button) ── */}
      <section className="mb-10 max-w-[640px]">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-ink">토픽 정보</h2>
          <p className="mt-1 text-sm text-ink-3">
            내용을 고친 뒤 아래{" "}
            <span className="font-medium text-ink-2">변경 사항 저장</span> 버튼을
            눌러야 반영됩니다.
          </p>
        </div>
        <TopicForm
          topic={{
            id: topic.id,
            num: topic.num,
            title: topic.title,
            lead: topic.lead,
            keywords: topic.keywords,
            bg: topic.bg === "bg" ? "bg" : "white",
            published: topic.published,
          }}
          cancelHref="/admin/research"
        />
      </section>

      {/* ── Subsections (instant — no save needed) ── */}
      <section className="border-t border-line pt-10">
        <div className="mb-1 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">서브섹션 {subsections.length}개</h2>
          <Link
            href={`/admin/research/${topic.id}/new`}
            className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
          >
            새 서브섹션 추가
          </Link>
        </div>
        <p className="mb-4 text-sm text-ink-3">
          순서 변경·공개 전환·삭제는{" "}
          <span className="font-medium text-ink-2">즉시 반영</span>됩니다. 따로 저장할
          필요가 없어요. 서브섹션 내용은{" "}
          <span className="font-medium text-ink-2">관리</span>에서 바꿉니다.
        </p>
        <SubsectionTable topicId={topic.id} subsections={subsections} />
      </section>
    </div>
  );
}
