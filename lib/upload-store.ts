import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { writeThumbnail, writeDetail, THUMB_WIDTH } from "@/lib/thumbnail";
import { removeUploadFiles } from "@/lib/upload-cleanup";
import { uploadsEnabled } from "@/lib/uploads";

// Phase 8-7: shared image-persistence helpers for the admin forms. Uploads now
// happen at form-save time (not file-pick time), so the four imgPath forms
// (Members/Publications/Gallery/Research figure) and the standalone uploadImage
// action (News rich-text inline images) funnel their writes through storeUpload
// here. Server-only — pulls in sharp/fs; never imported by a client component
// directly (only via "use server" entry points and server actions).

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

// Extension comes from the MIME map, never the original filename (untrusted).
const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export type StoredImage = { path: string; width: number; height: number };
export type StoreResult =
  | { ok: true; image: StoredImage }
  | { ok: false; error: string };

// Validate an uploaded image File (type + size + real-image check) and persist
// the original + 600px thumbnail (+ 1400px detail variant, except GIF/small).
// Returns the public /uploads path and pixel dimensions. Auth and the
// uploads-enabled kill-switch are the caller's responsibility (this is pure I/O).
export async function storeUpload(file: File): Promise<StoreResult> {
  if (file.size === 0) return { ok: false, error: "파일을 선택하세요." };
  if (file.size > MAX_BYTES) return { ok: false, error: "파일 크기는 5MB 이하여야 합니다." };
  const ext = MIME_EXT[file.type];
  if (!ext) return { ok: false, error: "이미지 파일(JPG·PNG·WebP·GIF)만 업로드할 수 있습니다." };

  const buffer = Buffer.from(await file.arrayBuffer());

  // sharp.metadata() doubles as content validation: a non-image — including a
  // text file renamed to .jpg with a forged MIME — throws here, and the same
  // call yields the pixel dimensions in one pass.
  let width: number | undefined;
  let height: number | undefined;
  try {
    const meta = await sharp(buffer).metadata();
    width = meta.width;
    height = meta.height;
  } catch {
    return { ok: false, error: "이미지 파일(JPG·PNG·WebP·GIF)만 업로드할 수 있습니다." };
  }
  if (!width || !height) return { ok: false, error: "이미지 크기를 확인할 수 없습니다." };

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  await writeFile(path.join(dir, filename), buffer);

  // Bake the 600px WebP thumbnail now so list/card/preview views never decode
  // the original (7-9). buffer already validated as an image above.
  const webPath = `/uploads/${filename}`;
  await writeThumbnail(webPath, buffer);
  // Bake the 1400px WebP detail variant too (8-5), except for GIFs (keep their
  // animated original) and images no wider than the thumbnail (the detail would
  // be a byte-identical duplicate — bestDetailSrc serves the original instead).
  if (ext !== "gif" && width > THUMB_WIDTH) await writeDetail(webPath, buffer);

  return { ok: true, image: { path: webPath, width, height } };
}

export type ResolvedImage =
  | { ok: true; path: string | null; stored?: StoredImage }
  | { ok: false; error: string };

// Resolve the final imgPath for a form submit: when a File was staged (and
// uploads are enabled) persist it and use its path; otherwise fall back to the
// text path the form carries. A staged file takes priority over the text path.
// `stored` is set only when a new file was written this request, so the caller
// knows which file is safe to unlink on a rollback (never the text fallback).
export async function resolveFormImage(
  formData: FormData,
  fallbackPath: string | null,
): Promise<ResolvedImage> {
  const file = formData.get("file");
  // uploadsEnabled is the real gate (the demo hides the file input, but a
  // tampered request must be refused too — fall through to the text path).
  if (uploadsEnabled() && file instanceof File && file.size > 0) {
    const result = await storeUpload(file);
    if (!result.ok) return result;
    return { ok: true, path: result.image.path, stored: result.image };
  }
  return { ok: true, path: fallbackPath };
}

// Run a row write that references a just-stored upload; if the write throws,
// unlink the freshly-written file so a failed save leaves no orphan. redirect()
// and audit logging MUST stay outside this wrapper — redirect throws NEXT_REDIRECT
// (would delete a referenced file), and an audit failure means the row already
// references the file (not an orphan).
export async function commitWithUpload<T>(
  stored: StoredImage | undefined,
  write: () => Promise<T>,
): Promise<T> {
  try {
    return await write();
  } catch (err) {
    if (stored) await removeUploadFiles(stored.path);
    throw err;
  }
}
