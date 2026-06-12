import { z } from "zod";

// Phase 7-4: shared between the form UI (type select) and the server actions
// (validation). `type` drives which fields apply — toPublicationData clears
// the other types' fields to null, so switching type on edit can't leave
// stale values behind (the clear shows up in the audit diff and stays
// restorable for 90 days).

export const PUBLICATION_TYPES = ["JOURNAL", "CONFERENCE", "PATENT"] as const;
export type PublicationTypeValue = (typeof PUBLICATION_TYPES)[number];

export const TYPE_LABELS: Record<PublicationTypeValue, string> = {
  JOURNAL: "Journal",
  CONFERENCE: "Conference",
  PATENT: "Patent",
};

const emptyToNull = z
  .string()
  .trim()
  .transform((v) => v || null);

export const publicationSchema = z.object({
  type: z.enum(PUBLICATION_TYPES, "구분을 선택하세요."),
  // Free text — legacy data has the group label "2014~Before", and the public
  // pages sort years with localeCompare desc, so no numeric coercion.
  year: z.string().trim().min(1, "연도를 입력하세요."),
  title: z.string().trim().min(1, "제목을 입력하세요."),
  authors: emptyToNull,
  journal: emptyToNull,
  // The public detail page renders this verbatim as an href — require a full
  // http(s) URL (all 102 legacy DOIs are https://).
  doi: emptyToNull.pipe(
    z
      .string()
      .regex(/^https?:\/\//, "DOI는 https:// 로 시작하는 전체 링크여야 합니다.")
      .nullable(),
  ),
  conference: emptyToNull,
  inventors: emptyToNull,
  applicationNo: emptyToNull,
  country: emptyToNull,
  // Free text; legacy rows use "YYYY-MM-DD" (guided by placeholder only).
  registeredAt: emptyToNull,
  // Until the 7-8 upload component lands this is a plain text path; site-internal
  // paths only ("/legacy/…", "/uploads/…") — no external URLs or odd schemes.
  imgPath: emptyToNull.pipe(
    z
      .string()
      .startsWith("/", "이미지 경로는 /로 시작하는 사이트 내부 경로여야 합니다.")
      .nullable(),
  ),
  published: z.boolean(),
});

export type PublicationInput = z.output<typeof publicationSchema>;

// Maps validated input to the Prisma columns this form owns. Fields belonging
// to the other types are cleared to null — lossless for legacy rows (they are
// already null on every non-matching row) and required for type switches.
export function toPublicationData(p: PublicationInput) {
  return {
    type: p.type,
    year: p.year,
    title: p.title,
    authors: p.type === "PATENT" ? null : p.authors,
    journal: p.type === "JOURNAL" ? p.journal : null,
    doi: p.type === "JOURNAL" ? p.doi : null,
    imgPath: p.type === "JOURNAL" ? p.imgPath : null,
    conference: p.type === "CONFERENCE" ? p.conference : null,
    inventors: p.type === "PATENT" ? p.inventors : null,
    applicationNo: p.type === "PATENT" ? p.applicationNo : null,
    country: p.type === "PATENT" ? p.country : null,
    registeredAt: p.type === "PATENT" ? p.registeredAt : null,
    published: p.published,
  };
}
