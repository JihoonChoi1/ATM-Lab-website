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
// with the neighbor within the same topic. "관리" opens the subsection detail
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
            <th className={`w-20 ${thClass}`}>순서</th>
            <th className={thClass}>번호</th>
            <th className={thClass}>제목</th>
            <th className={thClass}>그림</th>
            <th className={thClass}>공개</th>
            <th className={thClass}>관리</th>
          </tr>
        </thead>
        <tbody>
          {subsections.length === 0 && (
            <tr>
              <td colSpan={6} className={emptyCellClass}>
                서브섹션이 없습니다.
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
                    aria-label={`${s.title} 위로 이동`}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => run(() => moveSubsection(s.id, "down"))}
                    disabled={isPending || idx === subsections.length - 1}
                    className={iconBtnClass}
                    aria-label={`${s.title} 아래로 이동`}
                  >
                    ↓
                  </button>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-ink-3">
                {s.num}
              </td>
              <td className="min-w-[260px] px-4 py-2.5 font-medium text-ink">{s.title}</td>
              <td className="whitespace-nowrap px-4 py-2.5 text-ink-2">{s.figCount}장</td>
              <td className="px-4 py-2.5">
                <button
                  onClick={() => run(() => toggleSubsectionPublished(s.id))}
                  disabled={isPending}
                  className={publishedBtnClass(s.published)}
                >
                  {s.published ? "공개" : "비공개"}
                </button>
              </td>
              <td className="whitespace-nowrap px-4 py-2.5">
                <Link
                  href={`/admin/research/${topicId}/${s.id}`}
                  className={editLinkClass}
                >
                  관리
                </Link>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `'${s.title}' 서브섹션을 삭제할까요? 하위 그림도 함께 삭제됩니다. 90일 내 최근 활동에서 복원할 수 있습니다.`,
                      )
                    ) {
                      run(() => deleteSubsection(s.id));
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
