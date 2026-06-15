import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { uploadsEnabled } from "@/lib/uploads";
import FigureForm from "../../../_components/FigureForm";

export const metadata: Metadata = { title: "새 그림 · ATM Lab" };

// Reads the session cookie → never cache.
export const dynamic = "force-dynamic";

export default async function NewFigurePage({
  params,
}: {
  params: { topicId: string; subsectionId: string };
}) {
  const { topicId, subsectionId } = params;
  await requireAdmin(`/admin/research/${topicId}/${subsectionId}/new`);

  const sub = await prisma.researchSubsection.findUnique({
    where: { id: subsectionId },
    select: { topicId: true, num: true, title: true },
  });
  if (!sub || sub.topicId !== topicId) redirect(`/admin/research/${topicId}`);

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-2">
        <Link
          href={`/admin/research/${topicId}/${subsectionId}`}
          className="text-sm text-accent hover:underline"
        >
          ← {sub.num} {sub.title}
        </Link>
      </div>
      <h1 className="mb-8 text-3xl font-bold tracking-[-0.02em]">새 그림</h1>
      <FigureForm
        topicId={topicId}
        subsectionId={subsectionId}
        uploadsEnabled={uploadsEnabled()}
        cancelHref={`/admin/research/${topicId}/${subsectionId}`}
      />
    </div>
  );
}
