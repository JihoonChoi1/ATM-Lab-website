"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  chipClass,
  deleteBtnClass,
  editLinkClass,
  emptyCellClass,
  publishedBtnClass,
  rowClass,
  searchInputClass,
  tableClass,
  tableWrapClass,
  thClass,
  theadRowClass,
} from "@/app/admin/_components/table-ui";
import {
  pagerBtnClass,
  pagerDisabledClass,
} from "@/app/admin/_components/Pagination";
import { deletePublication, togglePublicationPublished } from "../actions";
import { PUBLICATION_TYPES, TYPE_LABELS, type PublicationTypeValue } from "../schema";

// List table: rows arrive sorted by [year desc, order desc] — the canonical
// order shared with the public pages. Type chips + title/author search are
// client-side like the other tables, plus client-side pagination (~200 rows
// are already in memory for filtering, so no server round-trips; the shared
// Pagination.tsx is ?page=-link based, hence useState here). No group header
// rows — the chips are the grouping. No reorder arrows — the public order is
// computed, not curated.

const PAGE_SIZE = 25;

export type PublicationRow = {
  id: string;
  type: PublicationTypeValue;
  year: string;
  title: string;
  authors: string | null;
  journal: string | null;
  conference: string | null;
  applicationNo: string | null;
  published: boolean;
};

// Same per-type source field as the home page's metaOf.
const sourceOf = (p: PublicationRow) =>
  p.type === "JOURNAL" ? p.journal : p.type === "CONFERENCE" ? p.conference : p.applicationNo;

export default function PublicationsTable({
  publications,
}: {
  publications: PublicationRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<PublicationTypeValue | "ALL">("ALL");
  const [page, setPage] = useState(1);

  // Mutations don't re-render server components on their own — refresh after.
  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  const q = query.trim().toLowerCase();
  const filtered = publications.filter(
    (p) =>
      (typeFilter === "ALL" || p.type === typeFilter) &&
      (!q ||
        p.title.toLowerCase().includes(q) ||
        (p.authors ?? "").toLowerCase().includes(q)),
  );

  // Chip/search changes reset to page 1 (see handlers); the clamp covers rows
  // disappearing under the pager, e.g. deleting the last row of the last page.
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageRows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setTypeFilter("ALL");
            setPage(1);
          }}
          className={chipClass(typeFilter === "ALL")}
        >
          전체 {publications.length}
        </button>
        {PUBLICATION_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTypeFilter(t);
              setPage(1);
            }}
            className={chipClass(typeFilter === t)}
          >
            {TYPE_LABELS[t]} {publications.filter((p) => p.type === t).length}
          </button>
        ))}
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="제목·저자 검색"
          className={searchInputClass}
        />
      </div>

      <div className={tableWrapClass}>
        <table className={tableClass}>
          <thead>
            <tr className={theadRowClass}>
              <th className={thClass}>연도</th>
              <th className={thClass}>구분</th>
              <th className={thClass}>제목</th>
              <th className={thClass}>출처</th>
              <th className={thClass}>공개</th>
              <th className={thClass}>관리</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={6} className={emptyCellClass}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
            {pageRows.map((p) => (
              <tr key={p.id} className={rowClass}>
                <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-ink-3">
                  {p.year}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-ink-2">
                  {TYPE_LABELS[p.type]}
                </td>
                <td className="min-w-[260px] px-4 py-2.5 font-medium text-ink">
                  {p.title}
                </td>
                <td className="min-w-[160px] px-4 py-2.5 text-ink-2">
                  {sourceOf(p) ?? "—"}
                </td>
                <td className="px-4 py-2.5">
                  <button
                    onClick={() => run(() => togglePublicationPublished(p.id))}
                    disabled={isPending}
                    className={publishedBtnClass(p.published)}
                  >
                    {p.published ? "공개" : "비공개"}
                  </button>
                </td>
                <td className="whitespace-nowrap px-4 py-2.5">
                  <Link href={`/admin/publications/${p.id}`} className={editLinkClass}>
                    수정
                  </Link>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `'${p.title}' 게재물을 삭제할까요? 되돌릴 수 없습니다.`,
                        )
                      ) {
                        run(() => deletePublication(p.id));
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

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage(current - 1)}
            disabled={current <= 1}
            className={current <= 1 ? pagerDisabledClass : pagerBtnClass}
          >
            ← 이전
          </button>
          <span className="text-sm text-ink-3">
            {current} / {totalPages}
          </span>
          <button
            onClick={() => setPage(current + 1)}
            disabled={current >= totalPages}
            className={current >= totalPages ? pagerDisabledClass : pagerBtnClass}
          >
            다음 →
          </button>
        </nav>
      )}
    </div>
  );
}
