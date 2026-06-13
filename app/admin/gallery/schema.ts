import { z } from "zod";

// Phase 7-7: shared between the form UI and the server actions (validation).
// Gallery is flat — no conditional fields, no superRefine; parsed fields map
// 1:1 to the Prisma columns this form owns (order is legacy residue the
// gallery pages only read as a sort tiebreaker, so the form/actions leave it
// alone).

const emptyToNull = z
  .string()
  .trim()
  .transform((v) => v || null);

// <input type="date"> (YYYY-MM-DD) ↔ DateTime. Parsed as UTC midnight — every
// public render is UTC-based (board/detail toISOString().slice(0,10), home
// getUTCFullYear), so the calendar date round-trips exactly. The toISOString
// round-trip check catches V8's silent overflow ("2024-02-31" → Mar 2).
// Legacy rows carry a time-of-day; an edit normalizes it to UTC midnight
// (recorded in the audit diff — accepted; if both rows of the one same-date
// pair end up normalized, the order/createdAt tiebreakers keep their legacy
// relative order).
const dateField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "날짜를 입력하세요.")
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
  }, "유효한 날짜가 아닙니다.")
  .transform((v) => new Date(`${v}T00:00:00Z`));

export const galleryItemSchema = z.object({
  date: dateField,
  title: z.string().trim().min(1, "제목을 입력하세요."),
  // Until the 7-8 upload component lands this is a plain text path; site-internal
  // paths only ("/legacy/…", "/uploads/…") — no external URLs or odd schemes.
  // Empty → null: board card/detail render a placeholder, and the home strip
  // filters on imgPath not null, so a pathless row never reaches the home grid.
  imgPath: emptyToNull.pipe(
    z
      .string()
      .startsWith("/", "이미지 경로는 /로 시작하는 사이트 내부 경로여야 합니다.")
      .nullable(),
  ),
  published: z.boolean(),
});

export type GalleryItemInput = z.output<typeof galleryItemSchema>;
