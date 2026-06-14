import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { thumbUrl } from "@/lib/thumbnail-path";

// Phase 7-9: shared thumbnail generation (sharp). Imported by the upload action
// (per-upload) and scripts/build-thumbnails.ts (legacy backfill) so both bake
// identical 600px WebP thumbnails. Server-only — pulls in sharp; the pure path
// rule lives in thumbnail-path.ts for the client render side.

export const THUMB_WIDTH = 600;

// Original buffer → 600px-wide WebP. `withoutEnlargement` leaves already-small
// images at their native size. No `{ animated: true }`, so a GIF yields a static
// first-frame thumbnail — list/card views freeze GIFs while detail pages still
// serve the original animated file.
export async function toThumbnail(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}

// Public image path (/legacy/x.jpg) → absolute disk path of its thumbnail.
export function thumbnailDiskPath(webPath: string): string {
  return path.join(process.cwd(), "public", thumbUrl(webPath).replace(/^\//, ""));
}

// Generate and write the thumbnail for an image already saved under public/.
export async function writeThumbnail(webPath: string, source: Buffer): Promise<void> {
  const target = thumbnailDiskPath(webPath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, await toThumbnail(source));
}

// Read an image's pixel dimensions from disk for CLS-safe width/height on the
// detail pages (which serve the original — no stored dimension columns). Only
// the header is parsed, so this is cheap even for multi-MB originals. Returns
// null if the file is missing or unreadable so the caller can omit the attrs.
export async function imageSize(
  webPath: string,
): Promise<{ width: number; height: number } | null> {
  try {
    const meta = await sharp(
      path.join(process.cwd(), "public", webPath.replace(/^\//, "")),
    ).metadata();
    if (meta.width && meta.height) return { width: meta.width, height: meta.height };
  } catch {
    // missing / unreadable file — caller falls back to no dimensions
  }
  return null;
}
