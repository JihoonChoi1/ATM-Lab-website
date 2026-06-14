"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHead from "@/components/ui/SectionHead";
import Thumb from "@/components/ui/Thumb";

// ─── Types ───────────────────────────────────────────────────────────────────

export type TabKey = "All" | "Journal" | "Conference" | "Patent";

export type PubItem = {
  id: string;
  num: string;
  year: string;
  title: string;
  meta: string;
  detail: string;
  authors: string;
  type: string;
};

export type ResearchCard = {
  num: string;
  eyebrow: string;
  title: string;
  href: string;
  img: string | null;
};

export type ProjectItem = {
  id: string;
  period: string;
  title: string;
  funder: string;
  active: boolean;
};

export type MemberChip = { id: string; initials: string; name: string; year: string | null };
export type MemberGroup = { label: string; count: string; members: MemberChip[] };

export type LectureItem = {
  id: string;
  num: string;
  category: "Undergraduate" | "Graduate";
  title: string;
  desc: string;
};

export type NewsItem = { id: string; day: string; month: string; title: string; body: string };
export type GalleryImg = { id: string; src: string; cap: string; span: string };
export type HeroStat = { value: string; label: string };

export type HomeData = {
  heroStats: HeroStat[];
  research: ResearchCard[];
  projects: ProjectItem[];
  publications: Record<TabKey, PubItem[]>;
  professorImg: string;
  professorKeywords: string[];
  publicationCount: number;
  memberGroups: MemberGroup[];
  lectures: LectureItem[];
  news: NewsItem[];
  gallery: GalleryImg[];
};

const PUB_TABS: TabKey[] = ["All", "Journal", "Conference", "Patent"];

// Bucket a pre-sorted (year desc) publication list into consecutive year groups.
function groupByYear(items: PubItem[]): { year: string; items: PubItem[] }[] {
  const groups: { year: string; items: PubItem[] }[] = [];
  for (const it of items) {
    const last = groups[groups.length - 1];
    if (last && last.year === it.year) last.items.push(it);
    else groups.push({ year: it.year, items: [it] });
  }
  return groups;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function HomeClient({
  heroStats,
  research,
  projects,
  publications,
  professorImg,
  professorKeywords,
  publicationCount,
  memberGroups,
  lectures,
  news,
  gallery,
}: HomeData) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("All");

  // Hero content fade on scroll
  useEffect(() => {
    const onScroll = () => {
      const { scrollY } = window;
      const vh = window.innerHeight;
      if (scrollY < vh * 1.1) {
        const p = Math.min(scrollY / vh, 1);
        const content = heroContentRef.current;
        if (content) {
          content.style.transform = `translate3d(0, ${scrollY * 0.18}px, 0) scale(${1 - p * 0.08})`;
          content.style.opacity = String(Math.max(0, 1 - p * 1.4));
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver for reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
          } else {
            e.target.classList.remove("in");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-stagger, .wo-cell").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);


  // Network graph animation — Ajou Blue nodes connected by proximity
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 40 : 80;
    const LINK_DIST = isMobile ? 120 : 160;

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    const nodes: Node[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: 1.5 + Math.random() * 2,
    }));

    const frame = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(0,102,255,${((1 - dist / LINK_DIST) * 0.3).toFixed(2)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,102,255,0.5)";
        ctx.fill();
      }

      animId = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const visiblePubs = groupByYear(publications[activeTab]);

  const undergradLectures = lectures.filter((l) => l.category === "Undergraduate");
  const gradLectures = lectures.filter((l) => l.category === "Graduate");

  return (
    <main>
      {/* ── Hero ── */}
      <header
        className="relative flex min-h-[640px] w-full items-center justify-center overflow-hidden"
        style={{ height: "100vh" }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        <div
          ref={heroContentRef}
          className="relative z-[3] max-w-[980px] px-6 text-center"
          style={{ willChange: "transform, opacity" }}
        >
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent-soft px-3.5 py-2 text-[12.5px] font-medium text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="font-mono">ATM&nbsp;LAB&nbsp;·&nbsp;EST.&nbsp;2014</span>
          </div>
          <h1 className="mb-6 font-bold leading-[1.02] tracking-[-0.035em] text-ink" style={{ fontSize: "clamp(44px,7vw,96px)" }}>
            Advanced<br />
            <span
              style={{
                background: "linear-gradient(120deg,#0066FF 0%, #3385FF 50%, #0066FF 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Thermal Management
            </span>{" "}
            Lab
          </h1>
          <p className="mx-auto max-w-[640px] leading-[1.5] text-ink-2" style={{ fontSize: "clamp(16px,1.6vw,20px)" }}>
            Advancing thermal solutions for next-generation technologies — from microelectronics cooling to sustainable energy systems.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-[13px] text-ink-3">
            {heroStats.map(({ value, label }) => (
              <span key={label}>
                <strong className="mb-0.5 block text-[22px] font-semibold tracking-[-0.01em] text-ink">{value}</strong>
                {label}
              </span>
            ))}
          </div>
        </div>

        <a
          href="#research"
          onClick={(e) => {
            // Keep this "scroll down" cue animated; everything else jumps instantly.
            e.preventDefault();
            document
              .getElementById("research")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="absolute bottom-9 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2.5 text-[11px] tracking-[0.18em] text-ink-3"
        >
          <span>SCROLL</span>
          <span className="scroll-line" />
        </a>
      </header>

      {/* ── Welcome + Contact ── */}
      <section id="welcome" className="bg-white">
        <div className="mx-auto max-w-container">
          <div className="wo-cell grid grid-cols-[1.1fr_1fr] items-start gap-16 px-8 py-[120px] max-[900px]:grid-cols-1 max-[900px]:gap-12 max-[640px]:px-5 max-[640px]:py-20">
            {/* Left: Welcome text */}
            <div className="reveal">
              <div className="mb-3.5 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
                Welcome
              </div>
              <h2 className="mb-7 font-bold leading-[0.95] tracking-[-0.04em]" style={{ fontSize: "clamp(48px,6vw,88px)" }}>
                Welcome.
              </h2>
              <div className="wo-rule" />
              <p className="text-[17px] leading-[1.75] text-ink-2">
                Welcome to the <strong className="font-semibold text-ink">Advanced Thermal Management Laboratory (ATM&nbsp;Lab)</strong> under the guidance of Prof. Jungho Lee in the Department of Mechanical Engineering at Ajou University.
              </p>
              <p className="mt-[18px] text-[17px] leading-[1.75] text-ink-2">
                We study heat transfer at the boundary of fundamental physics and real-world systems &mdash; from boiling on engineered surfaces to thermal control of next-generation electronics and energy storage. Our work pairs precision experiments with predictive modeling to push the limits of how heat moves through engineered systems.
              </p>
            </div>

            {/* Right: Contact */}
            <div className="reveal">
              <div className="mb-3.5 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
                Contact
              </div>
              <h2 className="mb-7 font-bold leading-[0.95] tracking-[-0.04em]" style={{ fontSize: "clamp(48px,6vw,88px)" }}>
                Join us.
              </h2>
              <div className="wo-rule" />
              <p className="text-[17px] leading-[1.75] text-ink-2">
                ATM Lab is recruiting <strong className="font-semibold text-ink">postdoctoral researchers</strong> and <strong className="font-semibold text-ink">graduate students</strong> with passionate and innovative minds.
              </p>
              <p className="mt-[18px] text-[17px] leading-[1.75] text-ink-2">
                If you are interested in joining the lab or collaborating, please contact Prof. Jungho Lee at{" "}
                <a href="mailto:jungholee@ajou.ac.kr" className="font-medium text-accent hover:underline">jungholee@ajou.ac.kr</a>.
              </p>
              <a
                href="https://grad.ajou.ac.kr/gs/admission/admission01.do"
                target="_blank"
                rel="noopener noreferrer"
                className="group/cta mt-8 inline-flex flex-col gap-1"
              >
                <span className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-ink-3">
                  Graduate admissions
                </span>
                <span className="inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-accent group-hover/cta:underline">
                  View admission process &amp; deadlines
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-1">
                    <path d="M5 12h14"/><path d="M13 5l7 7-7 7"/>
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Research ── */}
      <section id="research" className="relative bg-bg py-[120px]">
        <Container>
          <SectionHead
            eyebrow="Research Areas"
            title="Engineering heat at every scale."
            className="reveal"
          />
          <div className="research-grid reveal grid grid-cols-2 gap-5 max-[820px]:grid-cols-1">
            {research.map((item) => (
              <a
                key={item.num}
                href={item.href}
                className="group overflow-hidden rounded-[20px] border border-line bg-surface transition-[transform,box-shadow] duration-[350ms] hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-20px_rgba(0,102,255,.2)]"
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                  <span className="absolute right-4 top-4 z-10 font-mono text-[11px] font-medium tracking-[0.1em] text-white/80">
                    {item.num}
                  </span>
                  {item.img ? (
                    <Thumb
                      src={item.img}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-accent/15 to-accent/5" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/30 to-transparent" />
                </div>
                <div className="px-7 py-6">
                  <div className="mb-2 text-[11.5px] font-medium uppercase tracking-[0.14em] text-accent">
                    {item.eyebrow}
                  </div>
                  <h3 className="mb-4 text-[22px] font-semibold leading-[1.25] tracking-[-0.015em]">
                    {item.title}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent">
                    view more
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1">
                      <path d="M5 12h14" /><path d="M13 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="relative border-t border-line bg-white py-[120px]">
        <Container>
          <SectionHead
            eyebrow="Funded Projects"
            title={<>Active &amp; recent research projects.</>}
            sub="A selection of competitively-funded projects from national agencies and industry partners. Full list available on request."
            className="reveal"
          />
          <div className="reveal flex flex-col">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projects#project-${p.id}`}
                className="group grid grid-cols-[90px_1fr_auto] items-center gap-8 border-t border-line py-[26px] last:border-b transition-[padding] duration-[350ms] hover:pl-3.5 max-[780px]:grid-cols-1 max-[780px]:gap-2"
              >
                <div className="font-mono text-[12.5px] leading-[1.4] tracking-[0.02em] text-ink-3">
                  <b className="block text-sm font-semibold text-ink">{p.period}</b>
                </div>
                <div>
                  <div className="mb-1 text-[17px] font-semibold leading-[1.4] tracking-[-0.01em]">{p.title}</div>
                  <div className="text-[13.5px] text-ink-3">{p.funder}</div>
                </div>
                <span
                  className={`whitespace-nowrap rounded-md px-2.5 py-[5px] text-[11.5px] font-medium tracking-[0.04em] max-[780px]:justify-self-start ${p.active ? "bg-success-soft text-success" : "bg-[#f4f5f7] text-ink-2"
                    }`}
                >
                  {p.active ? "Active" : "Completed"}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-right">
            <a href="/projects" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-accent hover:underline">
              View all projects
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M5 12h14"/><path d="M13 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </Container>
      </section>

      {/* ── Publications ── */}
      <section
        id="publications"
        className="relative py-[120px] text-white"
        style={{ background: "#001F66" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(800px circle at 80% 0%, rgba(0,102,255,.25), transparent 50%), radial-gradient(600px circle at 0% 100%, rgba(51,133,255,.12), transparent 50%)",
          }}
        />
        <Container className="relative">
          <SectionHead
            eyebrow="Selected Publications"
            title="Journals · Conferences · Selected Patents"
            sub="Peer-reviewed articles, conference proceedings, and selected patents from the lab's work on thermal management and energy systems."
            variant="dark"
            stacked
            className="reveal"
          />

          <div className="reveal mb-8 flex flex-wrap gap-1.5">
            {PUB_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-200 ${activeTab === tab
                  ? "border-white bg-white text-dark"
                  : "border-white/[0.08] bg-white/[0.06] text-white/65 hover:bg-white/[0.1] hover:text-white"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="reveal flex flex-col">
            {visiblePubs.map((group) => (
              <div
                key={group.year}
                className="flex items-start gap-12 border-t border-white/[0.08] py-7 last:border-b last:border-white/[0.08] max-[680px]:flex-col max-[680px]:gap-4"
              >
                <div className="w-20 flex-none pt-1 font-mono text-[13px] font-medium tracking-[0.05em] text-accent-lighter">
                  {group.year}
                </div>
                <div className="flex flex-1 flex-col gap-6">
                  {group.items.map((item) => (
                      <Link key={item.id} href={`/publications/${item.id}`} className="group/item grid grid-cols-[24px_1fr_auto] items-start gap-5 transition-transform duration-300 hover:translate-x-1 max-[680px]:grid-cols-1">
                        <span className="pt-1 font-mono text-[12px] text-white/40 max-[680px]:hidden">{item.num}</span>
                        <div>
                          <div className="mb-1.5 text-[17px] font-medium leading-[1.4] tracking-[-0.005em] text-white">{item.title}</div>
                          <div className="mb-1.5 text-[13.5px] font-medium text-accent-lighter">
                            <em className="not-italic text-white/85">{item.meta}</em>
                            {", "}{item.detail}
                          </div>
                          <div className="text-[13.5px] leading-[1.5] text-white/55">{item.authors}</div>
                        </div>
                        <span className="self-start rounded px-2 py-1 text-[10.5px] font-medium tracking-[0.05em] text-accent-lighter max-[680px]:justify-self-start" style={{ background: "rgba(154,202,235,.2)" }}>
                          {item.type}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-right">
            <a href="/publications" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-accent-lighter hover:text-white">
              See all publications
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M5 12h14"/><path d="M13 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </Container>
      </section>

      {/* ── Members ── */}
      <section id="members" className="bg-white py-[120px]">
        <Container>
          <SectionHead
            eyebrow="People"
            title={<>A small team. A shared&nbsp;curiosity.</>}
            sub="Led by Prof. Jungho Lee, ATM Lab brings together researchers and students from mechanical engineering backgrounds. Alumni and full profiles on the Members page."
            className="reveal"
          />
          <div className="grid grid-cols-[1fr_1.4fr] items-start gap-12 max-[980px]:grid-cols-1">
            {/* Prof card */}
            <Link
              href="/members#professor"
              className="reveal group relative aspect-[4/5] overflow-hidden rounded-[24px] text-white"
              style={{ background: "#000D40", boxShadow: "0 30px 60px -25px rgba(0,0,0,.3)" }}
            >
              <Thumb
                src={professorImg}
                alt="Professor portrait"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,15,40,.85) 75%, rgba(0,15,40,.95) 100%), linear-gradient(135deg, rgba(0,102,255,.35) 0%, transparent 60%)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.15] px-3 py-[5px] text-[11.5px] font-medium tracking-[0.04em] backdrop-blur-[10px]">
                  PRINCIPAL INVESTIGATOR
                </span>
                <h3 className="mb-1 text-[30px] font-bold leading-[1.1] tracking-[-0.02em]">Prof. Jungho Lee</h3>
                <div className="mb-1 text-[13px] text-white/55">Ph.D. POSTECH · 1999</div>
                <div className="mb-4 text-[14px] text-white/75">Department of Mechanical Engineering · Ajou University</div>
                <div className="flex flex-wrap gap-1.5">
                  {professorKeywords.map((kw) => (
                    <span key={kw} className="rounded-md bg-white/[0.12] px-2.5 py-1 text-[11px] font-medium text-white/80">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </Link>

            {/* Members side */}
            <div className="flex flex-col gap-9">
              <p className="reveal text-[15.5px] leading-[1.7] text-ink-2">
                <strong className="font-semibold text-ink">Prof. Jungho Lee</strong> received his Ph.D. in Mechanical Engineering from POSTECH in 1999. His research spans phase-change heat transfer, data-center thermal management, thermosyphon-based waste-heat recovery, and boiling-driven heat spreaders, pairing precision experiments with predictive modeling. The lab&apos;s work is documented across {publicationCount} journal articles, conference papers, and patents.
              </p>
              {memberGroups.map((group) => (
                <div key={group.label} className="reveal">
                  <h4 className="mb-[18px] flex items-center gap-3.5 text-[12px] font-medium uppercase tracking-[0.15em] text-ink-3 after:h-px after:flex-1 after:bg-line after:content-['']">
                    <span>{group.label}</span>
                    <span className="font-mono text-accent">{group.count}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {group.members.map((m) => (
                      <Link
                        key={m.id}
                        href={`/members#member-${m.id}`}
                        className="inline-flex items-center gap-2 rounded-[10px] border border-transparent bg-[#f5f6f8] px-3.5 py-2.5 text-[14px] font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-white hover:shadow-[0_6px_18px_-8px_rgba(0,102,255,.4)]"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-light text-[10.5px] font-semibold tracking-[0.02em] text-white">
                          {m.initials}
                        </span>
                        {m.name}
                        {m.year && <span className="font-mono text-[11px] text-ink-3">{m.year}</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="reveal text-right">
                <a href="/members" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-accent hover:underline">
                  View all members
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M5 12h14"/><path d="M13 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Lectures ── */}
      <section id="lectures" className="bg-bg py-[120px]">
        <Container>
          <SectionHead
            eyebrow="Teaching"
            title="Courses taught at Ajou."
            sub="Prof. Lee teaches undergraduate and graduate courses on heat transfer, phase-change heat transfer, and experimental thermal-fluid mechanics. Course materials available on AjouBb."
            className="reveal"
          />
          <div className="flex flex-col gap-10">
            {[
              { label: "Undergraduate", courses: undergradLectures },
              { label: "Graduate", courses: gradLectures },
            ].map(({ label, courses }) => (
              <div key={label} className="reveal">
                <h3 className="mb-5 text-[13px] font-medium uppercase tracking-[0.15em] text-ink-3">{label}</h3>
                <div className="grid grid-cols-3 gap-[18px] max-[880px]:grid-cols-1">
                  {courses.map((lec) => (
                    <Link
                      key={lec.id}
                      href={`/lectures#lecture-${lec.id}`}
                      className="group flex flex-col gap-3 rounded-[18px] border border-line bg-white px-7 pb-6 pt-6 transition-[transform,box-shadow,border-color] duration-[350ms] hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-[0_24px_50px_-25px_rgba(0,102,255,.25)]"
                    >
                      <div className="text-[19px] font-semibold leading-[1.3] tracking-[-0.01em]">{lec.title}</div>
                      {lec.desc && <div className="flex-1 text-[13.5px] leading-[1.6] text-ink-3">{lec.desc}</div>}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Updates (Board) ── */}
      <section id="updates" className="bg-bg py-[120px]">
        <Container>
          <SectionHead
            eyebrow="Board"
            title={<>News &amp; gallery.</>}
            sub="Awards, conferences, and what daily life inside ATM Lab actually looks like."
            className="reveal"
          />
          <div className="grid grid-cols-2 items-start gap-12 max-[920px]:grid-cols-1 max-[920px]:gap-16">
            {/* News */}
            <div className="reveal">
              <div className="mb-6 flex items-baseline justify-between">
                <h3 className="text-[28px] font-bold tracking-[-0.02em]">News</h3>
                <a href="/board" className="text-[13px] font-medium text-accent">View all →</a>
              </div>
              <div className="flex flex-col gap-0.5">
                {news.map((item) => (
                  <Link
                    key={item.id}
                    href={`/board/news/${item.id}`}
                    className="flex gap-5 border-b border-line py-[22px] px-1 last:border-0 transition-[padding] duration-300 hover:pl-3.5"
                  >
                    <div className="w-[88px] flex-none font-mono text-[12px] text-ink-3">
                      <b className="mb-1 block font-sans text-[20px] font-semibold leading-none tracking-[-0.01em] text-ink">
                        {item.day}
                      </b>
                      {item.month}
                    </div>
                    <div className="min-w-0">
                      <h4 className="mb-1.5 line-clamp-2 text-[16px] font-semibold leading-[1.35] tracking-[-0.01em]">{item.title}</h4>
                      <p className="line-clamp-2 text-[14px] leading-[1.5] text-ink-3">{item.body}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div className="reveal">
              <div className="mb-6 flex items-baseline justify-between">
                <h3 className="text-[28px] font-bold tracking-[-0.02em]">Gallery</h3>
                <a href="/board#section-gallery" className="text-[13px] font-medium text-accent">More →</a>
              </div>
              <div className="grid grid-cols-2 gap-2.5" style={{ gridAutoRows: "140px" }}>
                {gallery.map((img) => (
                  <Link
                    key={img.id}
                    href={`/board/gallery/${img.id}`}
                    className={`group/gal relative block overflow-hidden rounded-[14px] bg-[#eee] ${img.span}`}
                  >
                    <Thumb
                      src={img.src}
                      alt={img.cap}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/gal:scale-[1.08]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/45 opacity-0 transition-opacity duration-[350ms] group-hover/gal:opacity-100" />
                    <span className="absolute bottom-3 left-3.5 z-[2] translate-y-1.5 text-[12px] font-medium tracking-[0.02em] text-white opacity-0 transition-all duration-[350ms] group-hover/gal:translate-y-0 group-hover/gal:opacity-100">
                      {img.cap}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

    </main>
  );
}
