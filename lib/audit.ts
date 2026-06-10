import { prisma } from "@/lib/db";
import { Prisma } from "@/app/generated/prisma/client";

// Phase 6-8: admin action audit trail. Self-maintaining like the LoginAttempt
// sweep in lib/auth/rate-limit.ts — every write opportunistically prunes rows
// past the retention window, so the table stays bounded with zero cron/setup on
// either deployment (Vercel + school server). No one has to delete old logs by hand.
const RETENTION_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

export type AuditAction =
  | "LOGIN" // security / account events
  | "LOGOUT"
  | "ENABLE_2FA"
  | "CREATE" // Phase 7 content mutations
  | "UPDATE"
  | "DELETE";

type AuditEntry = {
  userId: string;
  action: AuditAction;
  entity: string;
  entityId?: string | null;
  data?: Prisma.InputJsonValue; // never secrets/PII — { ip } for security events
};

/**
 * Best-effort audit write: a logging failure must never break the main action
 * (login, logout, 2FA enrolment, future CRUD), so everything is wrapped in
 * try/catch. The entry is written first, then old rows are pruned, so a sweep
 * hiccup can't cost us the current entry.
 */
export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId ?? null,
        data: entry.data,
      },
    });
    await prisma.auditLog.deleteMany({
      where: { createdAt: { lt: new Date(Date.now() - RETENTION_MS) } },
    });
  } catch (err) {
    console.error("[audit] failed to record", entry.action, entry.entity, err);
  }
}
