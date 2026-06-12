// Single source for which audit entities support revert/restore — the
// delegate map in actions.ts and the button rendering in page.tsx both key
// off this. 7-4+: add each new CRUD entity here and in DELEGATES together.
export const REVERTIBLE_ENTITIES = ["Member", "Project", "Publication"] as const;
