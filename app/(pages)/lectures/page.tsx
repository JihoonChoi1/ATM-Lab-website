"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";

// ─── Types ───────────────────────────────────────────────────────────────────

type CategoryKey = "All" | "Undergraduate" | "Graduate";

type Lecture = {
  num: string;
  category: Exclude<CategoryKey, "All">;
  title: string;
  paragraphs: string[];
};

// ─── Data ────────────────────────────────────────────────────────────────────

const LECTURES: Lecture[] = [
  {
    num: "01",
    category: "Undergraduate",
    title: "Heat Transfer",
    paragraphs: [
      "Through the heat transfer lecture, the students will learn about the fundamental concepts of heat transfer, such as conduction, convection, and radiation.",
      "In the conduction part, students can study one-dimensional conduction heat transfer, heat transfer theory, and the application of both steady- and unsteady-states conductions.",
      "In the convection part, students can study the basic theory and application of forced and free convection heat transfer in the internal and external flow based on fluid dynamics.",
      "A lot of industrial applications involve heat generation. Therefore heat transfer is an important variable in applications like air conditioners, refrigerators, mobile devices, automobiles, and power plants.",
      "By taking this class, students will gain useful knowledge that can be applied to most industrial fields.",
    ],
  },
  {
    num: "02",
    category: "Undergraduate",
    title: "Applied Heat Transfer",
    paragraphs: [
      "In the applied heat transfer lecture, students will learn about heat transfer fundamentals not encountered in the “Heat Transfer” lecture.",
      "The students will study phase-change heat transfer, heat exchanger, radiation heat transfer, heat pipe, and thermal management.",
      "Especially technical issues in electric vehicles, cooling of the energy storage system (ESS) battery, cooling of the power semiconductor in the power conversion system, and cooling of the laser diode in laser weapons will be learned.",
      "This class will give students deeper physical insights applicable to the advanced industrial area.",
    ],
  },
  {
    num: "03",
    category: "Graduate",
    title: "Phase-Change Heat Transfer",
    paragraphs: [
      "Students will learn a detailed view of boiling and condensation phenomena in the phase-change heat transfer lecture.",
      "Different from heat transfer lectures in the undergraduate course, this lecture will provide an understanding of two-phase flow, basic models and empirical treatments of two-phase flow, pool and convective boiling, subcooled and saturated boiling, and critical heat flux in forced convective flow and condensation. These can even solve global problems such as climate change and energy crisis.",
      "By taking this class, students will gain abilities that can be used to solve difficulties with phase-change heat transfer in actual R&D applications.",
    ],
  },
  {
    num: "04",
    category: "Graduate",
    title: "Experimental Thermal and Fluid Mechanics",
    paragraphs: [],
  },
];

const CATEGORIES: Array<{ key: CategoryKey; label: string }> = [
  { key: "All", label: "All" },
  { key: "Undergraduate", label: "Undergraduate" },
  { key: "Graduate", label: "Graduate" },
];

const categoryCounts: Record<CategoryKey, number> = {
  All: LECTURES.length,
  Undergraduate: LECTURES.filter((l) => l.category === "Undergraduate").length,
  Graduate: LECTURES.filter((l) => l.category === "Graduate").length,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function chipClasses(category: string) {
  return category === "Undergraduate"
    ? "border-accent/30 bg-accent-soft text-accent"
    : "border-ajou-silver/40 bg-ajou-silver/10 text-ajou-silver";
}

const ACTIVE_TITLE: Record<CategoryKey, string> = {
  All: "All lectures",
  Undergraduate: "Undergraduate lectures",
  Graduate: "Graduate lectures",
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LecturesPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("All");

  const filtered = LECTURES.filter(
    (l) => activeCategory === "All" || l.category === activeCategory
  );

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
          else e.target.classList.remove("in");
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .wo-cell").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [activeCategory]);

  const handleCategoryChange = (key: CategoryKey) => {
    if (key === activeCategory) return;
    setActiveCategory(key);
    const section = document.getElementById("lectures-section");
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY - (72 + 56);
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleCategoryKey = (e: React.KeyboardEvent) => {
    const keys = CATEGORIES.map((c) => c.key);
    const idx = keys.indexOf(activeCategory);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleCategoryChange(keys[(idx + 1) % keys.length]);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleCategoryChange(keys[(idx - 1 + keys.length) % keys.length]);
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
                Lectures
              </div>
              <h1
                className="font-bold leading-[1.02] tracking-[-0.035em] text-ink"
                style={{ fontSize: "clamp(40px,5.5vw,76px)" }}
              >
                Courses taught
                <br />
                by the&nbsp;lab.
              </h1>
              <div className="wo-rule mt-7" />
              <p className="mt-7 max-w-[560px] text-[16.5px] leading-[1.65] text-ink-2">
                Undergraduate and graduate courses on heat transfer, phase-change
                phenomena, and experimental thermal-fluid mechanics — taught at Ajou
                University&apos;s Department of Mechanical Engineering.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 font-mono text-[12.5px] uppercase tracking-[0.08em] text-ink-3">
              {(
                [
                  ["Courses", "04", true],
                  ["Undergraduate", "02", true],
                  ["Graduate", "02", true],
                  ["Instructor", "Prof. Jungho Lee", false],
                ] as const
              ).map(([label, value, mono]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-6 border-t border-line pt-3"
                >
                  <span>{label}</span>
                  <span className={`font-medium ${mono ? "text-ink" : "text-ink-2"}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </header>

      {/* ── Sticky category tab bar ── */}
      <div className="sticky top-[72px] z-40 bg-white/85 backdrop-blur-[18px] backdrop-saturate-[180%] border-y border-line">
        <Container>
          <div
            role="tablist"
            aria-label="Lecture categories"
            className="flex items-center gap-2 py-3.5 overflow-x-auto pill-row"
          >
            {CATEGORIES.map(({ key, label }) => {
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
                  <span>{label}</span>
                  <span
                    className={`font-mono text-[11.5px] ${
                      isActive ? "text-white/80" : "text-accent"
                    }`}
                  >
                    {String(categoryCounts[key]).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      {/* ── Lecture card list ── */}
      <section
        id="lectures-section"
        className="bg-bg py-[120px] max-[640px]:py-20"
      >
        <Container>
          <div className="mb-12 flex items-baseline justify-between gap-6 flex-wrap reveal">
            <h2 className="text-[clamp(26px,3vw,36px)] font-bold tracking-[-0.025em]">
              {ACTIVE_TITLE[activeCategory]}
            </h2>
            <div className="font-mono text-[12.5px] uppercase tracking-[0.08em] text-ink-3">
              {String(filtered.length).padStart(2, "0")} of{" "}
              {String(LECTURES.length).padStart(2, "0")} courses
            </div>
          </div>

          <ol className="space-y-8 max-[640px]:space-y-6">
            {filtered.map((lec, i) => (
              <li
                key={lec.num}
                className="group reveal rounded-[18px] border border-line bg-surface p-8 max-[640px]:p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-[0_24px_50px_-25px_rgba(0,102,255,.25)]"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="grid grid-cols-[88px_1fr] gap-x-8 max-[820px]:grid-cols-1 max-[820px]:gap-y-4">
                  <div
                    className="font-mono font-semibold text-accent leading-none tracking-[-0.04em]"
                    style={{ fontSize: "clamp(48px,6vw,72px)" }}
                  >
                    {lec.num}
                  </div>
                  <div className="min-w-0">
                    <span
                      className={`inline-flex items-center font-mono text-[10.5px] uppercase tracking-[0.12em] border rounded-full px-3 py-[5px] ${chipClasses(lec.category)}`}
                    >
                      {lec.category.toUpperCase()}
                    </span>
                    <h3
                      className="mt-3 font-bold tracking-[-0.02em] text-ink leading-[1.2]"
                      style={{ fontSize: "clamp(24px,2.6vw,34px)" }}
                    >
                      {lec.title}
                    </h3>
                    <div className="wo-rule mt-4" />
                    {lec.paragraphs.length > 0 ? (
                      <div className="mt-6 space-y-4 text-[16px] text-ink-2 leading-[1.75] text-justify">
                        {lec.paragraphs.map((p, j) => (
                          <p key={j}>{p}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-6 font-mono text-[12.5px] uppercase tracking-[0.08em] text-ink-3">
                        Course description not provided.
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </main>
  );
}
