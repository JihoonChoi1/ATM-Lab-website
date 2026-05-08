"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";

// ─── Data ────────────────────────────────────────────────────────────────────

const PROF_EDUCATION = [
  { period: "1995 — 1999", title: "Ph.D., Mechanical Engineering", inst: "POSTECH" },
  { period: "1993 — 1995", title: "M.S., Mechanical Engineering", inst: "POSTECH" },
  { period: "1989 — 1993", title: "B.S., Mechanical Engineering", inst: "Seoul National University" },
];

const PROF_WORK = [
  { period: "2015 — present", title: "Professor", inst: "Ajou University" },
  { period: "2008 — 2015", title: "Associate Professor", inst: "Ajou University" },
  { period: "2003 — 2008", title: "Assistant Professor", inst: "Ajou University" },
  { period: "1999 — 2003", title: "Senior Researcher", inst: "Korea Institute of Machinery & Materials (KIMM)" },
];

const PROF_FIELDS = [
  "Two-phase Heat Transfer",
  "Boiling & Condensation",
  "Spray / Jet Cooling",
  "Heat Pipe",
  "Battery Thermal Management",
  "Phase-Change Materials",
  "Electronics Cooling",
];

const PROF_LECTURES = [
  { title: "Heat Transfer", code: "ME 304" },
  { title: "Thermodynamics I", code: "ME 201" },
  { title: "Two-phase Flow & Boiling", code: "ME 503" },
  { title: "Advanced Heat Transfer", code: "ME 521" },
  { title: "Thermal Management of Electronics", code: "ME 612" },
];

const RESEARCHERS = [
  { initials: "JP", name: "Jiyoung Park", position: "Postdoctoral Researcher", interests: ["Spray Cooling", "CHF Enhancement", "IR Thermography"], email: "jypark@ajou.ac.kr", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80" },
  { initials: "HL", name: "Hyunsoo Lee", position: "Postdoctoral Researcher", interests: ["Two-phase Loop", "Heat Pipe", "Electronics Cooling"], email: "hslee@ajou.ac.kr", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80" },
  { initials: "SM", name: "Sora Min", position: "Research Staff", interests: ["Lab Operations", "Test-rig Design"], email: "smin@ajou.ac.kr", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80" },
];

const STUDENTS = [
  { initials: "DH", name: "Dongwoo Hwang", year: "'21", position: "Ph.D. Course", interests: ["Pool Boiling", "Nano-/Micro-structured Surfaces"], email: "dwhwang@ajou.ac.kr", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80" },
  { initials: "KH", name: "Kyungmin Han", year: "'22", position: "Ph.D. Course", interests: ["Dropwise Condensation", "Hybrid Wettability"], email: "kmhan@ajou.ac.kr", img: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=600&q=80" },
  { initials: "YS", name: "Yejin Seo", year: "'23", position: "Ph.D. Course", interests: ["Battery TMS", "Immersion Cooling"], email: "yjseo@ajou.ac.kr", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80" },
  { initials: "MC", name: "Minjae Choi", year: "'24", position: "Ph.D. Course", interests: ["Composite PCM", "Thermal Energy Storage"], email: "mjchoi@ajou.ac.kr", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80" },
  { initials: "JY", name: "Junho Yoon", year: "'25", position: "Ph.D. Course", interests: ["Heat Pump", "Low-GWP Refrigerants"], email: "jhyoon@ajou.ac.kr", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80" },
  { initials: "SR", name: "Soohyun Ryu", year: "'24", position: "Master Course", interests: ["Jet Impingement", "Micro-fin Surfaces"], email: "shryu@ajou.ac.kr", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80" },
  { initials: "EJ", name: "Eunji Jang", year: "'24", position: "Master Course", interests: ["Two-phase Visualization"], email: "ejjang@ajou.ac.kr", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80" },
  { initials: "TB", name: "Taewoo Bae", year: "'25", position: "Master Course", interests: ["Heat Pipe Design"], email: "twbae@ajou.ac.kr", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80" },
  { initials: "HK", name: "Haram Kang", year: "'25", position: "Master Course", interests: ["PCM Composites"], email: "hrkang@ajou.ac.kr", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80" },
  { initials: "JN", name: "Jinwoo Nam", year: "'25", position: "Master Course", interests: ["Battery Pack Cooling"], email: "jwnam@ajou.ac.kr", img: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=600&q=80" },
  { initials: "SO", name: "Sumin Oh", year: "'26", position: "Undergraduate Intern", interests: ["PCM", "Thermal Storage"], email: "smoh@ajou.ac.kr", img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=600&q=80" },
  { initials: "TK", name: "Taehoon Kim", year: "'26", position: "Undergraduate Intern", interests: ["CFD", "Heat Sink Design"], email: "thkim@ajou.ac.kr", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80" },
];

const ALUMNI = [
  { initials: "SL", name: "Sungmin Lee", year: "2024", degree: "Doctor Degree", position: "Hanwha Aerospace", email: "smlee.alum@ajou.ac.kr", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
  { initials: "JK", name: "Jihye Kang", year: "2024", degree: "Master Degree", position: "Hyundai Mobis", email: "jhkang.alum@ajou.ac.kr", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80" },
  { initials: "DP", name: "Donghyun Park", year: "2023", degree: "Doctor Degree", position: "Samsung Electronics — Senior Engineer", email: "dhpark.alum@ajou.ac.kr", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
  { initials: "YK", name: "Yunseo Kim", year: "2023", degree: "Master Degree", position: "LG Energy Solution", email: "yskim.alum@ajou.ac.kr", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" },
  { initials: "WC", name: "Wooyoung Cho", year: "2022", degree: "Doctor of Philosophy in Mechanical Engineering", position: "Postdoc, MIT", email: "wycho.alum@ajou.ac.kr", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80" },
  { initials: "JB", name: "Jaewon Bae", year: "2022", degree: "Master Degree", position: "SK hynix", email: "jwbae.alum@ajou.ac.kr", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80" },
  { initials: "HS", name: "Hyeri Shin", year: "2021", degree: "Doctor Degree", position: "KIMM — Senior Researcher", email: "hrshin.alum@ajou.ac.kr", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80" },
  { initials: "MK", name: "Minsu Kwon", year: "2021", degree: "Master Degree", position: "Hyundai Motor Group", email: "mskwon.alum@ajou.ac.kr", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80" },
  { initials: "EY", name: "Eunhye Yoo", year: "2020", degree: "Doctor Degree", position: "Assistant Professor, Inha University", email: "ehyoo.alum@ajou.ac.kr", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80" },
  { initials: "TO", name: "Taejin Oh", year: "2020", degree: "Master Degree", position: "Doosan Enerbility", email: "tjoh.alum@ajou.ac.kr", img: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=300&q=80" },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

const MAIL_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 flex-none">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

function alumniCategory(a: typeof ALUMNI[number]) {
  return a.degree === "Master Degree" ? "Master Degree" : "Doctor Degree";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MemberCard({ m }: { m: typeof RESEARCHERS[number] & { year?: string } }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[18px] border border-line bg-white transition-[transform,box-shadow,border-color] duration-[350ms] hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-[0_24px_50px_-25px_rgba(0,102,255,.25)]">
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m.img} alt={`Portrait of ${m.name}`} className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]" loading="lazy" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,.18) 100%)" }} />
      </div>
      <div className="flex flex-1 flex-col px-6 py-5">
        <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{m.position}</div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-[19px] font-semibold tracking-[-0.01em]">{m.name}</h3>
          {m.year && <span className="font-mono text-[12px] text-accent">{m.year}</span>}
        </div>
        <div className="mt-3 mb-3 h-px bg-line" />
        <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">Research Interests</div>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {m.interests.map((it) => (
            <span key={it} title={it} className="rounded-md bg-accent-soft px-2 py-[3px] text-[11.5px] font-medium text-accent truncate max-w-full">{it}</span>
          ))}
        </div>
        <a href={`mailto:${m.email}`} className="mt-auto inline-flex items-center gap-1.5 font-mono text-[12.5px] text-ink-2 transition-colors duration-200 hover:text-accent">
          {MAIL_ICON}
          <span>{m.email}</span>
        </a>
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
          <span className={`font-mono text-[11px] ${active === t ? "text-white/70" : "text-accent"}`}>
            {String(counts[t]).padStart(2, "0")}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MembersPage() {
  const [researcherTab, setResearcherTab] = useState<"All" | "Postdoctoral Researcher" | "Research Staff">("All");
  const [studentTab, setStudentTab] = useState<"All" | "Ph.D. Course" | "Master Course" | "Undergraduate Intern">("All");
  const [alumniTab, setAlumniTab] = useState<"All" | "Doctor Degree" | "Master Degree">("All");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in");
        else e.target.classList.remove("in");
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .wo-cell").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Researcher tabs
  const RESEARCHER_TABS = ["All", "Postdoctoral Researcher", "Research Staff"] as const;
  const researcherCounts = {
    "All": RESEARCHERS.length,
    "Postdoctoral Researcher": RESEARCHERS.filter((m) => m.position === "Postdoctoral Researcher").length,
    "Research Staff": RESEARCHERS.filter((m) => m.position === "Research Staff").length,
  };
  const visibleResearchers = researcherTab === "All"
    ? RESEARCHERS
    : RESEARCHERS.filter((m) => m.position === researcherTab);

  // Student tabs
  const STUDENT_TABS = ["All", "Ph.D. Course", "Master Course", "Undergraduate Intern"] as const;
  const studentCounts = {
    "All": STUDENTS.length,
    "Ph.D. Course": STUDENTS.filter((m) => m.position === "Ph.D. Course").length,
    "Master Course": STUDENTS.filter((m) => m.position === "Master Course").length,
    "Undergraduate Intern": STUDENTS.filter((m) => m.position === "Undergraduate Intern").length,
  };
  const visibleStudents = studentTab === "All"
    ? STUDENTS
    : STUDENTS.filter((m) => m.position === studentTab);

  // Alumni tabs
  const ALUMNI_TABS = ["All", "Doctor Degree", "Master Degree"] as const;
  const alumniCounts = {
    "All": ALUMNI.length,
    "Doctor Degree": ALUMNI.filter((a) => alumniCategory(a) === "Doctor Degree").length,
    "Master Degree": ALUMNI.filter((a) => alumniCategory(a) === "Master Degree").length,
  };
  const filteredAlumni = alumniTab === "All" ? ALUMNI : ALUMNI.filter((a) => alumniCategory(a) === alumniTab);

  // Group alumni by year
  const alumniByYear: Record<string, typeof ALUMNI> = {};
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
            <span><b className="mr-2 font-sans text-[15px] font-semibold tracking-[-0.005em] text-ink">1</b>PI</span>
            <span><b className="mr-2 font-sans text-[15px] font-semibold tracking-[-0.005em] text-ink">3</b>Researchers</span>
            <span><b className="mr-2 font-sans text-[15px] font-semibold tracking-[-0.005em] text-ink">12</b>Students</span>
            <span><b className="mr-2 font-sans text-[15px] font-semibold tracking-[-0.005em] text-ink">10</b>Alumni</span>
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/professor.png"
                alt="Portrait of Prof. Jungho Lee"
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
                <ul className="flex flex-col">
                  {PROF_EDUCATION.map((it) => (
                    <li key={it.period} className="grid grid-cols-[120px_1fr] items-baseline gap-6 border-t border-line py-4 last:border-b max-[640px]:grid-cols-1 max-[640px]:gap-1">
                      <span className="font-mono text-[12.5px] tracking-[0.04em] text-ink-3">{it.period}</span>
                      <span className="text-[15.5px] leading-[1.55]">
                        <b className="font-semibold text-ink">{it.title}</b>
                        <span className="text-ink-3">, {it.inst}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Work Experience */}
              <div className="reveal border-t border-line pt-10">
                <div className="mb-2 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[14px] before:bg-accent before:content-['']">
                  Work Experience
                </div>
                <h3 className="mb-5 text-[22px] font-semibold tracking-[-0.015em]">Work Experience</h3>
                <ul className="flex flex-col">
                  {PROF_WORK.map((it) => (
                    <li key={it.period} className="grid grid-cols-[120px_1fr] items-baseline gap-6 border-t border-line py-4 last:border-b max-[640px]:grid-cols-1 max-[640px]:gap-1">
                      <span className="font-mono text-[12.5px] tracking-[0.04em] text-ink-3">{it.period}</span>
                      <span className="text-[15.5px] leading-[1.55]">
                        <b className="font-semibold text-ink">{it.title}</b>
                        <span className="text-ink-3">, {it.inst}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Research Field */}
              <div className="reveal border-t border-line pt-10">
                <div className="mb-2 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[14px] before:bg-accent before:content-['']">
                  Research Field
                </div>
                <h3 className="mb-5 text-[22px] font-semibold tracking-[-0.015em]">Research Field</h3>
                <div className="flex flex-wrap gap-2">
                  {PROF_FIELDS.map((f) => (
                    <span key={f} className="rounded-[10px] border border-line bg-white px-3.5 py-2 text-[13.5px] font-medium text-ink-2 transition-colors duration-200 hover:border-accent/30 hover:bg-accent-soft hover:text-accent">
                      {f}
                    </span>
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
                  {PROF_LECTURES.map((l) => (
                    <li key={l.code} className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
                      <span className="text-[15px] font-medium tracking-[-0.005em] text-ink">{l.title}</span>
                      <span className="font-mono text-[12px] tracking-[0.04em] text-ink-3">{l.code}</span>
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
              Postdoctoral researchers and full-time research staff who lead experiments, mentor students, and keep the lab's testbeds running.
            </p>
          </div>

          <TabBar
            tabs={RESEARCHER_TABS}
            active={researcherTab}
            counts={researcherCounts}
            onSelect={setResearcherTab}
          />
          <div className="grid grid-cols-4 gap-5 max-[1080px]:grid-cols-3 max-[800px]:grid-cols-2 max-[480px]:grid-cols-1">
            {visibleResearchers.map((m) => <MemberCard key={m.email} m={m} />)}
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
            {visibleStudents.map((m) => <MemberCard key={m.email} m={m} />)}
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
                      key={a.email}
                      className="grid grid-cols-[44px_1.4fr_0.8fr_1.2fr_auto] items-center gap-5 border-b border-line/70 py-4 last:border-0 transition-[padding] duration-300 hover:pl-3.5 max-[820px]:grid-cols-[44px_1fr] max-[820px]:gap-x-4 max-[820px]:gap-y-1"
                    >
                      <div className="row-span-2 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-accent to-accent-light text-white max-[820px]:row-span-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={a.img} alt={`Portrait of ${a.name}`} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[16px] font-semibold tracking-[-0.005em] text-ink">{a.name}</div>
                        <div className="text-[12.5px] text-ink-3">{a.degree}</div>
                      </div>
                      <div className="font-mono text-[12.5px] tracking-[0.04em] text-ink-3 max-[820px]:hidden">{a.year}</div>
                      <div className="text-[13.5px] font-medium text-accent max-[820px]:col-span-2 max-[820px]:col-start-2">{a.position}</div>
                      <a
                        href={`mailto:${a.email}`}
                        className="inline-flex items-center gap-1.5 font-mono text-[12px] text-ink-3 transition-colors duration-200 hover:text-accent max-[820px]:col-span-2 max-[820px]:col-start-2 max-[820px]:justify-self-start"
                      >
                        {MAIL_ICON}
                        <span className="truncate">{a.email}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
