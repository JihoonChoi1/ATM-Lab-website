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
// Arrows swap with the global neighbor (no grouping). "관리" opens the topic
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
            <th className={`w-20 ${thClass}`}>순서</th>
            <th className={thClass}>번호</th>
            <th className={thClass}>제목</th>
            <th className={thClass}>서브섹션</th>
            <th className={thClass}>공개</th>
            <th className={thClass}>관리</th>
          </tr>
        </thead>
        <tbody>
          {topics.length === 0 && (
            <tr>
              <td colSpan={6} className={emptyCellClass}>
                토픽이 없습니다.
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
                    aria-label={`${t.title} 위로 이동`}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => run(() => moveTopic(t.id, "down"))}
                    disabled={isPending || idx === topics.length - 1}
                    className={iconBtnClass}
                    aria-label={`${t.title} 아래로 이동`}
                  >
                    ↓
                  </button>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-ink-3">
                {t.num}
              </td>
              <td className="min-w-[260px] px-4 py-2.5 font-medium text-ink">{t.title}</td>
              <td className="whitespace-nowrap px-4 py-2.5 text-ink-2">{t.subCount}개</td>
              <td className="px-4 py-2.5">
                <button
                  onClick={() => run(() => toggleTopicPublished(t.id))}
                  disabled={isPending}
                  className={publishedBtnClass(t.published)}
                >
                  {t.published ? "공개" : "비공개"}
                </button>
              </td>
              <td className="whitespace-nowrap px-4 py-2.5">
                <Link href={`/admin/research/${t.id}`} className={editLinkClass}>
                  관리
                </Link>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `'${t.title}' 토픽을 삭제할까요? 하위 서브섹션과 그림도 함께 삭제됩니다. 90일 내 최근 활동에서 복원할 수 있습니다.`,
                      )
                    ) {
                      run(() => deleteTopic(t.id));
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
