// Admin-scoped Suspense fallback. Mirrors app/admin/error.tsx's reasoning: the
// root loading.tsx sits above admin/layout, so without this the admin sidebar is
// dropped while a page's data loads. Co-located here, the boundary renders inside
// admin/layout's <main>, keeping the sidebar shell intact during loads — the
// transient-state twin of admin/error.tsx. It must NOT add its own <main> (the
// admin layout already provides one). An sr-only <h1> keeps the transient
// document axe-clean (page-has-heading-one); skeleton blocks are non-text +
// aria-hidden, so the AA contrast rule does not apply.
export default function AdminLoading() {
  return (
    <div aria-busy="true" className="mx-auto w-full max-w-[1000px]">
      <h1 className="sr-only">불러오는 중입니다.</h1>
      <div role="status" aria-label="로딩 중" className="animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-line" aria-hidden="true" />
        <div className="mt-7 space-y-3" aria-hidden="true">
          <div className="h-12 w-full rounded-xl bg-line/70" />
          <div className="h-12 w-full rounded-xl bg-line/70" />
          <div className="h-12 w-full rounded-xl bg-line/70" />
        </div>
      </div>
    </div>
  );
}
