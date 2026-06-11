"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { getClientIp } from "@/lib/auth/rate-limit";
import { diffChanges, logAudit } from "@/lib/audit";
import { memberSchema, toMemberData } from "./schema";

// Phase 7-2: first content CRUD — the pattern 7-3+ replicates. Every action
// re-guards with requireAdmin (Server Actions are their own entry points) and
// audits on success. CSRF is covered by Next's Server Action origin check
// (verified in 6-6); no revalidatePath — every page is force-dynamic.

export type MemberFormState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

function parseForm(formData: FormData) {
  return memberSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    role: String(formData.get("role") ?? ""),
    position: String(formData.get("position") ?? ""),
    email: String(formData.get("email") ?? ""),
    year: String(formData.get("year") ?? ""),
    degree: String(formData.get("degree") ?? ""),
    currentPosition: String(formData.get("currentPosition") ?? ""),
    interests: String(formData.get("interests") ?? ""),
    imgPath: String(formData.get("imgPath") ?? ""),
    published: formData.get("published") === "on",
  });
}

export async function createMember(
  _prev: MemberFormState,
  formData: FormData,
): Promise<MemberFormState> {
  const session = await requireAdmin("/admin/members/new");

  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  // End of the global order sequence = end of its role group on the public page.
  const max = await prisma.member.aggregate({ _max: { order: true } });
  const member = await prisma.member.create({
    data: { ...toMemberData(parsed.data), order: (max._max.order ?? 0) + 1 },
  });

  await logAudit({
    userId: session.user.id,
    action: "CREATE",
    entity: "Member",
    entityId: member.id,
    data: { ip: getClientIp(), label: member.name },
  });

  redirect("/admin/members");
}

export async function updateMember(
  id: string,
  _prev: MemberFormState,
  formData: FormData,
): Promise<MemberFormState> {
  const session = await requireAdmin(`/admin/members/${id}`);

  const existing = await prisma.member.findUnique({ where: { id } });
  if (!existing) return { message: "멤버를 찾을 수 없습니다. 목록에서 다시 시도하세요." };

  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  // Writes only the form-managed columns — the professor JSON blobs
  // (education/workHistory/researchFields/lectureSubjects) are never touched.
  const data = toMemberData(parsed.data);
  await prisma.member.update({ where: { id }, data });

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Member",
    entityId: id,
    data: { ip: getClientIp(), label: data.name, ...diffChanges(existing, data) },
  });

  redirect("/admin/members");
}

export async function deleteMember(id: string): Promise<void> {
  const session = await requireAdmin("/admin/members");

  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) return;

  await prisma.member.delete({ where: { id } });

  // Full-row snapshot: a hard delete has no other way back (90-day retention).
  // JSON round-trip turns Dates into ISO strings for the Json column.
  await logAudit({
    userId: session.user.id,
    action: "DELETE",
    entity: "Member",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: member.name,
      snapshot: JSON.parse(JSON.stringify(member)),
    },
  });
}

export async function toggleMemberPublished(id: string): Promise<void> {
  const session = await requireAdmin("/admin/members");

  const member = await prisma.member.findUnique({
    where: { id },
    select: { name: true, published: true },
  });
  if (!member) return;

  await prisma.member.update({
    where: { id },
    data: { published: !member.published },
  });

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Member",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: member.name,
      before: { published: member.published },
      after: { published: !member.published },
    },
  });
}

export async function moveMember(id: string, direction: "up" | "down"): Promise<void> {
  const session = await requireAdmin("/admin/members");
  if (direction !== "up" && direction !== "down") return;

  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) return;

  // The public page sorts globally by `order` then groups by role, so only the
  // relative order within a role matters — swap with the role-adjacent row.
  // (order is unique within each role; cross-role duplicates don't matter.)
  const neighbor = await prisma.member.findFirst({
    where: {
      role: member.role,
      order: direction === "up" ? { lt: member.order } : { gt: member.order },
    },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return; // already first/last in its group

  await prisma.$transaction([
    prisma.member.update({ where: { id: member.id }, data: { order: neighbor.order } }),
    prisma.member.update({ where: { id: neighbor.id }, data: { order: member.order } }),
  ]);

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Member",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: member.name,
      before: { order: member.order },
      after: { order: neighbor.order },
    },
  });
}
