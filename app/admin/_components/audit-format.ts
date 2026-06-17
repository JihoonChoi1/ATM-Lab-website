// Shared audit-log formatting for the activity page and the dashboard preview.
// Extracted from activity/page.tsx so both render the same action labels,
// timestamps, and entity labels — the dashboard is a slim mirror of those rows.

// Korean labels for the compact action tokens stored in AuditLog.action.
export const ACTION_LABELS: Record<string, string> = {
  LOGIN: "로그인",
  LOGOUT: "로그아웃",
  ENABLE_2FA: "2FA 켜기",
  CREATE: "생성",
  UPDATE: "수정",
  DELETE: "삭제",
};

export const fmtTime = (d: Date) =>
  new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(d);

// Content CRUD entries (7-2+) carry a human-readable { label } (name/title) —
// the entityId cuid is meaningless to a human, especially after a delete.
export function readLabel(data: unknown): string | null {
  if (data && typeof data === "object" && "label" in data) {
    const label = (data as { label?: unknown }).label;
    if (typeof label === "string" && label) return label;
  }
  return null;
}
