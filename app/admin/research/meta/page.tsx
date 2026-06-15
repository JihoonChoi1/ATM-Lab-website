import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import MetaForm from "../_components/MetaForm";

export const metadata: Metadata = { title: "Research 페이지 메타 · ATM Lab" };

// Reads the session cookie + the singleton row → never cache.
export const dynamic = "force-dynamic";

export default async function ResearchMetaPage() {
  await requireAdmin("/admin/research/meta");

  const [meta, topicsCount, subtopicsCount] = await Promise.all([
    prisma.researchPageMeta.findFirst(),
    prisma.researchTopic.count({ where: { published: true } }),
    prisma.researchSubsection.count({ where: { published: true } }),
  ]);

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">Research 페이지 메타</h1>
        <p className="mt-1 text-sm text-ink-3">
          공개 /research 상단의 Hero 문구와 Years 통계값입니다.
        </p>
      </div>

      {/* Topics/Subtopics are derived from the DB (published rows), so they are
          shown read-only — they update automatically as topics/subsections change. */}
      <div className="mb-8 grid grid-cols-3 gap-4 rounded-3xl border border-line bg-surface px-6 py-5">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
            Topics
          </div>
          <div className="mt-1 text-2xl font-semibold text-ink">
            {String(topicsCount).padStart(2, "0")}
          </div>
        </div>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
            Subtopics
          </div>
          <div className="mt-1 text-2xl font-semibold text-ink">
            {String(subtopicsCount).padStart(2, "0")}
          </div>
        </div>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
            자동 집계
          </div>
          <div className="mt-1 text-xs leading-relaxed text-ink-3">
            공개된 토픽·서브섹션 수로 자동 계산됩니다.
          </div>
        </div>
      </div>

      <MetaForm
        meta={{
          heroHeadline: meta?.heroHeadline ?? "",
          heroParagraph: meta?.heroParagraph ?? "",
          yearsValue: meta?.yearsValue ?? "",
        }}
      />
    </div>
  );
}
