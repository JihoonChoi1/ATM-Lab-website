import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import ScrollTopOnMount from "../../../_components/ScrollTopOnMount";
import SubsectionForm from "../../_components/SubsectionForm";
import FigureTable from "../../_components/FigureTable";

export const metadata: Metadata = { title: "Manage subsection · ATM Lab" };

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
            The figure was saved; back to the list.
          </p>
        </>
      )}

      {/* ── Subsection fields (deferred — needs the save button) ── */}
      <section className="mb-10 max-w-[640px]">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-ink">Subsection details</h2>
          <p className="mt-1 text-sm text-ink-3">
            After editing, click the{" "}
            <span className="font-medium text-ink-2">Save changes</span> button
            below to apply.
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
          <h2 className="text-lg font-semibold text-ink">Figures ({sub.figures.length})</h2>
          <Link
            href={`/admin/research/${topicId}/${subsectionId}/new`}
            className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
          >
            Add figure
          </Link>
        </div>
        <p className="mb-4 text-sm text-ink-3">
          Reordering and deletion take effect immediately — no separate save
          needed. Edit each figure&rsquo;s content from the{" "}
          <span className="font-medium text-ink-2">Edit</span> button on its row.
        </p>
        <FigureTable topicId={topicId} subsectionId={subsectionId} figures={sub.figures} />
      </section>
    </div>
  );
}
