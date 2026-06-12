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
import { deleteMember, moveMember, toggleMemberPublished } from "../actions";
import { ROLE_LABELS, type MemberRole } from "../schema";

// List table: rows arrive sorted by `order` asc (the public-page order).
// Search/role filter are client-side — 24 rows, no server round-trips. Rows
// stay grouped by role because that's what the up/down reorder operates on.

export type MemberRow = {
  id: string;
  name: string;
  role: MemberRole;
  position: string;
  email: string | null;
  year: string | null;
  published: boolean;
};

const ROLE_ORDER: MemberRole[] = ["PROFESSOR", "RESEARCHER", "STUDENT", "ALUMNI"];

export default function MembersTable({ members }: { members: MemberRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<MemberRole | "ALL">("ALL");

  // Mutations don't re-render server components on their own — refresh after.
  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  const q = query.trim().toLowerCase();
  const matches = (m: MemberRow) =>
    m.name.toLowerCase().includes(q) || (m.email ?? "").toLowerCase().includes(q);

  // Full per-role groups (for first/last reorder edges), then the search filter
  // for display only — arrows always swap with the true neighbor.
  const groups = ROLE_ORDER.filter((r) => roleFilter === "ALL" || r === roleFilter)
    .map((role) => {
      const all = members.filter((m) => m.role === role);
      return { role, all, visible: q ? all.filter(matches) : all };
    })
    .filter((g) => g.all.length > 0);

  const visibleTotal = groups.reduce((n, g) => n + g.visible.length, 0);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button onClick={() => setRoleFilter("ALL")} className={chipClass(roleFilter === "ALL")}>
          전체 {members.length}
        </button>
        {ROLE_ORDER.map((r) => (
          <button key={r} onClick={() => setRoleFilter(r)} className={chipClass(roleFilter === r)}>
            {ROLE_LABELS[r]} {members.filter((m) => m.role === r).length}
          </button>
        ))}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="이름·이메일 검색"
          className={searchInputClass}
        />
      </div>

      <div className={tableWrapClass}>
        <table className={tableClass}>
          <thead>
            <tr className={theadRowClass}>
              <th className={`w-20 ${thClass}`}>순서</th>
              <th className={thClass}>이름</th>
              <th className={thClass}>직책</th>
              <th className={thClass}>연도</th>
              <th className={thClass}>이메일</th>
              <th className={thClass}>공개</th>
              <th className={thClass}>관리</th>
            </tr>
          </thead>
          <tbody>
            {visibleTotal === 0 && (
              <tr>
                <td colSpan={7} className={emptyCellClass}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
            {groups.map((g) => (
              <Fragment key={g.role}>
                {g.visible.length > 0 && (
                  <tr className={groupRowClass}>
                    <td colSpan={7} className={groupCellClass}>
                      {ROLE_LABELS[g.role]} · {g.all.length}명
                    </td>
                  </tr>
                )}
                {g.visible.map((m) => {
                  const idx = g.all.indexOf(m);
                  return (
                    <tr key={m.id} className={rowClass}>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1">
                          <button
                            onClick={() => run(() => moveMember(m.id, "up"))}
                            disabled={isPending || idx === 0}
                            className={iconBtnClass}
                            aria-label={`${m.name} 위로 이동`}
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => run(() => moveMember(m.id, "down"))}
                            disabled={isPending || idx === g.all.length - 1}
                            className={iconBtnClass}
                            aria-label={`${m.name} 아래로 이동`}
                          >
                            ↓
                          </button>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 font-medium text-ink">
                        {m.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-ink-2">{m.position}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-ink-3">
                        {m.year ?? "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-ink-3">
                        {m.email ?? "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        <button
                          onClick={() => run(() => toggleMemberPublished(m.id))}
                          disabled={isPending}
                          className={publishedBtnClass(m.published)}
                        >
                          {m.published ? "공개" : "비공개"}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <Link href={`/admin/members/${m.id}`} className={editLinkClass}>
                          수정
                        </Link>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `'${m.name}' 멤버를 삭제할까요? 되돌릴 수 없습니다.`,
                              )
                            ) {
                              run(() => deleteMember(m.id));
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
