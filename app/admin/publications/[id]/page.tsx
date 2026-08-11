import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { uploadsEnabled } from "@/lib/uploads";
import PublicationForm from "../_components/PublicationForm";

export const metadata: Metadata = { title: "Edit publication · ATM Lab" };

// Reads the session cookie + a live row → never cache.
export const dynamic = "force-dynamic";

export default async function EditPublicationPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin(`/admin/publications/${params.id}`);

  const [publication, members] = await Promise.all([
    prisma.publication.findUnique({
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
        members: { select: { id: true } },
      },
    }),
    // Tag options — every member (published or not; hidden profiles can still
    // be authors), in the members-page order.
    prisma.member.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true, position: true },
    }),
  ]);
  // Stale link (row already deleted) → back to the list, not a global 404.
  if (!publication) redirect("/admin/publications");

  const { members: tagged, ...fields } = publication;

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">Edit publication</h1>
        <p className="mt-1 text-sm text-ink-3">{publication.title}</p>
      </div>
      <PublicationForm
        publication={{ ...fields, memberIds: tagged.map((m) => m.id) }}
        members={members}
        uploadsEnabled={uploadsEnabled()}
      />
    </div>
  );
}
