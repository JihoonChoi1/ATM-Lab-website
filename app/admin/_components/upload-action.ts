"use server";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { requireAdmin } from "@/lib/auth/guard";
import { uploadsEnabled } from "@/lib/uploads";

// Phase 7-8: shared image upload for the admin forms (Members/Publications/
// Gallery imgPath; Research figures reuse it in 7-10). Immediate upload — the
// client calls this the moment a file is picked, then drops the returned path
// into the imgPath input, so the existing useFormState submit + Zod flow is
// untouched ("/uploads/…" passes the startsWith("/") check). Not audited here:
// the path lands in the entity's own CREATE/UPDATE diff once the row is saved
// (7-2 policy). width/height are returned for 7-10's figure auto-layout; the
// three current forms ignore them (no column to store).

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

// Extension comes from the MIME map, never the original filename (untrusted).
const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export type UploadResult =
  | { ok: true; path: string; width: number; height: number }
  | { ok: false; error: string };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  // Server Actions are independent entry points — re-guard (7-2+ pattern).
  await requireAdmin("/admin");

  // Double-block: the form hides the upload UI when this is off, but the action
  // is the real gate — a direct call must be refused too.
  if (!uploadsEnabled()) {
    return { ok: false, error: "이 환경에서는 파일 업로드가 비활성화되어 있습니다." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "파일을 선택하세요." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "파일 크기는 5MB 이하여야 합니다." };
  }
  const ext = MIME_EXT[file.type];
  if (!ext) {
    return { ok: false, error: "이미지 파일(JPG·PNG·WebP·GIF)만 업로드할 수 있습니다." };
  }

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
  if (!width || !height) {
    return { ok: false, error: "이미지 크기를 확인할 수 없습니다." };
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  await writeFile(path.join(dir, filename), buffer);

  return { ok: true, path: `/uploads/${filename}`, width, height };
}
