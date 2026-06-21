import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import { prisma } from "@/lib/db";
import { optimizeBodyImages } from "@/lib/thumbnail";

// Render per request so admin edits show up immediately (no rebuild needed).
export const dynamic = "force-dynamic";

const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const item = await prisma.news.findUnique({
    where: { id: params.id },
    select: { title: true },
  });
  return { title: item ? `${item.title} — ATM Lab` : "News — ATM Lab" };
}

export default async function NewsDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await prisma.news.findUnique({ where: { id: params.id } });
  if (!item || !item.published) notFound();

  return (
    <main>
      {/* ── Header ── */}
      <header className="bg-white pt-[150px] pb-[56px] max-[640px]:pt-[120px] max-[640px]:pb-10">
        <Container>
          <div className="max-w-[920px]">
            <Link
              href="/board#section-news"
              className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-3 transition-colors hover:text-accent"
            >
              <span aria-hidden="true">←</span> News
            </Link>

            <div className="mt-8 mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
              News
              <span className="font-mono text-ink-3">{fmtDate(item.date)}</span>
            </div>

            <h1
              lang="ko"
              className="font-bold leading-[1.3] tracking-[-0.02em] text-ink text-[clamp(24px,3vw,38px)]"
            >
              {item.title}
            </h1>

            <div className="wo-rule mt-8" />
          </div>
        </Container>
      </header>

      {/* ── Body ── */}
      <section className="bg-bg pt-12 pb-[120px] max-[640px]:pt-8 max-[640px]:pb-20">
        <Container>
          {item.content ? (
            <div
              lang="ko"
              className="news-body max-w-[920px] break-words text-[17px] leading-[1.8] text-ink-2
                [&_p]:my-[1.1em]
                [&_ul]:my-[1.1em] [&_ul]:list-disc [&_ul]:pl-[1.5em]
                [&_ol]:my-[1.1em] [&_ol]:list-decimal [&_ol]:pl-[1.5em]
                [&_li]:my-[0.35em] [&_li>p]:my-0
                [&_img]:my-7 [&_img]:mx-auto [&_img]:block [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-[12px] [&_img]:border [&_img]:border-line
                [&_a]:text-accent [&_a]:underline
                [&_strong]:font-semibold [&_strong]:text-ink"
              dangerouslySetInnerHTML={{ __html: optimizeBodyImages(item.content) }}
            />
          ) : (
            <p className="max-w-[920px] text-[15px] italic text-ink-3">
              No content.
            </p>
          )}
        </Container>
      </section>
    </main>
  );
}
