// Shared classes for admin CRUD list tables (7-2+). One source of truth so
// sections can't drift apart (cell sizing, fonts, control styling) — new
// tables import these instead of re-cloning the class strings.

export const chipClass = (active: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
    active
      ? "border-accent bg-accent text-white"
      : "border-line bg-surface text-ink-2 hover:border-accent/30 hover:bg-accent-soft hover:text-accent"
  }`;

export const searchInputClass =
  "ml-auto w-52 rounded-2xl border border-line bg-surface px-3.5 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

export const tableWrapClass =
  "overflow-x-auto rounded-3xl border border-line bg-surface";
export const tableClass = "w-full min-w-[820px] text-sm";
export const theadRowClass =
  "border-b border-line text-left text-xs uppercase tracking-wide text-ink-3";
export const thClass = "px-4 py-3 font-medium";
export const rowClass = "border-b border-line last:border-0";
export const groupRowClass = "border-b border-line bg-bg";
export const groupCellClass =
  "px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-3";
export const emptyCellClass = "px-4 py-10 text-center text-ink-3";

export const iconBtnClass =
  "flex h-7 w-7 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-accent/30 hover:text-accent disabled:pointer-events-none disabled:opacity-30";

// whitespace-nowrap: wrapping columns (long titles) can squeeze the table —
// without it "공개/비공개" stacks vertically.
export const publishedBtnClass = (published: boolean) =>
  `whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium transition disabled:opacity-50 ${
    published ? "bg-success-soft text-success" : "bg-line text-ink-3"
  }`;

export const editLinkClass = "font-medium text-accent hover:underline";
// text-[#b35900]: brand ajou-yellow (#ff801a) is only ~2.5:1 on white — too low
// for AA on this text-only control. This darker amber keeps the warning hue at
// ≥4.8:1. (Kept inline rather than touching the brand token, which is also used
// decoratively.)
export const deleteBtnClass =
  "ml-4 font-medium text-[#b35900] hover:underline disabled:opacity-50";
