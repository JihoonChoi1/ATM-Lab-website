import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import Pagination from "@/app/admin/_components/Pagination";
import RevertButton from "./_components/RevertButton";
import { REVERTIBLE_ENTITIES } from "./revertable";

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

// Content CRUD entries (7-2+) carry a human-readable { label } (name/title) —
// the entityId cuid is meaningless to a human, especially after a delete.
function readLabel(data: unknown): string | null {
  if (data && typeof data === "object" && "label" in data) {
    const label = (data as { label?: unknown }).label;
    if (typeof label === "string" && label) return label;
  }
  return null;
}

// { before, after } on UPDATE entries, { snapshot } on DELETE entries.
function readRecord(data: unknown, key: string): Record<string, unknown> | null {
  if (data && typeof data === "object" && key in data) {
    const v = (data as Record<string, unknown>)[key];
    if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>;
  }
  return null;
}

const fmtVal = (v: unknown): string => {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "string") return v;
  return JSON.stringify(v);
};

const detailThClass = "whitespace-nowrap py-1 pr-3 text-left font-medium text-ink-3";
const detailTdClass = "break-all py-1 pr-3 align-top";
// Fixed width: the cell's natural column width is whatever is left over, which
// would crush the inner table into vertical letter-stacking. overflow-x-auto
// on the wrapper absorbs the difference on narrow screens.
const detailBoxClass = "w-[340px]";

function DiffTable({
  before,
  after,
}: {
  before: Record<string, unknown>;
  after: Record<string, unknown>;
}) {
  return (
    <table className="mt-2 w-full text-xs">
      <thead>
        <tr>
          <th className={detailThClass}>필드</th>
          <th className={detailThClass}>이전</th>
          <th className={detailThClass}>이후</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(after).map((k) => (
          <tr key={k} className="border-t border-line">
            <td className={`${detailTdClass} whitespace-nowrap font-mono`}>{k}</td>
            <td className={`${detailTdClass} text-ink-3`}>{fmtVal(before[k])}</td>
            <td className={`${detailTdClass} text-ink`}>{fmtVal(after[k])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SnapshotTable({ snapshot }: { snapshot: Record<string, unknown> }) {
  const keys = Object.keys(snapshot).filter(
    (k) => !["id", "createdAt", "updatedAt"].includes(k),
  );
  return (
    <table className="mt-2 w-full text-xs">
      <tbody>
        {keys.map((k) => (
          <tr key={k} className="border-t border-line first:border-0">
            <td className={`${detailTdClass} whitespace-nowrap font-mono text-ink-3`}>{k}</td>
            <td className={`${detailTdClass} text-ink`}>{fmtVal(snapshot[k])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Phase 6-8: same guard as the security page — any signed-in admin can view.
// There's only the one admin account, so no role gate
const PAGE_SIZE = 25;

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  await requireAdmin("/admin/activity");

  const total = await prisma.auditLog.count();
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  // Clamp instead of 404 — a stale link after the 90-day sweep shrinks the
  // table should still land on a valid page.
  const page = Math.min(totalPages, Math.max(1, Number(searchParams.page) || 1));

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      action: true,
      entity: true,
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
          관리자 작업 감사 로그 — 총 {total}건, 최신순 (90일 보관)
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
                <th className="px-4 py-3 font-medium">내용</th>
                <th className="px-4 py-3 font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const label = readLabel(log.data);
                const before = readRecord(log.data, "before");
                const after = readRecord(log.data, "after");
                const snapshot = readRecord(log.data, "snapshot");
                const revertible = (REVERTIBLE_ENTITIES as readonly string[]).includes(
                  log.entity,
                );
                return (
                  <tr key={log.id} className="border-b border-line last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 text-ink-2">
                      {fmtTime(log.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink">
                      {log.user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className="whitespace-nowrap rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                        {ACTION_LABELS[log.action] ?? log.action}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-2">
                      {log.entity}
                      {label && (
                        <span
                          className="mt-0.5 block max-w-[320px] truncate text-xs text-ink-3"
                          title={label}
                        >
                          {label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {before && after ? (
                        <details>
                          <summary className="cursor-pointer whitespace-nowrap text-xs font-medium text-accent">
                            변경 {Object.keys(after).length}개 필드
                          </summary>
                          <div className={detailBoxClass}>
                            <DiffTable before={before} after={after} />
                            {revertible && <RevertButton logId={log.id} kind="revert" />}
                          </div>
                        </details>
                      ) : snapshot ? (
                        <details>
                          <summary className="cursor-pointer whitespace-nowrap text-xs font-medium text-accent">
                            삭제된 데이터
                          </summary>
                          <div className={detailBoxClass}>
                            <SnapshotTable snapshot={snapshot} />
                            {revertible && <RevertButton logId={log.id} kind="restore" />}
                          </div>
                        </details>
                      ) : (
                        <span className="text-xs text-ink-3">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink-3">
                      {readIp(log.data)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} basePath="/admin/activity" />
    </div>
  );
}
