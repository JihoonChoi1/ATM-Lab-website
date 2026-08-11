import { z } from "zod";

// Phase 7-3: shared between the form UI (status select) and the server
// actions (validation). Project is flat — no conditional fields, so no
// superRefine. Parsed fields map 1:1 to the Prisma columns this form owns,
// so actions write parsed.data as-is (no toProjectData mapper needed).

export const PROJECT_STATUSES = ["ACTIVE", "COMPLETED"] as const;
export type ProjectStatusValue = (typeof PROJECT_STATUSES)[number];

export const STATUS_LABELS: Record<ProjectStatusValue, string> = {
  ACTIVE: "Ongoing",
  COMPLETED: "Completed",
};

const emptyToNull = z
  .string()
  .trim()
  .transform((v) => v || null);

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Please enter a project name."),
  institution: z.string().trim().min(1, "Please enter an institution."),
  period: z.string().trim().min(1, "Please enter a period."),
  // Free text as-is (legacy rows mix ₩-prefixed and bare numbers); the public
  // page renders it verbatim and shows "—" when null.
  scale: emptyToNull,
  status: z.enum(PROJECT_STATUSES, "Please select a status."),
  published: z.boolean(),
});

export type ProjectInput = z.output<typeof projectSchema>;
