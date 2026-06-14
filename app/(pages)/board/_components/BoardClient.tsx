"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Thumb from "@/components/ui/Thumb";

// ─── Types ───────────────────────────────────────────────────────────────────

export type NewsItem = {
  id: string;
  num: string;
  date: string;
  title: string;
};

export type GalleryItem = {
  id: string;
  num: string;
  date: string;
  title: string;
  imgPath: string | null;
};

type SectionId = "section-news" | "section-gallery";

// ─── Component ───────────────────────────────────────────────────────────────

export default function BoardClient({
  news,
  gallery,
}: {
  news: NewsItem[];
  gallery: GalleryItem[];
}) {
  const [activeId, setActiveId] = useState<SectionId>("section-news");

  const TOC_ITEMS: Array<{ id: SectionId; label: string; count: string }> = [
    { id: "section-news", label: "News", count: String(news.length).padStart(2, "0") },
    { id: "section-gallery", label: "Gallery", count: String(gallery.length).padStart(2, "0") },
  ];

  // Reveal-on-scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        }),
      // Fire as soon as an element is about to peek in from the bottom (pre-trigger
      // 10% of the viewport) rather than 40px after it has entered.
      { threshold: 0, rootMargin: "0px 0px 10% 0px" }
    );
    document.querySelectorAll(".reveal, .wo-cell").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Sticky TOC active-pill tracking — reference-line method.
  // At any scroll position, the active section is whichever one currently
  // contains the reference line (just below sticky navbar + TOC). This is
  // deterministic and never oscillates, unlike "highest intersection ratio".
  useEffect(() => {
    const sectionIds: SectionId[] = ["section-news", "section-gallery"];
    const REFERENCE_LINE = 140; // px from viewport top (below 72px nav + ~52px TOC)

    function update() {
      let current: SectionId = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        // Section is "active" if its top edge has crossed above the reference line.
        if (el.getBoundingClientRect().top - REFERENCE_LINE <= 0) {
          current = id;
        }
      }
      setActiveId((prev) => (prev === current ? prev : current));
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Scroll-padding so anchor jumps clear navbar + sticky TOC
  useEffect(() => {
    const prev = document.documentElement.style.scrollPaddingTop;
    document.documentElement.style.scrollPaddingTop = "132px";
    return () => {
      document.documentElement.style.scrollPaddingTop = prev;
    };
  }, []);

  return (
    <main>
      {/* ── Hero ── */}
      <section className="bg-white pt-[140px] pb-[72px] max-[640px]:pt-[112px] max-[640px]:pb-12">
        <Container>
          <div className="wo-cell grid grid-cols-[1.4fr_1fr] items-end gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-8">
            <div className="reveal">
              <div className="mb-3.5 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
                <span className="font-mono">Board</span>
              </div>
              <h1
                className="mb-7 font-bold leading-[0.98] tracking-[-0.035em] text-ink"
                style={{ fontSize: "clamp(40px,5.5vw,76px)" }}
              >
                News &amp; moments
                <br />
                from the lab.
              </h1>
              <div className="wo-rule" />
              <p className="max-w-[560px] text-[17px] leading-[1.7] text-ink-2">
                Press coverage, awards, and grant announcements alongside photos from conferences,
                kickoff meetings, and lab events. Korean titles are preserved verbatim from the
                legacy site.
              </p>
            </div>
            <div className="reveal delay-1 flex flex-col gap-4 justify-self-end max-[900px]:justify-self-start">
              <div className="grid grid-cols-3 gap-6 rounded-[18px] border border-line bg-surface px-7 py-6">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
                    News
                  </div>
                  <div className="mt-1 text-[28px] font-semibold tracking-[-0.02em] text-ink">
                    {String(news.length).padStart(2, "0")}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
                    Gallery
                  </div>
                  <div className="mt-1 text-[28px] font-semibold tracking-[-0.02em] text-ink">
                    {String(gallery.length).padStart(2, "0")}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
                    Years
                  </div>
                  <div className="mt-1 text-[28px] font-semibold tracking-[-0.02em] text-ink">
                    21–25
                  </div>
                </div>
              </div>
              <div className="font-mono text-[11.5px] tracking-[0.04em] text-ink-3 text-right max-[900px]:text-left">
                ATM-LAB · BOARD · 2021 — 2025
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Sticky TOC ── */}
      <div className="sticky top-[72px] z-40 border-y border-line bg-white/[0.85] backdrop-blur-[14px] backdrop-saturate-[180%]">
        <Container>
          <div
            className="pill-row flex items-center gap-2 overflow-x-auto py-3.5 max-[640px]:-mx-5 max-[640px]:px-5"
            role="tablist"
            aria-label="Board sections"
          >
            <span className="pr-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-3 shrink-0 max-[640px]:hidden">
              Sections
            </span>
            {TOC_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={item.id}
                  className={`group inline-flex shrink-0 items-center gap-2.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 ${
                    isActive
                      ? "border-accent bg-accent text-white"
                      : "border-line bg-white text-ink-2 hover:bg-accent-soft hover:text-accent hover:border-accent/30"
                  }`}
                >
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] opacity-80">
                    {item.label}
                  </span>
                  <span
                    className={`font-mono text-[11px] tracking-[0.04em] ${
                      isActive ? "text-white/80" : "text-accent"
                    }`}
                  >
                    {item.count}
                  </span>
                </a>
              );
            })}
          </div>
        </Container>
      </div>

      {/* ── News ── */}
      <section id="section-news" className="bg-white py-[120px] max-[640px]:py-20">
        <Container>
          <div className="wo-cell mb-12 flex flex-wrap items-end justify-between gap-10 reveal">
            <div>
              <div className="mb-3.5 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
                <span className="font-mono">01 — Announcements</span>
              </div>
              <h2
                className="font-bold leading-[1.05] tracking-[-0.03em] text-ink"
                style={{ fontSize: "clamp(34px,4vw,52px)" }}
              >
                News
              </h2>
              <div className="wo-rule mt-6" />
            </div>
            <p className="max-w-[380px] text-base leading-[1.6] text-ink-3">
              Press coverage, awards, and funded-grant announcements involving the lab. Korean titles
              are preserved exactly as they appeared on the legacy ATM Lab board.
            </p>
          </div>

          <ol className="border-y border-line">
            {news.map((n, i) => (
              <li
                key={n.num}
                className="reveal group grid grid-cols-[88px_120px_1fr_auto] gap-x-8 items-baseline py-7 px-2 border-b border-line last:border-b-0 max-[820px]:grid-cols-[64px_1fr] max-[820px]:gap-y-2 max-[820px]:py-6"
                style={{ transitionDelay: `${Math.min(i * 80, 600)}ms` }}
              >
                {/* mono index */}
                <span
                  className="font-mono font-semibold text-accent leading-none tracking-[-0.03em] max-[820px]:text-[22px]"
                  style={{ fontSize: "clamp(24px,2.4vw,30px)" }}
                >
                  {n.num}
                </span>
                {/* date (desktop) */}
                <span className="font-mono text-[12.5px] uppercase tracking-[0.08em] text-ink-3 max-[820px]:hidden">
                  {n.date}
                </span>
                {/* title */}
                <Link
                  href={`/board/news/${n.id}`}
                  lang="ko"
                  className="text-ink font-semibold tracking-[-0.01em] leading-[1.45] group-hover:text-accent transition-colors"
                  style={{ fontSize: "clamp(17px,1.6vw,20px)" }}
                >
                  {n.title}
                </Link>
                {/* arrow */}
                <span
                  className="font-mono text-[14px] text-ink-3 group-hover:text-accent transition-[transform,color] group-hover:translate-x-1 max-[820px]:hidden"
                  aria-hidden="true"
                >
                  →
                </span>
                {/* date (mobile) */}
                <span className="hidden max-[820px]:inline-block max-[820px]:col-start-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-3">
                  {n.date}
                </span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── Gallery ── */}
      <section id="section-gallery" className="bg-bg py-[120px] max-[640px]:py-20">
        <Container>
          <div className="wo-cell mb-12 flex flex-wrap items-end justify-between gap-10 reveal">
            <div>
              <div className="mb-3.5 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
                <span className="font-mono">02 — Photos</span>
              </div>
              <h2
                className="font-bold leading-[1.05] tracking-[-0.03em] text-ink"
                style={{ fontSize: "clamp(34px,4vw,52px)" }}
              >
                Gallery
              </h2>
              <div className="wo-rule mt-6" />
            </div>
            <p className="max-w-[380px] text-base leading-[1.6] text-ink-3">
              Conference attendances, kickoff meetings, lab group photos, and invited seminars.
              Original thumbnails will be migrated from the legacy server.
            </p>
          </div>

          <ul className="grid grid-cols-4 gap-6 max-[1024px]:grid-cols-3 max-[1024px]:gap-5 max-[640px]:grid-cols-2 max-[640px]:gap-4">
            {gallery.map((g, i) => (
              <li
                key={`${g.num}-${g.date}`}
                className="group reveal"
                style={{ transitionDelay: `${Math.min(i * 50, 200)}ms` }}
              >
                <Link href={`/board/gallery/${g.id}`} className="block" aria-label={g.title}>
                  <div className="relative overflow-hidden rounded-[14px] border border-line bg-surface p-2.5 transition-[transform,box-shadow,border-color] duration-300 group-hover:-translate-y-1.5 group-hover:border-accent/30 group-hover:shadow-[0_24px_50px_-25px_rgba(0,102,255,.25)]">
                    {g.imgPath ? (
                      <Thumb
                        src={g.imgPath}
                        alt={g.title}
                        className="aspect-[4/3] w-full rounded-[10px] object-cover"
                      />
                    ) : (
                      // placeholder thumbnail (no legacy image available)
                      <div className="aspect-[4/3] w-full rounded-[10px] bg-accent-soft flex items-center justify-center px-4 text-center">
                        <div className="space-y-1.5">
                          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent/70">
                            IMG · {g.date}
                          </div>
                          <div
                            lang="ko"
                            className="font-mono text-[11.5px] text-accent leading-[1.45] line-clamp-3"
                          >
                            {g.title}
                          </div>
                        </div>
                      </div>
                    )}
                    {/* mono index pinned top-left */}
                    <span className="absolute top-4 left-4 font-mono text-[10.5px] uppercase tracking-[0.14em] bg-white/90 backdrop-blur rounded-full px-2 py-[3px] text-accent border border-accent/20">
                      {g.num}
                    </span>
                  </div>
                  {/* caption */}
                  <div className="mt-3 px-1">
                    <h3
                      lang="ko"
                      className="text-[14.5px] font-semibold text-ink leading-[1.45] line-clamp-2 group-hover:text-accent transition-colors"
                    >
                      {g.title}
                    </h3>
                    <p className="mt-1.5 font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-3">
                      {g.date}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </main>
  );
}
