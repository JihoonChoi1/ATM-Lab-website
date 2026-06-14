import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { uploadsEnabled } from "@/lib/uploads";
import GalleryForm from "../_components/GalleryForm";

export const metadata: Metadata = { title: "갤러리 항목 수정 · ATM Lab" };

// Reads the session cookie + a live row → never cache.
export const dynamic = "force-dynamic";

export default async function EditGalleryItemPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin(`/admin/gallery/${params.id}`);

  const item = await prisma.galleryItem.findUnique({
    where: { id: params.id },
    select: { id: true, date: true, title: true, imgPath: true, published: true },
  });
  // Stale link (row already deleted) → back to the list, not a global 404.
  if (!item) redirect("/admin/gallery");

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">갤러리 항목 수정</h1>
        <p className="mt-1 text-sm text-ink-3">{item.title}</p>
      </div>
      <GalleryForm
        item={{ ...item, date: item.date.toISOString().slice(0, 10) }}
        uploadsEnabled={uploadsEnabled()}
      />
    </div>
  );
}
