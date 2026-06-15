import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { uploadsEnabled } from "@/lib/uploads";
import FigureForm from "../../../_components/FigureForm";

export const metadata: Metadata = { title: "그림 수정 · ATM Lab" };

// Reads the session cookie + a live row → never cache.
export const dynamic = "force-dynamic";

export default async function EditFigurePage({
  params,
}: {
  params: { topicId: string; subsectionId: string; figureId: string };
}) {
  const { topicId, subsectionId, figureId } = params;
  await requireAdmin(`/admin/research/${topicId}/${subsectionId}/${figureId}`);

  const figure = await prisma.researchFigure.findUnique({
    where: { id: figureId },
    select: {
      id: true,
      subsectionId: true,
      imgPath: true,
      caption: true,
      width: true,
      height: true,
    },
  });
  // Stale link or mismatched parent → back to the figure list.
  if (!figure || figure.subsectionId !== subsectionId) {
    redirect(`/admin/research/${topicId}/${subsectionId}`);
  }

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-2">
        <Link
          href={`/admin/research/${topicId}/${subsectionId}`}
          className="text-sm text-accent hover:underline"
        >
          ← 그림 목록
        </Link>
      </div>
      <h1 className="mb-8 text-3xl font-bold tracking-[-0.02em]">그림 수정</h1>
      <FigureForm
        topicId={topicId}
        subsectionId={subsectionId}
        figure={{
          id: figure.id,
          imgPath: figure.imgPath,
          caption: figure.caption,
          width: figure.width,
          height: figure.height,
        }}
        uploadsEnabled={uploadsEnabled()}
        cancelHref={`/admin/research/${topicId}/${subsectionId}`}
      />
    </div>
  );
}
