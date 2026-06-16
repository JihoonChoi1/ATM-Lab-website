// Single source for which audit entities support revert/restore — the
// delegate map in actions.ts and the button rendering in page.tsx both key
// off this. 7-4+: add each new CRUD entity here and in DELEGATES together.
export const REVERTIBLE_ENTITIES = [
  "Member",
  "Project",
  "Publication",
  "Lecture",
  "News",
  "GalleryItem",
  // 7-10b: Topic/Subsection DELETE restore rebuilds the cascaded subtree (nested
  // create in actions.ts); Figure restore + every UPDATE revert use the flat
  // path. PageMeta is a singleton (no delete) — UPDATE revert only.
  "ResearchTopic",
  "ResearchSubsection",
  "ResearchFigure",
  "ResearchPageMeta",
] as const;
