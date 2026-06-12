"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { getClientIp } from "@/lib/auth/rate-limit";
import { diffChanges, logAudit } from "@/lib/audit";
import { lectureSchema } from "./schema";

// Phase 7-5: Lectures CRUD — the 7-3 projects pattern on the flattest model.
// Every action re-guards with requireAdmin (Server Actions are their own
// entry points) and audits on success with label = title. CSRF is covered by
// Next's Server Action origin check (verified in 6-6); no revalidatePath —
// every page is force-dynamic.

export type LectureFormState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

function parseForm(formData: FormData) {
  return lectureSchema.safeParse({
    num: String(formData.get("num") ?? ""),
    category: String(formData.get("category") ?? ""),
    title: String(formData.get("title") ?? ""),
    paragraphs: String(formData.get("paragraphs") ?? ""),
    published: formData.get("published") === "on",
  });
}

export async function createLecture(
  _prev: LectureFormState,
  formData: FormData,
): Promise<LectureFormState> {
  const session = await requireAdmin("/admin/lectures/new");

  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  // End of the global order sequence = end of the public All tab.
  const max = await prisma.lecture.aggregate({ _max: { order: true } });
  const lecture = await prisma.lecture.create({
    data: { ...parsed.data, order: (max._max.order ?? 0) + 1 },
  });

  await logAudit({
    userId: session.user.id,
    action: "CREATE",
    entity: "Lecture",
    entityId: lecture.id,
    data: { ip: getClientIp(), label: lecture.title },
  });

  redirect("/admin/lectures");
}

export async function updateLecture(
  id: string,
  _prev: LectureFormState,
  formData: FormData,
): Promise<LectureFormState> {
  const session = await requireAdmin(`/admin/lectures/${id}`);

  const existing = await prisma.lecture.findUnique({ where: { id } });
  if (!existing) return { message: "강의를 찾을 수 없습니다. 목록에서 다시 시도하세요." };

  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  await prisma.lecture.update({ where: { id }, data: parsed.data });

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Lecture",
    entityId: id,
    data: { ip: getClientIp(), label: parsed.data.title, ...diffChanges(existing, parsed.data) },
  });

  redirect("/admin/lectures");
}

export async function deleteLecture(id: string): Promise<void> {
  const session = await requireAdmin("/admin/lectures");

  const lecture = await prisma.lecture.findUnique({ where: { id } });
  if (!lecture) return;

  await prisma.lecture.delete({ where: { id } });

  // Full-row snapshot: a hard delete has no other way back (90-day retention).
  // JSON round-trip turns Dates into ISO strings for the Json column.
  await logAudit({
    userId: session.user.id,
    action: "DELETE",
    entity: "Lecture",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: lecture.title,
      snapshot: JSON.parse(JSON.stringify(lecture)),
    },
  });
}

export async function toggleLecturePublished(id: string): Promise<void> {
  const session = await requireAdmin("/admin/lectures");

  const lecture = await prisma.lecture.findUnique({
    where: { id },
    select: { title: true, published: true },
  });
  if (!lecture) return;

  await prisma.lecture.update({
    where: { id },
    data: { published: !lecture.published },
  });

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Lecture",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: lecture.title,
      before: { published: lecture.published },
      after: { published: !lecture.published },
    },
  });
}

export async function moveLecture(id: string, direction: "up" | "down"): Promise<void> {
  const session = await requireAdmin("/admin/lectures");
  if (direction !== "up" && direction !== "down") return;

  const lecture = await prisma.lecture.findUnique({ where: { id } });
  if (!lecture) return;

  // The public All tab is the canonical view: one global order-asc sequence
  // with categories interleaved (category tabs are mere filters). So swap with
  // the global neighbor — no category condition. (order is globally unique;
  // num is a manual label and never renumbered on move.)
  const neighbor = await prisma.lecture.findFirst({
    where: {
      order: direction === "up" ? { lt: lecture.order } : { gt: lecture.order },
    },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return; // already first/last

  await prisma.$transaction([
    prisma.lecture.update({ where: { id: lecture.id }, data: { order: neighbor.order } }),
    prisma.lecture.update({ where: { id: neighbor.id }, data: { order: lecture.order } }),
  ]);

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Lecture",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: lecture.title,
      before: { order: lecture.order },
      after: { order: neighbor.order },
    },
  });
}
