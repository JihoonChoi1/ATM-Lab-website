"use client";

import { Fragment, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  chipClass,
  deleteBtnClass,
  editLinkClass,
  emptyCellClass,
  groupCellClass,
  groupRowClass,
  iconBtnClass,
  publishedBtnClass,
  rowClass,
  searchInputClass,
  tableClass,
  tableWrapClass,
  thClass,
  theadRowClass,
} from "@/app/admin/_components/table-ui";
import { deleteProject, moveProject, toggleProjectPublished } from "../actions";
import { STATUS_LABELS, type ProjectStatusValue } from "../schema";

// List table: rows arrive sorted by `order` asc (the public-page order).
// Search/status filter are client-side — 9 rows, no server round-trips. Rows
// stay grouped by status because that's what the up/down reorder operates on.

export type ProjectRow = {
  id: string;
  title: string;
  institution: string;
  period: string;
  status: ProjectStatusValue;
  published: boolean;
};

const STATUS_ORDER: ProjectStatusValue[] = ["ACTIVE", "COMPLETED"];

export default function ProjectsTable({ projects }: { projects: ProjectRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatusValue | "ALL">("ALL");

  // Mutations don't re-render server components on their own — refresh after.
  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  const q = query.trim().toLowerCase();
  const matches = (p: ProjectRow) =>
    p.title.toLowerCase().includes(q) || p.institution.toLowerCase().includes(q);

  // Full per-status groups (for first/last reorder edges), then the search
  // filter for display only — arrows always swap with the true neighbor.
  const groups = STATUS_ORDER.filter((s) => statusFilter === "ALL" || s === statusFilter)
    .map((status) => {
      const all = projects.filter((p) => p.status === status);
      return { status, all, visible: q ? all.filter(matches) : all };
    })
    .filter((g) => g.all.length > 0);

  const visibleTotal = groups.reduce((n, g) => n + g.visible.length, 0);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button onClick={() => setStatusFilter("ALL")} className={chipClass(statusFilter === "ALL")}>
          전체 {projects.length}
        </button>
        {STATUS_ORDER.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={chipClass(statusFilter === s)}>
            {STATUS_LABELS[s]} {projects.filter((p) => p.status === s).length}
          </button>
        ))}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="프로젝트명·기관 검색"
          className={searchInputClass}
        />
      </div>

      <div className={tableWrapClass}>
        <table className={tableClass}>
          <thead>
            <tr className={theadRowClass}>
              <th className={`w-20 ${thClass}`}>순서</th>
              <th className={thClass}>프로젝트명</th>
              <th className={thClass}>기관</th>
              <th className={thClass}>기간</th>
              <th className={thClass}>공개</th>
              <th className={thClass}>관리</th>
            </tr>
          </thead>
          <tbody>
            {visibleTotal === 0 && (
              <tr>
                <td colSpan={6} className={emptyCellClass}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
            {groups.map((g) => (
              <Fragment key={g.status}>
                {g.visible.length > 0 && (
                  <tr className={groupRowClass}>
                    <td colSpan={6} className={groupCellClass}>
                      {STATUS_LABELS[g.status]} · {g.all.length}건
                    </td>
                  </tr>
                )}
                {g.visible.map((p) => {
                  const idx = g.all.indexOf(p);
                  return (
                    <tr key={p.id} className={rowClass}>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1">
                          <button
                            onClick={() => run(() => moveProject(p.id, "up"))}
                            disabled={isPending || idx === 0}
                            className={iconBtnClass}
                            aria-label={`${p.title} 위로 이동`}
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => run(() => moveProject(p.id, "down"))}
                            disabled={isPending || idx === g.all.length - 1}
                            className={iconBtnClass}
                            aria-label={`${p.title} 아래로 이동`}
                          >
                            ↓
                          </button>
                        </div>
                      </td>
                      <td className="min-w-[260px] px-4 py-2.5 font-medium text-ink">
                        {p.title}
                      </td>
                      <td className="px-4 py-2.5 text-ink-2">{p.institution}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-ink-3">
                        {p.period}
                      </td>
                      <td className="px-4 py-2.5">
                        <button
                          onClick={() => run(() => toggleProjectPublished(p.id))}
                          disabled={isPending}
                          className={publishedBtnClass(p.published)}
                        >
                          {p.published ? "공개" : "비공개"}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <Link href={`/admin/projects/${p.id}`} className={editLinkClass}>
                          수정
                        </Link>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `'${p.title}' 프로젝트를 삭제할까요? 90일 내 최근 활동에서 복원할 수 있습니다.`,
                              )
                            ) {
                              run(() => deleteProject(p.id));
                            }
                          }}
                          disabled={isPending}
                          className={deleteBtnClass}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
