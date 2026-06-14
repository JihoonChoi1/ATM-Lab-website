import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import { prisma } from "@/lib/db";
import { imageSize } from "@/lib/thumbnail";

// Render per request so admin edits show up immediately (no rebuild needed).
export const dynamic = "force-dynamic";

const TYPE_LABEL = {
  JOURNAL: "Journals",
  CONFERENCE: "Conferences",
  PATENT: "Selected Patents",
} as const;

// One detail field. Values come straight from the DB — nothing is fabricated.
type Field = {
  label: string;
  value: string;
  italic?: boolean; // journal / conference names
  mono?: boolean; // identifiers, dates, years
  href?: string; // external link (journal DOI)
};

type Pub = NonNullable<Awaited<ReturnType<typeof prisma.publication.findUnique>>>;

function buildFields(pub: Pub): Field[] {
  if (pub.type === "JOURNAL") {
    const fields: Field[] = [
      { label: "Journal", value: pub.journal ?? "—", italic: true },
      { label: "Author", value: pub.authors ?? "—" },
      { label: "Year", value: pub.year, mono: true },
    ];
    if (pub.doi) fields.push({ label: "Link", value: pub.doi, href: pub.doi });
    return fields;
  }
  if (pub.type === "CONFERENCE") {
    return [
      { label: "Author", value: pub.authors ?? "—" },
      { label: "Conference", value: pub.conference ?? "—", italic: true },
      { label: "Year", value: pub.year, mono: true },
    ];
  }
  // PATENT
  return [
    { label: "Inventors", value: pub.inventors ?? "—" },
    {
      label: "Application / Registration No.",
      value: pub.applicationNo ?? "—",
      mono: true,
    },
    { label: "Country", value: pub.country ?? "—" },
    {
      label: "Filing / Registration Date",
      value: pub.registeredAt ?? "—",
      mono: true,
    },
    { label: "Year", value: pub.year, mono: true },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const pub = await prisma.publication.findUnique({
    where: { id: params.id },
    select: { title: true },
  });
  return { title: pub ? `${pub.title} — ATM Lab` : "Publication — ATM Lab" };
}

export default async function PublicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const pub = await prisma.publication.findUnique({
    where: { id: params.id },
  });
  if (!pub || !pub.published) notFound();

  const eyebrow = TYPE_LABEL[pub.type];
  const fields = buildFields(pub);
  const isJournal = pub.type === "JOURNAL";
  // Detail view serves the original cover; read its dimensions for CLS-safe
  // width/height (no stored dim columns).
  const dims = pub.imgPath ? await imageSize(pub.imgPath) : null;

  return (
    <main>
      {/* ── Header ── */}
      <header className="bg-white pt-[150px] pb-[60px] max-[640px]:pt-[120px] max-[640px]:pb-10">
        <Container>
          <div className="max-w-[860px]">
            <Link
              href="/publications"
              className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-3 transition-colors hover:text-accent"
            >
              <span aria-hidden="true">←</span> Publications
            </Link>

            <div className="mt-8 mb-4 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
              {eyebrow}
            </div>

            <h1 className="font-bold leading-[1.18] tracking-[-0.02em] text-ink text-[clamp(26px,3.4vw,42px)]">
              {isJournal || pub.type === "CONFERENCE"
                ? `“${pub.title}”`
                : pub.title}
            </h1>

            <div className="wo-rule mt-8" />
          </div>
        </Container>
      </header>

      {/* ── Details ── */}
      <section className="bg-bg pt-12 pb-[120px] max-[640px]:pt-8 max-[640px]:pb-20">
        <Container>
          <div
            className={
              isJournal
                ? "max-w-[860px] grid grid-cols-[180px_1fr] gap-10 max-[640px]:grid-cols-1 max-[640px]:gap-7"
                : "max-w-[860px]"
            }
          >
            {isJournal ? (
              <div className="max-[640px]:max-w-[180px]">
                {pub.imgPath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={pub.imgPath}
                    alt=""
                    width={dims?.width}
                    height={dims?.height}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full rounded-[12px] border border-line object-cover"
                  />
                ) : (
                  <div className="fig-placeholder aspect-[3/4] w-full rounded-[12px] border border-line" />
                )}
              </div>
            ) : null}

            <dl className="grid grid-cols-[180px_1fr] gap-x-6 gap-y-6 max-[640px]:grid-cols-1 max-[640px]:gap-y-1">
              {fields.map((f) => (
                <Fragment key={f.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 pt-1 max-[640px]:mt-4 max-[640px]:first:mt-0">
                    {f.label}
                  </dt>
                  <dd
                    className={`leading-[1.6] text-ink-2 ${
                      f.mono
                        ? "font-mono text-[14px] tracking-[0.01em]"
                        : f.italic
                        ? "text-[16px] italic"
                        : "text-[15px]"
                    }`}
                  >
                    {f.href ? (
                      <a
                        href={f.href}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center gap-1.5 text-accent break-all hover:underline"
                      >
                        {f.value}
                        <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      f.value
                    )}
                  </dd>
                </Fragment>
              ))}
            </dl>
          </div>
        </Container>
      </section>
    </main>
  );
}
