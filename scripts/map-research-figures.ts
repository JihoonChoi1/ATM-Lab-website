// Maps legacy research figure images (already downloaded to public/legacy/ by
// fetch-legacy-images.ts) onto ResearchFigure.imgPath in the DB.
//
// The four research topics live in g5_write_sub2_1 .. g5_write_sub2_4, one row
// each. Each row's content HTML lists subsections (anchored by an <h2
// class="sCont_title"> with text) followed by their figure <img>s. We group
// images under the preceding titled subsection, match subsections to the DB by
// title + order, then assign images to figures in `order` sequence.
//
// Run with: npm run db:map-research-figures

import { readFileSync } from "fs";
import { existsSync } from "fs";
import * as path from "path";
import { prisma } from "../lib/db";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`${name} is not set. Add it to .env.local.`);
    process.exit(1);
  }
  return v;
}

const SQL_PATH = requireEnv("GNUBOARD_SQL_PATH");
const LEGACY_DIR = path.resolve(process.cwd(), "public/legacy");

// Topic order in DB → legacy table name.
const TOPIC_TABLES = [
  "g5_write_sub2_1", // order 0: Phase-Change Heat Transfer
  "g5_write_sub2_2", // order 1: Data Center Thermal Management
  "g5_write_sub2_3", // order 2: Thermosyphon and Waste Heat Recovery
  "g5_write_sub2_4", // order 3: TGP (Boiling-Driven Heat Spreader)
];

// ─── SQL parser (shared shape with the other migration scripts) ───────────────

function parseInsertValues(body: string): (string | null)[][] {
  const rows: (string | null)[][] = [];
  let i = 0;
  while (i < body.length) {
    while (i < body.length && body[i] !== "(") i++;
    if (i >= body.length) break;
    i++;
    const row: (string | null)[] = [];
    let buf = "";
    let wasString = false;
    let inStr = false;
    while (i < body.length) {
      const ch = body[i];
      if (inStr) {
        if (ch === "\\") {
          const n = body[i + 1];
          if (n === "n") buf += "\n";
          else if (n === "r") buf += "\r";
          else if (n === "t") buf += "\t";
          else buf += n ?? "";
          i += 2;
        } else if (ch === "'") { inStr = false; i++; }
        else { buf += ch; i++; }
      } else {
        if (ch === "'") { inStr = true; wasString = true; i++; }
        else if (ch === "," || ch === ")") {
          if (wasString) row.push(buf);
          else { const t = buf.trim(); row.push(t === "NULL" || t === "" ? null : t); }
          buf = ""; wasString = false;
          if (ch === ")") { rows.push(row); i++; break; }
          i++;
        } else { buf += ch; i++; }
      }
    }
  }
  return rows;
}

function extractRows(sql: string, tableName: string): (string | null)[][] {
  const all: (string | null)[][] = [];
  const pattern = new RegExp(`INSERT INTO \`${tableName}\`\\s+VALUES\\s+`, "g");
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(sql)) !== null) {
    const start = m.index + m[0].length;
    let i = start;
    let inStr = false;
    while (i < sql.length) {
      const ch = sql[i];
      if (inStr) {
        if (ch === "\\") i += 2;
        else if (ch === "'") { inStr = false; i++; }
        else i++;
      } else {
        if (ch === "'") { inStr = true; i++; }
        else if (ch === ";") break;
        else i++;
      }
    }
    all.push(...parseInsertValues(sql.slice(start, i)));
  }
  return all;
}

// ─── Topic HTML → subsection groups ──────────────────────────────────────────

type Group = { title: string; files: string[] };

// Walks the topic content in document order. A titled <h2 class="sCont_title">
// starts a new subsection; every <img> after it (including images nested inside
// untitled sCont_title containers) belongs to that subsection.
function parseTopic(content: string): Group[] {
  type Tok = { pos: number; kind: "title" | "img"; text?: string; file?: string };
  const toks: Tok[] = [];

  const titleRe = /<h2[^>]*class="sCont_title"[^>]*>([\s\S]*?)<\/h2>/gi;
  let m: RegExpExecArray | null;
  while ((m = titleRe.exec(content)) !== null) {
    const txt = m[1]
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (txt) toks.push({ pos: m.index, kind: "title", text: txt });
  }

  const imgRe = /<img[^>]+src="([^"]+)"/gi;
  while ((m = imgRe.exec(content)) !== null) {
    const file = m[1].split("/").pop();
    if (file) toks.push({ pos: m.index, kind: "img", file });
  }

  toks.sort((a, b) => a.pos - b.pos);

  const groups: Group[] = [];
  for (const t of toks) {
    if (t.kind === "title") groups.push({ title: t.text!, files: [] });
    else if (groups.length) groups[groups.length - 1].files.push(t.file!);
  }
  return groups;
}

const normalize = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const sql = readFileSync(SQL_PATH, "utf-8");

  const topics = await prisma.researchTopic.findMany({
    orderBy: { order: "asc" },
    include: {
      subsections: {
        orderBy: { order: "asc" },
        include: { figures: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (topics.length !== TOPIC_TABLES.length) {
    throw new Error(`Expected ${TOPIC_TABLES.length} topics, found ${topics.length}.`);
  }

  let updated = 0;

  for (let t = 0; t < topics.length; t++) {
    const topic = topics[t];
    const content = extractRows(sql, TOPIC_TABLES[t])[0]?.[10] ?? "";
    const groups = parseTopic(content);

    if (groups.length !== topic.subsections.length) {
      throw new Error(
        `Topic "${topic.title}": HTML has ${groups.length} subsections, DB has ${topic.subsections.length}.`
      );
    }

    for (let s = 0; s < topic.subsections.length; s++) {
      const sub = topic.subsections[s];
      const group = groups[s];

      if (normalize(sub.title) !== normalize(group.title)) {
        throw new Error(
          `Subsection title mismatch:\n  DB:   "${sub.title}"\n  HTML: "${group.title}"`
        );
      }
      if (group.files.length !== sub.figures.length) {
        throw new Error(
          `"${sub.title}": HTML has ${group.files.length} images, DB has ${sub.figures.length} figures.`
        );
      }

      for (let f = 0; f < sub.figures.length; f++) {
        const file = group.files[f];
        if (!existsSync(path.join(LEGACY_DIR, file))) {
          throw new Error(`Image not found on disk: public/legacy/${file}`);
        }
        await prisma.researchFigure.update({
          where: { id: sub.figures[f].id },
          data: { imgPath: `/legacy/${file}` },
        });
        updated++;
      }
    }
  }

  console.log(`Updated ${updated} ResearchFigure imgPaths.`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
