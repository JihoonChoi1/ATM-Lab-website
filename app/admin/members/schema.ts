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
