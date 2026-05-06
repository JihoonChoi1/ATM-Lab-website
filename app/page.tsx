"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/ui/Container";
import SectionHead from "@/components/ui/SectionHead";

// ─── Data ────────────────────────────────────────────────────────────────────

const RESEARCH_ITEMS = [
  {
    num: "01",
    eyebrow: "Research Topic 01",
    title: "Two-phase Cooling",
    href: "/research",
    img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80",
  },
  {
    num: "02",
    eyebrow: "Research Topic 02",
    title: "Battery Thermal Management",
    href: "/research",
    img: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80",
  },
  {
    num: "03",
    eyebrow: "Research Topic 03",
    title: "Phase-Change Materials",
    href: "/research",
    img: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80",
  },
  {
    num: "04",
    eyebrow: "Research Topic 04",
    title: "Heat Pumps & Energy Systems",
    href: "/research",
    img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80",
  },
];

const PROJECTS = [
  { period: "2026 — 2029", duration: "3 yr", title: "AI-driven thermal control of immersion-cooled lithium-ion battery packs", funder: "National Research Foundation of Korea (NRF) · Mid-career Researcher Program", active: true },
  { period: "2025 — 2028", duration: "3 yr", title: "Hybrid jet–spray cooling architecture for kilowatt-class AI accelerators", funder: "Samsung Electronics · Industry-Academia Research Program", active: true },
  { period: "2024 — 2027", duration: "3 yr", title: "Composite phase-change materials for grid-scale thermal energy storage", funder: "Korea Institute of Energy Technology Evaluation and Planning (KETEP)", active: true },
  { period: "2023 — 2026", duration: "3 yr", title: "Critical heat flux enhancement on hierarchical micro-/nano-engineered surfaces", funder: "National Research Foundation of Korea (NRF) · Basic Research Program", active: true },
  { period: "2022 — 2025", duration: "3 yr", title: "Compact heat pump system with low-GWP refrigerant blends", funder: "LG Electronics · Joint R&D Project", active: false },
  { period: "2021 — 2024", duration: "3 yr", title: "Two-phase loop thermosyphon for vertically stacked power semiconductors", funder: "Hyundai Motor Group · Open Innovation Project", active: false },
];

const PUBLICATIONS = [
  {
    year: "2026", items: [
      { num: "01", title: "Hybrid jet–spray cooling for kilowatt-scale GPU thermal loads.", meta: "International Journal of Heat and Mass Transfer", detail: "226, 2026.", authors: <>J. Park, <b>S. Kim</b>, H. Lee, et al.</>, type: "JOURNAL" },
      { num: "02", title: "Composite paraffin–graphene PCM with anisotropic conductivity for fast-charging modules.", meta: "Applied Thermal Engineering", detail: "238, 2026.", authors: <>M. Choi, <b>S. Kim</b>, J. Yoon.</>, type: "JOURNAL" },
    ]
  },
  {
    year: "2025", items: [
      { num: "03", title: "Critical heat flux enhancement on biphilic micro-pillared surfaces under subcooled flow boiling.", meta: "International Journal of Heat and Mass Transfer", detail: "219, 2025.", authors: <>D. Hwang, <b>S. Kim</b>, K. Han.</>, type: "JOURNAL" },
      { num: "04", title: "Predictive thermal control of immersion-cooled lithium-ion modules using physics-informed networks.", meta: "Energy Conversion and Management", detail: "312, 2025.", authors: <>Y. Seo, J. Park, <b>S. Kim</b>.</>, type: "JOURNAL" },
      { num: "05", title: "Dielectric immersion cooling system for high-density AI server racks.", meta: "KR Patent 10-2025-0094821", detail: "2025.", authors: <><b>S. Kim</b>, J. Park, M. Choi.</>, type: "PATENT" },
      { num: "06", title: "Two-phase loop thermosyphon design for vertically stacked power semiconductors.", meta: "Proc. ASME InterPACK 2025", detail: "San Diego, USA.", authors: <>H. Lee, <b>S. Kim</b>.</>, type: "CONFERENCE" },
    ]
  },
  {
    year: "2024", items: [
      { num: "07", title: "Visualization of dropwise condensation on hybrid wettability surfaces under high heat flux.", meta: "International Journal of Heat and Mass Transfer", detail: "215, 2024.", authors: <>K. Han, <b>S. Kim</b>, D. Hwang.</>, type: "JOURNAL" },
      { num: "08", title: "Compact heat pump with low-GWP refrigerant blend for cold-climate residential heating.", meta: "Applied Energy", detail: "358, 2024.", authors: <>J. Yoon, M. Choi, <b>S. Kim</b>.</>, type: "JOURNAL" },
      { num: "09", title: "Experimental study of jet impingement on micro-finned copper substrates.", meta: "Proc. IHTC-17", detail: "Cape Town, South Africa.", authors: <>J. Park, H. Lee, <b>S. Kim</b>.</>, type: "CONFERENCE" },
    ]
  },
  {
    year: "2023", items: [
      { num: "10", title: "Pool boiling heat transfer on hierarchical nano-/micro-structured copper.", meta: "International Communications in Heat and Mass Transfer", detail: "144, 2023.", authors: <>D. Hwang, K. Han, <b>S. Kim</b>.</>, type: "JOURNAL" },
      { num: "11", title: "Thermal performance of 21700 cylindrical cells under hybrid cold-plate / PCM cooling.", meta: "Journal of Power Sources", detail: "580, 2023.", authors: <>Y. Seo, <b>S. Kim</b>.</>, type: "JOURNAL" },
    ]
  },
];

const MEMBER_GROUPS = [
  {
    label: "Researchers",
    count: "02",
    members: [
      { initials: "JP", name: "Jiyoung Park", year: "'22" },
      { initials: "HL", name: "Hyunsoo Lee", year: "'24" },
    ],
  },
  {
    label: "Ph.D. Students",
    count: "05",
    members: [
      { initials: "DH", name: "Dongwoo Hwang", year: "'21" },
      { initials: "KH", name: "Kyungmin Han", year: "'22" },
      { initials: "YS", name: "Yejin Seo", year: "'23" },
      { initials: "MC", name: "Minjae Choi", year: "'24" },
      { initials: "JY", name: "Junho Yoon", year: "'25" },
    ],
  },
  {
    label: "M.S. Students",
    count: "05",
    members: [
      { initials: "SR", name: "Soohyun Ryu", year: "'24" },
      { initials: "EJ", name: "Eunji Jang", year: "'24" },
      { initials: "TW", name: "Taewoo Bae", year: "'25" },
      { initials: "HK", name: "Haram Kang", year: "'25" },
      { initials: "JN", name: "Jinwoo Nam", year: "'25" },
    ],
  },
  {
    label: "Undergrad / Intern",
    count: "02",
    members: [
      { initials: "SM", name: "Sumin Oh", year: "'26" },
      { initials: "TK", name: "Taehoon Kim", year: "'26" },
    ],
  },
];

const LECTURES = [
  { code: "ME 304", title: "Heat Transfer", desc: "Fundamentals of conduction, convection, and radiation. Steady and transient analysis with engineering applications in electronics cooling and HVAC.", semester: "Spring", credits: "3 credits", level: "Undergrad", grad: false },
  { code: "ME 201", title: "Thermodynamics I", desc: "First and second laws of thermodynamics, properties of pure substances, and analysis of closed and open systems. Cycle analysis introduction.", semester: "Fall", credits: "3 credits", level: "Undergrad", grad: false },
  { code: "ME 503", title: "Two-phase Flow & Boiling", desc: "Phase-change heat transfer phenomena: nucleate boiling, critical heat flux, condensation, and engineered surface enhancement strategies.", semester: "Spring", credits: "3 credits", level: "Graduate", grad: true },
  { code: "ME 521", title: "Advanced Heat Transfer", desc: "Numerical and analytical methods for complex heat transfer problems, including microscale transport and porous media.", semester: "Fall", credits: "3 credits", level: "Graduate", grad: true },
  { code: "ME 612", title: "Thermal Management of Electronics", desc: "System-level thermal design for high-power electronics: heat sinks, cold plates, immersion cooling, and battery thermal management.", semester: "Spring", credits: "3 credits", level: "Graduate", grad: true },
  { code: "ME 101", title: "Introduction to Mechanical Engineering", desc: "Survey course introducing core mechanical engineering disciplines, design thinking, and modern research frontiers.", semester: "Fall", credits: "2 credits", level: "Undergrad", grad: false },
];

const NEWS = [
  { day: "04", month: "APR 2026", tag: "AWARD", title: "Dongwoo Hwang receives Best Paper Award at KSME Spring Conference 2026 for outstanding research contributions in thermal engineering", body: "The award recognizes his pioneering work on hierarchically structured surfaces that significantly enhance critical heat flux under subcooled flow boiling conditions, with implications for next-generation electronics cooling." },
  { day: "18", month: "MAR 2026", tag: "GRANT", title: "ATM Lab awarded new 3-year NRF mid-career grant on AI-driven battery thermal management for electric vehicle applications", body: "The project will develop physics-informed neural network control strategies for immersion-cooled EV battery packs, targeting safer fast-charging cycles and extended battery lifetime under extreme thermal loads." },
  { day: "22", month: "FEB 2026", tag: "PUBLICATION", title: <>New paper accepted in <em>Int. J. Heat and Mass Transfer</em></>, body: "Hybrid jet–spray cooling architecture for kilowatt-scale GPU thermal loads." },
  { day: "09", month: "JAN 2026", tag: "PEOPLE", title: "Sumin Oh joins ATM Lab as M.S. student", body: "Welcome Sumin, who will be working on PCM composites for grid-scale storage." },
  { day: "11", month: "DEC 2025", tag: "EVENT", title: "Lab attends ASME IMECE 2025 in Columbus, OH", body: "Three oral presentations and two posters from current students and postdocs." },
];

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1400&q=80", cap: "Two-phase cooling testbed · 2025", span: "col-span-2" },
  { src: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=900&q=80", cap: "Surface fabrication", span: "row-span-2" },
  { src: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=900&q=80", cap: "Infrared imaging", span: "" },
  { src: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=900&q=80", cap: "Lab seminar", span: "" },
  { src: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1400&q=80", cap: "Group photo · Spring 2025 retreat", span: "col-span-2" },
];

const PUB_TABS = ["All", "Journal", "Conference", "Patent"];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Home() {
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("All");

  // Scroll-driven parallax + hero fade
  useEffect(() => {
    const onScroll = () => {
      const { scrollY } = window;
      const vh = window.innerHeight;
      if (scrollY < vh * 1.1) {
        const p = Math.min(scrollY / vh, 1);
        const bg = heroBgRef.current;
        const content = heroContentRef.current;
        if (bg) {
          if (scrollY > 4) {
            bg.style.animation = "none";
            bg.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0) scale(${1.12 + p * 0.15})`;
          } else {
            bg.style.animation = "";
            bg.style.transform = "";
          }
        }
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
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-stagger, .wo-cell").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);


  // Spawn rising bubbles
  useEffect(() => {
    const layer = bubblesRef.current;
    if (!layer) return;
    const COUNT = 22;
    for (let i = 0; i < COUNT; i++) {
      const b = document.createElement("span");
      b.className = "bubble";
      const size = 6 + Math.random() * 38;
      const left = Math.random() * 100;
      const dur = 9 + Math.random() * 11;
      const delay = -Math.random() * dur;
      b.style.width = b.style.height = size + "px";
      b.style.left = left + "%";
      b.style.animationDuration = dur + "s";
      b.style.animationDelay = delay + "s";
      layer.appendChild(b);
    }
  }, []);

  const visiblePubs = PUBLICATIONS.reduce(
    (acc: typeof PUBLICATIONS, group) => {
      const taken = acc.reduce((s, g) => s + g.items.length, 0);
      if (taken >= 10) return acc;
      const filtered = group.items.filter(
        (item) => activeTab === "All" || item.type === activeTab.toUpperCase()
      );
      if (filtered.length === 0) return acc;
      acc.push({ ...group, items: filtered.slice(0, 10 - taken) });
      return acc;
    },
    []
  );

  return (
    <main>
      {/* ── Hero ── */}
      <header
        className="relative flex min-h-[640px] w-full items-center justify-center overflow-hidden text-white"
        style={{ height: "100vh" }}
      >
        <div
          ref={heroBgRef}
          className="hero-bg"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=2400&q=85')" }}
        />
        <div className="hero-sheen" />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 25% 30%, rgba(26,86,219,.55) 0%, transparent 50%), radial-gradient(ellipse at 85% 80%, rgba(91,141,239,.3) 0%, transparent 55%), linear-gradient(180deg, rgba(4,7,16,.35) 0%, rgba(4,7,16,.55) 55%, rgba(4,7,16,.92) 100%)",
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at center, black 0%, transparent 75%)",
          }}
        />
        <div ref={bubblesRef} className="absolute inset-0 z-[1] overflow-hidden pointer-events-none" />

        <div
          ref={heroContentRef}
          className="relative z-[3] max-w-[980px] px-6 text-center"
          style={{ willChange: "transform, opacity" }}
        >
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/[0.06] px-3.5 py-2 text-[12.5px] font-medium backdrop-blur-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-light" style={{ boxShadow: "0 0 12px #5b8def" }} />
            <span className="font-mono">ATM&nbsp;LAB&nbsp;·&nbsp;EST.&nbsp;2014</span>
          </div>
          <h1 className="mb-6 font-bold leading-[1.02] tracking-[-0.035em]" style={{ fontSize: "clamp(44px,7vw,96px)" }}>
            Advanced<br />
            <span
              style={{
                background: "linear-gradient(120deg,#fff 0%, #a8c2ff 50%, #fff 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Thermal Management
            </span>{" "}
            Lab
          </h1>
          <p className="mx-auto max-w-[640px] leading-[1.5] text-white/78" style={{ fontSize: "clamp(16px,1.6vw,20px)" }}>
            Advancing thermal solutions for next-generation technologies — from microelectronics cooling to sustainable energy systems.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-[13px] text-white/65">
            {[
              { value: "62+", label: "Peer-reviewed papers" },
              { value: "14", label: "Active researchers" },
              { value: "9", label: "Industry partners" },
            ].map(({ value, label }) => (
              <span key={label}>
                <strong className="mb-0.5 block text-[22px] font-semibold tracking-[-0.01em] text-white">{value}</strong>
                {label}
              </span>
            ))}
          </div>
        </div>

        <a
          href="#research"
          className="absolute bottom-9 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2.5 text-[11px] tracking-[0.18em] text-white/70"
        >
          <span>SCROLL</span>
          <span className="scroll-line" />
        </a>
      </header>

      {/* ── Welcome + Contact ── */}
      <section id="welcome" className="bg-white">
        <div className="mx-auto max-w-container">
          <div className="wo-cell reveal grid grid-cols-[1.1fr_1fr] items-start gap-16 px-8 py-[120px] max-[900px]:grid-cols-1 max-[900px]:gap-12 max-[640px]:px-5 max-[640px]:py-20">
            {/* Left: Welcome text */}
            <div>
              <div className="mb-3.5 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent before:block before:h-px before:w-[18px] before:bg-accent before:content-['']">
                Welcome
              </div>
              <h2 className="mb-7 font-bold leading-[0.95] tracking-[-0.04em]" style={{ fontSize: "clamp(48px,6vw,88px)" }}>
                Welcome.
              </h2>
              <div className="wo-rule" />
              <p className="text-[17px] leading-[1.75] text-ink-2">
                Welcome to the <strong className="font-semibold text-ink">Advanced Thermal Management Laboratory (ATM&nbsp;Lab)</strong> under the guidance of Prof. Seungwon Kim in the Department of Mechanical Engineering at Ajou University.
              </p>
              <p className="mt-[18px] text-[17px] leading-[1.75] text-ink-2">
                We study heat transfer at the boundary of fundamental physics and real-world systems &mdash; from boiling on engineered surfaces to thermal control of next-generation electronics and energy storage. Our work pairs precision experiments with predictive modeling to push the limits of how heat moves through engineered systems.
              </p>
            </div>

            {/* Right: Contact card */}
            <div
              className="relative overflow-hidden rounded-[28px] p-10 text-white max-[640px]:p-7"
              style={{ background: "linear-gradient(135deg,#0d1428 0%, #1a2a4d 60%, #1A56DB 130%)" }}
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 80% 20%, rgba(91,141,239,.4), transparent 40%), radial-gradient(circle at 10% 100%, rgba(255,255,255,.08), transparent 40%)",
                }}
              />
              <div className="relative">
                <div className="mb-3 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-accent-lightest before:block before:h-px before:w-[18px] before:bg-accent-lightest before:content-['']">
                  Contact
                </div>
                <h3 className="mb-4 text-[22px] font-bold leading-[1.15] tracking-[-0.02em]">
                  Interested in joining or collaborating?
                </h3>
                <p className="mb-6 text-[14.5px] leading-[1.7] text-white/70">
                  Advanced Thermal Management Laboratory (ATM Lab) is recruiting <strong className="font-semibold text-white">postdoctoral researchers</strong> and{" "}
                  <strong className="font-semibold text-white">graduate students</strong> with passionate and innovative minds. If you are interested in the laboratory or want to join it, please contact Prof. Jungho Lee.
                </p>
                <div className="mb-6 flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] border border-white/15 bg-white/[0.1] text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-[17px] w-[17px]"><path d="M4 6l8 6 8-6" /><rect x="3" y="5" width="18" height="14" rx="2" /></svg>
                  </div>
                  <div>
                    <div className="mb-0.5 text-[11px] uppercase tracking-[0.12em] text-white/55">Email</div>
                    <a href="mailto:jungholee@ajou.ac.kr" className="text-[14.5px] font-medium leading-[1.45] text-white hover:text-accent-lightest">jungholee@ajou.ac.kr</a>
                  </div>
                </div>
                <a
                  href="https://grad.ajou.ac.kr/gs/admission/admission01.do"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/cta flex items-center justify-between gap-6 rounded-[12px] border border-white/20 bg-white/[0.1] px-5 py-4 backdrop-blur-[8px] transition-[background,border-color] duration-300 hover:border-white hover:bg-white hover:text-accent-dark"
                >
                  <span className="flex flex-col gap-0.5 text-left">
                    <span className="text-[10.5px] font-medium uppercase tracking-[0.16em] opacity-70">Graduate admissions</span>
                    <span className="text-[14px] font-semibold tracking-[-0.005em]">View admission process &amp; deadlines</span>
                  </span>
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white text-accent transition-transform duration-300 group-hover/cta:translate-x-1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 12h14" /><path d="M13 5l7 7-7 7" /></svg>
                  </span>
                </a>
              </div>
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
          <div className="research-grid reveal-stagger grid grid-cols-2 gap-5 max-[820px]:grid-cols-1">
            {RESEARCH_ITEMS.map((item) => (
              <a
                key={item.num}
                href={item.href}
                className="group overflow-hidden rounded-[20px] border border-line bg-surface transition-[transform,box-shadow] duration-[350ms] hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-20px_rgba(26,86,219,.2)]"
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                  <span className="absolute right-4 top-4 z-10 font-mono text-[11px] font-medium tracking-[0.1em] text-white/80">
                    {item.num}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
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
            {PROJECTS.slice(0, 4).map((p) => (
              <div
                key={p.title}
                className="group grid cursor-default grid-cols-[90px_1fr_auto] items-center gap-8 border-t border-line py-[26px] last:border-b transition-[padding] duration-[350ms] hover:pl-3.5 max-[780px]:grid-cols-1 max-[780px]:gap-2"
              >
                <div className="font-mono text-[12.5px] leading-[1.4] tracking-[0.02em] text-ink-3">
                  <b className="mb-0.5 block text-sm font-semibold text-ink">{p.period}</b>
                  {p.duration}
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
              </div>
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
        style={{ background: "#0d0f12" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(800px circle at 80% 0%, rgba(26,86,219,.18), transparent 50%), radial-gradient(600px circle at 0% 100%, rgba(91,141,239,.1), transparent 50%)",
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
                      <div key={item.num} className="group/item grid grid-cols-[24px_1fr_auto] items-start gap-5 transition-transform duration-300 hover:translate-x-1 max-[680px]:grid-cols-1">
                        <span className="pt-1 font-mono text-[12px] text-white/40 max-[680px]:hidden">{item.num}</span>
                        <div>
                          <div className="mb-1.5 text-[17px] font-medium leading-[1.4] tracking-[-0.005em] text-white">{item.title}</div>
                          <div className="mb-1.5 text-[13.5px] font-medium text-accent-lighter">
                            <em className="not-italic text-white/85">{item.meta}</em>
                            {", "}{item.detail}
                          </div>
                          <div className="text-[13.5px] leading-[1.5] text-white/55">{item.authors}</div>
                        </div>
                        <span className="self-start rounded px-2 py-1 text-[10.5px] font-medium tracking-[0.05em] text-accent-lighter max-[680px]:justify-self-start" style={{ background: "rgba(122,161,255,.15)" }}>
                          {item.type}
                        </span>
                      </div>
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
            <div
              className="reveal group relative aspect-[4/5] overflow-hidden rounded-[24px] text-white"
              style={{ background: "#1a1f2e", boxShadow: "0 30px 60px -25px rgba(0,0,0,.3)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80"
                alt="Professor portrait"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(10,15,30,.85) 75%, rgba(10,15,30,.95) 100%), linear-gradient(135deg, rgba(26,86,219,.35) 0%, transparent 60%)",
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
                  {["Thermal Management", "Phase-Change", "Heat Pipe"].map((kw) => (
                    <span key={kw} className="rounded-md bg-white/[0.12] px-2.5 py-1 text-[11px] font-medium text-white/80">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Members side */}
            <div className="flex flex-col gap-9">
              <p className="reveal text-[15.5px] leading-[1.7] text-ink-2">
                <strong className="font-semibold text-ink">Prof. Kim</strong> received his Ph.D. in Mechanical Engineering from KAIST in 2012 and conducted postdoctoral research at MIT before joining Ajou University in 2015. His research focuses on phase-change heat transfer, two-phase cooling systems, and thermal energy storage. He has authored 60+ peer-reviewed papers and serves on the editorial board of two international journals.
              </p>
              {MEMBER_GROUPS.map((group) => (
                <div key={group.label} className="reveal">
                  <h4 className="mb-[18px] flex items-center gap-3.5 text-[12px] font-medium uppercase tracking-[0.15em] text-ink-3 after:h-px after:flex-1 after:bg-line after:content-['']">
                    <span>{group.label}</span>
                    <span className="font-mono text-accent">{group.count}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {group.members.map((m) => (
                      <span
                        key={m.name}
                        className="inline-flex cursor-default items-center gap-2 rounded-[10px] border border-transparent bg-[#f5f6f8] px-3.5 py-2.5 text-[14px] font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-white hover:shadow-[0_6px_18px_-8px_rgba(26,86,219,.4)]"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-light text-[10.5px] font-semibold tracking-[0.02em] text-white">
                          {m.initials}
                        </span>
                        {m.name}
                        <span className="font-mono text-[11px] text-ink-3">{m.year}</span>
                      </span>
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
            sub="Prof. Kim teaches undergraduate and graduate courses on heat transfer, thermodynamics, and energy systems. Course materials available on AjouBb."
            className="reveal"
          />
          <div className="flex flex-col gap-10">
            {[
              { label: "Undergraduate", courses: LECTURES.filter((l) => !l.grad) },
              { label: "Graduate", courses: LECTURES.filter((l) => l.grad) },
            ].map(({ label, courses }) => (
              <div key={label} className="reveal">
                <h3 className="mb-5 text-[13px] font-medium uppercase tracking-[0.15em] text-ink-3">{label}</h3>
                <div className="grid grid-cols-3 gap-[18px] max-[880px]:grid-cols-1">
                  {courses.map((lec) => (
                    <div
                      key={lec.title}
                      className="group flex flex-col gap-3 rounded-[18px] border border-line bg-white px-7 pb-6 pt-6 transition-[transform,box-shadow,border-color] duration-[350ms] hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-[0_24px_50px_-25px_rgba(26,86,219,.25)]"
                    >
                      <div className="text-[19px] font-semibold leading-[1.3] tracking-[-0.01em]">{lec.title}</div>
                      <div className="flex-1 text-[13.5px] leading-[1.6] text-ink-3">{lec.desc}</div>
                    </div>
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
                {NEWS.slice(0, 5).map((item, i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer gap-5 border-b border-line py-[22px] px-1 last:border-0 transition-[padding] duration-300 hover:pl-3.5"
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
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div className="reveal">
              <div className="mb-6 flex items-baseline justify-between">
                <h3 className="text-[28px] font-bold tracking-[-0.02em]">Gallery</h3>
                <a href="#" className="text-[13px] font-medium text-accent">More →</a>
              </div>
              <div className="grid grid-cols-2 gap-2.5" style={{ gridAutoRows: "140px" }}>
                {GALLERY.map((img, i) => (
                  <a
                    key={i}
                    href="#"
                    className={`group/gal relative block overflow-hidden rounded-[14px] bg-[#eee] ${img.span}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.cap}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/gal:scale-[1.08]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/45 opacity-0 transition-opacity duration-[350ms] group-hover/gal:opacity-100" />
                    <span className="absolute bottom-3 left-3.5 z-[2] translate-y-1.5 text-[12px] font-medium tracking-[0.02em] text-white opacity-0 transition-all duration-[350ms] group-hover/gal:translate-y-0 group-hover/gal:opacity-100">
                      {img.cap}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

    </main>
  );
}
