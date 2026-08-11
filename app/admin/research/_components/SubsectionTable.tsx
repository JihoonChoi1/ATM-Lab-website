"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
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
import { deleteSubsection, moveSubsection, toggleSubsectionPublished } from "../actions";

// Subsection list for one topic: rows arrive sorted by order asc. Arrows swap
// with the neighbor within the same topic. "Manage" opens the subsection detail
// page (edit its fields + manage its figures).

export type SubsectionRow = {
  id: string;
  num: string;
  title: string;
  figCount: number;
  published: boolean;
};

export default function SubsectionTable({
  topicId,
  subsections,
}: {
  topicId: string;
  subsections: SubsectionRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  return (
    <div className={tableWrapClass}>
      <table className={tableClass}>
        <thead>
          <tr className={theadRowClass}>
            <th className={`w-20 ${thClass}`}>Order</th>
            <th className={thClass}>No.</th>
            <th className={thClass}>Title</th>
            <th className={thClass}>Figure</th>
            <th className={thClass}>Published</th>
            <th className={thClass}>Manage</th>
          </tr>
        </thead>
        <tbody>
          {subsections.length === 0 && (
            <tr>
              <td colSpan={6} className={emptyCellClass}>
                No subsections yet.
              </td>
            </tr>
          )}
          {subsections.map((s, idx) => (
            <tr key={s.id} className={rowClass}>
              <td className="px-4 py-2.5">
                <div className="flex gap-1">
                  <button
                    onClick={() => run(() => moveSubsection(s.id, "up"))}
                    disabled={isPending || idx === 0}
                    className={iconBtnClass}
                    aria-label={`${s.title} Move up`}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => run(() => moveSubsection(s.id, "down"))}
                    disabled={isPending || idx === subsections.length - 1}
                    className={iconBtnClass}
                    aria-label={`${s.title} Move down`}
                  >
                    ↓
                  </button>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-ink-3">
                {s.num}
              </td>
              <td className="min-w-[260px] px-4 py-2.5 font-medium text-ink">{s.title}</td>
              <td className="whitespace-nowrap px-4 py-2.5 text-ink-2">{s.figCount}</td>
              <td className="px-4 py-2.5">
                <button
                  onClick={() => run(() => toggleSubsectionPublished(s.id))}
                  disabled={isPending}
                  className={publishedBtnClass(s.published)}
                >
                  {s.published ? "Published" : "Unpublished"}
                </button>
              </td>
              <td className="whitespace-nowrap px-4 py-2.5">
                <Link
                  href={`/admin/research/${topicId}/${s.id}`}
                  className={editLinkClass}
                >
                  Manage
                </Link>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete the subsection '${s.title}'? Its figures are deleted too. You can restore it from Recent activity within 90 days.`,
                      )
                    ) {
                      run(() => deleteSubsection(s.id));
                    }
                  }}
                  disabled={isPending}
                  className={deleteBtnClass}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
