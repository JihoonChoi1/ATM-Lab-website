"use server";

import { prisma } from "@/lib/db";
import { Prisma } from "@/app/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/guard";
import { getClientIp } from "@/lib/auth/rate-limit";
import { diffChanges, logAudit } from "@/lib/audit";
import { REVERTIBLE_ENTITIES } from "./revertable";

// Revert/restore from the audit trail (7-3 follow-up). UPDATE entries carry
// { before } (changed fields only) → write them back; DELETE entries carry
// { snapshot } (full row) → re-create it under its original id. The client
// only ever sends a log id — everything else is re-read server-side. A revert
// is itself audited (revertOf/restoreOf), so the trail stays complete.

type Delegate = {
  findUnique(args: { where: { id: string } }): Promise<Record<string, unknown> | null>;
  update(args: { where: { id: string }; data: Record<string, unknown> }): Promise<unknown>;
  create(args: { data: Record<string, unknown> }): Promise<unknown>;
};

const DELEGATES: Record<(typeof REVERTIBLE_ENTITIES)[number], Delegate> = {
  Member: prisma.member as unknown as Delegate,
  Project: prisma.project as unknown as Delegate,
  Publication: prisma.publication as unknown as Delegate,
  Lecture: prisma.lecture as unknown as Delegate,
  News: prisma.news as unknown as Delegate,
  GalleryItem: prisma.galleryItem as unknown as Delegate,
  // 7-10b: the flat path handles every Research UPDATE revert and the
  // ResearchFigure (leaf) DELETE restore. ResearchTopic/ResearchSubsection
  // DELETE are intercepted before this map (restoreResearchTree). PageMeta is a
  // singleton (UPDATE revert only).
  ResearchTopic: prisma.researchTopic as unknown as Delegate,
  ResearchSubsection: prisma.researchSubsection as unknown as Delegate,
  ResearchFigure: prisma.researchFigure as unknown as Delegate,
  ResearchPageMeta: prisma.researchPageMeta as unknown as Delegate,
  // Phase 2 page-hero singletons — UPDATE revert only (singletons, no delete).
  MembersPageMeta: prisma.membersPageMeta as unknown as Delegate,
  ProjectsPageMeta: prisma.projectsPageMeta as unknown as Delegate,
  PublicationsPageMeta: prisma.publicationsPageMeta as unknown as Delegate,
  LecturesPageMeta: prisma.lecturesPageMeta as unknown as Delegate,
  BoardPageMeta: prisma.boardPageMeta as unknown as Delegate,
};

function readRecord(data: unknown, key: string): Record<string, unknown> | null {
  if (data && typeof data === "object" && key in data) {
    const v = (data as Record<string, unknown>)[key];
    if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>;
  }
  return null;
}

function readLabel(data: unknown): string {
  if (data && typeof data === "object" && "label" in data) {
    const label = (data as { label?: unknown }).label;
    if (typeof label === "string" && label) return label;
  }
  return "—";
}

export async function revertAudit(logId: string): Promise<string | void> {
  const session = await requireAdmin("/admin/activity");

  const log = await prisma.auditLog.findUnique({ where: { id: logId } });
  if (!log || !log.entityId) return "로그를 찾을 수 없습니다.";
  const delegate = (DELEGATES as Record<string, Delegate | undefined>)[log.entity];
  if (!delegate) return "이 항목은 복원을 지원하지 않습니다.";
  const label = readLabel(log.data);

  if (log.action === "UPDATE") {
    const before = readRecord(log.data, "before");
    if (!before || Object.keys(before).length === 0) return "되돌릴 변경 내용이 없습니다.";

    const current = await delegate.findUnique({ where: { id: log.entityId } });
    if (!current) return "행이 이미 삭제되어 되돌릴 수 없습니다. 삭제 기록에서 복원하세요.";

    await delegate.update({ where: { id: log.entityId }, data: before });

    await logAudit({
      userId: session.user.id,
      action: "UPDATE",
      entity: log.entity,
      entityId: log.entityId,
      data: { ip: getClientIp(), label, ...diffChanges(current, before), revertOf: log.id },
    });
    return;
  }

  if (log.action === "DELETE") {
    const snapshot = readRecord(log.data, "snapshot");
    if (!snapshot) return "복원할 데이터가 없습니다.";

    // Research containers carry their whole subtree in the snapshot (7-10b) —
    // rebuild it with a nested create; the flat path below only re-creates one row.
    if (log.entity === "ResearchTopic" || log.entity === "ResearchSubsection") {
      return restoreResearchTree(
        session.user.id,
        { id: log.id, entity: log.entity, entityId: log.entityId },
        snapshot,
        label,
      );
    }

    const exists = await delegate.findUnique({ where: { id: log.entityId } });
    if (exists) return "이미 복원된 행입니다.";

    // Strip null keys: absent nullable columns fall back to NULL on create
    // anyway, and nullable Json columns reject a plain JS null.
    const data = Object.fromEntries(
      Object.entries(snapshot).filter(([, v]) => v !== null),
    );
    await delegate.create({ data });

    await logAudit({
      userId: session.user.id,
      action: "CREATE",
      entity: log.entity,
      entityId: log.entityId,
      data: { ip: getClientIp(), label, restoreOf: log.id },
    });
    return;
  }

  return "이 작업 유형은 되돌릴 수 없습니다.";
}

// 7-10b: rebuild a deleted Research container (Topic → Subsections → Figures, or
// Subsection → Figures) from its subtree snapshot. The flat DELEGATES path can't
// re-create the cascaded children, so a nested create restores the whole tree in
// one atomic write (Prisma runs nested writes in a transaction), preserving every
// original id so anchors/links survive. Drop the DB-managed columns and the
// relation FKs that nesting sets implicitly. Refuses cleanly when the row was
// already restored, the parent topic is gone, the Topic num is taken, or a child
// id collides (P2002/P2003).
const SYSTEM_FIELDS = ["createdAt", "updatedAt"];

function rebuild(row: Record<string, unknown>, drop: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (SYSTEM_FIELDS.includes(k) || drop.includes(k)) continue;
    out[k] = v;
  }
  return out;
}

function asRows(v: unknown): Record<string, unknown>[] {
  return Array.isArray(v) ? (v as Record<string, unknown>[]) : [];
}

async function restoreResearchTree(
  userId: string,
  log: { id: string; entity: string; entityId: string },
  snapshot: Record<string, unknown>,
  label: string,
): Promise<string | void> {
  // Figures nest under their subsection — drop the FK the nesting sets.
  const nestedFigures = (sub: Record<string, unknown>) => ({
    create: asRows(sub.figures).map((f) => rebuild(f, ["subsectionId"])),
  });

  try {
    if (log.entity === "ResearchTopic") {
      if (await prisma.researchTopic.findUnique({ where: { id: log.entityId } }))
        return "이미 복원된 행입니다.";
      // num is @unique — a re-used number can't be silently reclaimed.
      const num = snapshot.num;
      if (
        typeof num === "string" &&
        (await prisma.researchTopic.findFirst({ where: { num } }))
      )
        return `같은 번호('${num}')의 토픽이 이미 있어 복원할 수 없습니다.`;

      const data = {
        ...rebuild(snapshot, ["subsections"]),
        subsections: {
          create: asRows(snapshot.subsections).map((s) => ({
            ...rebuild(s, ["topicId", "figures"]),
            figures: nestedFigures(s),
          })),
        },
      };
      await prisma.researchTopic.create({
        data: data as unknown as Prisma.ResearchTopicCreateInput,
      });
    } else {
      if (await prisma.researchSubsection.findUnique({ where: { id: log.entityId } }))
        return "이미 복원된 행입니다.";
      // The subtree reconnects to its original topic via the kept topicId FK.
      const topicId = snapshot.topicId;
      if (
        typeof topicId !== "string" ||
        !(await prisma.researchTopic.findUnique({ where: { id: topicId } }))
      )
        return "상위 토픽이 없어 복원할 수 없습니다. 토픽을 먼저 복원하세요.";

      const data = {
        ...rebuild(snapshot, ["figures"]),
        figures: nestedFigures(snapshot),
      };
      await prisma.researchSubsection.create({
        data: data as unknown as Prisma.ResearchSubsectionCreateInput,
      });
    }
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      (err.code === "P2002" || err.code === "P2003")
    ) {
      return "이미 일부 항목이 존재하거나 상위 항목이 없어 복원할 수 없습니다.";
    }
    throw err;
  }

  await logAudit({
    userId,
    action: "CREATE",
    entity: log.entity,
    entityId: log.entityId,
    data: { ip: getClientIp(), label, restoreOf: log.id },
  });
}
