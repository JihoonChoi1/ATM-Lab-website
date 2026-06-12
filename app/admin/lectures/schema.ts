import { z } from "zod";

// Phase 7-5: shared between the form UI (category select) and the server
// actions (validation). Lecture is flat — no conditional fields, no
// superRefine; parsed fields map 1:1 to the Prisma columns this form owns.

export const LECTURE_CATEGORIES = ["UNDERGRADUATE", "GRADUATE"] as const;
export type LectureCategoryValue = (typeof LECTURE_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<LectureCategoryValue, string> = {
  UNDERGRADUATE: "Undergraduate",
  GRADUATE: "Graduate",
};

// One textarea ↔ String[] — paragraphs are separated by blank lines. Legacy
// rows keep single \n inside a paragraph (rendered as-is) and never contain
// blank lines within one, so join("\n\n") → split round-trips losslessly.
// An empty textarea yields [] — the public card falls back to "Course
// description not provided." (a real case: lecture 04).
const paragraphsField = z.string().transform((v) =>
  v
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean),
);

export const lectureSchema = z.object({
  // Free text: the big display number on the public card ("01"…"04"). It is a
  // manual label — not renumbered on reorder, no uniqueness enforced.
  num: z.string().trim().min(1, "표시 번호를 입력하세요."),
  category: z.enum(LECTURE_CATEGORIES, "구분을 선택하세요."),
  title: z.string().trim().min(1, "강의명을 입력하세요."),
  paragraphs: paragraphsField,
  published: z.boolean(),
});

export type LectureInput = z.output<typeof lectureSchema>;
