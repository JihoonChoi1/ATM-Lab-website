"use client";

import { Fragment, useState } from "react";
import Container from "@/components/ui/Container";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

// ─── Types ───────────────────────────────────────────────────────────────────

type CategoryKey = "All" | "Undergraduate" | "Graduate";

export type Lecture = {
  id: string;
  num: string;
  category: Exclude<CategoryKey, "All">;
  title: string;
  paragraphs: string[];
};

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES: Array<{ key: CategoryKey; label: string }> = [
  { key: "All", label: "All" },
  { key: "Undergraduate", label: "Undergraduate" },
  { key: "Graduate", label: "Graduate" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function chipClasses(category: string) {
  // accent-dark / #5c7474 (darker silver): on the pale soft tints the brand
  // accent (#0066ff, 4.32:1) and ajou-silver (#8ca8a8, 2.3:1) fell under AA.
  return category === "Undergraduate"
    ? "border-accent/30 bg-accent-soft text-accent-dark"
    : "border-ajou-silver/40 bg-ajou-silver/10 text-[#5c7474]";
}

const ACTIVE_TITLE: Record<CategoryKey, string> = {
  All: "All lectures",
  Undergraduate: "Undergraduate lectures",
  Graduate: "Graduate lectures",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function LecturesClient({
  lectures,
  heroHeadline,
  heroParagraph,
}: {
  lectures: Lecture[];
  heroHeadline: string;
  heroParagraph: string;
}) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("All");

  const categoryCounts: Record<CategoryKey, number> = {
    All: lectures.length,
    Undergraduate: lectures.filter((l) => l.category === "Undergraduate").length,
    Graduate: lectures.filter((l) => l.category === "Graduate").length,
  };

  const filtered = lectures.filter(
    (l) => activeCategory === "All" || l.category === activeCategory
  );

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
                {heroHeadline.split("\n").map((line, i) => (
                  <Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
              </h1>
              <div className="wo-rule mt-7" />
              <p className="mt-7 max-w-[560px] whitespace-pre-line text-[16.5px] leading-[1.65] text-ink-2">
                {heroParagraph}
              </p>
            </div>

            <div className="flex flex-col gap-2.5 font-mono text-[12.5px] uppercase tracking-[0.08em] text-ink-3">
              {(
                [
                  ["Courses", String(categoryCounts.All).padStart(2, "0"), true],
                  ["Undergraduate", String(categoryCounts.Undergraduate).padStart(2, "0"), true],
                  ["Graduate", String(categoryCounts.Graduate).padStart(2, "0"), true],
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
                      isActive ? "text-white" : "text-accent"
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
              {String(lectures.length).padStart(2, "0")} courses
            </div>
          </div>

          <ol className="space-y-8 max-[640px]:space-y-6">
            {filtered.map((lec, i) => (
              <li
                key={lec.id}
                id={`lecture-${lec.id}`}
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
                          <p key={j} className="whitespace-pre-line">{p}</p>
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

      <RevealOnScroll watch={activeCategory} />
    </main>
  );
}
