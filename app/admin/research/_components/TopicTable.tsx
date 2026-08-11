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
import { deleteTopic, moveTopic, toggleTopicPublished } from "../actions";

// Topic list: rows arrive sorted by order asc — the canonical public sequence.
// Arrows swap with the global neighbor (no grouping). "Manage" opens the topic
// detail page (edit its fields + manage its subsections).

export type TopicRow = {
  id: string;
  num: string;
  title: string;
  subCount: number;
  published: boolean;
};

export default function TopicTable({ topics }: { topics: TopicRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Mutations don't re-render server components on their own — refresh after.
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
            <th className={thClass}>Subsection</th>
            <th className={thClass}>Published</th>
            <th className={thClass}>Manage</th>
          </tr>
        </thead>
        <tbody>
          {topics.length === 0 && (
            <tr>
              <td colSpan={6} className={emptyCellClass}>
                No topics yet.
              </td>
            </tr>
          )}
          {topics.map((t, idx) => (
            <tr key={t.id} className={rowClass}>
              <td className="px-4 py-2.5">
                <div className="flex gap-1">
                  <button
                    onClick={() => run(() => moveTopic(t.id, "up"))}
                    disabled={isPending || idx === 0}
                    className={iconBtnClass}
                    aria-label={`${t.title} Move up`}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => run(() => moveTopic(t.id, "down"))}
                    disabled={isPending || idx === topics.length - 1}
                    className={iconBtnClass}
                    aria-label={`${t.title} Move down`}
                  >
                    ↓
                  </button>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-ink-3">
                {t.num}
              </td>
              <td className="min-w-[260px] px-4 py-2.5 font-medium text-ink">{t.title}</td>
              <td className="whitespace-nowrap px-4 py-2.5 text-ink-2">{t.subCount}</td>
              <td className="px-4 py-2.5">
                <button
                  onClick={() => run(() => toggleTopicPublished(t.id))}
                  disabled={isPending}
                  className={publishedBtnClass(t.published)}
                >
                  {t.published ? "Published" : "Unpublished"}
                </button>
              </td>
              <td className="whitespace-nowrap px-4 py-2.5">
                <Link href={`/admin/research/${t.id}`} className={editLinkClass}>
                  Manage
                </Link>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete the topic '${t.title}'? Its subsections and figures are deleted too. You can restore it from Recent activity within 90 days.`,
                      )
                    ) {
                      run(() => deleteTopic(t.id));
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
