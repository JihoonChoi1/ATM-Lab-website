"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "@/components/ui/Container";

// ─── Types ───────────────────────────────────────────────────────────────────

type Journal = {
  num: number;
  year: string;
  title: string;
  journal: string;
  authors: string;
};

type Conference = {
  num: number;
  year: string;
  title: string;
  authors: string;
  conference: string;
};

type Patent = {
  num: number;
  year: string;
  title: string;
  inventors: string;
  applicationNo: string;
  country: string;
  date: string;
};

type CategoryKey = "journals" | "conferences" | "patents";

// ─── Bucket specs (will move to DB in Phase 5) ───────────────────────────────

const JOURNAL_BUCKETS: Array<[string, number]> = [
  ["2026", 6], ["2025", 22], ["2024", 12], ["2023", 5], ["2022", 7],
  ["2021", 11], ["2020", 6], ["2019", 9], ["2018", 9], ["2017", 7],
  ["2016", 5], ["2015", 3], ["2014~Before", 6],
];
const CONFERENCE_BUCKETS: Array<[string, number]> = [
  ["2025", 6], ["2024", 28], ["2023", 24], ["2022", 21], ["2021", 2],
];
const PATENT_BUCKETS: Array<[string, number]> = [
  ["2024", 2], ["2023", 1], ["2022", 6], ["2021", 2],
];

// ─── Sample pools ────────────────────────────────────────────────────────────

const SAMPLE_TITLES = [
  "Pool boiling heat transfer enhancement on hierarchical micro-/nano-structured copper surfaces",
  "Critical heat flux behavior of subcooled flow boiling under high mass flux conditions",
  "Two-phase loop thermosyphon design for vertically stacked power semiconductors",
  "Visualization of dropwise condensation on hybrid wettability surfaces under high heat flux",
  "Thermal performance of vapor chambers integrated with capillary-driven wicks",
  "Hybrid jet–spray cooling architecture for kilowatt-scale GPU thermal loads",
  "Composite paraffin–graphene phase change materials with anisotropic conductivity",
  "Predictive thermal control of immersion-cooled lithium-ion modules using physics-informed networks",
  "Dielectric immersion cooling of high-density AI server racks under transient loads",
  "Experimental study of jet impingement on micro-finned copper substrates",
  "Compact heat pump with low-GWP refrigerant blend for cold-climate residential heating",
  "Heat transfer characteristics of pulsating heat pipes charged with binary working fluids",
  "Boiling crisis suppression on biphilic surfaces with engineered nucleation sites",
];
const SAMPLE_JOURNALS = [
  "Applied Thermal Engineering",
  "International Journal of Heat and Mass Transfer",
  "International Communications in Heat and Mass Transfer",
  "Journal of Heat Transfer",
  "Case Studies in Thermal Engineering",
  "The KSFM Journal of Fluid Machinery",
];
const SAMPLE_CONFERENCES = [
  "KSFM Summer Conference (placeholder)",
  "KSME Spring Conference (placeholder)",
  "IHPC & IHPS (placeholder)",
  "IHTC (placeholder)",
  "InterPACK (placeholder)",
];
const SAMPLE_PATENT_TITLES = [
  "Two-phase cooling module for high-density processors",
  "Immersion cooling system with dielectric fluid",
  "Heat pipe with composite capillary wick",
  "Vapor chamber integrated battery cold plate",
  "Phase change thermal storage assembly",
  "Hybrid jet impingement heat sink",
  "Pulsating heat pipe cooling unit",
  "Loop thermosyphon for power electronics",
  "Surface-engineered boiling enhancement plate",
  "Thermosiphon evaporator with structured wick",
  "Dielectric spray cooling apparatus",
];
const SAMPLE_NAMES = [
  "Hyunsoo Park", "Jiyoung Lim", "Dongwoo Hwang", "Kyungmin Han", "Yejin Seo",
  "Minjae Choi", "Junho Yoon", "Soohyun Ryu", "Eunji Jang", "Taewoo Bae",
];

// ─── Builders ────────────────────────────────────────────────────────────────

function buildJournals(): Journal[] {
  const out: Journal[] = [];
  let n = 108;
  for (const [year, count] of JOURNAL_BUCKETS) {
    for (let i = 0; i < count; i++) {
      const authorCount = 2 + (n % 5);
      const authors: string[] = [];
      for (let a = 0; a < authorCount - 1; a++) {
        authors.push(SAMPLE_NAMES[(n + a) % SAMPLE_NAMES.length]);
      }
      authors.push("Jungho Lee*");
      out.push({
        num: n,
        year,
        title: SAMPLE_TITLES[n % SAMPLE_TITLES.length],
        journal: SAMPLE_JOURNALS[n % SAMPLE_JOURNALS.length],
        authors: authors.join(", "),
      });
      n--;
    }
  }
  return out;
}

function buildConferences(): Conference[] {
  const out: Conference[] = [];
  let n = 81;
  for (const [year, count] of CONFERENCE_BUCKETS) {
    for (let i = 0; i < count; i++) {
      const authorCount = 1 + (n % 5);
      const authors: string[] = [];
      for (let a = 0; a < authorCount - 1; a++) {
        authors.push(SAMPLE_NAMES[(n + a) % SAMPLE_NAMES.length]);
      }
      authors.push("Jungho Lee");
      out.push({
        num: n,
        year,
        title: SAMPLE_TITLES[(n + 3) % SAMPLE_TITLES.length],
        authors: authors.join(", "),
        conference: SAMPLE_CONFERENCES[n % SAMPLE_CONFERENCES.length],
      });
      n--;
    }
  }
  return out;
}

function buildPatents(): Patent[] {
  const epoSet = new Set([10]);
  const pctSet = new Set([8, 2]);
  const out: Patent[] = [];
  let n = 11;
  for (const [year, count] of PATENT_BUCKETS) {
    for (let i = 0; i < count; i++) {
      const authorCount = 1 + (n % 4);
      const authors = ["Jungho Lee"];
      for (let a = 1; a < authorCount; a++) {
        authors.push(SAMPLE_NAMES[(n + a) % SAMPLE_NAMES.length]);
      }
      let country: string;
      let applicationNo: string;
      if (epoSet.has(n)) {
        country = "European Patent Office (EPO)";
        applicationNo = `22 877 ${300 + n}.${n % 9}`;
      } else if (pctSet.has(n)) {
        country = "PCT";
        applicationNo = `PCT/KR${year}/${String(100000 + n * 137).padStart(6, "0")}`;
      } else {
        country = "Republic of Korea";
        applicationNo = `10-${year}-${String(1000000 + n * 13577).padStart(7, "0")}`;
      }
      const month = String(((n * 3) % 12) + 1).padStart(2, "0");
      const day = String(((n * 7) % 27) + 1).padStart(2, "0");
      out.push({
        num: n,
        year,
        title: SAMPLE_PATENT_TITLES[n % SAMPLE_PATENT_TITLES.length],
        inventors: authors.join(", "),
        applicationNo,
        country,
        date: `${year}-${month}-${day}`,
      });
      n--;
    }
  }
  return out;
}

const JOURNALS = buildJournals();
const CONFERENCES = buildConferences();
const PATENTS = buildPatents();

// ─── Categories config ───────────────────────────────────────────────────────

type CategoryConfig = {
  label: string;
  title: string;
  count: number;
  years: string[];
};

const CATEGORIES: Record<CategoryKey, CategoryConfig> = {
  journals: {
    label: "Journals",
    title: "Journals",
    count: JOURNALS.length,
    years: ["All", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014~Before"],
  },
  conferences: {
    label: "Conferences",
    title: "Conferences",
    count: CONFERENCES.length,
    years: ["All", "2025", "2024", "2023", "2022", "2021"],
  },
  patents: {
    label: "Selected Patents",
    title: "Selected Patents",
    count: PATENTS.length,
    years: ["All", "2024", "2023", "2022", "2021"],
  },
};

const CATEGORY_KEYS: CategoryKey[] = ["journals", "conferences", "patents"];

const pad2 = (n: number) => String(n).padStart(2, "0");
const pad3 = (n: number) => String(n).padStart(3, "0");

// ─── Row components ──────────────────────────────────────────────────────────

const rowBase =
  "group reveal flex items-start gap-6 py-6 px-2 transition-[padding] duration-300 hover:pl-5 max-[640px]:flex-col max-[640px]:gap-3";

const titleHover =
  "transition-colors duration-200 group-hover:text-accent";

const linkBtnClass =
  "shrink-0 inline-flex items-center gap-1.5 mt-1 text-[12px] font-mono uppercase tracking-[0.08em] text-accent hover:underline";

function NumLabel({ n }: { n: number }) {
  return (
    <span className="font-mono text-[13px] text-accent tracking-[0.04em] pt-1 shrink-0 w-12">
      {pad3(n)}
    </span>
  );
}

function ExternalLinkButton() {
  return (
    <a href="#" target="_blank" rel="noopener" className={linkBtnClass}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3 w-3"
        aria-hidden="true"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      LINK
      <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
    </a>
  );
}

function JournalRow({ it }: { it: Journal }) {
  return (
    <li className={rowBase}>
      <NumLabel n={it.num} />
      <div className="shrink-0 mt-0.5 max-[640px]:hidden">
        <div className="fig-placeholder h-[80px] w-[60px] rounded-md border border-line/80" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`text-[clamp(16px,1.5vw,19px)] font-semibold tracking-[-0.01em] text-ink leading-[1.45] ${titleHover}`}>
          &ldquo;{it.title}&rdquo;
        </h3>
        <p className="mt-2 text-[14.5px] text-ink-2 italic leading-[1.55]">{it.journal}</p>
        <p className="mt-1 text-[13.5px] text-ink-3 leading-[1.6]">{it.authors}</p>
      </div>
      <ExternalLinkButton />
    </li>
  );
}

function ConferenceRow({ it }: { it: Conference }) {
  return (
    <li className={rowBase}>
      <NumLabel n={it.num} />
      <div className="flex-1 min-w-0">
        <h3 className={`text-[clamp(16px,1.5vw,19px)] font-semibold tracking-[-0.01em] text-ink leading-[1.45] ${titleHover}`}>
          &ldquo;{it.title}&rdquo;
        </h3>
        <p className="mt-2 text-[13.5px] text-ink-3 leading-[1.6]">{it.authors}</p>
        <p className="mt-1 text-[14.5px] text-ink-2 italic leading-[1.55]">{it.conference}</p>
      </div>
    </li>
  );
}

function PatentCard({ it }: { it: Patent }) {
  return (
    <li className="group reveal rounded-[14px] border border-line bg-surface p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_24px_50px_-25px_rgba(0,102,255,.25)]">
      <div className="flex items-start gap-5 max-[640px]:flex-col max-[640px]:gap-2">
        <NumLabel n={it.num} />
        <div className="flex-1 min-w-0">
          <h3 className={`text-[clamp(16px,1.5vw,19px)] font-semibold tracking-[-0.01em] text-ink leading-[1.45] ${titleHover}`}>
            {it.title}
          </h3>
          <p className="mt-2 text-[13.5px] text-ink-3 leading-[1.6]">{it.inventors}</p>
          <dl className="mt-4 grid grid-cols-[110px_1fr] gap-x-4 gap-y-2 max-[640px]:grid-cols-1 max-[640px]:gap-y-1">
            <dt className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-3">Application</dt>
            <dd className="font-mono text-[12.5px] text-ink-2">{it.applicationNo}</dd>
            <dt className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-3">Country</dt>
            <dd className="text-[13px] text-ajou-silver">{it.country}</dd>
            <dt className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-3">Filed</dt>
            <dd className="font-mono text-[12.5px] text-ink-2">{it.date}</dd>
          </dl>
        </div>
      </div>
    </li>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PublicationsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("journals");
  const [activeYear, setActiveYear] = useState<string>("All");

  const cat = CATEGORIES[activeCategory];
  const isPatent = activeCategory === "patents";

  const data = useMemo(() => {
    if (activeCategory === "journals") return JOURNALS;
    if (activeCategory === "conferences") return CONFERENCES;
    return PATENTS;
  }, [activeCategory]);

  const filtered = useMemo(
    () => (activeYear === "All" ? data : data.filter((it) => it.year === activeYear)),
    [data, activeYear]
  );

  const yearCounts = useMemo(() => {
    const m: Record<string, number> = { All: data.length };
    for (const y of cat.years) {
      if (y === "All") continue;
      m[y] = data.filter((it) => it.year === y).length;
    }
    return m;
  }, [data, cat.years]);

  const groups = useMemo(() => {
    const orderedYears = cat.years.filter((y) => y !== "All");
    return orderedYears
      .map((y) => ({
        year: y,
        items: filtered
          .filter((it) => it.year === y)
          .slice()
          .sort((a, b) => b.num - a.num),
      }))
      .filter((g) => g.items.length > 0);
  }, [filtered, cat.years]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
          else e.target.classList.remove("in");
        }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document
      .querySelectorAll(".reveal, .wo-cell")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [activeCategory, activeYear]);

  const handleCategoryChange = (key: CategoryKey) => {
    if (key === activeCategory) return;
    setActiveCategory(key);
    setActiveYear("All");
    const offset = 72 + 64 + 56 - 8;
    const target = document.getElementById("active-title");
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleCategoryKey = (e: React.KeyboardEvent) => {
    const idx = CATEGORY_KEYS.indexOf(activeCategory);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleCategoryChange(CATEGORY_KEYS[(idx + 1) % CATEGORY_KEYS.length]);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleCategoryChange(
        CATEGORY_KEYS[(idx - 1 + CATEGORY_KEYS.length) % CATEGORY_KEYS.length]
      );
    }
  };

  return (
    <main>
      {/* ── Hero ── */}
      <header className="bg-white pt-[150px] pb-[70px] max-[640px]:pt-[120px] max-[640px]:pb-12">
        <Container>
          <div className="wo-cell reveal grid grid-cols-[1.4fr_1fr] items-end gap-12 max-[820px]:grid-cols-1 max-[820px]:gap-8 max-[820px]:items-start">
            <div>
              <div className="mb-4 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
                Publications
              </div>
              <h1
                className="font-bold leading-[1.02] tracking-[-0.035em] text-ink"
                style={{ fontSize: "clamp(40px,5.5vw,76px)" }}
              >
                The lab&apos;s
                <br />
                published&nbsp;record.
              </h1>
              <div className="wo-rule mt-7" />
              <p className="max-w-[560px] text-[16.5px] leading-[1.65] text-ink-2">
                Peer-reviewed journal articles, conference papers, and patents produced by ATM&nbsp;Lab and our collaborators. Filter by category and year.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 font-mono text-[12.5px] uppercase tracking-[0.08em] text-ink-3">
              <div className="flex items-center justify-between gap-6 border-t border-line pt-3">
                <span>Journals</span>
                <span className="text-ink font-medium">{pad3(JOURNALS.length)}</span>
              </div>
              <div className="flex items-center justify-between gap-6 border-t border-line pt-3">
                <span>Conferences</span>
                <span className="text-ink font-medium">{pad3(CONFERENCES.length)}</span>
              </div>
              <div className="flex items-center justify-between gap-6 border-t border-line pt-3">
                <span>Patents</span>
                <span className="text-ink font-medium">{pad3(PATENTS.length)}</span>
              </div>
              <div className="flex items-center justify-between gap-6 border-t border-line pt-3">
                <span>Earliest</span>
                <span className="text-ink-2 font-medium">2014~Before</span>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* ── Sticky category tab bar ── */}
      <div className="sticky top-[72px] z-40 bg-white/85 backdrop-blur-[18px] backdrop-saturate-[180%] border-y border-line">
        <Container>
          <div
            role="tablist"
            aria-label="Publication categories"
            className="flex items-center gap-2 py-3.5 overflow-x-auto pill-row"
          >
            {CATEGORY_KEYS.map((key) => {
              const c = CATEGORIES[key];
              const isActive = key === activeCategory;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleCategoryChange(key)}
                  onKeyDown={handleCategoryKey}
                  className={`shrink-0 cursor-pointer inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[13.5px] font-medium transition-all duration-200 ${
                    isActive
                      ? "border-accent bg-accent text-white shadow-[0_8px_22px_-12px_rgba(0,102,255,.55)]"
                      : "border-line bg-white text-ink-2 hover:bg-accent-soft hover:text-accent"
                  }`}
                >
                  <span>{c.label}</span>
                  <span
                    className={`font-mono text-[11.5px] ${
                      isActive ? "text-white/80" : "text-accent"
                    }`}
                  >
                    {pad3(c.count)}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      {/* ── Sticky year filter chip row ── */}
      <div className="sticky top-[136px] z-30 bg-white/85 backdrop-blur-[18px] backdrop-saturate-[180%] border-b border-line">
        <Container>
          <div className="flex items-center gap-2 py-3 overflow-x-auto pill-row">
            {cat.years.map((y) => {
              const isActive = y === activeYear;
              return (
                <button
                  key={y}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveYear(y)}
                  className={`shrink-0 cursor-pointer inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-all duration-200 ${
                    isActive
                      ? "border-accent bg-accent text-white"
                      : "border-line bg-white text-ink-2 hover:bg-accent-soft hover:text-accent"
                  }`}
                >
                  <span className="font-mono tracking-[0.02em]">{y}</span>
                  <span
                    className={`font-mono text-[10.5px] ${
                      isActive ? "text-white/75" : "text-accent"
                    }`}
                  >
                    {pad2(yearCounts[y] ?? 0)}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      {/* ── Entry list ── */}
      <section className="bg-bg pt-14 pb-[120px] max-[640px]:pt-10 max-[640px]:pb-20">
        <Container>
          <div className="mb-10 flex items-baseline justify-between gap-6 flex-wrap">
            <h2
              id="active-title"
              className="text-[clamp(26px,3vw,36px)] font-bold tracking-[-0.025em]"
            >
              {cat.title}
            </h2>
            <div className="font-mono text-[12.5px] uppercase tracking-[0.08em] text-ink-3">
              {pad3(filtered.length)} ENTRIES
              {activeYear !== "All" ? ` · ${activeYear}` : ""}
            </div>
          </div>

          <div className="flex flex-col gap-16">
            {groups.length === 0 ? (
              <div className="text-ink-3 text-[15px] italic py-12">No entries.</div>
            ) : (
              groups.map((g) => (
                <section key={g.year} className="reveal">
                  <div className="grid grid-cols-[140px_1fr] gap-x-10 max-[820px]:grid-cols-1 max-[820px]:gap-y-3">
                    <div className="wo-cell">
                      <div className="font-mono text-[13px] text-accent tracking-[0.06em]">
                        {g.year}
                      </div>
                      <div
                        className={`font-semibold tracking-[-0.02em] text-ink leading-none mt-2 whitespace-nowrap ${
                          g.year.length > 4
                            ? "text-[clamp(20px,2vw,26px)]"
                            : "text-[clamp(34px,4vw,48px)]"
                        }`}
                      >
                        {g.year}
                      </div>
                      <div className="wo-rule mt-4 max-[820px]:hidden" />
                      <div className="mt-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-3">
                        {pad2(g.items.length)}{" "}
                        {isPatent
                          ? "patents"
                          : g.items.length === 1
                          ? "entry"
                          : "entries"}
                      </div>
                    </div>
                    <ol className={isPatent ? "grid gap-4" : "divide-y divide-line"}>
                      {activeCategory === "journals" &&
                        g.items.map((it) => (
                          <JournalRow key={it.num} it={it as Journal} />
                        ))}
                      {activeCategory === "conferences" &&
                        g.items.map((it) => (
                          <ConferenceRow key={it.num} it={it as Conference} />
                        ))}
                      {activeCategory === "patents" &&
                        g.items.map((it) => (
                          <PatentCard key={it.num} it={it as Patent} />
                        ))}
                    </ol>
                  </div>
                </section>
              ))
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}
