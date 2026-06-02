// Downloads legacy images from atml.dsso.kr and saves them to public/legacy/.
//
// Two sources:
//   1. g5_board_file — member portraits + gallery photos stored via board upload
//      URL: http://atml.dsso.kr/data/file/<bo_table>/<bf_file>
//   2. Editor inline images in g5_write_sub6_1 (news) content
//      URL: http://atml.dsso.kr/data/editor/<board>/<filename>
//      (detected by extracting the original URLs before rewrite)
//
// Run with: npm run db:fetch-legacy-images

import { createWriteStream, mkdirSync, existsSync } from "fs";
import { readFileSync } from "fs";
import * as https from "https";
import * as http from "http";
import * as path from "path";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`${name} is not set. Add it to .env.local.`);
    process.exit(1);
  }
  return v;
}

const SQL_PATH = requireEnv("GNUBOARD_SQL_PATH");
const OUT_DIR = path.resolve(process.cwd(), "public/legacy");

// ─── SQL parser (same as migrate-gnuboard.ts) ────────────────────────────────

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

function extractRows(sql: string, tableName: string): (string | null)[][] {
  const all: (string | null)[][] = [];
  const pattern = new RegExp(
    `INSERT INTO \`${tableName}\`\\s+VALUES\\s+`,
    "g"
  );
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
    const body = sql.slice(start, i);
    all.push(...parseInsertValues(body));
  }
  return all;
}

// ─── Download helper ──────────────────────────────────────────────────────────

function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const proto = url.startsWith("https") ? https : http;
    const req = proto.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        resolve(false);
        return;
      }
      const out = createWriteStream(dest);
      res.pipe(out);
      out.on("finish", () => { out.close(); resolve(true); });
      out.on("error", () => resolve(false));
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => { req.destroy(); resolve(false); });
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Reading backup: ${SQL_PATH}`);
  const sql = readFileSync(SQL_PATH, "utf-8");

  // 1. Board file attachments (member portraits, gallery photos)
  const boardFiles = extractRows(sql, "g5_board_file");
  const fileJobs: { url: string; filename: string }[] = [];

  for (const r of boardFiles) {
    const boTable = r[0] ?? "";
    const bfFile = r[4] ?? "";
    if (!boTable || !bfFile) continue;
    const url = `http://atml.dsso.kr/data/file/${boTable}/${bfFile}`;
    fileJobs.push({ url, filename: bfFile });
  }

  // 2. Inline editor images from board content (news + research)
  const editorPattern =
    /https?:\/\/(?:www\.)?atml\.dsso\.kr\/(data\/editor\/[^"'\s)]+\/([^/"'\s)]+\.(?:png|jpg|jpeg|gif|webp|bmp)))/gi;

  for (const table of [
    "g5_write_sub6_1",
    "g5_write_sub2_1",
    "g5_write_sub2_2",
    "g5_write_sub2_3",
    "g5_write_sub2_4",
  ]) {
    const rows = extractRows(sql, table);
    for (const r of rows) {
      const contentHtml = r[10] ?? "";
      let m: RegExpExecArray | null;
      editorPattern.lastIndex = 0;
      while ((m = editorPattern.exec(contentHtml)) !== null) {
        const urlPath = m[1];
        const filename = m[2];
        fileJobs.push({ url: `http://atml.dsso.kr/${urlPath}`, filename });
      }
    }
  }

  // Deduplicate by filename (same file may appear multiple times)
  const seen = new Set<string>();
  const unique = fileJobs.filter(({ filename }) => {
    if (seen.has(filename)) return false;
    seen.add(filename);
    return true;
  });

  console.log(`Found ${unique.length} unique files to download.`);

  let ok = 0;
  let skip = 0;
  let fail = 0;

  for (const { url, filename } of unique) {
    const dest = path.join(OUT_DIR, filename);
    if (existsSync(dest)) {
      skip++;
      continue;
    }
    const success = await downloadFile(url, dest);
    if (success) {
      ok++;
      if (ok % 10 === 0) console.log(`  Downloaded ${ok} files...`);
    } else {
      console.warn(`  FAILED: ${url}`);
      fail++;
    }
  }

  console.log(`\nDone. Downloaded: ${ok}, Skipped (already exist): ${skip}, Failed: ${fail}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
