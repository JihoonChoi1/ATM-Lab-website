/**
 * Seeds the professor's Education / Research Field / Lecture Subject data.
 *
 * These three sections were not present in the Gnuboard SQL backup (only the
 * work-history HTML was), so they are sourced from the live professor profile
 * page (http://atmlab.ajou.ac.kr/bbs/board.php?bo_table=sub1_1).
 *
 * Idempotent: updates the single PROFESSOR row in place.
 */
import { prisma } from "../lib/db";

const education = [
  { period: "1994.03 ~ 1999.02", title: "Ph.D.", inst: "Pohang University of Science and Technology (POSTECH)" },
  { period: "1992.03 ~ 1994.02", title: "M.S.", inst: "Pohang University of Science and Technology (POSTECH)" },
  { period: "1988.03 ~ 1992.02", title: "B.S.", inst: "Pusan National University" },
];

// Grouped under the two headers used on the live profile page. The first two
// entries carry comma-separated sub-areas (rendered as sub-tags); the rest are
// standalone fields. Text is kept verbatim from the source.
const researchFields = [
  {
    group: "Major R&D Areas",
    items: [
      {
        label: "Advanced Thermal Management",
        subs: [
          "High-Power Electronic Equipment",
          "Power Semiconductor",
          "Electric Vehicle (EV) Battery",
          "ESS Battery",
          "Laser-Diode",
          "Data Center Cooling",
        ],
      },
      {
        label: "Thermal Management Technology for Defense",
        subs: ["TGP-embedded Heat Sink", "Liquid/Hybrid Cooling", "Phase-change Cooling"],
      },
      { label: "Heat Pipe Heat Exchanger (HPHX) for recovering waste heat", subs: [] },
      { label: "Wrap-around heat pipe heat exchanger for air conditioning", subs: [] },
      { label: "Phase-change Heat Transfer (Boiling and Condensation)", subs: [] },
      { label: "Forced Convection Heat Transfer Enhancement (Jet and Spray)", subs: [] },
      { label: "Direct liquid cooling for high-density data centers", subs: [] },
      { label: "Heat Pipe, Vapor Chamber, and Thermal Ground Plane (TGP)", subs: [] },
      { label: "Heat Pipe Heat Exchanger (HPHX)", subs: [] },
    ],
  },
  {
    group: "Commercial Product Technology Development",
    items: [
      { label: "Eco-Friendly Ultra Intensive Quenching", subs: [] },
      { label: "Cooling Devices for Hot Steel Products", subs: [] },
    ],
  },
];

const lectureSubjects = [
  { title: "Heat Transfer", code: "" },
  { title: "Applied Heat Transfer", code: "" },
  { title: "Phase-Change Heat Transfer", code: "" },
  { title: "Experimental Thermal and Fluid Engineering", code: "" },
  { title: "Advanced Thermal Management", code: "" },
];

async function main() {
  const prof = await prisma.member.findFirst({ where: { role: "PROFESSOR" } });
  if (!prof) throw new Error("No PROFESSOR member found — run the migration first.");

  await prisma.member.update({
    where: { id: prof.id },
    data: { education, researchFields, lectureSubjects },
  });

  console.log(`Updated professor "${prof.name}" with education (${education.length}), researchFields (${researchFields.length}), lectureSubjects (${lectureSubjects.length}).`);
}

main().finally(() => process.exit(0));
