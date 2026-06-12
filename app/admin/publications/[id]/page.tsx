import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import PublicationForm from "../_components/PublicationForm";

export const metadata: Metadata = { title: "게재물 수정 · ATM Lab" };

// Reads the session cookie + a live row → never cache.
export const dynamic = "force-dynamic";

export default async function EditPublicationPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin(`/admin/publications/${params.id}`);

  const publication = await prisma.publication.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      type: true,
      year: true,
      title: true,
      authors: true,
      journal: true,
      doi: true,
      conference: true,
      inventors: true,
      applicationNo: true,
      country: true,
      registeredAt: true,
      imgPath: true,
      published: true,
    },
  });
  // Stale link (row already deleted) → back to the list, not a global 404.
  if (!publication) redirect("/admin/publications");

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">게재물 수정</h1>
        <p className="mt-1 text-sm text-ink-3">{publication.title}</p>
      </div>
      <PublicationForm publication={publication} />
    </div>
  );
}
