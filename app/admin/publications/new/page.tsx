import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { uploadsEnabled } from "@/lib/uploads";
import PublicationForm from "../_components/PublicationForm";

export const metadata: Metadata = { title: "New publication · ATM Lab" };

// Reads the session cookie → never cache.
export const dynamic = "force-dynamic";

export default async function NewPublicationPage() {
  await requireAdmin("/admin/publications/new");

  // Tag options — every member (published or not; hidden profiles can still be
  // authors), in the members-page order: PI → researchers → students → alumni.
  const members = await prisma.member.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true, position: true },
  });

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">New publication</h1>
        <p className="mt-1 text-sm text-ink-3">
          Changes appear on the public /publications page immediately after saving.
        </p>
      </div>
      <PublicationForm members={members} uploadsEnabled={uploadsEnabled()} />
    </div>
  );
}
