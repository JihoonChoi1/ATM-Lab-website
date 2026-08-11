"use server";

import { requireAdmin } from "@/lib/auth/guard";
import { uploadsEnabled } from "@/lib/uploads";
import { storeUpload } from "@/lib/upload-store";

// Phase 7-8 / 8-7: standalone image upload kept for the News rich-text editor
// (RichTextEditor), where an inline image must exist the moment it's dropped so
// it can be embedded into the contenteditable HTML. The four imgPath forms no
// longer call this — they upload at form-save time via resolveFormImage. The
// actual validation + write lives in storeUpload (shared with those forms); this
// action only adds the auth re-guard and the uploads kill-switch. width/height
// are returned for callers that want them (the editor ignores them).

export type UploadResult =
  | { ok: true; path: string; width: number; height: number }
  | { ok: false; error: string };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  // Server Actions are independent entry points — re-guard (7-2+ pattern).
  await requireAdmin("/admin");

  // Double-block: the form hides the upload UI when this is off, but the action
  // is the real gate — a direct call must be refused too.
  if (!uploadsEnabled()) {
    return { ok: false, error: "File uploads are disabled in this environment." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "Please select a file." };
  }

  const result = await storeUpload(file);
  if (!result.ok) return result;
  return { ok: true, ...result.image };
}
