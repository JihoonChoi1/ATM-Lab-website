// Shared audit-log formatting for the activity page and the dashboard preview.
// Extracted from activity/page.tsx so both render the same action labels,
// timestamps, and entity labels — the dashboard is a slim mirror of those rows.

// Korean labels for the compact action tokens stored in AuditLog.action.
export const ACTION_LABELS: Record<string, string> = {
  LOGIN: "Sign in",
  LOGOUT: "Sign out",
  ENABLE_2FA: "Enable 2FA",
  CREATE: "Create",
  UPDATE: "Update",
  DELETE: "Delete",
};

export const fmtTime = (d: Date) =>
  new Intl.DateTimeFormat("en-US", {
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
