import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import { prisma } from "@/lib/db";
import { bestDetailSrc } from "@/lib/thumbnail";

// Render per request so admin edits show up immediately (no rebuild needed).
export const dynamic = "force-dynamic";

type Member = NonNullable<Awaited<ReturnType<typeof prisma.member.findUnique>>>;

// Professor-only structured JSON (shapes documented in prisma/schema.prisma).
type Entry = { period: string; title: string; inst: string };
type LectureSubject = { title: string; code: string };
type ResearchFieldGroup = {
  group: string;
  items: { label: string; subs: string[] }[];
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const member = await prisma.member.findUnique({
    where: { id: params.id },
    select: { name: true },
  });
  return { title: member ? `${member.name} — ATM Lab` : "Member — ATM Lab" };
}

function DefinitionList({ items }: { items: Entry[] }) {
  return (
    <ul className="flex flex-col">
      {items.map((it, i) => (
        <li key={i} className="grid grid-cols-[120px_1fr] items-baseline gap-6 border-t border-line py-4 last:border-b max-[640px]:grid-cols-1 max-[640px]:gap-1">
          <span className="font-mono text-[12.5px] tracking-[0.04em] text-ink-3">{it.period}</span>
          <span className="text-[15.5px] leading-[1.55]">
            <b className="font-semibold text-ink">{it.title}</b>
            {it.inst && <span className="text-ink-3">, {it.inst}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ProfessorBody({ member }: { member: Member }) {
  const education = (member.education as unknown as Entry[] | null) ?? [];
  const workHistory = (member.workHistory as unknown as Entry[] | null) ?? [];
  const researchFields =
    (member.researchFields as unknown as ResearchFieldGroup[] | null) ?? [];
  const lectureSubjects =
    (member.lectureSubjects as unknown as LectureSubject[] | null) ?? [];

  return (
    <div className="grid grid-cols-[0.9fr_1.4fr] items-start gap-14 max-[980px]:grid-cols-1 max-[980px]:gap-10">
      {/* Portrait card */}
      <div
        className="group relative overflow-hidden rounded-[24px] text-white min-[981px]:sticky min-[981px]:top-[96px]"
        style={{ aspectRatio: "4/5", background: "#000D40", boxShadow: "0 30px 60px -25px rgba(0,0,0,.3)" }}
      >
        {/* Above the fold — eager + high priority so the portrait doesn't pop
            in after the text (lazy defers the fetch until after layout). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.imgPath ? bestDetailSrc(member.imgPath) : "/professor.png"}
          alt={`Portrait of ${member.name}`}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,15,40,.85) 75%, rgba(0,15,40,.95) 100%), linear-gradient(135deg, rgba(0,102,255,.35) 0%, transparent 60%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <span className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.15] px-3 py-[5px] text-[11.5px] font-medium tracking-[0.04em] backdrop-blur-[10px]">
            PRINCIPAL INVESTIGATOR
          </span>
          <h3 className="mb-1 text-[30px] font-bold leading-[1.1] tracking-[-0.02em]">Prof. Jungho Lee</h3>
          <div className="mb-1 text-[13px] text-white/55">Ph.D. POSTECH · 1999</div>
          <div className="text-[14px] text-white/75">Department of Mechanical Engineering · Ajou University</div>
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex flex-col gap-10">
        {/* Education */}
        <div>
          <div className="mb-2 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[14px] before:bg-accent before:content-['']">
            Education
          </div>
          <h3 className="mb-5 text-[22px] font-semibold tracking-[-0.015em]">Education</h3>
          <DefinitionList items={education} />
        </div>

        {/* Work Experience */}
        <div className="border-t border-line pt-10">
          <div className="mb-2 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[14px] before:bg-accent before:content-['']">
            Work Experience
          </div>
          <h3 className="mb-5 text-[22px] font-semibold tracking-[-0.015em]">Work Experience</h3>
          <DefinitionList items={workHistory} />
        </div>

        {/* Research Field */}
        <div className="border-t border-line pt-10">
          <div className="mb-2 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[14px] before:bg-accent before:content-['']">
            Research Field
          </div>
          <h3 className="mb-5 text-[22px] font-semibold tracking-[-0.015em]">Research Field</h3>
          <div className="flex flex-col gap-7">
            {researchFields.map((g, gi) => (
              <div key={g.group} className={gi > 0 ? "border-t border-line pt-6" : ""}>
                <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
                  {g.group}
                </div>
                <ul className="flex flex-col gap-4">
                  {g.items.map((it) => (
                    <li key={it.label}>
                      <div className="flex items-start gap-2.5">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                        <span className="text-[15px] font-medium leading-[1.5] text-ink">
                          {it.label}
                        </span>
                      </div>
                      {it.subs.length > 0 && (
                        <div className="ml-4 mt-2.5 flex flex-wrap gap-2">
                          {it.subs.map((s) => (
                            <span key={s} className="rounded-[8px] border border-line bg-white px-3 py-1.5 text-[13px] text-ink-2 transition-colors duration-200 hover:border-accent/30 hover:bg-accent-soft hover:text-accent">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Lecture Subject */}
        <div className="border-t border-line pt-10">
          <div className="mb-2 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[14px] before:bg-accent before:content-['']">
            Lecture Subject
          </div>
          <h3 className="mb-5 text-[22px] font-semibold tracking-[-0.015em]">Lecture Subject</h3>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 max-[640px]:grid-cols-1">
            {lectureSubjects.map((l) => (
              <li key={l.title} className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
                <span className="text-[15px] font-medium tracking-[-0.005em] text-ink">{l.title}</span>
                {l.code && <span className="font-mono text-[12px] tracking-[0.04em] text-ink-3">{l.code}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PersonBody({ member }: { member: Member }) {
  return (
    <div className="max-w-[860px] grid grid-cols-[240px_1fr] gap-10 max-[640px]:grid-cols-1 max-[640px]:gap-7">
      <div className="max-[640px]:max-w-[240px]">
        {member.imgPath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bestDetailSrc(member.imgPath)}
            alt={`Portrait of ${member.name}`}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="aspect-[3/4] w-full rounded-[12px] border border-line object-cover"
          />
        ) : (
          <div className="fig-placeholder aspect-[3/4] w-full rounded-[12px] border border-line" />
        )}
      </div>

      {/* content-start: the portrait column stretches this dl taller than its
          rows; without it the extra height is distributed between rows (long
          gaps, stretched interest chips). */}
      <dl className="grid grid-cols-[180px_1fr] content-start gap-x-6 gap-y-6 max-[640px]:grid-cols-1 max-[640px]:gap-y-1">
        <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 pt-1 max-[640px]:mt-4 max-[640px]:first:mt-0">
          Position
        </dt>
        <dd className="text-[15px] leading-[1.6] text-ink-2">{member.position}</dd>

        {member.year && (
          <>
            <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 pt-1 max-[640px]:mt-4">
              Year
            </dt>
            <dd className="font-mono text-[14px] leading-[1.6] tracking-[0.01em] text-ink-2">{member.year}</dd>
          </>
        )}

        {member.interests.length > 0 && (
          <>
            <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 pt-1 max-[640px]:mt-4">
              Research Interests
            </dt>
            <dd className="flex flex-wrap gap-1.5">
              {member.interests.map((it) => (
                <span key={it} className="rounded-md bg-accent-soft px-2.5 py-1 text-[12.5px] font-medium text-accent-dark max-w-full break-words">{it}</span>
              ))}
            </dd>
          </>
        )}

        {member.email && (
          <>
            <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 pt-1 max-[640px]:mt-4">
              Email
            </dt>
            <dd className="text-[15px] leading-[1.6]">
              <a href={`mailto:${member.email}`} className="break-all text-accent hover:underline">
                {member.email}
              </a>
            </dd>
          </>
        )}
      </dl>
    </div>
  );
}

export default async function MemberDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const member = await prisma.member.findUnique({ where: { id: params.id } });
  if (!member || !member.published) notFound();

  return (
    <main>
      {/* ── Header ── */}
      <header className="bg-white pt-[150px] pb-[60px] max-[640px]:pt-[120px] max-[640px]:pb-10">
        <Container>
          <div className="max-w-[860px]">
            <Link
              href="/members"
              className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-3 transition-colors hover:text-accent"
            >
              <span aria-hidden="true">←</span> Members
            </Link>

            <div className="mt-8 mb-4 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
              {member.position}
            </div>

            <h1 className="font-bold leading-[1.18] tracking-[-0.02em] text-ink text-[clamp(26px,3.4vw,42px)]">
              {member.name}
            </h1>

            <div className="wo-rule mt-8" />
          </div>
        </Container>
      </header>

      {/* ── Details ── */}
      <section className="bg-bg pt-12 pb-[120px] max-[640px]:pt-8 max-[640px]:pb-20">
        <Container>
          {member.role === "PROFESSOR" ? (
            <ProfessorBody member={member} />
          ) : (
            <PersonBody member={member} />
          )}
        </Container>
      </section>
    </main>
  );
}
