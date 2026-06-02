// Scrapes journal publication cover thumbnails from atmlab.ajou.ac.kr/bbs/board.php?bo_table=sub4_1,
// downloads them to public/legacy/, and updates Publication.imgPath in the DB.
//
// Run with: npm run db:fetch-publication-images

import { createWriteStream, mkdirSync, existsSync } from "fs";
import * as https from "https";
import * as http from "http";
import * as path from "path";
import { prisma } from "../lib/db";

const BASE_URL = "http://atmlab.ajou.ac.kr/bbs/board.php?bo_table=sub4_1";
const OUT_DIR = path.resolve(process.cwd(), "public/legacy");
const TOTAL_PAGES = 8;

function get(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    let body = "";
    const req = proto.get(url, { timeout: 15000 }, (res) => {
      res.setEncoding("utf8");
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve(body));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
  });
}

function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const proto = url.startsWith("https") ? https : http;
    const req = proto.get(url, { timeout: 15000 }, (res) => {
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

// Extracts wr_id → img_url pairs from the listing page HTML.
// The relevant HTML looks like:
//   <a href="...&amp;wr_id=119&amp;page=1" class="img"><img src="http://...thumb-....png" alt="" >
function parseImageLinks(html: string): Map<number, string> {
  const map = new Map<number, string>();
  const re = /wr_id=(\d+)[^"]*" class="img"><img src="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const wrId = Number(m[1]);
    const imgUrl = m[2];
    if (!map.has(wrId)) map.set(wrId, imgUrl);
  }
  return map;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  // 1. Scrape all pages to collect wr_id → thumbnail URL
  console.log("Scraping publication listing pages...");
  const allImages = new Map<number, string>();
  for (let page = 1; page <= TOTAL_PAGES; page++) {
    const html = await get(`${BASE_URL}&page=${page}`);
    const links = parseImageLinks(html);
    for (const [wrId, url] of links) {
      if (!allImages.has(wrId)) allImages.set(wrId, url);
    }
    console.log(`  Page ${page}: found ${links.size} images (total so far: ${allImages.size})`);
  }

  console.log(`\nTotal unique publications with images: ${allImages.size}`);

  // 2. Download each thumbnail and update DB
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  let updated = 0;
  let notInDb = 0;

  for (const [wrId, imgUrl] of allImages) {
    const filename = path.basename(imgUrl);
    const dest = path.join(OUT_DIR, filename);
    const legacyPath = `/legacy/${filename}`;

    // Download if not already present
    if (!existsSync(dest)) {
      const ok = await downloadFile(imgUrl, dest);
      if (ok) { downloaded++; }
      else { console.warn(`  FAILED download: ${imgUrl}`); failed++; continue; }
    } else {
      skipped++;
    }

    // Update DB — match by order = wr_id AND type = JOURNAL only.
    // order is the wr_id from the Gnuboard board; each board starts at 1,
    // so filtering by type prevents updating conferences with the same order value.
    const result = await prisma.publication.updateMany({
      where: { order: wrId, type: "JOURNAL" },
      data: { imgPath: legacyPath },
    });

    if (result.count > 0) {
      updated++;
    } else {
      notInDb++;
    }
  }

  console.log(`\nImages — Downloaded: ${downloaded}, Skipped (exist): ${skipped}, Failed: ${failed}`);
  console.log(`DB updates — Updated: ${updated}, Not in DB: ${notInDb}`);

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
