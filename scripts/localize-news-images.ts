// Localizes remote images embedded in News bodies. The legacy migration kept
// some news photos as hotlinks to www.ajou.ac.kr (the university's press site);
// this downloads each into public/legacy/ and rewrites News.content to point at
// the local copy, so the news detail pages are fully self-hosted.
//
// Idempotent: images already present in public/legacy/ are reused, and content
// that no longer contains remote URLs is left untouched.
//
// Run with: npm run db:localize-news-images

import { createWriteStream, existsSync, mkdirSync } from "fs";
import * as http from "http";
import * as https from "https";
import * as path from "path";
import { prisma } from "../lib/db";

const LEGACY_DIR = path.resolve(process.cwd(), "public/legacy");

// Only rewrite absolute http(s) images; already-local /legacy/ paths are kept.
const REMOTE_RE = /^https?:\/\//i;

function basename(url: string): string {
  return decodeURIComponent(
    url.split("?")[0].split("#")[0].split("/").pop() || ""
  );
}

function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const proto = url.startsWith("https") ? https : http;
    const req = proto.get(url, { timeout: 30000 }, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        resolve(false);
        return;
      }
      const out = createWriteStream(dest);
      res.pipe(out);
      out.on("finish", () => {
        out.close();
        resolve(true);
      });
      out.on("error", () => resolve(false));
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  mkdirSync(LEGACY_DIR, { recursive: true });

  const news = await prisma.news.findMany();
  let downloaded = 0;
  let reused = 0;
  let failed = 0;
  let rewritten = 0;

  for (const n of news) {
    const content = n.content ?? "";
    if (!content) continue;

    const urls = Array.from(
      new Set([...content.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]))
    ).filter((u) => REMOTE_RE.test(u));
    if (urls.length === 0) continue;

    let next = content;
    for (const url of urls) {
      const file = basename(url);
      if (!file) {
        console.warn(`  ! no filename in ${url}`);
        failed++;
        continue;
      }
      const dest = path.join(LEGACY_DIR, file);

      if (existsSync(dest)) {
        reused++;
      } else {
        const ok = await downloadFile(url, dest);
        if (!ok) {
          console.warn(`  ✗ download failed: ${url}`);
          failed++;
          continue; // leave this URL untouched so the body still renders
        }
        downloaded++;
        console.log(`  ↓ ${file}`);
      }

      // Replace every occurrence of the remote URL with the local path.
      next = next.split(url).join(`/legacy/${file}`);
    }

    if (next !== content) {
      await prisma.news.update({ where: { id: n.id }, data: { content: next } });
      rewritten++;
      console.log(`  ✎ News#${n.order} — ${n.title.slice(0, 48)}`);
    }
  }

  console.log(
    `\nDone. downloaded=${downloaded} reused=${reused} failed=${failed} posts_rewritten=${rewritten}`
  );
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
