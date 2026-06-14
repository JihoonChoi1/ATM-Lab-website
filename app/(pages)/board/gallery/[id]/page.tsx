import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import { prisma } from "@/lib/db";
import { imageSize } from "@/lib/thumbnail";

// Render per request so admin edits show up immediately (no rebuild needed).
export const dynamic = "force-dynamic";

const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const item = await prisma.galleryItem.findUnique({
    where: { id: params.id },
    select: { title: true },
  });
  return { title: item ? `${item.title} — ATM Lab` : "Gallery — ATM Lab" };
}

export default async function GalleryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await prisma.galleryItem.findUnique({ where: { id: params.id } });
  if (!item || !item.published) notFound();

  // Detail view serves the original (full quality). Read its dimensions so the
  // <img> reserves space and never shifts layout on load (no stored dim columns).
  const dims = item.imgPath ? await imageSize(item.imgPath) : null;

  return (
    <main>
      {/* ── Header ── */}
      <header className="bg-white pt-[150px] pb-[56px] max-[640px]:pt-[120px] max-[640px]:pb-10">
        <Container>
          <div className="max-w-[860px]">
            <Link
              href="/board#section-gallery"
              className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-3 transition-colors hover:text-accent"
            >
              <span aria-hidden="true">←</span> Gallery
            </Link>

            <div className="mt-8 mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
              Gallery
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

      {/* ── Photo ── */}
      <section className="bg-bg pt-12 pb-[120px] max-[640px]:pt-8 max-[640px]:pb-20">
        <Container>
          <div className="max-w-[860px]">
            {item.imgPath ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imgPath}
                alt={item.title}
                width={dims?.width}
                height={dims?.height}
                loading="lazy"
                decoding="async"
                className="h-auto w-full rounded-[16px] border border-line bg-surface"
              />
            ) : (
              <div className="fig-placeholder aspect-[4/3] w-full rounded-[16px] border border-line" />
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}
