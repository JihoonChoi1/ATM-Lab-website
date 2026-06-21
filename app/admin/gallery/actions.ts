"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { getClientIp } from "@/lib/auth/rate-limit";
import { diffChanges, logAudit } from "@/lib/audit";
import { commitWithUpload, resolveFormImage } from "@/lib/upload-store";
import { galleryItemSchema } from "./schema";

// Phase 7-7: Gallery CRUD — the 7-6 News pattern (no move): the public order
// is computed (date desc, with order/createdAt as deterministic tiebreakers)
// and the display number is positional (pad2 on the board), so there is
// nothing to curate and nothing to renumber. `order` is never written (new
// rows take the Prisma default 0 — it only survives as a sort tiebreaker).
// Every action re-guards with requireAdmin (Server Actions are their own
// entry points) and audits on success with label = title. CSRF is covered by
// Next's Server Action origin check (verified in 6-6); no revalidatePath —
// every page is force-dynamic.

export type GalleryFormState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

function parseForm(formData: FormData) {
  return galleryItemSchema.safeParse({
    date: String(formData.get("date") ?? ""),
    title: String(formData.get("title") ?? ""),
    imgPath: String(formData.get("imgPath") ?? ""),
    published: formData.get("published") === "on",
  });
}

export async function createGalleryItem(
  _prev: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  const session = await requireAdmin("/admin/gallery/new");

  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  const img = await resolveFormImage(formData, parsed.data.imgPath);
  if (!img.ok) return { errors: { imgPath: [img.error] } };

  const data = { ...parsed.data, imgPath: img.path };
  const item = await commitWithUpload(img.stored, () =>
    prisma.galleryItem.create({ data }),
  );

  await logAudit({
    userId: session.user.id,
    action: "CREATE",
    entity: "GalleryItem",
    entityId: item.id,
    data: { ip: getClientIp(), label: item.title },
  });

  redirect("/admin/gallery");
}

export async function updateGalleryItem(
  id: string,
  _prev: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  const session = await requireAdmin(`/admin/gallery/${id}`);

  const existing = await prisma.galleryItem.findUnique({ where: { id } });
  if (!existing) return { message: "갤러리 항목을 찾을 수 없습니다. 목록에서 다시 시도하세요." };

  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  const img = await resolveFormImage(formData, parsed.data.imgPath);
  if (!img.ok) return { errors: { imgPath: [img.error] } };

  // Writes only the form-managed columns — the diff below records changed
  // fields only. The previous imgPath is left on disk (audit restore window).
  const data = { ...parsed.data, imgPath: img.path };
  await commitWithUpload(img.stored, () =>
    prisma.galleryItem.update({ where: { id }, data }),
  );

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "GalleryItem",
    entityId: id,
    data: { ip: getClientIp(), label: data.title, ...diffChanges(existing, data) },
  });

  redirect("/admin/gallery");
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const session = await requireAdmin("/admin/gallery");

  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) return;

  await prisma.galleryItem.delete({ where: { id } });

  // Full-row snapshot: a hard delete has no other way back (90-day retention).
  // JSON round-trip turns Dates into ISO strings for the Json column.
  await logAudit({
    userId: session.user.id,
    action: "DELETE",
    entity: "GalleryItem",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: item.title,
      snapshot: JSON.parse(JSON.stringify(item)),
    },
  });
}

export async function toggleGalleryItemPublished(id: string): Promise<void> {
  const session = await requireAdmin("/admin/gallery");

  const item = await prisma.galleryItem.findUnique({
    where: { id },
    select: { title: true, published: true },
  });
  if (!item) return;

  await prisma.galleryItem.update({
    where: { id },
    data: { published: !item.published },
  });

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "GalleryItem",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: item.title,
      before: { published: item.published },
      after: { published: !item.published },
    },
  });
}
