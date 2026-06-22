"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import Thumb from "@/components/ui/Thumb";

// ─── Types ───────────────────────────────────────────────────────────────────

type Entry = { period: string; title: string; inst: string };
type LectureSubject = { title: string; code: string };
export type ResearchFieldItem = { label: string; subs: string[] };
export type ResearchFieldGroup = { group: string; items: ResearchFieldItem[] };

export type Professor = {
  name: string;
  img: string | null;
  education: Entry[];
  workHistory: Entry[];
  researchFields: ResearchFieldGroup[];
  lectureSubjects: LectureSubject[];
};

export type Person = {
  id: string;
  name: string;
  position: string;
  year: string | null;
  interests: string[];
  email: string | null;
  img: string | null;
};

export type Alumnus = {
  name: string;
  year: string;
  degree: string;
  position: string;
  email: string | null;
  img: string | null;
};

export type MembersData = {
  professor: Professor;
  researchers: Person[];
  students: Person[];
  alumni: Alumnus[];
  counts: { pi: number; researchers: number; students: number; alumni: number };
};

// ─── Helper ───────────────────────────────────────────────────────────────────

const MAIL_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 flex-none">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

// Bucket degree strings ("Master's degree" / "Doctoral degree") onto the two
// display categories by the "master" keyword.
function alumniCategory(a: Alumnus): "Master Degree" | "Doctor Degree" {
  return a.degree.toLowerCase().includes("master") ? "Master Degree" : "Doctor Degree";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MemberCard({ m }: { m: Person }) {
  return (
    <article id={`member-${m.id}`} className="group flex flex-col overflow-hidden rounded-[18px] border border-line bg-white transition-[transform,box-shadow,border-color] duration-[350ms] hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-[0_24px_50px_-25px_rgba(0,102,255,.25)]">
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <Thumb src={m.img} alt={`Portrait of ${m.name}`} className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,.18) 100%)" }} />
      </div>
      <div className="flex flex-1 flex-col px-6 py-5">
        <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{m.position}</div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-[19px] font-semibold tracking-[-0.01em]">{m.name}</h3>
          {m.year && <span className="font-mono text-[12px] text-accent">{m.year}</span>}
        </div>
        <div className="mt-3 mb-3 h-px bg-line" />
        {m.interests.length > 0 && (
          <>
            <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">Research Interests</div>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {m.interests.map((it) => (
                <span key={it} className="rounded-md bg-accent-soft px-2 py-[3px] text-[11.5px] font-medium text-accent-dark max-w-full break-words">{it}</span>
              ))}
            </div>
          </>
        )}
        {m.email && (
          <a href={`mailto:${m.email}`} className="mt-auto inline-flex items-center gap-1.5 font-mono text-[12.5px] text-ink-2 transition-colors duration-200 hover:text-accent">
            {MAIL_ICON}
            <span>{m.email}</span>
          </a>
        )}
      </div>
    </article>
  );
}

function TabBar<T extends string>({
  tabs,
  active,
  counts,
  onSelect,
}: {
  tabs: readonly T[];
  active: T;
  counts: Record<T, number>;
  onSelect: (t: T) => void;
}) {
  return (
    <div className="reveal mb-9 flex flex-wrap gap-1.5">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onSelect(t)}
          className={`cursor-pointer inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
            active === t
              ? "border-accent bg-accent text-white"
              : "border-line bg-white text-ink-2 hover:bg-accent-soft hover:text-accent hover:border-accent/30"
          }`}
        >
          <span>{t}</span>
          <span className={`font-mono text-[11px] ${active === t ? "text-white" : "text-accent"}`}>
            {String(counts[t]).padStart(2, "0")}
          </span>
        </button>
      ))}
    </div>
  );
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

// ─── Component ───────────────────────────────────────────────────────────────

export default function MembersClient({
  professor,
  researchers,
  students,
  alumni,
  counts,
}: MembersData) {
  const [researcherTab, setResearcherTab] = useState<"All" | "Postdoctoral Researcher" | "Research Staff">("All");
  const [studentTab, setStudentTab] = useState<"All" | "Ph.D. Course" | "Master's Course" | "Undergraduate Intern">("All");
  const [alumniTab, setAlumniTab] = useState<"All" | "Doctor Degree" | "Master Degree">("All");

  // Researcher tabs
  const RESEARCHER_TABS = ["All", "Postdoctoral Researcher", "Research Staff"] as const;
  const researcherCounts = {
    "All": researchers.length,
    "Postdoctoral Researcher": researchers.filter((m) => m.position === "Postdoctoral Researcher").length,
    "Research Staff": researchers.filter((m) => m.position === "Research Staff").length,
  };
  const visibleResearchers = researcherTab === "All"
    ? researchers
    : researchers.filter((m) => m.position === researcherTab);

  // Student tabs
  const STUDENT_TABS = ["All", "Ph.D. Course", "Master's Course", "Undergraduate Intern"] as const;
  const studentCounts = {
    "All": students.length,
    "Ph.D. Course": students.filter((m) => m.position === "Ph.D. Course").length,
    "Master's Course": students.filter((m) => m.position === "Master's Course").length,
    "Undergraduate Intern": students.filter((m) => m.position === "Undergraduate Intern").length,
  };
  const visibleStudents = studentTab === "All"
    ? students
    : students.filter((m) => m.position === studentTab);

  // Alumni tabs
  const ALUMNI_TABS = ["All", "Doctor Degree", "Master Degree"] as const;
  const alumniCounts = {
    "All": alumni.length,
    "Doctor Degree": alumni.filter((a) => alumniCategory(a) === "Doctor Degree").length,
    "Master Degree": alumni.filter((a) => alumniCategory(a) === "Master Degree").length,
  };
  const filteredAlumni = alumniTab === "All" ? alumni : alumni.filter((a) => alumniCategory(a) === alumniTab);

  // Group alumni by year
  const alumniByYear: Record<string, Alumnus[]> = {};
  for (const a of filteredAlumni) {
    if (!alumniByYear[a.year]) alumniByYear[a.year] = [];
    alumniByYear[a.year].push(a);
  }
  const alumniYears = Object.keys(alumniByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <main>
      {/* ── Hero ── */}
      <header className="relative overflow-hidden bg-white pt-[152px] pb-[80px]" style={{ minHeight: 380 }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(700px circle at 92% 0%, rgba(0,102,255,.06), transparent 55%)" }} />
        <div className="relative mx-auto max-w-container px-8 max-[640px]:px-5">
          <div className="reveal">
            <div className="mb-3.5 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
              Members
            </div>
            <div className="grid grid-cols-[1.4fr_1fr] items-end gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-8">
              <h1 className="font-bold leading-[1.02] tracking-[-0.035em] text-ink" style={{ fontSize: "clamp(40px,5.5vw,76px)" }}>
                The people behind ATM&nbsp;Lab.
              </h1>
              <p className="max-w-[520px] text-[16px] leading-[1.65] text-ink-2">
                A small principal investigator–led group of postdoctoral researchers, graduate students, and undergraduate interns advancing thermal management research — alongside alumni now working in industry, national labs, and academia.
              </p>
            </div>
          </div>

          <div className="reveal mt-12 flex flex-wrap gap-x-9 gap-y-3 border-t border-line pt-7 font-mono text-[12.5px] tracking-[0.04em] text-ink-3">
            <span><b className="mr-2 font-sans text-[15px] font-semibold tracking-[-0.005em] text-ink">{counts.pi}</b>PI</span>
            <span><b className="mr-2 font-sans text-[15px] font-semibold tracking-[-0.005em] text-ink">{counts.researchers}</b>Researchers</span>
            <span><b className="mr-2 font-sans text-[15px] font-semibold tracking-[-0.005em] text-ink">{counts.students}</b>Students</span>
            <span><b className="mr-2 font-sans text-[15px] font-semibold tracking-[-0.005em] text-ink">{counts.alumni}</b>Alumni</span>
          </div>
        </div>
      </header>

      {/* ── Professor ── */}
      <section id="professor" className="bg-white pb-[120px] max-[640px]:pb-20">
        <Container>
          <div className="wo-cell mb-12 reveal">
            <div className="mb-3.5 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
              Principal Investigator
            </div>
            <h2 className="text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-[-0.025em]">Meet the PI.</h2>
            <div className="wo-rule mt-6" />
          </div>

          <div className="grid grid-cols-[0.9fr_1.4fr] items-start gap-14 max-[980px]:grid-cols-1 max-[980px]:gap-10">
            {/* Portrait card */}
            <div
              className="reveal group relative overflow-hidden rounded-[24px] text-white min-[981px]:sticky min-[981px]:top-[96px]"
              style={{ aspectRatio: "4/5", background: "#000D40", boxShadow: "0 30px 60px -25px rgba(0,0,0,.3)" }}
            >
              {/* PI hero portrait — the single largest image on the page, so it
                  serves the original (not a 600px thumb) to stay crisp on retina;
                  one image, not a scrolling grid, so decode cost is a non-issue. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={professor.img ?? "/professor.png"}
                alt={`Portrait of ${professor.name}`}
                loading="lazy"
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
              <div className="reveal">
                <div className="mb-2 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[14px] before:bg-accent before:content-['']">
                  Education
                </div>
                <h3 className="mb-5 text-[22px] font-semibold tracking-[-0.015em]">Education</h3>
                <DefinitionList items={professor.education} />
              </div>

              {/* Work Experience */}
              <div className="reveal border-t border-line pt-10">
                <div className="mb-2 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[14px] before:bg-accent before:content-['']">
                  Work Experience
                </div>
                <h3 className="mb-5 text-[22px] font-semibold tracking-[-0.015em]">Work Experience</h3>
                <DefinitionList items={professor.workHistory} />
              </div>

              {/* Research Field */}
              <div className="reveal border-t border-line pt-10">
                <div className="mb-2 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[14px] before:bg-accent before:content-['']">
                  Research Field
                </div>
                <h3 className="mb-5 text-[22px] font-semibold tracking-[-0.015em]">Research Field</h3>
                <div className="flex flex-col gap-7">
                  {professor.researchFields.map((g, gi) => (
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
              <div className="reveal border-t border-line pt-10">
                <div className="mb-2 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[14px] before:bg-accent before:content-['']">
                  Lecture Subject
                </div>
                <h3 className="mb-5 text-[22px] font-semibold tracking-[-0.015em]">Lecture Subject</h3>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-3 max-[640px]:grid-cols-1">
                  {professor.lectureSubjects.map((l) => (
                    <li key={l.title} className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
                      <span className="text-[15px] font-medium tracking-[-0.005em] text-ink">{l.title}</span>
                      {l.code && <span className="font-mono text-[12px] tracking-[0.04em] text-ink-3">{l.code}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Researchers ── */}
      <section id="researchers" className="bg-bg py-[120px] max-[640px]:py-20">
        <Container>
          <div className="mb-14 flex flex-wrap items-end justify-between gap-10 reveal">
            <div>
              <div className="mb-3.5 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
                Researchers
              </div>
              <h2 className="max-w-[680px] text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-[-0.025em]">
                Postdocs &amp; research staff.
              </h2>
            </div>
            <p className="max-w-[380px] text-base leading-[1.6] text-ink-3">
              Postdoctoral researchers and full-time research staff who lead experiments, mentor students, and keep the lab&apos;s testbeds running.
            </p>
          </div>

          <TabBar
            tabs={RESEARCHER_TABS}
            active={researcherTab}
            counts={researcherCounts}
            onSelect={setResearcherTab}
          />
          <div className="grid grid-cols-4 gap-5 max-[1080px]:grid-cols-3 max-[800px]:grid-cols-2 max-[480px]:grid-cols-1">
            {visibleResearchers.map((m) => <MemberCard key={m.email ?? m.name} m={m} />)}
          </div>
        </Container>
      </section>

      {/* ── Students ── */}
      <section id="students" className="bg-white py-[120px] max-[640px]:py-20">
        <Container>
          <div className="mb-14 flex flex-wrap items-end justify-between gap-10 reveal">
            <div>
              <div className="mb-3.5 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
                Students
              </div>
              <h2 className="max-w-[680px] text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-[-0.025em]">
                Graduate students &amp; interns.
              </h2>
            </div>
            <p className="max-w-[380px] text-base leading-[1.6] text-ink-3">
              Ph.D. students, M.S. students, and undergraduate interns working across two-phase cooling, battery thermal management, PCMs, and heat pump systems.
            </p>
          </div>

          <TabBar
            tabs={STUDENT_TABS}
            active={studentTab}
            counts={studentCounts}
            onSelect={setStudentTab}
          />
          <div className="grid grid-cols-4 gap-5 max-[1080px]:grid-cols-3 max-[800px]:grid-cols-2 max-[480px]:grid-cols-1">
            {visibleStudents.map((m) => <MemberCard key={m.email ?? m.name} m={m} />)}
          </div>
        </Container>
      </section>

      {/* ── Alumni ── */}
      <section id="alumni" className="bg-bg py-[120px] max-[640px]:py-20">
        <Container>
          <div className="mb-14 flex flex-wrap items-end justify-between gap-10 reveal">
            <div>
              <div className="mb-3.5 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
                Alumni
              </div>
              <h2 className="max-w-[680px] text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-[-0.025em]">
                Where they are now.
              </h2>
            </div>
            <p className="max-w-[380px] text-base leading-[1.6] text-ink-3">
              ATM Lab graduates now work in industry, national labs, and academia — from semiconductor giants to research universities.
            </p>
          </div>

          <TabBar
            tabs={ALUMNI_TABS}
            active={alumniTab}
            counts={alumniCounts}
            onSelect={setAlumniTab}
          />

          <div className="reveal flex flex-col">
            {alumniYears.map((year) => (
              <div key={year} className="flex items-start gap-12 border-t border-line py-8 last:border-b max-[680px]:flex-col max-[680px]:gap-5">
                <div className="w-20 flex-none pt-1 font-mono text-[13px] font-medium tracking-[0.05em] text-accent">
                  {year}
                </div>
                <div className="flex flex-1 flex-col">
                  {alumniByYear[year].map((a) => (
                    <div
                      key={a.email ?? a.name}
                      className="grid grid-cols-[44px_1.4fr_0.8fr_1.2fr_auto] items-center gap-5 border-b border-line/70 py-4 last:border-0 transition-[padding] duration-300 hover:pl-3.5 max-[820px]:grid-cols-[44px_1fr] max-[820px]:gap-x-4 max-[820px]:gap-y-1"
                    >
                      <div className="row-span-2 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-accent to-accent-light text-white max-[820px]:row-span-1">
                        <Thumb src={a.img} alt={`Portrait of ${a.name}`} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[16px] font-semibold tracking-[-0.005em] text-ink">{a.name}</div>
                        <div className="text-[12.5px] text-ink-3">{a.degree}</div>
                      </div>
                      <div className="font-mono text-[12.5px] tracking-[0.04em] text-ink-3 max-[820px]:hidden">{a.year}</div>
                      <div className="text-[13.5px] font-medium text-accent max-[820px]:col-span-2 max-[820px]:col-start-2">{a.position}</div>
                      {a.email && (
                        <a
                          href={`mailto:${a.email}`}
                          className="inline-flex items-center gap-1.5 font-mono text-[12px] text-ink-3 transition-colors duration-200 hover:text-accent max-[820px]:col-span-2 max-[820px]:col-start-2 max-[820px]:justify-self-start"
                        >
                          {MAIL_ICON}
                          <span className="truncate">{a.email}</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <RevealOnScroll watch={`${researcherTab}|${studentTab}|${alumniTab}`} />
    </main>
  );
}
