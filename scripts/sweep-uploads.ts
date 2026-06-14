// Phase 7-9: remove orphaned admin uploads — files under public/uploads that
// nothing references. A file is an orphan only when neither a current row nor any
// (≤90-day) audit log points at it, so within the 90-day window every file stays
// restorable (revert/restore) and is reclaimed only after its audit has aged out.
// This is the single deletion path (no inline replace-time delete); run it on a
// cron at deploy time (Phase 10/11) for automatic cleanup. Only /uploads is
// touched; /legacy is a shared, committed asset and is never considered.
//
// Sources of orphans: replace-without-save (picked but never submitted — no audit,
// so swept immediately), and replaced/deleted images once their audit expires.
// Originals and their thumbnails are removed together (removeUploadFiles). A
// second pass drops any thumbnail in uploads/thumbs whose original is gone.
//
// Dry run by default (lists what would be deleted). Pass --apply to delete.
//
// Run with: npm run sweep-uploads            (lists orphans)
//           npm run sweep-uploads -- --apply (deletes them)

import { readdir, unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../lib/db";
import { isUploadReferenced, removeUploadFiles } from "../lib/upload-cleanup";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const THUMBS_DIR = path.join(UPLOADS_DIR, "thumbs");

async function listFiles(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isFile()).map((e) => e.name);
  } catch {
    return []; // directory does not exist yet
  }
}

(async () => {
  const apply = process.argv.includes("--apply");

  // ── Originals referenced by neither a row nor a (≤90-day) audit log ──
  const originals = await listFiles(UPLOADS_DIR);
  const orphans: string[] = [];
  for (const name of originals) {
    const webPath = `/uploads/${name}`;
    if (!(await isUploadReferenced(webPath))) orphans.push(webPath);
  }

  for (const webPath of orphans) {
    console.log(`${apply ? "deleting" : "orphan  "} ${webPath}`);
    if (apply) await removeUploadFiles(webPath);
  }

  // ── Thumbnails whose original no longer exists (filesystem-only) ──
  const remainingOriginals = new Set(
    (apply ? await listFiles(UPLOADS_DIR) : originals).map((n) => n.replace(/\.[^.]+$/, "")),
  );
  const thumbs = await listFiles(THUMBS_DIR);
  let strayThumbs = 0;
  for (const name of thumbs) {
    if (remainingOriginals.has(name.replace(/\.[^.]+$/, ""))) continue;
    console.log(`${apply ? "deleting" : "orphan  "} /uploads/thumbs/${name}`);
    strayThumbs++;
    if (apply) await unlink(path.join(THUMBS_DIR, name)).catch(() => {});
  }

  const total = orphans.length + strayThumbs;
  if (total === 0) {
    console.log("No orphaned uploads.");
  } else {
    console.log(
      `${apply ? "removed" : "found"} ${orphans.length} orphan original(s) + ${strayThumbs} stray thumbnail(s).` +
        (apply ? "" : " Re-run with --apply to delete."),
    );
  }

  await prisma.$disconnect();
})();
