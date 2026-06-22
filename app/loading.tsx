import Container from "@/components/ui/Container";

// Suspense fallback shown while a route's async server components fetch data.
// Every public/admin route is force-dynamic and runs Prisma per request, so this
// is actually visible on navigations — not a fake flash. Kept deliberately
// neutral (a few pulsing blocks, not a per-page bespoke skeleton) so it reads
// fine wherever it appears and never implies a specific layout. Renders inside
// the root layout, so globals.css + fonts are inherited — plain Tailwind is fine.
// It supplies its own <main> + (sr-only) <h1> because it fully replaces the page
// for the duration of the wait, keeping the transient document axe-clean
// (landmark-one-main + page-has-heading-one) without ever colliding with the real
// page's landmarks. Skeleton blocks are non-text + aria-hidden, so the AA
// contrast rule does not apply (soft `line`/`bg` tones are safe).
export default function Loading() {
  return (
    <main
      aria-busy="true"
      className="bg-bg pt-[150px] pb-[120px] max-[640px]:pt-[120px] max-[640px]:pb-20"
    >
      <Container>
        <h1 className="sr-only">페이지를 불러오는 중입니다.</h1>
        <div role="status" aria-label="로딩 중" className="max-w-[640px] animate-pulse">
          <div className="h-3.5 w-28 rounded-full bg-line" aria-hidden="true" />
          <div className="mt-6 h-12 w-3/4 rounded-2xl bg-line" aria-hidden="true" />
          <div className="mt-8 space-y-3" aria-hidden="true">
            <div className="h-4 w-full rounded-full bg-line/70" />
            <div className="h-4 w-11/12 rounded-full bg-line/70" />
            <div className="h-4 w-2/3 rounded-full bg-line/70" />
          </div>
        </div>
      </Container>
    </main>
  );
}
