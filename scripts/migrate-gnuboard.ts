// Migrates the old Gnuboard5 MariaDB backup into the new Prisma schema.
// Run with: npm run db:migrate-gnuboard
//
// The backup file lives outside the repo. Path is hard-coded; change if it moves.

import { readFileSync } from "fs";
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

// ─── MySQL dump parser ───────────────────────────────────────────────────────

// Parses "INSERT INTO `<table>` VALUES (...), (...), ...;" — returns one row
// per tuple. Each cell is a string for quoted/numeric values, or null for
// MySQL NULL. Handles standard MySQL escapes (\n \r \t \0 \\ \' \").
function parseInsertValues(body: string): (string | null)[][] {
  const rows: (string | null)[][] = [];
  let i = 0;
  while (i < body.length) {
    while (i < body.length && body[i] !== "(") i++;
    if (i >= body.length) break;
    i++; // consume '('

    const row: (string | null)[] = [];
    let buf = "";
    let wasString = false;
    let inStr = false;

    while (i < body.length) {
      const ch = body[i];
      if (inStr) {
        if (ch === "\\") {
          const next = body[i + 1];
          if (next === "n") buf += "\n";
          else if (next === "r") buf += "\r";
          else if (next === "t") buf += "\t";
          else if (next === "0") buf += "\0";
          else if (next === "Z") buf += "\x1A";
          else if (next === "b") buf += "\b";
          else buf += next ?? "";
          i += 2;
        } else if (ch === "'") {
          inStr = false;
          i++;
        } else {
          buf += ch;
          i++;
        }
      } else {
        if (ch === "'") {
          inStr = true;
          wasString = true;
          i++;
        } else if (ch === "," || ch === ")") {
          if (wasString) {
            row.push(buf);
          } else {
            const trimmed = buf.trim();
            row.push(trimmed === "NULL" || trimmed === "" ? null : trimmed);
          }
          buf = "";
          wasString = false;
          if (ch === ")") {
            rows.push(row);
            i++;
            break;
          }
          i++;
        } else {
          buf += ch;
          i++;
        }
      }
    }
  }
  return rows;
}

// Walks a complete SQL file and returns every row inserted into `tableName`,
// concatenating all INSERT statements for that table.
function extractRows(sql: string, tableName: string): (string | null)[][] {
  const all: (string | null)[][] = [];
  const pattern = new RegExp(
    `INSERT INTO \`${tableName}\`\\s+VALUES\\s+`,
    "g"
  );
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(sql)) !== null) {
    const start = m.index + m[0].length;
    // Find the terminating ';' that is outside any string literal.
    let i = start;
    let inStr = false;
    while (i < sql.length) {
      const ch = sql[i];
      if (inStr) {
        if (ch === "\\") i += 2;
        else if (ch === "'") {
          inStr = false;
          i++;
        } else i++;
      } else {
        if (ch === "'") {
          inStr = true;
          i++;
        } else if (ch === ";") break;
        else i++;
      }
    }
    const body = sql.slice(start, i);
    all.push(...parseInsertValues(body));
  }
  return all;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Old Gnuboard image URLs look like:
//   http://atml.dsso.kr/data/editor/2506/<filename>.png
//   http://atml.dsso.kr/data/file/sub1_1/<filename>.jpg
// We keep only the filename and rewrite to /legacy/<filename>. Phase 5-2 will
// drop the actual files into public/legacy/ so the URL resolves.
function rewriteImageUrls(html: string): string {
  return html.replace(
    /https?:\/\/(?:www\.)?atml\.dsso\.kr\/[^"'\s)]+\/([^/"'\s)]+\.(?:png|jpg|jpeg|gif|webp|bmp))/gi,
    "/legacy/$1"
  );
}

function legacyPathFromFilename(bfFile: string | null): string | null {
  if (!bfFile) return null;
  return `/legacy/${bfFile}`;
}

// Some 2024–25 gallery posts have no g5_board_file attachment — the photo was
// embedded inline in the editor body instead. Returns the first inline image
// rewritten to /legacy/<filename>, reusing rewriteImageUrls so it matches every
// other migrated image. Returns null when there is no rewritable image.
function firstInlineImage(html: string): string | null {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (!m) return null;
  const rewritten = rewriteImageUrls(m[1]);
  return rewritten.startsWith("/legacy/") ? rewritten : null;
}

// Removes HTML tags and decodes a small set of common entities. Used for
// fields that should be plain text (interests, alumni current position).
function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Splits HTML on <p>...</p> blocks and returns each block's plain text.
// Empty paragraphs are dropped.
function htmlToParagraphs(html: string): string[] {
  if (!html) return [];
  const matches = html.match(/<p[^>]*>[\s\S]*?<\/p>/gi);
  if (!matches) {
    const single = htmlToText(html);
    return single ? [single] : [];
  }
  return matches
    .map((p) => htmlToText(p))
    .filter((t) => t.length > 0);
}

// Splits a free-form interests string. Old data uses commas, "and", or
// just paragraphs of text. We keep it conservative: comma split when
// commas exist, otherwise the whole string as a single tag.
function splitInterests(raw: string): string[] {
  const text = htmlToText(raw);
  if (!text) return [];
  if (text.includes(",")) {
    return text
      .split(/,/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [text];
}

// "1Ph D. Course" → "Ph.D. Course"
// "2Master Course" → "Master's Course"
// "3Undergraduate Intern" → "Undergraduate Intern"
// "Postdoctoral Researcher" → "Postdoctoral Researcher" (no prefix)
function cleanCategory(raw: string | null): string {
  if (!raw) return "";
  const stripped = raw.replace(/^\d+/, "").trim();
  // Old data wrote "Ph D." and "Master Course" — the new design uses "Ph.D."
  // and the possessive "Master's Course" everywhere.
  return stripped
    .replace(/^Ph D\./, "Ph.D.")
    .replace(/^Master Course$/, "Master's Course");
}

function parseDate(raw: string | null): Date {
  if (!raw) return new Date(0);
  // MySQL datetime: "YYYY-MM-DD HH:MM:SS". Treat as UTC for stability.
  return new Date(raw.replace(" ", "T") + "Z");
}

function yearShort(raw: string | null): string | null {
  if (!raw) return null;
  const m = raw.match(/(\d{4})/);
  if (!m) return null;
  return "'" + m[1].slice(2);
}

// Parses the professor's workHistory HTML — a flat <ul><li>period : title (inst)</li>...</ul>.
// The lines come in three shapes:
//   "1999.08 ~ 2002.04 : University of Maryland (Postdoctoral Researcher)"
//   "President, KSFM, Korea (2026.01~2026.12)"            // period inside parens
//   "Executive Board Member, AUTSE (2020.05~Current)"
// We try both layouts and fall back to dumping the line into `title` if neither matches.
type WorkEntry = { period: string; title: string; inst: string };

function parseProfessorWorkHistory(html: string): WorkEntry[] {
  const items = html.match(/<li[^>]*>[\s\S]*?<\/li>/gi) ?? [];
  const out: WorkEntry[] = [];
  for (const li of items) {
    const text = htmlToText(li);
    if (!text) continue;

    // Shape 1: "PERIOD : TITLE_OR_INST (TITLE_OR_ROLE)"
    const shape1 = text.match(/^([\d.]+\s*~\s*[\w. ]+?)\s*:\s*(.+?)\s*\(([^)]+)\)\s*$/);
    if (shape1) {
      out.push({
        period: shape1[1].trim(),
        title: shape1[3].trim(),
        inst: shape1[2].trim(),
      });
      continue;
    }

    // Shape 2: "ROLE, INSTITUTION (PERIOD)"
    const shape2 = text.match(/^(.+?),\s*(.+?)\s*\(([\d.]+\s*~\s*[\w. ]+?)\)\s*$/);
    if (shape2) {
      out.push({
        period: shape2[3].trim(),
        title: shape2[1].trim(),
        inst: shape2[2].trim(),
      });
      continue;
    }

    out.push({ period: "", title: text, inst: "" });
  }
  return out;
}

// ─── g5_board_file lookup ────────────────────────────────────────────────────
//
// All Member portraits, Gallery photos, and editor uploads live in
// g5_board_file keyed by (bo_table, wr_id). bf_file is the stored filename
// on disk (UUID-prefixed); we map that to /legacy/<bf_file>.
type FileRow = {
  bo_table: string;
  wr_id: number;
  bf_no: number;
  bf_source: string;
  bf_file: string;
};

function buildFileIndex(sql: string): Map<string, FileRow[]> {
  const rows = extractRows(sql, "g5_board_file");
  const idx = new Map<string, FileRow[]>();
  for (const r of rows) {
    const file: FileRow = {
      bo_table: r[0] ?? "",
      wr_id: Number(r[1] ?? 0),
      bf_no: Number(r[2] ?? 0),
      bf_source: r[3] ?? "",
      bf_file: r[4] ?? "",
    };
    if (!file.bo_table || !file.bf_file) continue;
    const key = `${file.bo_table}/${file.wr_id}`;
    if (!idx.has(key)) idx.set(key, []);
    idx.get(key)!.push(file);
  }
  // Sort each bucket by bf_no so the first attachment is the primary image.
  for (const list of idx.values()) list.sort((a, b) => a.bf_no - b.bf_no);
  return idx;
}

function primaryImage(
  files: Map<string, FileRow[]>,
  table: string,
  wrId: number | string,
): string | null {
  const list = files.get(`${table}/${wrId}`);
  if (!list || list.length === 0) return null;
  return legacyPathFromFilename(list[0].bf_file);
}

// ─── Migrations ──────────────────────────────────────────────────────────────

async function migrateProfessor(sql: string, files: Map<string, FileRow[]>) {
  const rows = extractRows(sql, "g5_write_sub1_1");
  for (const r of rows) {
    const wrId = Number(r[0] ?? 0);
    const name = r[9] ?? "";
    const contentHtml = r[10] ?? "";
    const workHistory = parseProfessorWorkHistory(contentHtml);

    await prisma.member.create({
      data: {
        name,
        role: "PROFESSOR",
        position: "Professor",
        interests: [],
        imgPath: primaryImage(files, "sub1_1", wrId),
        workHistory,
        researchFields: [],
        order: wrId,
      },
    });
  }
}

async function migrateResearchers(sql: string, files: Map<string, FileRow[]>) {
  const rows = extractRows(sql, "g5_write_sub1_2");
  for (const r of rows) {
    const wrId = Number(r[0] ?? 0);
    const position = r[7] ?? "";
    const name = r[9] ?? "";
    const email = r[34] ?? null; // wr_5

    await prisma.member.create({
      data: {
        name,
        role: "RESEARCHER",
        position,
        interests: [],
        email: email || null,
        imgPath: primaryImage(files, "sub1_2", wrId),
        order: wrId,
      },
    });
  }
}

async function migrateStudents(sql: string, files: Map<string, FileRow[]>) {
  const rows = extractRows(sql, "g5_write_sub1_3");
  for (const r of rows) {
    const wrId = Number(r[0] ?? 0);
    const position = cleanCategory(r[7]);
    const name = r[9] ?? "";
    const interestsRaw = r[10] ?? "";
    const datetime = r[24] ?? null;
    const email = r[34] ?? null; // wr_5

    await prisma.member.create({
      data: {
        name,
        role: "STUDENT",
        position,
        interests: splitInterests(interestsRaw),
        email: email || null,
        year: yearShort(datetime),
        imgPath: primaryImage(files, "sub1_3", wrId),
        order: wrId,
      },
    });
  }
}

// The legacy data spells the doctorate inconsistently ("Doctor of philosophy",
// "Doctor degree") — normalize to the two canonical values the admin select
// offers (app/admin/members/schema.ts DEGREE_OPTIONS).
function normalizeDegree(raw: string | null): string | null {
  if (!raw) return null;
  return raw.toLowerCase().includes("master") ? "Master's degree" : "Doctoral degree";
}

async function migrateAlumni(sql: string, files: Map<string, FileRow[]>) {
  const rows = extractRows(sql, "g5_write_sub1_4");
  for (const r of rows) {
    const wrId = Number(r[0] ?? 0);
    const name = r[9] ?? "";
    const currentPositionHtml = r[10] ?? "";
    const year = r[30] ?? null; // wr_1
    const degree = normalizeDegree(r[31] ?? null); // wr_2
    const email = r[32] ?? null; // wr_3

    await prisma.member.create({
      data: {
        name,
        role: "ALUMNI",
        position: degree || "",
        interests: [],
        email: email || null,
        imgPath: primaryImage(files, "sub1_4", wrId),
        year: year || null,
        degree: degree || null,
        currentPosition: htmlToText(currentPositionHtml) || null,
        order: wrId,
      },
    });
  }
}

async function migrateProjects(sql: string) {
  const buckets: Array<{ table: string; status: "ACTIVE" | "COMPLETED" }> = [
    { table: "g5_write_sub3_1", status: "ACTIVE" },
    { table: "g5_write_sub3_2", status: "COMPLETED" },
  ];
  for (const { table, status } of buckets) {
    const rows = extractRows(sql, table);
    for (const r of rows) {
      const wrId = Number(r[0] ?? 0);
      const title = r[9] ?? "";
      const period = r[30] ?? "";
      const institution = r[31] ?? "";
      const scale = r[32] ?? null;

      await prisma.project.create({
        data: {
          title,
          institution,
          period,
          scale: scale || null,
          status,
          order: wrId,
        },
      });
    }
  }
}

async function migrateJournals(sql: string) {
  const rows = extractRows(sql, "g5_write_sub4_1");
  for (const r of rows) {
    const wrId = Number(r[0] ?? 0);
    const year = r[7] ?? "";
    const title = r[9] ?? "";
    const doi = r[12] ?? null; // wr_link1
    const authors = r[30] ?? null; // wr_1
    const journal = r[32] ?? null; // wr_3

    await prisma.publication.create({
      data: {
        type: "JOURNAL",
        year,
        title,
        authors: authors || null,
        journal: journal || null,
        doi: doi || null,
        order: wrId,
      },
    });
  }
}

async function migrateConferences(sql: string) {
  const rows = extractRows(sql, "g5_write_sub4_2");
  for (const r of rows) {
    const wrId = Number(r[0] ?? 0);
    const year = r[7] ?? "";
    const title = r[9] ?? "";
    const authors = r[30] ?? null; // wr_1
    const conference = r[37] ?? null; // wr_8

    await prisma.publication.create({
      data: {
        type: "CONFERENCE",
        year,
        title,
        authors: authors || null,
        conference: conference || null,
        order: wrId,
      },
    });
  }
}

async function migratePatents(sql: string) {
  const rows = extractRows(sql, "g5_write_sub4_3");
  for (const r of rows) {
    const wrId = Number(r[0] ?? 0);
    const year = r[7] ?? "";
    const title = r[9] ?? "";
    const inventors = r[30] ?? null; // wr_1
    const applicationNo = r[31] ?? null; // wr_2
    const country = r[32] ?? null; // wr_3
    const registeredAt = r[33] ?? null; // wr_4

    await prisma.publication.create({
      data: {
        type: "PATENT",
        year,
        title,
        inventors: inventors || null,
        applicationNo: applicationNo || null,
        country: country || null,
        registeredAt: registeredAt || null,
        order: wrId,
      },
    });
  }
}

async function migrateLectures(sql: string) {
  const rows = extractRows(sql, "g5_write_sub5_1");
  let counter = 1;
  for (const r of rows) {
    const wrId = Number(r[0] ?? 0);
    const ca = (r[7] ?? "").toLowerCase();
    const title = r[9] ?? "";
    const contentHtml = r[10] ?? "";

    await prisma.lecture.create({
      data: {
        num: String(counter++).padStart(2, "0"),
        category: ca.startsWith("under") ? "UNDERGRADUATE" : "GRADUATE",
        title,
        paragraphs: htmlToParagraphs(contentHtml),
        order: wrId,
      },
    });
  }
}

async function migrateNews(sql: string) {
  const rows = extractRows(sql, "g5_write_sub6_1");
  for (const r of rows) {
    const wrId = Number(r[0] ?? 0);
    const title = r[9] ?? "";
    const contentHtml = r[10] ?? "";
    const datetime = r[24] ?? null;

    await prisma.news.create({
      data: {
        title,
        content: rewriteImageUrls(contentHtml),
        date: parseDate(datetime),
        order: wrId,
      },
    });
  }
}

async function migrateGallery(sql: string, files: Map<string, FileRow[]>) {
  const rows = extractRows(sql, "g5_write_sub6_2");
  for (const r of rows) {
    const wrId = Number(r[0] ?? 0);
    const title = r[9] ?? "";
    const contentHtml = r[10] ?? "";
    const datetime = r[24] ?? null;

    await prisma.galleryItem.create({
      data: {
        title,
        date: parseDate(datetime),
        // Attachment first; fall back to the inline editor image for posts that
        // embedded the photo in the body instead of attaching it.
        imgPath:
          primaryImage(files, "sub6_2", wrId) ?? firstInlineImage(contentHtml),
        order: wrId,
      },
    });
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Reading backup: ${SQL_PATH}`);
  const sql = readFileSync(SQL_PATH, "utf-8");

  console.log("Wiping target tables…");
  await prisma.galleryItem.deleteMany();
  await prisma.news.deleteMany();
  await prisma.lecture.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.project.deleteMany();
  await prisma.member.deleteMany();

  console.log("Indexing g5_board_file…");
  const files = buildFileIndex(sql);

  console.log("Migrating Members…");
  await migrateProfessor(sql, files);
  await migrateResearchers(sql, files);
  await migrateStudents(sql, files);
  await migrateAlumni(sql, files);

  console.log("Migrating Projects…");
  await migrateProjects(sql);

  console.log("Migrating Publications…");
  await migrateJournals(sql);
  await migrateConferences(sql);
  await migratePatents(sql);

  console.log("Migrating Lectures…");
  await migrateLectures(sql);

  console.log("Migrating News…");
  await migrateNews(sql);

  console.log("Migrating Gallery…");
  await migrateGallery(sql, files);

  const counts = {
    members: await prisma.member.count(),
    projects: await prisma.project.count(),
    publications: await prisma.publication.count(),
    lectures: await prisma.lecture.count(),
    news: await prisma.news.count(),
    gallery: await prisma.galleryItem.count(),
  };
  console.log("Done.", counts);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
