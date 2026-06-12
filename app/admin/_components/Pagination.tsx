import Link from "next/link";

// Server-rendered pager shared by admin lists that outgrow one page (activity
// now, Publications in 7-4). Plain query-string links — every admin page is
// force-dynamic, so navigating re-fetches fresh rows.

// Exported for client-side pagers (PublicationsTable pages an in-memory
// filtered list, so it uses buttons + useState instead of ?page= links) —
// same visual tone, one source of truth.
export const pagerBtnClass =
  "rounded-xl border border-line bg-surface px-3.5 py-2 text-sm font-medium text-ink-2 transition hover:border-accent/30 hover:text-accent";
export const pagerDisabledClass =
  "rounded-xl border border-line bg-surface px-3.5 py-2 text-sm font-medium text-ink-3/50";

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

  return (
    <nav className="mt-6 flex items-center justify-center gap-4">
      {page > 1 ? (
        <Link href={`${basePath}?page=${page - 1}`} className={pagerBtnClass}>
          ← 이전
        </Link>
      ) : (
        <span className={pagerDisabledClass}>← 이전</span>
      )}
      <span className="text-sm text-ink-3">
        {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={`${basePath}?page=${page + 1}`} className={pagerBtnClass}>
          다음 →
        </Link>
      ) : (
        <span className={pagerDisabledClass}>다음 →</span>
      )}
    </nav>
  );
}
