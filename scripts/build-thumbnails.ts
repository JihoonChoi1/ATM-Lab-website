// Phase 7-9: one-time backfill of 600px WebP thumbnails for the committed legacy
// images (public/legacy/*). Uses the same lib/thumbnail core as the upload
// action, so legacy and uploaded thumbnails are identical. Idempotent — skips
// images whose thumbnail already exists (pass --force to regenerate). The output
// (public/legacy/thumbs/*.webp) is committed alongside public/legacy so both the
// Vercel and school-server deploys serve it with no build step.
//
// Run with: npm run build-thumbnails   (npm run build-thumbnails -- --force)

import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { thumbnailDiskPath, writeThumbnail } from "../lib/thumbnail";

const LEGACY_DIR = path.join(process.cwd(), "public", "legacy");
const IMG_RE = /\.(jpe?g|png|gif|webp)$/i;

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

  let made = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of files) {
    const webPath = `/legacy/${entry.name}`;
    if (!force && (await exists(thumbnailDiskPath(webPath)))) {
      skipped++;
      continue;
    }
    try {
      const source = await readFile(path.join(LEGACY_DIR, entry.name));
      await writeThumbnail(webPath, source);
      made++;
    } catch (err) {
      console.error(`failed: ${entry.name} — ${(err as Error).message}`);
      failed++;
    }
  }

  console.log(
    `thumbnails: ${made} made, ${skipped} skipped, ${failed} failed (${files.length} legacy images)`,
  );
})();
