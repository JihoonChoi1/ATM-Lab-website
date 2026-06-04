// Patches GalleryItem.imgPath for legacy gallery posts whose photo was embedded
// inline in the editor body instead of attached via g5_board_file. The original
// migration only read attachments, so those 2024–25 posts were left with a null
// imgPath and rendered as placeholders on /board and the home gallery.
//
// This applies the same fallback now baked into migrate-gnuboard.ts, but without
// a full re-migration (which would wipe other post-migration seeds). It only
// touches GalleryItem.
//
//   1. Re-derive each sub6_2 post's image: g5_board_file attachment first, else
//      the first inline editor image.
//   2. Download any missing inline image into public/legacy/ from the live site.
//   3. Targeted-update GalleryItem.imgPath by `order` (= legacy wr_id), only for
//      rows still null.
//
// Run with: npx tsx --env-file=.env.local scripts/patch-gallery-images.ts

import { createWriteStream, existsSync, mkdirSync, readFileSync } from "fs";
import * as http from "http";
import * as https from "https";
import * as path from "path";
import { prisma } from "../lib/db";

const SQL_PATH = process.env.GNUBOARD_SQL_PATH;
if (!SQL_PATH) {
  console.error("GNUBOARD_SQL_PATH is not set. Add it to .env.local.");
  process.exit(1);
}
const LEGACY_DIR = path.resolve(process.cwd(), "public/legacy");
// The old atml.dsso.kr tree is also served here; URLs in the dump use dsso.kr.
const LIVE_BASE = "http://atmlab.ajou.ac.kr";

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

// ─── Image helpers ───────────────────────────────────────────────────────────

// Captures (1) the server path and (2) the bare filename of an inline editor URL.
const EDITOR_URL_RE =
  /https?:\/\/(?:www\.)?atml\.dsso\.kr\/(data\/editor\/[^"'\s)]+\/([^/"'\s)]+\.(?:png|jpg|jpeg|gif|webp|bmp)))/i;

// First inline image in a gallery post body, as both its /legacy/ path and the
// live URL to download it from. Null when there is no rewritable image.
function firstInlineImage(html: string) {
  const imgTag = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (!imgTag) return null;
  const u = imgTag[1].match(EDITOR_URL_RE);
  if (!u) return null;
  return { legacyPath: `/legacy/${u[2]}`, downloadUrl: `${LIVE_BASE}/${u[1]}`, filename: u[2] };
}

// ─── Download helper (same as fetch-legacy-images.ts) ────────────────────────

function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const proto = url.startsWith("https") ? https : http;
    const req = proto.get(url, { timeout: 30000 }, (res) => {
      if (res.statusCode !== 200) { res.resume(); resolve(false); return; }
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
  console.log(`Reading backup: ${SQL_PATH}`);
  const sql = readFileSync(SQL_PATH, "utf-8");
  mkdirSync(LEGACY_DIR, { recursive: true });

  // Which gallery posts have a board_file attachment (already migrated correctly).
  const attached = new Set<number>();
  for (const r of extractRows(sql, "g5_board_file")) {
    if (r[0] === "sub6_2" && r[4]) attached.add(Number(r[1] ?? 0));
  }

  const rows = extractRows(sql, "g5_write_sub6_2");
  let downloaded = 0, updated = 0, failed = 0;

  for (const r of rows) {
    const wrId = Number(r[0] ?? 0);
    const contentHtml = r[10] ?? "";
    if (attached.has(wrId)) continue; // photo came from an attachment — leave as-is

    const inline = firstInlineImage(contentHtml);
    if (!inline) {
      console.warn(`  wr_id=${wrId}: no attachment and no inline image — skipped`);
      continue;
    }

    const dest = path.join(LEGACY_DIR, inline.filename);
    if (!existsSync(dest)) {
      const ok = await downloadFile(inline.downloadUrl, dest);
      if (ok) { downloaded++; console.log(`  downloaded ${inline.filename}`); }
      else { failed++; console.warn(`  FAILED ${inline.downloadUrl}`); continue; }
    }

    const res = await prisma.galleryItem.updateMany({
      where: { order: wrId, imgPath: null },
      data: { imgPath: inline.legacyPath },
    });
    updated += res.count;
  }

  const stillNull = await prisma.galleryItem.count({ where: { imgPath: null } });
  console.log(`\nDone. downloaded=${downloaded}, failed=${failed}, rows updated=${updated}, gallery still null=${stillNull}`);
}

main()
  .catch((err) => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
