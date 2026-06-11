import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";

export const metadata: Metadata = { title: "최근 활동 · ATM Lab" };

// Reads the session cookie + live audit rows → never cache.
export const dynamic = "force-dynamic";

// Korean labels for the compact action tokens stored in AuditLog.action.
const ACTION_LABELS: Record<string, string> = {
  LOGIN: "로그인",
  LOGOUT: "로그아웃",
  ENABLE_2FA: "2FA 켜기",
  CREATE: "생성",
  UPDATE: "수정",
  DELETE: "삭제",
};

const fmtTime = (d: Date) =>
  new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(d);

// data is best-effort { ip } for security events; read defensively.
function readIp(data: unknown): string {
  if (data && typeof data === "object" && "ip" in data) {
    const ip = (data as { ip?: unknown }).ip;
    if (typeof ip === "string" && ip) return ip;
  }
  return "—";
}

// Phase 6-8: same guard as the security page — any signed-in admin can view.
// There's only the one admin account, so no role gate; role separation is the
// optional Phase 7-10 (applied across admin pages together if it ever lands).
export default async function ActivityPage() {
  await requireAdmin("/admin/activity");

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      action: true,
      entity: true,
      entityId: true,
      data: true,
      createdAt: true,
      user: { select: { email: true } },
    },
  });

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">최근 활동</h1>
        <p className="mt-1 text-sm text-ink-3">
          관리자 작업 감사 로그 — 최신 {logs.length}건 (90일 보관)
        </p>
      </div>

      {logs.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface px-4 py-10 text-center text-sm text-ink-3">
          기록된 활동이 없습니다.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-line bg-surface">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-3">
                <th className="px-4 py-3 font-medium">시각</th>
                <th className="px-4 py-3 font-medium">사용자</th>
                <th className="px-4 py-3 font-medium">작업</th>
                <th className="px-4 py-3 font-medium">대상</th>
                <th className="px-4 py-3 font-medium">대상 ID</th>
                <th className="px-4 py-3 font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-line last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 text-ink-2">
                    {fmtTime(log.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink">
                    {log.user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                      {ACTION_LABELS[log.action] ?? log.action}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-2">
                    {log.entity}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-3">
                    {log.entityId ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink-3">
                    {readIp(log.data)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
