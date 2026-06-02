import Container from "@/components/ui/Container";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { prisma } from "@/lib/db";

// Render per request so admin edits show up immediately (no rebuild needed).
export const dynamic = "force-dynamic";

// ─── Types ───────────────────────────────────────────────────────────────────

type Project = {
  title: string;
  institution: string;
  period: string;
  scale: string;
};

type Status = "active" | "completed";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const pad2 = (n: number) => String(n).padStart(2, "0");

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusPill({ status }: { status: Status }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center self-start whitespace-nowrap rounded-full border border-accent/20 bg-accent-soft px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center self-start whitespace-nowrap rounded-full border border-ajou-silver/40 bg-transparent px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ajou-silver">
      Completed
    </span>
  );
}

function ProjectCard({
  project,
  status,
}: {
  project: Project;
  status: Status;
}) {
  return (
    <article className="group reveal flex flex-col rounded-[18px] border border-line bg-surface p-7 max-[640px]:p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-[0_24px_50px_-25px_rgba(0,102,255,.25)]">
      <StatusPill status={status} />
      <h3 className="mt-4 text-[clamp(18px,1.6vw,22px)] font-semibold tracking-[-0.015em] text-ink leading-[1.4]">
        {project.title}
      </h3>
      <div className="mt-5 mb-5 h-px bg-line" />
      <dl className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-3 items-baseline max-[640px]:grid-cols-1 max-[640px]:gap-y-1 max-[640px]:[&>dt]:mt-3 max-[640px]:[&>dt:first-child]:mt-0">
        <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
          Institution
        </dt>
        <dd className="text-[15px] leading-[1.55] text-ink-2">
          {project.institution}
        </dd>
        <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
          Period
        </dt>
        <dd className="font-mono text-[14px] leading-[1.55] text-ink-2 tracking-[0.01em]">
          {project.period}
        </dd>
        <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
          Scale
        </dt>
        <dd className="font-mono text-[15px] leading-[1.55] text-ink tracking-[0.01em]">
          {project.scale}
        </dd>
      </dl>
    </article>
  );
}

function SectionHeader({
  index,
  label,
  title,
}: {
  index: string;
  label: string;
  title: string;
}) {
  return (
    <div className="wo-cell mb-16 reveal">
      <div className="mb-3.5 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
        <span className="font-mono">
          {index} — {label}
        </span>
      </div>
      <h2 className="text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-[-0.03em] text-ink">
        {title}
      </h2>
      <div className="wo-rule" />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ProjectsPage() {
  const rows = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  const toView = (p: (typeof rows)[number]): Project => ({
    title: p.title,
    institution: p.institution,
    period: p.period,
    scale: p.scale ?? "—",
  });

  const IN_PROGRESS = rows.filter((p) => p.status === "ACTIVE").map(toView);
  const PREVIOUS = rows.filter((p) => p.status === "COMPLETED").map(toView);

  return (
    <main>
      {/* ── Hero ── */}
      <header className="relative bg-white pt-[152px] pb-[80px]">
        <Container>
          <div className="grid grid-cols-[1.4fr_1fr] items-end gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-10">
            <div className="reveal">
              <div className="mb-3.5 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
                <span className="font-mono">Projects</span>
              </div>
              <h1
                className="font-bold leading-[1.02] tracking-[-0.035em] text-ink"
                style={{ fontSize: "clamp(40px,5.5vw,76px)" }}
              >
                Funded research,
                <br />
                in flight and shipped.
              </h1>
              <p className="mt-7 max-w-[560px] text-[17px] leading-[1.7] text-ink-2">
                A snapshot of the grants currently driving the lab&apos;s experimental work, alongside completed contracts that produced the apparatus, surfaces, and devices we still build on.
              </p>
            </div>

            <div className="reveal flex flex-col gap-3 max-[900px]:flex-row max-[900px]:flex-wrap max-[900px]:gap-x-8 max-[900px]:gap-y-3">
              <div className="flex items-baseline gap-3 border-t border-line pt-3 max-[900px]:border-0 max-[900px]:pt-0">
                <span className="font-mono text-[13px] font-medium text-accent">
                  {pad2(IN_PROGRESS.length)}
                </span>
                <span className="text-[13px] uppercase tracking-[0.14em] text-ink-3">
                  In Progress
                </span>
              </div>
              <div className="flex items-baseline gap-3 border-t border-line pt-3 max-[900px]:border-0 max-[900px]:pt-0">
                <span className="font-mono text-[13px] font-medium text-ink-2">
                  {pad2(PREVIOUS.length)}
                </span>
                <span className="text-[13px] uppercase tracking-[0.14em] text-ink-3">
                  Completed
                </span>
              </div>
              <div className="flex items-baseline gap-3 border-t border-line pt-3 max-[900px]:border-0 max-[900px]:pt-0">
                <span className="font-mono text-[13px] font-medium text-ink-2">
                  ₩20B+
                </span>
                <span className="text-[13px] uppercase tracking-[0.14em] text-ink-3">
                  Cumulative
                </span>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* ── In Progress ── */}
      <section
        id="in-progress"
        className="relative bg-white py-[120px] max-[640px]:py-20"
      >
        <Container>
          <SectionHeader index="01" label="Active" title="In Progress" />
          <div className="grid grid-cols-2 gap-6 max-[820px]:grid-cols-1">
            {IN_PROGRESS.map((p) => (
              <ProjectCard key={p.title} project={p} status="active" />
            ))}
          </div>
        </Container>
      </section>

      {/* ── Previous ── */}
      <section
        id="previous"
        className="relative bg-bg py-[120px] max-[640px]:py-20"
      >
        <Container>
          <SectionHeader index="02" label="Completed" title="Previous" />
          <div className="grid grid-cols-2 gap-6 max-[820px]:grid-cols-1">
            {PREVIOUS.map((p) => (
              <ProjectCard key={p.title} project={p} status="completed" />
            ))}
          </div>
        </Container>
      </section>

      <RevealOnScroll />
    </main>
  );
}
