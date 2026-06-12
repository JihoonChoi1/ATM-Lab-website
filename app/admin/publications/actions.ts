"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { getClientIp } from "@/lib/auth/rate-limit";
import { diffChanges, logAudit } from "@/lib/audit";
import { publicationSchema, toPublicationData } from "./schema";

// Phase 7-4: Publications CRUD — the 7-3 pattern without move: the public
// order is computed (year desc → order desc), so there is nothing to curate.
// Every action re-guards with requireAdmin (Server Actions are their own
// entry points) and audits on success with label = title. CSRF is covered by
// Next's Server Action origin check (verified in 6-6); no revalidatePath —
// every page is force-dynamic.

export type PublicationFormState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

function parseForm(formData: FormData) {
  return publicationSchema.safeParse({
    type: String(formData.get("type") ?? ""),
    year: String(formData.get("year") ?? ""),
    title: String(formData.get("title") ?? ""),
    authors: String(formData.get("authors") ?? ""),
    journal: String(formData.get("journal") ?? ""),
    doi: String(formData.get("doi") ?? ""),
    conference: String(formData.get("conference") ?? ""),
    inventors: String(formData.get("inventors") ?? ""),
    applicationNo: String(formData.get("applicationNo") ?? ""),
    country: String(formData.get("country") ?? ""),
    registeredAt: String(formData.get("registeredAt") ?? ""),
    imgPath: String(formData.get("imgPath") ?? ""),
    published: formData.get("published") === "on",
  });
}

export async function createPublication(
  _prev: PublicationFormState,
  formData: FormData,
): Promise<PublicationFormState> {
  const session = await requireAdmin("/admin/publications/new");

  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  // order = global max+1: within its year the newest addition sorts first
  // (year desc → order desc), matching the legacy numbering practice.
  const max = await prisma.publication.aggregate({ _max: { order: true } });
  const publication = await prisma.publication.create({
    data: { ...toPublicationData(parsed.data), order: (max._max.order ?? 0) + 1 },
  });

  await logAudit({
    userId: session.user.id,
    action: "CREATE",
    entity: "Publication",
    entityId: publication.id,
    data: { ip: getClientIp(), label: publication.title },
  });

  redirect("/admin/publications");
}

export async function updatePublication(
  id: string,
  _prev: PublicationFormState,
  formData: FormData,
): Promise<PublicationFormState> {
  const session = await requireAdmin(`/admin/publications/${id}`);

  const existing = await prisma.publication.findUnique({ where: { id } });
  if (!existing) return { message: "게재물을 찾을 수 없습니다. 목록에서 다시 시도하세요." };

  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  // Writes every form-managed column — on a type switch toPublicationData
  // nulls the other types' fields, so the clear lands in the diff below.
  const data = toPublicationData(parsed.data);
  await prisma.publication.update({ where: { id }, data });

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Publication",
    entityId: id,
    data: { ip: getClientIp(), label: data.title, ...diffChanges(existing, data) },
  });

  redirect("/admin/publications");
}

export async function deletePublication(id: string): Promise<void> {
  const session = await requireAdmin("/admin/publications");

  const publication = await prisma.publication.findUnique({ where: { id } });
  if (!publication) return;

  await prisma.publication.delete({ where: { id } });

  // Full-row snapshot: a hard delete has no other way back (90-day retention).
  // JSON round-trip turns Dates into ISO strings for the Json column.
  await logAudit({
    userId: session.user.id,
    action: "DELETE",
    entity: "Publication",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: publication.title,
      snapshot: JSON.parse(JSON.stringify(publication)),
    },
  });
}

export async function togglePublicationPublished(id: string): Promise<void> {
  const session = await requireAdmin("/admin/publications");

  const publication = await prisma.publication.findUnique({
    where: { id },
    select: { title: true, published: true },
  });
  if (!publication) return;

  await prisma.publication.update({
    where: { id },
    data: { published: !publication.published },
  });

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Publication",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: publication.title,
      before: { published: publication.published },
      after: { published: !publication.published },
    },
  });
}
