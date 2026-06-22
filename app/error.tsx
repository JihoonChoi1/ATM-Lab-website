"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";

// Segment error boundary for the public/root tree. Unlike global-error.tsx (the
// last-resort fallback that replaces the root layout itself), this renders INSIDE
// the root layout's SiteChrome, so the Navbar + Footer survive and only the
// content area is swapped for this state. That means globals.css and the
// next/font faces are inherited normally — use plain Tailwind here (do NOT copy
// global-error's inline-style workaround). It supplies its own <main>/<h1> since
// SiteChrome renders no landmark of its own (keeps axe landmark-one-main happy).
// Error boundaries only render in production — `next dev` shows the dev overlay.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="bg-bg">
      <section className="flex min-h-[68vh] items-center pt-[150px] pb-[120px] max-[640px]:pt-[120px] max-[640px]:pb-20">
        <Container>
          <div className="max-w-[640px]">
            <p className="font-mono text-[13px] font-medium uppercase tracking-[0.18em] text-accent-dark">
              Error
            </p>
            <h1
              lang="ko"
              className="mt-5 font-bold leading-[1.1] tracking-[-0.03em] text-ink text-[clamp(40px,7vw,76px)]"
            >
              문제가&nbsp;발생했습니다
            </h1>
            <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.7] text-ink-2 max-[640px]:text-base">
              페이지를 표시하는 중 예기치 못한 오류가 발생했습니다. 잠시 후 다시
              시도해 주세요. Something went wrong while loading this page.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                다시 시도
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-6 py-3 text-[14px] font-medium text-accent-dark transition-colors hover:border-accent hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                홈으로 <span aria-hidden="true">→</span>
              </Link>
            </div>
            {error.digest && (
              <p className="mt-7 font-mono text-[12px] text-ink-3">
                오류 코드: {error.digest}
              </p>
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}
