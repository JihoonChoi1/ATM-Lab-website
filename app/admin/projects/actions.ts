"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { getClientIp } from "@/lib/auth/rate-limit";
import { diffChanges, logAudit } from "@/lib/audit";
import { projectSchema } from "./schema";
import {
  saveHeroMeta,
  type HeroMetaFormState,
  type SingletonDelegate,
} from "../_lib/hero-meta";

// Phase 7-3: Projects CRUD — the 7-2 members pattern on a flat model. Every
// action re-guards with requireAdmin (Server Actions are their own entry
// points) and audits on success with label = title. CSRF is covered by Next's
// Server Action origin check (verified in 6-6); no revalidatePath — every
// page is force-dynamic.

export type ProjectFormState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

function parseForm(formData: FormData) {
  return projectSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    institution: String(formData.get("institution") ?? ""),
    period: String(formData.get("period") ?? ""),
    scale: String(formData.get("scale") ?? ""),
    status: String(formData.get("status") ?? ""),
    published: formData.get("published") === "on",
  });
}

export async function createProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const session = await requireAdmin("/admin/projects/new");

  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  // End of the global order sequence = end of its status group on the public page.
  const max = await prisma.project.aggregate({ _max: { order: true } });
  const project = await prisma.project.create({
    data: { ...parsed.data, order: (max._max.order ?? 0) + 1 },
  });

  await logAudit({
    userId: session.user.id,
    action: "CREATE",
    entity: "Project",
    entityId: project.id,
    data: { ip: getClientIp(), label: project.title },
  });

  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const session = await requireAdmin(`/admin/projects/${id}`);

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return { message: "프로젝트를 찾을 수 없습니다. 목록에서 다시 시도하세요." };

  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  await prisma.project.update({ where: { id }, data: parsed.data });

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Project",
    entityId: id,
    data: { ip: getClientIp(), label: parsed.data.title, ...diffChanges(existing, parsed.data) },
  });

  redirect("/admin/projects");
}

export async function deleteProject(id: string): Promise<void> {
  const session = await requireAdmin("/admin/projects");

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return;

  await prisma.project.delete({ where: { id } });

  // Full-row snapshot: a hard delete has no other way back (90-day retention).
  // JSON round-trip turns Dates into ISO strings for the Json column.
  await logAudit({
    userId: session.user.id,
    action: "DELETE",
    entity: "Project",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: project.title,
      snapshot: JSON.parse(JSON.stringify(project)),
    },
  });
}

export async function toggleProjectPublished(id: string): Promise<void> {
  const session = await requireAdmin("/admin/projects");

  const project = await prisma.project.findUnique({
    where: { id },
    select: { title: true, published: true },
  });
  if (!project) return;

  await prisma.project.update({
    where: { id },
    data: { published: !project.published },
  });

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Project",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: project.title,
      before: { published: project.published },
      after: { published: !project.published },
    },
  });
}

export async function moveProject(id: string, direction: "up" | "down"): Promise<void> {
  const session = await requireAdmin("/admin/projects");
  if (direction !== "up" && direction !== "down") return;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return;

  // The public page sorts globally by `order` then splits by status, so only
  // the relative order within a status matters — swap with the status-adjacent
  // row. (order is unique within each status; cross-status duplicates don't matter.)
  const neighbor = await prisma.project.findFirst({
    where: {
      status: project.status,
      order: direction === "up" ? { lt: project.order } : { gt: project.order },
    },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return; // already first/last in its group

  await prisma.$transaction([
    prisma.project.update({ where: { id: project.id }, data: { order: neighbor.order } }),
    prisma.project.update({ where: { id: neighbor.id }, data: { order: project.order } }),
  ]);

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "Project",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: project.title,
      before: { order: project.order },
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
      delegate: prisma.projectsPageMeta as unknown as SingletonDelegate,
      entity: "ProjectsPageMeta",
      label: "Projects 페이지 메타",
      metaPath: "/admin/projects/meta",
    },
    formData,
  );
}
