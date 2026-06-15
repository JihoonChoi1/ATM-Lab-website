"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Thumb from "@/components/ui/Thumb";
import {
  deleteBtnClass,
  editLinkClass,
  emptyCellClass,
  iconBtnClass,
  rowClass,
  tableClass,
  tableWrapClass,
  thClass,
  theadRowClass,
} from "@/app/admin/_components/table-ui";
import { deleteFigure, moveFigure } from "../actions";

// Figure list for one subsection: rows arrive sorted by order asc — the order
// the public column stacks them (and feeds portrait-pair detection). Arrows
// swap within the subsection. Figures have no published flag.

export type FigureRow = {
  id: string;
  imgPath: string | null;
  caption: string;
  width: number;
  height: number;
};

export default function FigureTable({
  topicId,
  subsectionId,
  figures,
}: {
  topicId: string;
  subsectionId: string;
  figures: FigureRow[];
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
            <th className={thClass}>이미지</th>
            <th className={thClass}>캡션</th>
            <th className={thClass}>크기</th>
            <th className={thClass}>관리</th>
          </tr>
        </thead>
        <tbody>
          {figures.length === 0 && (
            <tr>
              <td colSpan={5} className={emptyCellClass}>
                그림이 없습니다.
              </td>
            </tr>
          )}
          {figures.map((f, idx) => (
            <tr key={f.id} className={rowClass}>
              <td className="px-4 py-2.5">
                <div className="flex gap-1">
                  <button
                    onClick={() => run(() => moveFigure(f.id, "up"))}
                    disabled={isPending || idx === 0}
                    className={iconBtnClass}
                    aria-label="위로 이동"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => run(() => moveFigure(f.id, "down"))}
                    disabled={isPending || idx === figures.length - 1}
                    className={iconBtnClass}
                    aria-label="아래로 이동"
                  >
                    ↓
                  </button>
                </div>
              </td>
              <td className="px-4 py-2.5">
                {f.imgPath ? (
                  <Thumb
                    src={f.imgPath}
                    alt=""
                    className="h-12 w-16 rounded-md border border-line object-cover"
                  />
                ) : (
                  <span className="text-xs text-ink-3">자리표시</span>
                )}
              </td>
              <td className="min-w-[280px] px-4 py-2.5 text-ink">{f.caption}</td>
              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-ink-3">
                {f.width}×{f.height}
              </td>
              <td className="whitespace-nowrap px-4 py-2.5">
                <Link
                  href={`/admin/research/${topicId}/${subsectionId}/${f.id}`}
                  className={editLinkClass}
                >
                  수정
                </Link>
                <button
                  onClick={() => {
                    if (window.confirm("이 그림을 삭제할까요? 되돌릴 수 없습니다.")) {
                      run(() => deleteFigure(f.id));
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
