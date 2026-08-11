"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  chipClass,
  deleteBtnClass,
  editLinkClass,
  emptyCellClass,
  iconBtnClass,
  publishedBtnClass,
  rowClass,
  tableClass,
  tableWrapClass,
  thClass,
  theadRowClass,
} from "@/app/admin/_components/table-ui";
import { deleteLecture, moveLecture, toggleLecturePublished } from "../actions";
import { CATEGORY_LABELS, LECTURE_CATEGORIES, type LectureCategoryValue } from "../schema";

// List table: rows arrive sorted by `order` asc — one global sequence with
// categories interleaved, exactly the public All tab. Category chips are a
// display filter only; the arrows always swap with the true global neighbor,
// so a move under a chip filter may not visibly reorder the filtered view
// (intended — 4 rows, real use is the Total tab). No search/pagination.

export type LectureRow = {
  id: string;
  num: string;
  category: LectureCategoryValue;
  title: string;
  published: boolean;
};

export default function LecturesTable({ lectures }: { lectures: LectureRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [categoryFilter, setCategoryFilter] = useState<LectureCategoryValue | "ALL">("ALL");

  // Mutations don't re-render server components on their own — refresh after.
  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  const visible = lectures.filter(
    (l) => categoryFilter === "ALL" || l.category === categoryFilter,
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setCategoryFilter("ALL")}
          className={chipClass(categoryFilter === "ALL")}
        >
          All {lectures.length}
        </button>
        {LECTURE_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={chipClass(categoryFilter === c)}
          >
            {CATEGORY_LABELS[c]} {lectures.filter((l) => l.category === c).length}
          </button>
        ))}
      </div>

      <div className={tableWrapClass}>
        <table className={tableClass}>
          <thead>
            <tr className={theadRowClass}>
              <th className={`w-20 ${thClass}`}>Order</th>
              <th className={thClass}>No.</th>
              <th className={thClass}>Type</th>
              <th className={thClass}>Lecture name</th>
              <th className={thClass}>Published</th>
              <th className={thClass}>Manage</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className={emptyCellClass}>
                  No lectures yet.
                </td>
              </tr>
            )}
            {visible.map((l) => {
              // Global index — first/last in the full sequence disables the arrow.
              const idx = lectures.indexOf(l);
              return (
                <tr key={l.id} className={rowClass}>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1">
                      <button
                        onClick={() => run(() => moveLecture(l.id, "up"))}
                        disabled={isPending || idx === 0}
                        className={iconBtnClass}
                        aria-label={`${l.title} Move up`}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => run(() => moveLecture(l.id, "down"))}
                        disabled={isPending || idx === lectures.length - 1}
                        className={iconBtnClass}
                        aria-label={`${l.title} Move down`}
                      >
                        ↓
                      </button>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-ink-3">
                    {l.num}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-ink-2">
                    {CATEGORY_LABELS[l.category]}
                  </td>
                  <td className="min-w-[260px] px-4 py-2.5 font-medium text-ink">
                    {l.title}
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => run(() => toggleLecturePublished(l.id))}
                      disabled={isPending}
                      className={publishedBtnClass(l.published)}
                    >
                      {l.published ? "Published" : "Unpublished"}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <Link href={`/admin/lectures/${l.id}`} className={editLinkClass}>
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(`Delete the lecture '${l.title}'? You can restore it from Recent activity within 90 days.`)
                        ) {
                          run(() => deleteLecture(l.id));
                        }
                      }}
                      disabled={isPending}
                      className={deleteBtnClass}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
