"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { Prisma } from "@/app/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/guard";
import { getClientIp } from "@/lib/auth/rate-limit";
import { diffChanges, logAudit } from "@/lib/audit";
import { commitWithUpload, resolveFormImage } from "@/lib/upload-store";
import { memberSchema, professorProfileSchema, toMemberData } from "./schema";
import {
  saveHeroMeta,
  type HeroMetaFormState,
  type SingletonDelegate,
} from "../_lib/hero-meta";

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

  const img = await resolveFormImage(formData, parsed.data.imgPath);
  if (!img.ok) return { errors: { imgPath: [img.error] } };

  // End of the global order sequence = end of its role group on the public page.
  const max = await prisma.member.aggregate({ _max: { order: true } });
  const member = await commitWithUpload(img.stored, () =>
    prisma.member.create({
      data: { ...toMemberData(parsed.data), imgPath: img.path, order: (max._max.order ?? 0) + 1 },
    }),
  );

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

  const img = await resolveFormImage(formData, parsed.data.imgPath);
  if (!img.ok) return { errors: { imgPath: [img.error] } };

  // Writes only the form-managed columns — the professor JSON blobs
  // (education/workHistory/researchFields/lectureSubjects) are never touched.
  // The previous imgPath is left on disk (audit restore window).
  const data = { ...toMemberData(parsed.data), imgPath: img.path };
  await commitWithUpload(img.stored, () =>
    prisma.member.update({ where: { id }, data }),
  );

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Member",
    entityId: id,
    data: { ip: getClientIp(), label: data.name, ...diffChanges(existing, data) },
  });

  redirect("/admin/members");
}

// Each of the 4 professor JSON fields arrives as one hidden input holding a
// JSON-serialized array (the client edits them as nested React state). A parse
// failure can only come from a tampered request — fall through to undefined so
// the array schema rejects it with a field error.
function parseJsonField(v: FormDataEntryValue | null): unknown {
  try {
    return JSON.parse(typeof v === "string" ? v : "");
  } catch {
    return undefined;
  }
}

// Phase 7-11: the "separate editor" the 7-2 MemberForm notice points to. Writes
// ONLY the 4 professor-only JSON columns on the single PROFESSOR row — the
// generic member form still never touches them (7-2 invariant preserved).
export async function updateProfessorProfile(
  _prev: MemberFormState,
  formData: FormData,
): Promise<MemberFormState> {
  const session = await requireAdmin("/admin/members/professor");

  const prof = await prisma.member.findFirst({ where: { role: "PROFESSOR" } });
  if (!prof) return { message: "교수 정보를 찾을 수 없습니다. 목록에서 다시 시도하세요." };

  const parsed = professorProfileSchema.safeParse({
    education: parseJsonField(formData.get("education")),
    workHistory: parseJsonField(formData.get("workHistory")),
    researchFields: parseJsonField(formData.get("researchFields")),
    lectureSubjects: parseJsonField(formData.get("lectureSubjects")),
  });
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  const data = {
    education: parsed.data.education,
    workHistory: parsed.data.workHistory,
    researchFields: parsed.data.researchFields,
    lectureSubjects: parsed.data.lectureSubjects,
  };
  await prisma.member.update({
    where: { id: prof.id },
    data: data as Prisma.MemberUpdateInput,
  });

  // Audit only these 4 fields. Normalize existing null → [] so a first-ever
  // null→[] transition isn't logged as a change and a later UPDATE revert never
  // writes a plain JS null into a nullable Json column (which Prisma rejects).
  const before = {
    education: prof.education ?? [],
    workHistory: prof.workHistory ?? [],
    researchFields: prof.researchFields ?? [],
    lectureSubjects: prof.lectureSubjects ?? [],
  };
  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Member",
    entityId: prof.id,
    data: { ip: getClientIp(), label: prof.name, ...diffChanges(before, data) },
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

// ─── Page meta (singleton) ───────────────────────────────────────────────────

export async function updatePageMeta(
  _prev: HeroMetaFormState,
  formData: FormData,
): Promise<HeroMetaFormState> {
  return saveHeroMeta(
    {
      delegate: prisma.membersPageMeta as unknown as SingletonDelegate,
      entity: "MembersPageMeta",
      label: "Members 페이지 메타",
      metaPath: "/admin/members/meta",
    },
    formData,
  );
}
