"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { getClientIp } from "@/lib/auth/rate-limit";
import { diffChanges, logAudit } from "@/lib/audit";
import { commitWithUpload, resolveFormImage } from "@/lib/upload-store";
import { figureSchema, pageMetaSchema, subsectionSchema, topicSchema } from "./schema";

// Phase 7-10: Research CRUD — Topic / Subsection / Figure (3-level nesting) +
// the ResearchPageMeta singleton. Mirrors the 7-2 policy: every action re-guards
// with requireAdmin (Server Actions are their own entry points) and audits on
// success ({ ip, label }; UPDATE adds a changed-field diff, DELETE a full-row
// snapshot; toggles/moves are UPDATEs). CSRF is covered by Next's Server Action
// origin check; no revalidatePath — every page is force-dynamic.
//
// 7-10b: Topic/Subsection DELETE snapshot the whole cascaded subtree (subsections
// + figures), not just the single row, so revert/restore can rebuild the children
// that onDelete: Cascade removes. All four Research models are registered in
// REVERTIBLE_ENTITIES; the tree is reassembled by a nested create in
// app/admin/activity/actions.ts.

export type ResearchFormState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

// ─── Topic ───────────────────────────────────────────────────────────────────

function parseTopicForm(formData: FormData) {
  return topicSchema.safeParse({
    num: String(formData.get("num") ?? ""),
    title: String(formData.get("title") ?? ""),
    lead: String(formData.get("lead") ?? ""),
    keywords: String(formData.get("keywords") ?? ""),
    bg: String(formData.get("bg") ?? ""),
    published: formData.get("published") === "on",
  });
}

// Topic.num is @unique — guard before write, return a field error on collision.
async function numTaken(num: string, exceptId?: string): Promise<boolean> {
  const hit = await prisma.researchTopic.findFirst({
    where: { num, ...(exceptId ? { NOT: { id: exceptId } } : {}) },
    select: { id: true },
  });
  return hit !== null;
}

export async function createTopic(
  _prev: ResearchFormState,
  formData: FormData,
): Promise<ResearchFormState> {
  const session = await requireAdmin("/admin/research/new");

  const parsed = parseTopicForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };
  if (await numTaken(parsed.data.num)) {
    return { errors: { num: ["이미 사용 중인 번호입니다."] } };
  }

  const max = await prisma.researchTopic.aggregate({ _max: { order: true } });
  const topic = await prisma.researchTopic.create({
    data: { ...parsed.data, order: (max._max.order ?? 0) + 1 },
  });

  await logAudit({
    userId: session.user.id,
    action: "CREATE",
    entity: "ResearchTopic",
    entityId: topic.id,
    data: { ip: getClientIp(), label: topic.title },
  });

  redirect("/admin/research?saved=1");
}

export async function updateTopic(
  id: string,
  _prev: ResearchFormState,
  formData: FormData,
): Promise<ResearchFormState> {
  const session = await requireAdmin(`/admin/research/${id}`);

  const existing = await prisma.researchTopic.findUnique({ where: { id } });
  if (!existing) return { message: "토픽을 찾을 수 없습니다. 목록에서 다시 시도하세요." };

  const parsed = parseTopicForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };
  if (await numTaken(parsed.data.num, id)) {
    return { errors: { num: ["이미 사용 중인 번호입니다."] } };
  }

  await prisma.researchTopic.update({ where: { id }, data: parsed.data });

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "ResearchTopic",
    entityId: id,
    data: { ip: getClientIp(), label: parsed.data.title, ...diffChanges(existing, parsed.data) },
  });

  // Redirect to the list (not this same [topicId] route): useFormState's
  // post-redirect state would otherwise render on the still-mounted form.
  // ?saved=1 → the list shows a "saved" banner so the redirect reads as success.
  redirect("/admin/research?saved=1");
}

export async function deleteTopic(id: string): Promise<void> {
  const session = await requireAdmin("/admin/research");

  // Snapshot the whole subtree before the cascade wipes the children — restore
  // (7-10b) rebuilds subsections + figures from this single JSON blob.
  const topic = await prisma.researchTopic.findUnique({
    where: { id },
    include: {
      subsections: {
        orderBy: { order: "asc" },
        include: { figures: { orderBy: { order: "asc" } } },
      },
    },
  });
  if (!topic) return;

  // Subsections/figures cascade on delete (DB-level onDelete: Cascade).
  await prisma.researchTopic.delete({ where: { id } });

  await logAudit({
    userId: session.user.id,
    action: "DELETE",
    entity: "ResearchTopic",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: topic.title,
      snapshot: JSON.parse(JSON.stringify(topic)),
    },
  });
}

export async function toggleTopicPublished(id: string): Promise<void> {
  const session = await requireAdmin("/admin/research");

  const topic = await prisma.researchTopic.findUnique({
    where: { id },
    select: { title: true, published: true },
  });
  if (!topic) return;

  await prisma.researchTopic.update({ where: { id }, data: { published: !topic.published } });

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "ResearchTopic",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: topic.title,
      before: { published: topic.published },
      after: { published: !topic.published },
    },
  });
}

export async function moveTopic(id: string, direction: "up" | "down"): Promise<void> {
  const session = await requireAdmin("/admin/research");
  if (direction !== "up" && direction !== "down") return;

  const topic = await prisma.researchTopic.findUnique({ where: { id } });
  if (!topic) return;

  // Global order-asc sequence (no grouping) — swap with the global neighbor.
  const neighbor = await prisma.researchTopic.findFirst({
    where: { order: direction === "up" ? { lt: topic.order } : { gt: topic.order } },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return; // already first/last

  await prisma.$transaction([
    prisma.researchTopic.update({ where: { id: topic.id }, data: { order: neighbor.order } }),
    prisma.researchTopic.update({ where: { id: neighbor.id }, data: { order: topic.order } }),
  ]);

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "ResearchTopic",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: topic.title,
      before: { order: topic.order },
      after: { order: neighbor.order },
    },
  });
}

// ─── Subsection ──────────────────────────────────────────────────────────────

function parseSubsectionForm(formData: FormData) {
  return subsectionSchema.safeParse({
    num: String(formData.get("num") ?? ""),
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    keywords: String(formData.get("keywords") ?? ""),
    published: formData.get("published") === "on",
  });
}

export async function createSubsection(
  topicId: string,
  _prev: ResearchFormState,
  formData: FormData,
): Promise<ResearchFormState> {
  const session = await requireAdmin(`/admin/research/${topicId}/new`);

  const parsed = parseSubsectionForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  // End of this topic's order sequence.
  const max = await prisma.researchSubsection.aggregate({
    where: { topicId },
    _max: { order: true },
  });
  const sub = await prisma.researchSubsection.create({
    data: { ...parsed.data, topicId, order: (max._max.order ?? 0) + 1 },
  });

  await logAudit({
    userId: session.user.id,
    action: "CREATE",
    entity: "ResearchSubsection",
    entityId: sub.id,
    data: { ip: getClientIp(), label: sub.title },
  });

  redirect(`/admin/research/${topicId}?saved=1`);
}

export async function updateSubsection(
  topicId: string,
  id: string,
  _prev: ResearchFormState,
  formData: FormData,
): Promise<ResearchFormState> {
  const session = await requireAdmin(`/admin/research/${topicId}/${id}`);

  const existing = await prisma.researchSubsection.findUnique({ where: { id } });
  if (!existing) return { message: "서브섹션을 찾을 수 없습니다. 목록에서 다시 시도하세요." };

  const parsed = parseSubsectionForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  await prisma.researchSubsection.update({ where: { id }, data: parsed.data });

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "ResearchSubsection",
    entityId: id,
    data: { ip: getClientIp(), label: parsed.data.title, ...diffChanges(existing, parsed.data) },
  });

  // Redirect to the topic detail (the subsection list), not this same
  // [subsectionId] route the form lives on (useFormState/redirect interplay).
  // ?saved=1 → the topic page shows a "saved" banner so leaving reads as success.
  redirect(`/admin/research/${topicId}?saved=1`);
}

export async function deleteSubsection(id: string): Promise<void> {
  const session = await requireAdmin("/admin/research");

  // Snapshot figures with the subsection so restore (7-10b) can rebuild them.
  const sub = await prisma.researchSubsection.findUnique({
    where: { id },
    include: { figures: { orderBy: { order: "asc" } } },
  });
  if (!sub) return;

  // Figures cascade on delete (DB-level onDelete: Cascade).
  await prisma.researchSubsection.delete({ where: { id } });

  await logAudit({
    userId: session.user.id,
    action: "DELETE",
    entity: "ResearchSubsection",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: sub.title,
      snapshot: JSON.parse(JSON.stringify(sub)),
    },
  });
}

export async function toggleSubsectionPublished(id: string): Promise<void> {
  const session = await requireAdmin("/admin/research");

  const sub = await prisma.researchSubsection.findUnique({
    where: { id },
    select: { title: true, published: true },
  });
  if (!sub) return;

  await prisma.researchSubsection.update({ where: { id }, data: { published: !sub.published } });

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "ResearchSubsection",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: sub.title,
      before: { published: sub.published },
      after: { published: !sub.published },
    },
  });
}

export async function moveSubsection(id: string, direction: "up" | "down"): Promise<void> {
  const session = await requireAdmin("/admin/research");
  if (direction !== "up" && direction !== "down") return;

  const sub = await prisma.researchSubsection.findUnique({ where: { id } });
  if (!sub) return;

  // Swap within the same topic only.
  const neighbor = await prisma.researchSubsection.findFirst({
    where: {
      topicId: sub.topicId,
      order: direction === "up" ? { lt: sub.order } : { gt: sub.order },
    },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await prisma.$transaction([
    prisma.researchSubsection.update({ where: { id: sub.id }, data: { order: neighbor.order } }),
    prisma.researchSubsection.update({ where: { id: neighbor.id }, data: { order: sub.order } }),
  ]);

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "ResearchSubsection",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: sub.title,
      before: { order: sub.order },
      after: { order: neighbor.order },
    },
  });
}

// ─── Figure ──────────────────────────────────────────────────────────────────

function parseFigureForm(formData: FormData) {
  return figureSchema.safeParse({
    imgPath: String(formData.get("imgPath") ?? ""),
    caption: String(formData.get("caption") ?? ""),
    width: String(formData.get("width") ?? ""),
    height: String(formData.get("height") ?? ""),
    wide: formData.get("wide") === "wide",
  });
}

export async function createFigure(
  topicId: string,
  subsectionId: string,
  _prev: ResearchFormState,
  formData: FormData,
): Promise<ResearchFormState> {
  const session = await requireAdmin(`/admin/research/${topicId}/${subsectionId}/new`);

  const parsed = parseFigureForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  // width/height come from the form (the client reads them off the picked image);
  // resolveFormImage only persists the file and supplies the new imgPath.
  const img = await resolveFormImage(formData, parsed.data.imgPath);
  if (!img.ok) return { errors: { imgPath: [img.error] } };

  const max = await prisma.researchFigure.aggregate({
    where: { subsectionId },
    _max: { order: true },
  });
  const figure = await commitWithUpload(img.stored, () =>
    prisma.researchFigure.create({
      data: { ...parsed.data, imgPath: img.path, subsectionId, order: (max._max.order ?? 0) + 1 },
    }),
  );

  await logAudit({
    userId: session.user.id,
    action: "CREATE",
    entity: "ResearchFigure",
    entityId: figure.id,
    data: { ip: getClientIp(), label: figure.caption },
  });

  redirect(`/admin/research/${topicId}/${subsectionId}?saved=1`);
}

export async function updateFigure(
  topicId: string,
  subsectionId: string,
  id: string,
  _prev: ResearchFormState,
  formData: FormData,
): Promise<ResearchFormState> {
  const session = await requireAdmin(`/admin/research/${topicId}/${subsectionId}/${id}`);

  const existing = await prisma.researchFigure.findUnique({ where: { id } });
  if (!existing) return { message: "그림을 찾을 수 없습니다. 목록에서 다시 시도하세요." };

  const parsed = parseFigureForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  const img = await resolveFormImage(formData, parsed.data.imgPath);
  if (!img.ok) return { errors: { imgPath: [img.error] } };

  // The previous imgPath is left on disk (audit restore window).
  const data = { ...parsed.data, imgPath: img.path };
  await commitWithUpload(img.stored, () =>
    prisma.researchFigure.update({ where: { id }, data }),
  );

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "ResearchFigure",
    entityId: id,
    data: { ip: getClientIp(), label: data.caption, ...diffChanges(existing, data) },
  });

  redirect(`/admin/research/${topicId}/${subsectionId}?saved=1`);
}

export async function deleteFigure(id: string): Promise<void> {
  const session = await requireAdmin("/admin/research");

  const figure = await prisma.researchFigure.findUnique({ where: { id } });
  if (!figure) return;

  await prisma.researchFigure.delete({ where: { id } });

  await logAudit({
    userId: session.user.id,
    action: "DELETE",
    entity: "ResearchFigure",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: figure.caption,
      snapshot: JSON.parse(JSON.stringify(figure)),
    },
  });
}

export async function moveFigure(id: string, direction: "up" | "down"): Promise<void> {
  const session = await requireAdmin("/admin/research");
  if (direction !== "up" && direction !== "down") return;

  const figure = await prisma.researchFigure.findUnique({ where: { id } });
  if (!figure) return;

  // Swap within the same subsection only — figure order drives the public
  // column stacking + portrait-pair detection.
  const neighbor = await prisma.researchFigure.findFirst({
    where: {
      subsectionId: figure.subsectionId,
      order: direction === "up" ? { lt: figure.order } : { gt: figure.order },
    },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await prisma.$transaction([
    prisma.researchFigure.update({ where: { id: figure.id }, data: { order: neighbor.order } }),
    prisma.researchFigure.update({ where: { id: neighbor.id }, data: { order: figure.order } }),
  ]);

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "ResearchFigure",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: figure.caption,
      before: { order: figure.order },
      after: { order: neighbor.order },
    },
  });
}

// ─── Page meta (singleton) ───────────────────────────────────────────────────

export async function updatePageMeta(
  _prev: ResearchFormState,
  formData: FormData,
): Promise<ResearchFormState> {
  const session = await requireAdmin("/admin/research/meta");

  const parsed = pageMetaSchema.safeParse({
    heroHeadline: String(formData.get("heroHeadline") ?? ""),
    heroParagraph: String(formData.get("heroParagraph") ?? ""),
    yearsValue: String(formData.get("yearsValue") ?? ""),
  });
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  // Singleton: update the one row, or create it if somehow absent.
  const existing = await prisma.researchPageMeta.findFirst();
  if (existing) {
    await prisma.researchPageMeta.update({ where: { id: existing.id }, data: parsed.data });
    await logAudit({
      userId: session.user.id,
      action: "UPDATE",
      entity: "ResearchPageMeta",
      entityId: existing.id,
      data: { ip: getClientIp(), label: "Research 페이지 메타", ...diffChanges(existing, parsed.data) },
    });
  } else {
    const created = await prisma.researchPageMeta.create({ data: parsed.data });
    await logAudit({
      userId: session.user.id,
      action: "CREATE",
      entity: "ResearchPageMeta",
      entityId: created.id,
      data: { ip: getClientIp(), label: "Research 페이지 메타" },
    });
  }

  redirect("/admin/research?saved=1");
}
