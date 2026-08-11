import { z } from "zod";

// Phase 7-10: Research CRUD — shared between the form UIs and the server
// actions (validation). Three nested entities (Topic → Subsection → Figure)
// plus the ResearchPageMeta singleton. Parsed fields map 1:1 to the Prisma
// columns each form owns; order is never in a form (create = max+1, move
// swaps), and num uniqueness on Topic is checked in the action (needs the DB).

// Comma-separated tags → string[] (same as MemberForm interests). Empty → [].
const keywordsField = z
  .string()
  .transform((v) => v.split(",").map((s) => s.trim()).filter(Boolean));

// Empty → null; otherwise a site-internal path ("/legacy/…", "/uploads/…").
// Figures render a placeholder when imgPath is null (the public FigureView has
// a real placeholder branch), so a pathless figure is valid.
const imgPathField = z
  .string()
  .trim()
  .transform((v) => v || null)
  .pipe(
    z
      .string()
      .startsWith("/", "The image path must be an internal site path starting with /.")
      .nullable(),
  );

// ─── Topic ───────────────────────────────────────────────────────────────────

export const TOPIC_BG = ["white", "bg"] as const;
export type TopicBgValue = (typeof TOPIC_BG)[number];

export const TOPIC_BG_LABELS: Record<TopicBgValue, string> = {
  white: "White background",
  bg: "Tinted background",
};

export const topicSchema = z.object({
  // Big display number + anchor id ("01"…). @unique in the DB — the action
  // pre-checks for a collision and returns a field error.
  num: z.string().trim().min(1, "Please enter a number."),
  title: z.string().trim().min(1, "Please enter a title."),
  lead: z.string().trim().min(1, "Please enter a lead sentence."),
  keywords: keywordsField,
  bg: z.enum(TOPIC_BG, "Please choose a background."),
  published: z.boolean(),
});

export type TopicInput = z.output<typeof topicSchema>;

// ─── Subsection ──────────────────────────────────────────────────────────────

export const subsectionSchema = z.object({
  // Free text ("01.01"…) — not unique, not renumbered on reorder.
  num: z.string().trim().min(1, "Please enter a number."),
  title: z.string().trim().min(1, "Please enter a title."),
  // Single paragraph stored as-is (db.Text). The public page renders one <p>;
  // all real rows are single-paragraph, so no blank-line splitting.
  body: z.string().trim().min(1, "Please enter body text."),
  keywords: keywordsField,
  published: z.boolean(),
});

export type SubsectionInput = z.output<typeof subsectionSchema>;

// ─── Figure ──────────────────────────────────────────────────────────────────

// width/height are required columns and feed the public auto-layout (portrait
// pairing + aspectRatio box), so they can never be 0/missing — required even
// for a placeholder figure (the form pre-fills them and an upload overwrites
// them with the real pixel dimensions, 7-8).
const dimField = z.coerce
  .number()
  .int("Please enter a whole number.")
  .min(1, "Please enter a value of 1 or more.");

export const figureSchema = z.object({
  imgPath: imgPathField,
  caption: z.string().trim().min(1, "Please enter a caption."),
  width: dimField,
  height: dimField,
  // "Large" = render across the full gallery row; default "Normal" = one slot.
  wide: z.boolean(),
});

export type FigureInput = z.output<typeof figureSchema>;

// ─── Page meta (singleton) ───────────────────────────────────────────────────

export const pageMetaSchema = z.object({
  // Two-line headline, newline-separated (public hero splits on "\n").
  heroHeadline: z.string().trim().min(1, "Please enter a headline."),
  heroParagraph: z.string().trim().min(1, "Please enter an intro paragraph."),
  yearsValue: z.string().trim().min(1, "Please enter a years value."),
});

export type PageMetaInput = z.output<typeof pageMetaSchema>;
