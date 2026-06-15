import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import TopicForm from "../_components/TopicForm";
import SubsectionTable from "../_components/SubsectionTable";

export const metadata: Metadata = { title: "토픽 관리 · ATM Lab" };

// Reads the session cookie + a live row → never cache.
export const dynamic = "force-dynamic";

export default async function TopicDetailPage({
  params,
}: {
  params: { topicId: string };
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

      {/* ── Topic fields ── */}
      <section className="mb-12 max-w-[640px]">
        <h2 className="mb-4 text-lg font-semibold text-ink">토픽 정보</h2>
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

      {/* ── Subsections ── */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">서브섹션 {subsections.length}개</h2>
          <Link
            href={`/admin/research/${topic.id}/new`}
            className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
          >
            새 서브섹션 추가
          </Link>
        </div>
        <SubsectionTable topicId={topic.id} subsections={subsections} />
      </section>
    </div>
  );
}
