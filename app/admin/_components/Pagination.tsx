import Link from "next/link";

// Server-rendered pager shared by admin lists that outgrow one page (activity
// now, Publications in 7-4). Plain query-string links — every admin page is
// force-dynamic, so navigating re-fetches fresh rows.
export default function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const btnClass =
    "rounded-xl border border-line bg-surface px-3.5 py-2 text-sm font-medium text-ink-2 transition hover:border-accent/30 hover:text-accent";
  const disabledClass =
    "rounded-xl border border-line bg-surface px-3.5 py-2 text-sm font-medium text-ink-3/50";

  return (
    <nav className="mt-6 flex items-center justify-center gap-4">
      {page > 1 ? (
        <Link href={`${basePath}?page=${page - 1}`} className={btnClass}>
          ← 이전
        </Link>
      ) : (
        <span className={disabledClass}>← 이전</span>
      )}
      <span className="text-sm text-ink-3">
        {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={`${basePath}?page=${page + 1}`} className={btnClass}>
          다음 →
        </Link>
      ) : (
        <span className={disabledClass}>다음 →</span>
      )}
    </nav>
  );
}
