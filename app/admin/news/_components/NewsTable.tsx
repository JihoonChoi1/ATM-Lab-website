"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  deleteBtnClass,
  editLinkClass,
  emptyCellClass,
  publishedBtnClass,
  rowClass,
  tableClass,
  tableWrapClass,
  thClass,
  theadRowClass,
} from "@/app/admin/_components/table-ui";
import { deleteNews, toggleNewsPublished } from "../actions";

// List table: rows arrive sorted by date desc — the canonical order shared
// with the public board. No chips/search/pagination (5 rows) and no reorder
// arrows — the public order is computed from the date, not curated.

export type NewsRow = {
  id: string;
  date: string; // YYYY-MM-DD (UTC), pre-formatted by the server page
  title: string;
  published: boolean;
};

export default function NewsTable({ news }: { news: NewsRow[] }) {
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
            <th className={thClass}>Date</th>
            <th className={thClass}>Title</th>
            <th className={thClass}>Published</th>
            <th className={thClass}>Manage</th>
          </tr>
        </thead>
        <tbody>
          {news.length === 0 && (
            <tr>
              <td colSpan={4} className={emptyCellClass}>
                No news yet.
              </td>
            </tr>
          )}
          {news.map((n) => (
            <tr key={n.id} className={rowClass}>
              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-ink-3">
                {n.date}
              </td>
              <td className="min-w-[260px] px-4 py-2.5 font-medium text-ink">
                {n.title}
              </td>
              <td className="px-4 py-2.5">
                <button
                  onClick={() => run(() => toggleNewsPublished(n.id))}
                  disabled={isPending}
                  className={publishedBtnClass(n.published)}
                >
                  {n.published ? "Published" : "Unpublished"}
                </button>
              </td>
              <td className="whitespace-nowrap px-4 py-2.5">
                <Link href={`/admin/news/${n.id}`} className={editLinkClass}>
                  Edit
                </Link>
                <button
                  onClick={() => {
                    if (
                      window.confirm(`Delete the news post '${n.title}'? You can restore it from Recent activity within 90 days.`)
                    ) {
                      run(() => deleteNews(n.id));
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
