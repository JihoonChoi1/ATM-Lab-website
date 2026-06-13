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
import { deleteGalleryItem, toggleGalleryItemPublished } from "../actions";

// List table: rows arrive sorted by date desc — the canonical order shared
// with the public board. No chips/search/pagination (15 rows) and no reorder
// arrows — the public order is computed from the date, not curated.

export type GalleryRow = {
  id: string;
  date: string; // YYYY-MM-DD (UTC), pre-formatted by the server page
  title: string;
  imgPath: string | null;
  published: boolean;
};

export default function GalleryTable({ items }: { items: GalleryRow[] }) {
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
            <th className={thClass}>날짜</th>
            <th className={thClass}>제목</th>
            <th className={thClass}>이미지</th>
            <th className={thClass}>공개</th>
            <th className={thClass}>관리</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className={emptyCellClass}>
                갤러리 항목이 없습니다.
              </td>
            </tr>
          )}
          {items.map((g) => (
            <tr key={g.id} className={rowClass}>
              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-ink-3">
                {g.date}
              </td>
              <td className="min-w-[220px] px-4 py-2.5 font-medium text-ink">
                {g.title}
              </td>
              <td className="max-w-[220px] truncate px-4 py-2.5 font-mono text-xs text-ink-3" title={g.imgPath ?? undefined}>
                {g.imgPath ?? "—"}
              </td>
              <td className="px-4 py-2.5">
                <button
                  onClick={() => run(() => toggleGalleryItemPublished(g.id))}
                  disabled={isPending}
                  className={publishedBtnClass(g.published)}
                >
                  {g.published ? "공개" : "비공개"}
                </button>
              </td>
              <td className="whitespace-nowrap px-4 py-2.5">
                <Link href={`/admin/gallery/${g.id}`} className={editLinkClass}>
                  수정
                </Link>
                <button
                  onClick={() => {
                    if (
                      window.confirm(`'${g.title}' 갤러리 항목을 삭제할까요? 되돌릴 수 없습니다.`)
                    ) {
                      run(() => deleteGalleryItem(g.id));
                    }
                  }}
                  disabled={isPending}
                  className={deleteBtnClass}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
