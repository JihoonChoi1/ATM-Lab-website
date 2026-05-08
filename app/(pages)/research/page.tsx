"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";

// ─── Types ───────────────────────────────────────────────────────────────────

type Figure = {
  w: number;
  h: number;
  caption: string;
};

type Sub = {
  num: string;
  title: string;
  body: string;
  keywords?: string[];
  figures: Figure[];
};

type Topic = {
  num: string;
  bg: "white" | "bg";
  title: string;
  lead: string;
  keywords: string[];
  subs: Sub[];
};

// ─── Data (will move to lib/research.ts in Phase 5) ──────────────────────────

const RESEARCH_TOPICS: Topic[] = [
  {
    num: "01",
    bg: "white",
    title: "Phase-Change Heat Transfer",
    lead: "Fundamental and applied studies on pool and flow boiling, surface engineering, and the physics that governs nucleate-boiling heat transfer and critical heat flux.",
    keywords: ["Pool Boiling", "Flow Boiling", "Microporous Surfaces", "CHF", "HTC"],
    subs: [
      {
        num: "01.01",
        title: "Pool Boiling",
        body: "Pool boiling refers to a heat transfer phenomenon that occurs when a horizontal surface immersed in a quiescent fluid is heated, where heat is transferred through natural convection driven by buoyancy-induced density differences as well as through the nucleation, growth, and detachment of vapor bubbles. It denotes a boiling process in which fluid motion is generated solely by natural convection, in the absence of any externally imposed forced flow. Boiling is generally classified into four distinct regimes: natural convection boiling, nucleate boiling, transition boiling, and film boiling. Among these, the Onset of Nucleate Boiling (ONB), Heat Transfer Coefficient (HTC), and Critical Heat Flux (CHF) are regarded as the key governing parameters.",
        keywords: ["ONB", "HTC", "CHF", "Boiling Regimes"],
        figures: [
          { w: 300, h: 480, caption: "Fig. 1.1a — High-speed bubble dynamics, isolated bubble regime (placeholder GIF)." },
          { w: 300, h: 480, caption: "Fig. 1.1b — High-speed bubble dynamics, fully developed nucleate boiling (placeholder GIF)." },
          { w: 700, h: 525, caption: "Fig. 1.1c — Pool boiling regime diagram and characteristic boiling curve (placeholder)." },
        ],
      },
      {
        num: "01.02",
        title: "Pool Boiling Experimental Apparatus",
        body: "The present pool boiling experimental apparatus is designed to enable the observation of boiling phenomena under well-controlled and rigorously defined conditions. The pool boiling chamber is designed and fabricated to minimize heat losses to the surroundings while maintaining stable pool boiling conditions. A comprehensive performance analysis of the pool boiling behavior is conducted using high-precision instrumentation, including a high-speed camera, an accurate temperature control system, and dedicated power supply equipment.",
        keywords: ["Test Chamber", "High-speed Imaging"],
        figures: [
          { w: 1175, h: 471, caption: "Fig. 1.2 — Photograph / CAD section of the pool boiling chamber (placeholder)." },
        ],
      },
      {
        num: "01.03",
        title: "Flow Boiling Experimental Apparatus",
        body: "The present flow boiling experimental facility is characterized by the following features. Refrigerant circulation is driven by a gear pump, while impurities are removed via an in-line filter, and the mass flow rate is accurately measured using a Coriolis mass flow meter. The inlet temperature is precisely controlled by a subcooler, and after passing through the test section, the working fluid is re-condensed in a plate-type heat exchanger, thereby completing the circulation loop. The system is configured as a fully sealed closed-loop circuit, in which the saturation pressure is regulated through a cooling coil installed inside the reservoir tank. Even when the test section is isolated, a bypass loop ensures the continuous maintenance of a closed-loop operation. Prior to refrigerant charging, it is essential to evacuate the loop under vacuum to completely remove any non-condensable gases from the system, as their presence can significantly affect flow boiling performance and measurement accuracy.",
        keywords: ["Closed-loop", "Coriolis Flow Meter", "Refrigerant"],
        figures: [
          { w: 1175, h: 356, caption: "Fig. 1.3 — P&ID of the closed-loop refrigerant flow-boiling test rig (placeholder)." },
        ],
      },
      {
        num: "01.04",
        title: "Flow Boiling Enhancement: by Sandblasting",
        body: "In the present study, sandblasting was employed to tailor the surface roughness, wherein surface textures were generated through high-pressure abrasive particle impingement. Stainless steel (SUS) wire-cut abrasive media with particle sizes of 0.2, 0.4, and 0.6 mm were used to establish distinct roughness conditions. As the particle size increased, both the depth and lateral scale of surface asperities became more pronounced, resulting in an overall increase in surface roughness. The flow boiling experiments revealed that surfaces treated with larger abrasive particles exhibited superior heat transfer performance. This enhancement is attributed to an increased density of active nucleation sites and a rise in surface energy, which promote the formation of smaller and more uniformly distributed vapor bubbles, ultimately leading to a significant enhancement of flow boiling heat transfer.",
        keywords: ["Sandblasting", "Surface Roughness", "Nucleation Sites"],
        figures: [
          { w: 1175, h: 350, caption: "Fig. 1.4 — SEM images of sandblasted surfaces at 0.2 / 0.4 / 0.6 mm media (placeholder)." },
        ],
      },
      {
        num: "01.05",
        title: "Surface Characterization on Metal Surfaces",
        body: "The microporous surfaces employed in this study are capable of enhancing nucleate boiling heat transfer by suppressing vapor film formation and inducing capillary-driven liquid transport, thereby significantly improving pool boiling heat transfer performance. Micro-thick metallic foam (MMF), characterized by its high porosity and interconnected ligament network, effectively promotes both nucleate boiling activity and continuous liquid replenishment to the heated surface. The dual-layer microporous structure, formed by stacking MMF onto a baseline substrate, facilitates efficient vapor evacuation while simultaneously strengthening capillary flow, leading to improved boiling stability and heat transfer. The mixed-size sintered copper powder surface, fabricated by combining copper powders of varying diameters, generates a dual-scale pore architecture, which enables the simultaneous enhancement of the heat transfer coefficient (HTC) and the critical heat flux (CHF).",
        keywords: ["MMF", "Sintered Cu", "Dual-scale Pores"],
        figures: [
          { w: 658, h: 184, caption: "Fig. 1.5 — MMF cross-section and mixed-size sintered copper powder surface (placeholder)." },
        ],
      },
      {
        num: "01.06",
        title: "Hybrid Microporous Surface Characterization on Metal Surfaces",
        body: "Cross-sectional scanning electron microscopy (SEM) imaging enables a detailed visual analysis of the pore size distribution, layer thickness, and interfacial bonding quality of the microporous structures. To quantitatively characterize the surface properties, time-resolved contact angle measurements are performed, allowing for the evaluation of the wettability and surface energy of the working fluid on the engineered surfaces. The wicking performance is assessed based on the droplet spreading dynamics, through which the surface capillary transport behavior and liquid replenishment capability can be quantitatively evaluated.",
        keywords: ["SEM", "Contact Angle", "Wicking"],
        figures: [
          { w: 658, h: 225, caption: "Fig. 1.6 — SEM cross-section with contact-angle / wicking measurement (placeholder)." },
        ],
      },
      {
        num: "01.07",
        title: "Typical Results on Pool Boiling Heat Transfer",
        body: "Because aluminum readily reacts with water, which is otherwise an effective working fluid, acetone, possessing a high latent heat of vaporization, is predominantly employed as the working fluid for phase-change heat transfer applications involving aluminum surfaces. In this study, a microporous structure was fabricated via aluminum particle brazing, and the resulting surface was utilized to enhance boiling heat transfer performance significantly. Compared with previous studies employing either aluminum surfaces or acetone as the working fluid, the present results demonstrate substantially lower wall superheat and a markedly higher critical heat flux (CHF), thereby confirming the superior thermal performance of the aluminum–acetone combination. Furthermore, based on the experimental data, an empirical correlation was developed to predict the pool boiling CHF as a function of the coating parameters of the microporous surface.",
        keywords: ["Aluminum", "Acetone", "CHF Correlation"],
        figures: [
          { w: 658, h: 474, caption: "Fig. 1.7 — Boiling curve comparison: wall superheat vs. heat flux (placeholder)." },
        ],
      },
    ],
  },
  {
    num: "02",
    bg: "bg",
    title: "Data Center Thermal Management",
    lead: "Cooling architectures for AI/HPC data centers — from chiller-free immersion baths to two-phase cold plates that follow the chip.",
    keywords: ["Immersion Cooling", "Direct-to-Chip", "Cold Plate", "PUE", "Dielectric Fluids"],
    subs: [
      {
        num: "02.01",
        title: "Immersion Cooling: Single-phase",
        body: "Single-phase immersion cooling is generally employed as a thermal management technique in which IT equipment is directly submerged in electrically insulating dielectric fluid to dissipate heat. In this study, by positioning the evaporator section of a heat pipe heat exchanger within a single-phase immersion bath, the thermal energy extracted from the immersion-cooled system is passively transferred to the condenser section of the heat pipe. As a result, unlike conventional single-phase immersion cooling systems, the proposed configuration eliminates the need for external chillers and circulation pumps, thereby significantly reducing the operational energy consumption associated with single-phase immersion cooling. In this manner, the requirement for coolant circulation is removed, and chiller-free operation becomes feasible, allowing the system to establish itself as a highly efficient thermal management solution. Our laboratory is continuously conducting research to compare the thermal performance of conventional single-phase immersion cooling systems with that of single-phase immersion cooling integrated with heat pipe heat exchangers, with the ultimate goal of reducing the Power Usage Effectiveness (PUE) of data centers.",
        keywords: ["Single-phase", "Chiller-free", "PUE"],
        figures: [
          { w: 658, h: 208, caption: "Fig. 2.1 — Single-phase immersion bath integrated with heat-pipe heat exchanger (placeholder)." },
        ],
      },
      {
        num: "02.02",
        title: "Immersion Cooling: Two-phase Immersion",
        body: "For research on two-phase immersion cooling, a non-conductive experimental chamber has been constructed to evaluate boiling heat transfer performance in dielectric fluids. Studies are being conducted on enhancing the convective heat transfer coefficient and the critical heat flux by applying microporous surfaces. In addition, the mutual thermal interactions among individual heat sources in two-phase immersion cooling systems are analyzed to develop more practical and applicable cooling strategies for real-world data center environments.",
        keywords: ["Two-phase", "Dielectric Fluid", "Multi-heater"],
        figures: [
          { w: 658, h: 268, caption: "Fig. 2.2 — Non-conductive boiling chamber with multi-heater array (placeholder)." },
        ],
      },
      {
        num: "02.03",
        title: "Direct Liquid Cooling: Jet Impingement, Hybrid Boiling Cold Plate",
        body: "As the performance of AI and high-performance computing (HPC) hardware continues to increase, energy consumption in data centers is rising rapidly, accompanied by a significant increase in heat generation from server processing units. To address these challenges simultaneously, direct-to-chip (DTC) cooling approaches are being investigated, as they offer high cooling performance capable of substantially mitigating both energy consumption and thermal issues. The in-house developed two-phase flow testbed is equipped with precise flow-rate control and advanced instrumentation, enabling accurate evaluation of cooling performance under conditions closely representative of real operating environments. The Hybrid Boiling Cold Plate (HBCP) under development employs a two-phase cooling strategy that integrates pool boiling and flow boiling, making it well suited for cooling high-heat-flux chipsets while consuming exceptionally low pumping power. Ongoing research focuses on optimizing the design parameters of the HBCP to delay dryout onset and further enhance the thermal performance of the cold plate.",
        keywords: ["Direct-to-Chip", "HBCP", "AI/HPC"],
        figures: [
          { w: 658, h: 222, caption: "Fig. 2.3 — HBCP cold-plate cross-section with two-phase test loop (placeholder)." },
        ],
      },
    ],
  },
  {
    num: "03",
    bg: "white",
    title: "Thermosyphon and Waste Heat Recovery",
    lead: "Two-phase passive devices for compact electronics, HVAC energy recovery, and seasonal anti-icing — built around thermosyphon and heat-pipe physics.",
    keywords: ["Thermosyphon", "TPCT", "Heat-Pipe HX", "Waste Heat", "Geothermal"],
    subs: [
      {
        num: "03.01",
        title: "Heat Transfer Enhancement in Thermosyphon: Confinement Effect",
        body: "With the ongoing miniaturization of electronic devices and energy systems, along with the trend toward higher heat fluxes, demand for compact two-phase closed thermosyphons (TPCTs) has been steadily increasing. Due to the small diameters of compact TPCTs, confinement effects that hinder internal two-phase flow may occur, potentially disrupting stable TPCT operation. In general, the onset of confinement in TPCTs can lead to a severe degradation in thermal performance. Our research has primarily focused on analyzing flow instability phenomena and heat transfer characteristics of TPCTs across a wide range of geometries (inner diameters of 5–25 mm) and working fluids (water, acetone, ethanol, and HFE-7100). As a key outcome, this study is the first to demonstrate that stable operation can be achieved when both the confinement number (Co) and the Froude number (Fr) are less than 0.3.",
        keywords: ["TPCT", "Confinement", "Co–Fr Map"],
        figures: [
          { w: 514, h: 225, caption: "Fig. 3.1 — TPCT geometry sweep and Co–Fr stability map (placeholder)." },
        ],
      },
      {
        num: "03.02",
        title: "Heat Transfer Enhancement in Thermosyphon: Geyser Boiling",
        body: "Geyser boiling is a well-known instability in two-phase closed thermosyphons (TPCTs), characterized by the rapid growth of vapor bubbles that displace the liquid column and generate impulsive impacts at the upper section. Such behavior can shorten the service life of TPCTs and induce fatigue failure, underscoring the need for a more accurate understanding of its onset conditions and underlying mechanisms. Accordingly, this study analyzes Geyser boiling dynamics through flow visualization. It quantitatively measures the impact force of the displaced liquid during Geyser boiling events by installing a load cell at the end of the condenser section of the TPCT. The results indicate that Geyser boiling occurs more readily under high filling ratio conditions (FR > 75%), and that the cumulative loading resulting from repetitive impacts can have a significant influence on equipment fatigue and operational stability. Furthermore, this work provides practical design guidelines for avoiding Geyser boiling and ensuring structural durability during the TPCT design stage.",
        keywords: ["Geyser Boiling", "Load Cell", "Filling Ratio"],
        figures: [
          { w: 514, h: 212, caption: "Fig. 3.2 — High-speed visualization of geyser event with load-cell impact trace (placeholder)." },
        ],
      },
      {
        num: "03.03",
        title: "Gas-to-Liquid, Gas-to-Air Heat Pipe Heat Exchanger",
        body: "A heat-pipe heat exchanger (HPHX) is a thermal exchange device that efficiently transfers heat by employing an array of heat pipes. Operating on the principle of phase change of the working fluid, heat-pipe heat exchangers exhibit exceptionally high thermal performance, enabling superior energy efficiency. Moreover, owing to the intrinsic isothermal characteristics within a heat pipe, the temperature gradient between the evaporator and condenser sections remains relatively small, which imparts excellent thermal robustness and durability when deployed as a heat exchanger. Building upon these advantages, our research focuses on developing fabrication-friendly strategies to maximize the performance of gas-to-liquid and gas-to-air heat-pipe heat exchangers for the recovery of industrial waste heat. In particular, our efforts are primarily directed toward modifying the internal metallic surfaces of the evaporator section to reduce thermal resistance and further enhance thermal performance.",
        keywords: ["HPHX", "Gas-to-Liquid", "Waste Heat"],
        figures: [
          { w: 514, h: 273, caption: "Fig. 3.3 — HPHX bundle schematic with evaporator surface treatment detail (placeholder)." },
        ],
      },
      {
        num: "03.04",
        title: "Wrap-around HPHX",
        body: "The wrap-around loop heat pipe heat exchanger can be utilized as an energy-saving device in HVAC systems. When a wrap-around loop heat pipe heat exchanger is installed in a configuration that wraps around a chiller, the wrap-around loop heat pipe heat exchanger transfers heat from the upstream side to the downstream side after the chiller. Consequently, it eliminates the need for electric reheaters to compensate for the temperature drop downstream of the chiller in conventional HVAC systems, making it a highly energy-efficient heat exchange solution. In our laboratory, studies are being conducted to analyze the system-level suitability and operational characteristics of the heat exchanger as a function of the working fluid employed (water, ethanol, acetone, and R-1233zd(E)). The results indicate that among the working fluids tested, water exhibits the best overall performance, while R-1233zd(E) also demonstrates relatively favorable performance.",
        keywords: ["HVAC", "Wrap-around", "R-1233zd(E)"],
        figures: [
          { w: 514, h: 413, caption: "Fig. 3.4 — HVAC schematic with wrap-around loop around chiller coil (placeholder)." },
        ],
      },
      {
        num: "03.05",
        title: "Geothermal Thermosyphon",
        body: "A geothermal thermosyphon is a passive phase-change heat transfer device that utilizes geothermal energy to enable snow melting and prevent re-freezing without external power input. Research and development are currently underway to ensure effective operation not only during winter conditions but throughout all seasons. In this laboratory, the snow-melting performance of the geothermal thermosyphon is being experimentally validated under conditions that simulate real-world snow removal and anti-icing environments.",
        keywords: ["Geothermal", "Snow Melting", "Anti-icing"],
        figures: [
          { w: 514, h: 248, caption: "Fig. 3.5a — Buried geothermal thermosyphon schematic (placeholder)." },
          { w: 500, h: 281, caption: "Fig. 3.5b — Snow-melting field test setup (placeholder)." },
        ],
      },
    ],
  },
  {
    num: "04",
    bg: "bg",
    title: "TGP (Boiling-Driven Heat Spreader)",
    lead: "Planar phase-change heat spreaders that move concentrated chip-level heat fluxes — developed in collaboration with UT Dallas since 2014.",
    keywords: ["Vapor Chamber", "BDHS", "Heat Spreader", "Bubble Pumping", "300 W/cm²"],
    subs: [
      {
        num: "04.01",
        title: "Vapor Chamber",
        body: "A vapor chamber is a planar phase-change heat transfer device designed for efficient cooling by rapidly spreading heat through latent heat transfer. Fabricated from various metallic materials, including aluminum, it facilitates rapid thermal dissipation via internal evaporation and condensation cycles. Operating as a passive heat transfer mechanism that requires no external power, it serves as a viable thermal management solution for high-power electronic devices. Our laboratory is currently focusing on the development of lightweight vapor chambers, primarily utilizing aluminum as the substrate material.",
        keywords: ["Vapor Chamber", "Aluminum", "Passive"],
        figures: [
          { w: 514, h: 155, caption: "Fig. 4.1 — Aluminum vapor chamber cross-section with working principle diagram (placeholder)." },
        ],
      },
      {
        num: "04.02",
        title: "Boiling-Driven Heat Spreader (BDHS)",
        body: "Unlike conventional vapor chambers known as flat-plate heat pipes, the Boiling-driven Heat Spreader (BDHS) is a phase-change thermal device that dissipates concentrated heat primarily through boiling heat transfer rather than simple internal evaporation and condensation. Joint R&D for this technology has been conducted since 2014 in collaboration with Prof. Seung Mun You's research group at the University of Texas at Dallas. A key characteristic of the BDHS is its orientation-independent thermal performance, allowing effective cooling for concentrated heat sources with high heat fluxes up to 300 W/cm². The BDHS operates effectively under high heat flux conditions by circulating internal fluids through the \"bubble pumping\" effect induced by boiling heat transfer. With the recent expansion of high-density data centers, liquid cooling technologies are increasingly being adopted, and this laboratory is developing technologies to apply the BDHS developed in-house to cold plates for liquid cooling systems. In parallel, BDHSs designed for large-area and high-heat-flux heat sources are being continuously developed for applications in server chips requiring high-performance cooling.",
        keywords: ["BDHS", "Bubble Pumping", "300 W/cm²", "UT Dallas"],
        figures: [
          { w: 514, h: 223, caption: "Fig. 4.2a — BDHS internal flow loop schematic (placeholder)." },
          { w: 320, h: 320, caption: "Fig. 4.2b — Orientation-independent test photo (placeholder)." },
          { w: 514, h: 160, caption: "Fig. 4.2c — BDHS cold-plate integration for liquid cooling (placeholder)." },
        ],
      },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function topicId(num: string): string {
  return `topic-${parseInt(num, 10)}`;
}

function figLabel(caption: string): string {
  const m = caption.match(/^(Fig\.\s*[\w·.]+[a-z]?)/i);
  return m ? m[1] : "Fig.";
}

function figBody(caption: string): string {
  return caption
    .replace(/^Fig\.\s*[\w·.]+[a-z]?\s*[—-]\s*/i, "")
    .replace(/\s*\(placeholder[^)]*\)\.?$/i, "");
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

function FigurePlaceholder({ fig }: { fig: Figure }) {
  return (
    <>
      <div className="rounded-[18px] border border-line bg-surface p-3">
        <div
          className="fig-placeholder relative flex items-center justify-center overflow-hidden rounded-[12px]"
          style={{ aspectRatio: `${fig.w}/${fig.h}` }}
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
              <FigurePlaceholder fig={g.figs[0]} />
            </figure>
            <figure>
              <FigurePlaceholder fig={g.figs[1]} />
            </figure>
          </div>
        ) : (
          <figure key={i}>
            <FigurePlaceholder fig={g.fig} />
          </figure>
        )
      )}
    </div>
  );
}

function SubRow({ sub }: { sub: Sub }) {
  return (
    <div className="sub-row grid grid-cols-2 gap-x-12 gap-y-8 max-[820px]:grid-cols-1 max-[820px]:gap-y-6">
      <SubFigure figures={sub.figures} />
      <div className="sub-text reveal delay-1 flex flex-col">
        <div className="mb-3 font-mono text-[12px] tracking-[0.04em] text-accent">{sub.num}</div>
        <h3
          className="mb-5 font-semibold tracking-[-0.015em] text-ink"
          style={{ fontSize: "clamp(22px,2.4vw,30px)", lineHeight: 1.2 }}
        >
          {sub.title}
        </h3>
        <p className="text-justify text-[16px] leading-[1.75] text-ink-2">{sub.body}</p>
        {sub.keywords && sub.keywords.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {sub.keywords.map((k) => (
              <span
                key={k}
                className="rounded-md bg-accent-soft px-2 py-[3px] text-[11.5px] font-medium text-accent"
              >
                {k}
              </span>
            ))}
          </div>
        )}
      </div>
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
              <p className="mb-5 max-w-[620px] text-[17px] leading-[1.6] text-ink-2">
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
            <div key={sub.num}>
              {i > 0 && <div className="my-16 border-t border-line max-[820px]:my-12" />}
              <SubRow sub={sub} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  const [activeId, setActiveId] = useState<string>(topicId(RESEARCH_TOPICS[0].num));

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

  // Sticky TOC active-pill tracking
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[data-topic]");
    const tocIO = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | undefined;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
        }
        if (best) {
          const id = (best.target as HTMLElement).dataset.topic;
          if (id) setActiveId(id);
        }
      },
      { rootMargin: "-200px 0px -50% 0px", threshold: [0, 0.1, 0.25, 0.5] }
    );
    sections.forEach((s) => tocIO.observe(s));
    return () => tocIO.disconnect();
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
                Engineering heat
                <br />
                at every scale.
              </h1>
              <div className="wo-rule" />
              <p className="max-w-[560px] text-[17px] leading-[1.7] text-ink-2">
                ATM Lab investigates phase-change heat transfer across four interlocking research thrusts — from fundamental boiling and condensation physics to deployable thermal solutions for data centers, waste-heat recovery, and high-flux electronics. Each topic combines experimental rigs, surface engineering, and system-level integration.
              </p>
            </div>
            <div className="reveal delay-1 flex flex-col gap-4 justify-self-end max-[900px]:justify-self-start">
              <div className="grid grid-cols-3 gap-6 rounded-[18px] border border-line bg-surface px-7 py-6">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">Topics</div>
                  <div className="mt-1 text-[28px] font-semibold tracking-[-0.02em] text-ink">04</div>
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">Subtopics</div>
                  <div className="mt-1 text-[28px] font-semibold tracking-[-0.02em] text-ink">17</div>
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">Years</div>
                  <div className="mt-1 text-[28px] font-semibold tracking-[-0.02em] text-ink">10+</div>
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
            {RESEARCH_TOPICS.map((t) => {
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
                    className={`font-mono text-[11px] tracking-[0.04em] ${active ? "opacity-90" : "opacity-70"}`}
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
      {RESEARCH_TOPICS.map((t) => (
        <TopicSection key={t.num} topic={t} />
      ))}
    </main>
  );
}
