import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import SubsectionForm from "../../_components/SubsectionForm";

export const metadata: Metadata = { title: "새 서브섹션 · ATM Lab" };

// Reads the session cookie → never cache.
export const dynamic = "force-dynamic";

export default async function NewSubsectionPage({
  params,
}: {
  params: { topicId: string };
}) {
  await requireAdmin(`/admin/research/${params.topicId}/new`);

  const topic = await prisma.researchTopic.findUnique({
    where: { id: params.topicId },
    select: { num: true, title: true },
  });
  if (!topic) redirect("/admin/research");

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-2">
        <Link
          href={`/admin/research/${params.topicId}`}
          className="text-sm text-accent hover:underline"
        >
          ← {topic.num} {topic.title}
        </Link>
      </div>
      <h1 className="mb-8 text-3xl font-bold tracking-[-0.02em]">새 서브섹션</h1>
      <SubsectionForm
        topicId={params.topicId}
        cancelHref={`/admin/research/${params.topicId}`}
      />
    </div>
  );
}
