"use server";

import { prisma } from "@/lib/db";
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
