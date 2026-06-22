"use client";

import Link from "next/link";

// Admin-scoped error boundary. Without it, an admin page throw would bubble to
// the root app/error.tsx — but that renders chrome-less under /admin (SiteChrome
// hides the public nav/footer there and admin/layout would be unmounted too),
// leaving a bare page. Sitting below admin/layout.tsx, this boundary keeps the
// admin sidebar shell intact and swaps only the content area. It renders inside
// admin/layout's <main>, so it must NOT add its own <main> (avoids a second
// landmark). Error boundaries only render in production (dev shows the overlay).
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-[640px]">
      <p className="font-mono text-[13px] font-medium uppercase tracking-[0.18em] text-accent-dark">
        Error
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-ink">
        문제가 발생했습니다
      </h1>
      <p className="mt-4 text-[15px] leading-[1.7] text-ink-2">
        요청을 처리하는 중 예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해
        주세요.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          다시 시도
        </button>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-accent-dark transition-colors hover:border-accent hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          대시보드로 <span aria-hidden="true">→</span>
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 font-mono text-[12px] text-ink-3">
          오류 코드: {error.digest}
        </p>
      )}
    </div>
  );
}
