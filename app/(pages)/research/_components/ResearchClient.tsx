"use client";

import { Fragment, useEffect, useState } from "react";
import Container from "@/components/ui/Container";

// ─── Types ───────────────────────────────────────────────────────────────────

type Figure = {
  w: number;
  h: number;
  caption: string;
  imgPath: string | null;
  wide: boolean;
};

type Sub = {
  num: string;
  title: string;
  body: string;
  keywords?: string[];
  figures: Figure[];
};

export type Topic = {
  num: string;
  bg: "white" | "bg";
  title: string;
  lead: string;
  keywords: string[];
  subs: Sub[];
};

export type ResearchData = {
  topics: Topic[];
  heroHeadline: string;
  heroParagraph: string;
  yearsValue: string;
  topicsCount: number;
  subtopicsCount: number;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function topicId(num: string): string {
  return `topic-${parseInt(num, 10)}`;
}

function figLabel(caption: string): string {
  const m = caption.match(/^(Fig\.\s*[\w·.]+[a-z]?)/i);
  return m ? m[1] : "Fig.";
}

function figBody(caption: string): string {
  return caption.replace(/^Fig\.\s*[\w·.]+[a-z]?\s*[—-]\s*/i, "");
}

type FigGroup =
  | { kind: "single"; fig: Figure }
  | { kind: "pair"; figs: [Figure, Figure] };

function groupFigures(figures: Figure[]): FigGroup[] {
  const groups: FigGroup[] = [];
  let i = 0;
  while (i < figures.length) {
    const f = figures[i];
    const isPortrait = f.w / f.h < 0.95;
    const next = figures[i + 1];
    const nextPortrait = next ? next.w / next.h < 0.95 : false;
    if (isPortrait && next && nextPortrait) {
      groups.push({ kind: "pair", figs: [f, next] });
      i += 2;
    } else {
      groups.push({ kind: "single", fig: f });
      i += 1;
    }
  }
  return groups;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

// Cap on a figure's rendered height. A portrait image rendered at full column
// width balloons vertically (a 0.63-ratio image at 480px wide is ~768px tall),
// dwarfing short body text. Bounding the height instead lets width follow the
// aspect ratio, so any ratio in any order renders within a consistent band.
// A "wide" (크게) gallery figure spans the full row, so it gets a taller cap.
const FIG_MAX_H = "clamp(260px, 40vh, 420px)";
const FIG_MAX_H_WIDE = "clamp(360px, 70vh, 640px)";

function FigureView({ fig, wide = false }: { fig: Figure; wide?: boolean }) {
  const ratio = `${fig.w}/${fig.h}`;
  const maxH = wide ? FIG_MAX_H_WIDE : FIG_MAX_H;
  return (
    <>
      <div className="flex justify-center rounded-[18px] border border-line bg-surface p-3">
        {fig.imgPath ? (
          // src is pre-resolved server-side to the sharp detail variant (or the
          // original GIF) — render it directly so figures stay crisp and GIFs play.
          // Height-capped + width:auto: never upscaled past its own pixels, never
          // taller than the band; max-w-full keeps wide banners inside the column.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fig.imgPath}
            alt={figBody(fig.caption)}
            loading="lazy"
            decoding="async"
            style={{ aspectRatio: ratio, maxHeight: maxH }}
            className="block h-auto w-auto max-w-full rounded-[12px]"
          />
        ) : (
          <div
            className="fig-placeholder relative flex items-center justify-center overflow-hidden rounded-[12px]"
            style={{
              aspectRatio: ratio,
              width: `calc(${fig.w} / ${fig.h} * ${maxH})`,
              maxWidth: "100%",
            }}
          >
            <div className="absolute left-3 top-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent/70">
              {figLabel(fig.caption)}
            </div>
            <div className="px-5 text-center">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent/75">Placeholder</div>
              <div className="mt-1 max-w-[360px] text-[13px] font-medium leading-[1.4] text-accent">
                {figBody(fig.caption)}
              </div>
            </div>
            <div className="absolute right-3 bottom-3 font-mono text-[10px] tracking-[0.04em] text-accent/50">
              {fig.w}×{fig.h}
            </div>
          </div>
        )}
      </div>
      <figcaption className="mt-2.5 px-1 font-mono text-[12px] leading-[1.5] text-ink-3">
        {fig.caption}
      </figcaption>
    </>
  );
}

function SubFigure({ figures }: { figures: Figure[] }) {
  const groups = groupFigures(figures);
  return (
    <div className="sub-figure reveal flex flex-col gap-4">
      {groups.map((g, i) =>
        g.kind === "pair" ? (
          <div key={i} className="grid grid-cols-2 gap-3">
            <figure>
              <FigureView fig={g.figs[0]} />
            </figure>
            <figure>
              <FigureView fig={g.figs[1]} />
            </figure>
          </div>
        ) : (
          <figure key={i}>
            <FigureView fig={g.fig} />
          </figure>
        )
      )}
    </div>
  );
}

function SubHeading({ sub }: { sub: Sub }) {
  return (
    <>
      <div className="mb-3 font-mono text-[12px] tracking-[0.04em] text-accent">{sub.num}</div>
      <h3
        className="mb-5 font-semibold tracking-[-0.015em] text-ink"
        style={{ fontSize: "clamp(22px,2.4vw,30px)", lineHeight: 1.2 }}
      >
        {sub.title}
      </h3>
    </>
  );
}

function SubBody({ sub }: { sub: Sub }) {
  return (
    <>
      <p className="whitespace-pre-line text-justify text-[16px] leading-[1.75] text-ink-2">{sub.body}</p>
      {sub.keywords && sub.keywords.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {sub.keywords.map((k) => (
            <span
              key={k}
              className="rounded-md bg-accent-soft px-2 py-[3px] text-[11.5px] font-medium text-accent-dark"
            >
              {k}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

function SubText({ sub, className }: { sub: Sub; className: string }) {
  return (
    <div className={className}>
      <SubHeading sub={sub} />
      <SubBody sub={sub} />
    </div>
  );
}

function SubRow({ sub }: { sub: Sub }) {
  // Adaptive layout. One figure → the alternating two-column editorial row.
  // Two+ figures → a paper-style stack: subsection heading first (orients the
  // reader), then the figures tiled in a row, then the body text. The side-by-side
  // column can't balance a short body against several stacked tall figures.
  if (sub.figures.length > 1) {
    const cols =
      sub.figures.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
    return (
      <div className="flex flex-col">
        <div className="reveal">
          <SubHeading sub={sub} />
        </div>
        <div className={`reveal mb-8 grid grid-cols-1 gap-4 ${cols}`}>
          {sub.figures.map((fig, i) => (
            <figure key={i} className={fig.wide ? "col-span-full" : undefined}>
              <FigureView fig={fig} wide={fig.wide} />
            </figure>
          ))}
        </div>
        <div className="reveal delay-1 max-w-[760px]">
          <SubBody sub={sub} />
        </div>
      </div>
    );
  }

  return (
    <div className="sub-row grid grid-cols-2 gap-x-12 gap-y-8 max-[820px]:grid-cols-1 max-[820px]:gap-y-6">
      <SubFigure figures={sub.figures} />
      <SubText sub={sub} className="sub-text reveal delay-1 flex flex-col" />
    </div>
  );
}

function TopicSection({ topic }: { topic: Topic }) {
  const id = topicId(topic.num);
  const bgClass = topic.bg === "bg" ? "bg-bg" : "bg-white";
  return (
    <section
      id={id}
      data-topic={id}
      className={`${bgClass} py-[120px] max-[640px]:py-[80px]`}
    >
      <Container>
        <div className="wo-cell mb-20 grid grid-cols-[auto_1fr] items-start gap-x-10 gap-y-5 max-[820px]:grid-cols-1 max-[820px]:gap-x-0 max-[820px]:gap-y-3 max-[640px]:mb-14">
          <div
            className="reveal font-mono font-semibold tracking-[-0.04em] text-accent leading-none"
            style={{ fontSize: "clamp(64px,8vw,120px)" }}
          >
            {topic.num}
          </div>
          <div className="reveal">
            <div className="mb-3.5 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
              Research Topic {topic.num}
            </div>
            <h2
              className="mb-5 font-bold tracking-[-0.03em] text-ink"
              style={{ fontSize: "clamp(36px,4.5vw,60px)", lineHeight: 1.05 }}
            >
              {topic.title}
            </h2>
            {topic.lead && (
              <p className="mb-5 max-w-[620px] whitespace-pre-line text-[17px] leading-[1.6] text-ink-2">
                {topic.lead}
              </p>
            )}
            <div className="wo-rule" />
            {topic.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {topic.keywords.map((k) => (
                  <span
                    key={k}
                    className="rounded-md border border-line bg-white px-2.5 py-1 text-[11.5px] font-medium text-ink-2"
                  >
                    {k}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {topic.subs.map((sub, i) => (
            // .sub-block is the alternation counter: nth-child(even) here flips
            // the figure to the right (see .sub-block CSS in globals.css).
            <div key={sub.num} className="sub-block">
              {i > 0 && <div className="my-16 border-t border-line max-[820px]:my-12" />}
              <SubRow sub={sub} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ResearchClient({
  topics,
  heroHeadline,
  heroParagraph,
  yearsValue,
  topicsCount,
  subtopicsCount,
}: ResearchData) {
  const [activeId, setActiveId] = useState<string>(
    topics.length ? topicId(topics[0].num) : ""
  );

  // Reveal-on-scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .wo-cell").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Sticky TOC active-pill tracking. Deliberately NOT an IntersectionObserver:
  // the sections are far taller than the viewport, so intersectionRatio
  // (intersection ÷ section height) is tiny and its max scales with viewport
  // height — on short screens a section's ratio could land between two thresholds
  // and never fire while it was the active one, skipping its pill entirely.
  // Instead: the active topic is simply the last section whose top has scrolled
  // above a fixed reference line. No height/threshold dead zones, viewport-stable.
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[data-topic]")
    );
    if (!sections.length) return;

    const LINE = 200; // px below the viewport top (clears navbar + sticky TOC)
    const update = () => {
      let current = sections[0].dataset.topic ?? "";
      // Section tops increase down the page, so once one is below the line the
      // rest are too — take the last one still above it.
      for (const s of sections) {
        if (s.getBoundingClientRect().top > LINE) break;
        current = s.dataset.topic ?? current;
      }
      setActiveId(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Scroll-padding so anchor jumps clear navbar (72px) + sticky TOC
  useEffect(() => {
    const prev = document.documentElement.style.scrollPaddingTop;
    document.documentElement.style.scrollPaddingTop = "140px";
    return () => {
      document.documentElement.style.scrollPaddingTop = prev;
    };
  }, []);

  return (
    <main>
      {/* ── Hero ── */}
      <section className="bg-white pt-[140px] pb-[72px] max-[640px]:pt-[112px]">
        <Container>
          <div className="wo-cell grid grid-cols-[1.4fr_1fr] items-end gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-8">
            <div className="reveal">
              <div className="mb-3.5 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
                Research
              </div>
              <h1
                className="mb-7 font-bold leading-[0.98] tracking-[-0.035em] text-ink"
                style={{ fontSize: "clamp(40px,5.5vw,76px)" }}
              >
                {heroHeadline.split("\n").map((line, i) => (
                  <Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
              </h1>
              <div className="wo-rule" />
              <p className="max-w-[560px] whitespace-pre-line text-[17px] leading-[1.7] text-ink-2">
                {heroParagraph}
              </p>
            </div>
            <div className="reveal delay-1 flex flex-col gap-4 justify-self-end max-[900px]:justify-self-start">
              <div className="grid grid-cols-3 gap-6 rounded-[18px] border border-line bg-surface px-7 py-6">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">Topics</div>
                  <div className="mt-1 text-[28px] font-semibold tracking-[-0.02em] text-ink">
                    {String(topicsCount).padStart(2, "0")}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">Subtopics</div>
                  <div className="mt-1 text-[28px] font-semibold tracking-[-0.02em] text-ink">
                    {String(subtopicsCount).padStart(2, "0")}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">Years</div>
                  <div className="mt-1 text-[28px] font-semibold tracking-[-0.02em] text-ink">{yearsValue}</div>
                </div>
              </div>
              <div className="font-mono text-[11.5px] tracking-[0.04em] text-ink-3 text-right max-[900px]:text-left">
                ATM-LAB · RESEARCH OVERVIEW · 2026
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Sticky topic navigator ── */}
      <div className="sticky top-[72px] z-40 border-y border-line bg-white/[0.85] backdrop-blur-[14px] backdrop-saturate-[180%]">
        <Container>
          <div className="pill-row flex items-center gap-2 overflow-x-auto py-3.5 max-[640px]:-mx-5 max-[640px]:px-5">
            <span className="pr-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-3 shrink-0 max-[640px]:hidden">
              Topics
            </span>
            {topics.map((t) => {
              const id = topicId(t.num);
              const active = activeId === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`inline-flex shrink-0 items-center gap-2.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 ${
                    active
                      ? "border-accent bg-accent text-white"
                      : "border-line bg-white text-ink-2 hover:bg-accent-soft hover:text-accent hover:border-accent/30"
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] tracking-[0.04em] ${active ? "" : "opacity-80"}`}
                  >
                    {t.num}
                  </span>
                  <span>{t.title}</span>
                </a>
              );
            })}
          </div>
        </Container>
      </div>

      {/* ── Topic sections ── */}
      {topics.map((t) => (
        <TopicSection key={t.num} topic={t} />
      ))}
    </main>
  );
}
