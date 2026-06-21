// Phase 7-9: one-time backfill of 600px WebP thumbnails for the committed legacy
// images (public/legacy/*). Uses the same lib/thumbnail core as the upload
// action, so legacy and uploaded thumbnails are identical. Idempotent — skips
// variants that already exist (pass --force to regenerate). The output
// (public/legacy/thumbs/*.webp + details/*.webp) is committed alongside
// public/legacy so both the Vercel and school-server deploys serve it with no
// build step.
//
// Phase 8-5: also bakes the 1400px WebP detail variant. GIFs are skipped for the
// detail variant so animated files keep playing on detail pages (the thumbnail
// is still a static first frame for list/card views).
//
// Run with: npm run build-thumbnails   (npm run build-thumbnails -- --force)

import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import {
  thumbnailDiskPath,
  detailDiskPath,
  writeThumbnail,
  writeDetail,
  needsDetail,
} from "../lib/thumbnail";

const LEGACY_DIR = path.join(process.cwd(), "public", "legacy");
const IMG_RE = /\.(jpe?g|png|gif|webp)$/i;
const GIF_RE = /\.gif$/i;

async function exists(p: string): Promise<boolean> {
  return access(p).then(
    () => true,
    () => false,
  );
}

(async () => {
  const force = process.argv.includes("--force");
  const entries = await readdir(LEGACY_DIR, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile() && IMG_RE.test(e.name));

  let thumbsMade = 0;
  let detailsMade = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of files) {
    const webPath = `/legacy/${entry.name}`;
    const isGif = GIF_RE.test(entry.name);
    const needThumb = force || !(await exists(thumbnailDiskPath(webPath)));
    // GIFs intentionally have no detail variant — they serve the original.
    const needDetail =
      !isGif && (force || !(await exists(detailDiskPath(webPath))));
    if (!needThumb && !needDetail) {
      skipped++;
      continue;
    }
    try {
      const source = await readFile(path.join(LEGACY_DIR, entry.name));
      if (needThumb) {
        await writeThumbnail(webPath, source);
        thumbsMade++;
      }
      // Only bake a detail variant when it would differ from the thumbnail
      // (source wider than THUMB_WIDTH) — otherwise it is a byte-identical dup.
      if (needDetail && (await needsDetail(source))) {
        await writeDetail(webPath, source);
        detailsMade++;
      }
    } catch (err) {
      console.error(`failed: ${entry.name} — ${(err as Error).message}`);
      failed++;
    }
  }

  console.log(
    `thumbnails: ${thumbsMade} made, details: ${detailsMade} made, ${skipped} skipped, ${failed} failed (${files.length} legacy images)`,
  );
})();
