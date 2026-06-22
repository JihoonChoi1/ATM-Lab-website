import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다 (404) · ATM Lab",
};

// Render per request like every other route so the per-request CSP nonce
// (middleware) matches the served HTML — a build-time pre-rendered 404 would
// bake a stale nonce and trip the strict-dynamic policy. Renders inside the root
// layout's SiteChrome (Navbar + Footer), so visitors keep full navigation.
export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <main className="bg-bg">
      <section className="flex min-h-[68vh] items-center pt-[150px] pb-[120px] max-[640px]:pt-[120px] max-[640px]:pb-20">
        <Container>
          <div className="max-w-[640px]">
            <p className="font-mono text-[13px] font-medium uppercase tracking-[0.18em] text-accent-dark">
              Error 404
            </p>
            <h1
              lang="ko"
              className="mt-5 font-bold leading-[1.1] tracking-[-0.03em] text-ink text-[clamp(40px,7vw,76px)]"
            >
              페이지를 찾을 수&nbsp;없습니다
            </h1>
            <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.7] text-ink-2 max-[640px]:text-base">
              요청하신 주소가 변경되었거나 더 이상 존재하지 않습니다. 주소를 다시
              확인해 주세요. The page you&rsquo;re looking for doesn&rsquo;t exist
              or may have moved.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <Link
                href="/"
                className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                홈으로 돌아가기
              </Link>
              <Link
                href="/board"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-6 py-3 text-[14px] font-medium text-accent-dark transition-colors hover:border-accent hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                소식 보기 <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
