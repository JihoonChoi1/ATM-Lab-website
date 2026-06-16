import { z } from "zod";

// Phase 7-2: shared between the form UI (select options) and the server
// actions (validation). Position and degree are selects, not free text — the
// public /members page tab-filters on these exact strings, so a typo would
// silently drop a member from its tab. Values mirror the legacy data as-is.

export const MEMBER_ROLES = [
  "PROFESSOR",
  "RESEARCHER",
  "STUDENT",
  "ALUMNI",
] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

export const ROLE_LABELS: Record<MemberRole, string> = {
  PROFESSOR: "교수",
  RESEARCHER: "연구원",
  STUDENT: "학생",
  ALUMNI: "졸업생",
};

export const POSITION_OPTIONS = {
  RESEARCHER: ["Postdoctoral Researcher", "Research Staff"],
  STUDENT: ["Ph.D. Course", "Master's Course", "Undergraduate Intern"],
} as const;

// The public page buckets alumni by whether the degree contains "master".
export const DEGREE_OPTIONS = ["Master's degree", "Doctoral degree"] as const;

const emptyToNull = z
  .string()
  .trim()
  .transform((v) => v || null);

export const memberSchema = z
  .object({
    name: z.string().trim().min(1, "이름을 입력하세요."),
    role: z.enum(MEMBER_ROLES, "구분을 선택하세요."),
    position: z.string().trim(),
    email: emptyToNull.pipe(
      z.email("이메일 형식이 올바르지 않습니다.").nullable(),
    ),
    year: emptyToNull,
    degree: emptyToNull,
    currentPosition: emptyToNull,
    // Comma-separated tags → string[]
    interests: z
      .string()
      .transform((v) => v.split(",").map((s) => s.trim()).filter(Boolean)),
    // Until the 7-8 upload component lands this is a plain text path; site-internal
    // paths only ("/legacy/…", "/uploads/…") — no external URLs or odd schemes.
    imgPath: emptyToNull.pipe(
      z
        .string()
        .startsWith("/", "이미지 경로는 /로 시작하는 사이트 내부 경로여야 합니다.")
        .nullable(),
    ),
    published: z.boolean(),
  })
  .superRefine((m, ctx) => {
    if (
      (m.role === "RESEARCHER" || m.role === "STUDENT") &&
      !(POSITION_OPTIONS[m.role] as readonly string[]).includes(m.position)
    ) {
      ctx.addIssue({ code: "custom", path: ["position"], message: "직책을 선택하세요." });
    }
    if (m.role === "ALUMNI") {
      if (!m.degree || !(DEGREE_OPTIONS as readonly string[]).includes(m.degree)) {
        ctx.addIssue({ code: "custom", path: ["degree"], message: "학위를 선택하세요." });
      }
      // Public page groups alumni rows under a Number(year) heading.
      if (!m.year) {
        ctx.addIssue({ code: "custom", path: ["year"], message: "졸업년도를 입력하세요. (예: 2024)" });
      }
    }
  });

export type MemberInput = z.output<typeof memberSchema>;

// Maps validated input to the Prisma columns this form owns. PROFESSOR and
// ALUMNI have no position select (single professor row; legacy alumni rows
// store the degree string as position), so theirs are derived.
export function toMemberData(m: MemberInput) {
  const position =
    m.role === "PROFESSOR" ? "Professor" : m.role === "ALUMNI" ? m.degree! : m.position;
  return {
    name: m.name,
    role: m.role,
    position,
    email: m.email,
    year: m.year,
    degree: m.degree,
    currentPosition: m.currentPosition,
    interests: m.interests,
    imgPath: m.imgPath,
    published: m.published,
  };
}

// Phase 7-11: professor-only structured JSON, edited via the dedicated
// /admin/members/professor editor (left out of the generic form in 7-2). The
// z.output here must match the public renderer's types exactly
// (app/(pages)/members/_components/MembersClient.tsx) — a mismatch breaks the
// /members professor section.

// education + workHistory share one shape. The public DefinitionList renders
// `period` unconditionally and `inst` only when present, and the migrated work
// history has rows with empty period/inst (membership lines) — so only `title`
// is required.
const profEntrySchema = z.object({
  period: z.string().trim(),
  title: z.string().trim().min(1, "직함/학위를 입력하세요."),
  inst: z.string().trim(),
});

const profResearchItemSchema = z.object({
  label: z.string().trim().min(1, "연구분야 항목명을 입력하세요."),
  // Comma-separated sub-tags → string[] (same convention as `interests`).
  subs: z
    .string()
    .transform((v) => v.split(",").map((s) => s.trim()).filter(Boolean)),
});

const profResearchGroupSchema = z.object({
  group: z.string().trim().min(1, "연구분야 그룹명을 입력하세요."),
  items: z.array(profResearchItemSchema),
});

const profLectureSchema = z.object({
  title: z.string().trim().min(1, "강의명을 입력하세요."),
  code: z.string().trim(), // optional — legacy rows store ""
});

export const professorProfileSchema = z
  .object({
    // Top-level [] is allowed everywhere (the public renderer is empty-safe).
    education: z.array(profEntrySchema),
    workHistory: z.array(profEntrySchema),
    researchFields: z.array(profResearchGroupSchema),
    lectureSubjects: z.array(profLectureSchema),
  })
  .superRefine((p, ctx) => {
    // The public page uses group / item label / sub / lecture title as React
    // keys, so duplicates among siblings collide and break that render — reject
    // them. (education/workHistory use index keys, so they need no check.)
    const groups = new Set<string>();
    for (const g of p.researchFields) {
      if (groups.has(g.group))
        ctx.addIssue({ code: "custom", path: ["researchFields"], message: `연구분야 그룹명이 중복됩니다: "${g.group}"` });
      groups.add(g.group);
      const labels = new Set<string>();
      for (const it of g.items) {
        if (labels.has(it.label))
          ctx.addIssue({ code: "custom", path: ["researchFields"], message: `연구분야 항목명이 중복됩니다: "${it.label}"` });
        labels.add(it.label);
        if (new Set(it.subs).size !== it.subs.length)
          ctx.addIssue({ code: "custom", path: ["researchFields"], message: `"${it.label}" 항목의 세부 태그가 중복됩니다.` });
      }
    }
    const titles = new Set<string>();
    for (const l of p.lectureSubjects) {
      if (titles.has(l.title))
        ctx.addIssue({ code: "custom", path: ["lectureSubjects"], message: `강의명이 중복됩니다: "${l.title}"` });
      titles.add(l.title);
    }
  });

export type ProfessorProfileInput = z.output<typeof professorProfileSchema>;
