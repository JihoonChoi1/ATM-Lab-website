import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { thumbUrl, detailUrl } from "@/lib/thumbnail-path";

// Phase 7-9: shared thumbnail generation (sharp). Imported by the upload action
// (per-upload) and scripts/build-thumbnails.ts (legacy backfill) so both bake
// identical 600px WebP thumbnails. Server-only — pulls in sharp; the pure path
// rule lives in thumbnail-path.ts for the client render side.

export const THUMB_WIDTH = 600;
// Phase 8-5: detail pages previously served the multi-MB original. This is the
// width of the WebP variant they serve instead — large enough for the ~920px
// content column at 1.5×, a fraction of the original's bytes.
export const DETAIL_WIDTH = 1400;

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

// Original buffer → 1400px-wide WebP for detail pages. Same sharp settings as the
// thumbnail, just a larger cap; GIFs are excluded by the caller so animated files
// keep playing on detail pages.
export async function toDetail(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .resize({ width: DETAIL_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}

// A detail variant only helps when the source is wider than the thumbnail —
// at or below THUMB_WIDTH both resize to the original size and produce a
// byte-identical WebP, so the detail file would just duplicate the thumbnail.
// Callers skip writing one in that case; bestDetailSrc then serves the original
// (already small) on the detail page.
export async function needsDetail(input: Buffer): Promise<boolean> {
  const meta = await sharp(input).metadata();
  return (meta.width ?? 0) > THUMB_WIDTH;
}

// Public image path (/legacy/x.jpg) → absolute disk path of its thumbnail.
export function thumbnailDiskPath(webPath: string): string {
  return path.join(process.cwd(), "public", thumbUrl(webPath).replace(/^\//, ""));
}

// Public image path (/legacy/x.jpg) → absolute disk path of its detail variant.
export function detailDiskPath(webPath: string): string {
  return path.join(process.cwd(), "public", detailUrl(webPath).replace(/^\//, ""));
}

// Generate and write the thumbnail for an image already saved under public/.
export async function writeThumbnail(webPath: string, source: Buffer): Promise<void> {
  const target = thumbnailDiskPath(webPath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, await toThumbnail(source));
}

// Generate and write the detail variant for an image already saved under public/.
export async function writeDetail(webPath: string, source: Buffer): Promise<void> {
  const target = detailDiskPath(webPath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, await toDetail(source));
}

// Detail-page src resolver. Returns the 1400px WebP variant when it exists on
// disk, else the original — so a missing variant (GIF, pre-backfill upload,
// external path) degrades to the original instead of a broken image. Sync
// existsSync is cheap and these are force-dynamic server renders.
export function bestDetailSrc(webPath: string): string {
  const variant = detailUrl(webPath);
  if (variant !== webPath && existsSync(detailDiskPath(webPath))) return variant;
  return webPath;
}

// Rewrite <img src="…"> in stored rich-text (news body) to the detail variant
// where one exists. Only the double-quoted src value is touched; every other
// attribute and the surrounding HTML is left byte-for-byte intact, and a src
// with no variant (or no detail file) passes through unchanged.
export function optimizeBodyImages(html: string): string {
  return html.replace(
    /(<img\b[^>]*?\ssrc=")([^"]+)(")/gi,
    (_m, pre, src, post) => `${pre}${bestDetailSrc(src)}${post}`,
  );
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
