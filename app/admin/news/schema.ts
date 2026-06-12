import { z } from "zod";

// Phase 7-6: shared between the form UI and the server actions (validation).
// News is flat — no conditional fields, no superRefine; parsed fields map 1:1
// to the Prisma columns this form owns (order is legacy residue the News
// pages never read, so the form/actions leave it alone).

const emptyToNull = z
  .string()
  .trim()
  .transform((v) => v || null);

// <input type="date"> (YYYY-MM-DD) ↔ DateTime. Parsed as UTC midnight — every
// public render is UTC-based (board/detail toISOString().slice(0,10), home
// getUTC*), so the calendar date round-trips exactly. The toISOString
// round-trip check catches V8's silent overflow ("2024-02-31" → Mar 2).
// Legacy rows carry a time-of-day; an edit normalizes it to UTC midnight
// (recorded in the audit diff — accepted, no real rows share a date).
const dateField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "날짜를 입력하세요.")
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
  }, "유효한 날짜가 아닙니다.")
  .transform((v) => new Date(`${v}T00:00:00Z`));

export const newsSchema = z.object({
  date: dateField,
  title: z.string().trim().min(1, "제목을 입력하세요."),
  // Raw HTML blob, stored verbatim (single trusted admin; the public detail
  // page already renders it via dangerouslySetInnerHTML). Empty → null — the
  // detail page falls back to "No content.", the home snippet to "".
  content: emptyToNull,
  published: z.boolean(),
});

export type NewsInput = z.output<typeof newsSchema>;
