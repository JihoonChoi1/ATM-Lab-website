import { z } from "zod";

// Phase 7-3: shared between the form UI (status select) and the server
// actions (validation). Project is flat — no conditional fields, so no
// superRefine. Parsed fields map 1:1 to the Prisma columns this form owns,
// so actions write parsed.data as-is (no toProjectData mapper needed).

export const PROJECT_STATUSES = ["ACTIVE", "COMPLETED"] as const;
export type ProjectStatusValue = (typeof PROJECT_STATUSES)[number];

export const STATUS_LABELS: Record<ProjectStatusValue, string> = {
  ACTIVE: "진행중",
  COMPLETED: "완료",
};

const emptyToNull = z
  .string()
  .trim()
  .transform((v) => v || null);

export const projectSchema = z.object({
  title: z.string().trim().min(1, "프로젝트명을 입력하세요."),
  institution: z.string().trim().min(1, "기관을 입력하세요."),
  period: z.string().trim().min(1, "기간을 입력하세요."),
  // Free text as-is (legacy rows mix ₩-prefixed and bare numbers); the public
  // page renders it verbatim and shows "—" when null.
  scale: emptyToNull,
  status: z.enum(PROJECT_STATUSES, "상태를 선택하세요."),
  published: z.boolean(),
});

export type ProjectInput = z.output<typeof projectSchema>;
