"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Thumb from "@/components/ui/Thumb";
import { FieldError, hintClass, inputClass, labelClass } from "./form-ui";

// Phase 7-8 / 8-7: image field shared by the Members/Publications/Gallery/
// Research-figure forms.
//
// School server (uploadsEnabled): the path is never hand-typed. The picked file
// is NOT uploaded on pick — it rides in the form's FormData (name="file") and is
// persisted only when the form is saved (8-7), so picking then cancelling leaves
// nothing on disk. The current image's path is carried in a hidden input so
// saving without picking preserves it; picking a file replaces it. There is no
// editable path box — an admin can't fumble it into a broken path. (Blanking an
// existing image isn't a flow here; create pathless, or delete + recreate.)
//
// Cloud demo (uploadsEnabled=false): uploads are off, so the path is set the old
// way — a visible text input ("/legacy/…" or "/uploads/…"), cleared to remove.
//
// Preview: a staged file → local data: URL (the CSP img-src allows 'self' data:,
// not blob:); an existing path → its 600px thumbnail (Thumb), never the original.

export default function ImageUploadField({
  label,
  defaultValue,
  placeholder,
  hint,
  errors,
  uploadsEnabled,
  onDimensions,
}: {
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
  hint?: ReactNode;
  errors?: string[];
  uploadsEnabled: boolean;
  // Research figures (7-10) capture the picked image's pixel dimensions to fill
  // the width/height inputs; the other forms omit this.
  onDimensions?: (dims: { width: number; height: number }) => void;
}) {
  // Whether an image already exists at mount (edit of an item that has one) —
  // drives "교체 vs 업로드" wording and whether a remove control makes sense.
  const hasExisting = Boolean(defaultValue);

  // Demo only: the text path is editable. On the school server `value` is the
  // constant carrier of the existing path (never edited — submitted via hidden).
  const [value, setValue] = useState(defaultValue ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Keep the latest callback in a ref so the file effect can depend on [file]
  // alone — FigureForm passes an inline onDimensions whose identity changes each
  // render, which would otherwise re-run the effect (and re-read dims) endlessly.
  const onDimensionsRef = useRef(onDimensions);
  onDimensionsRef.current = onDimensions;

  // Read the picked file as a data: URL for the preview. The CSP img-src allows
  // 'self' and data: but NOT blob:, so an object URL would be blocked — and the
  // same applies to the programmatic Image() used for the dimension read below.
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    let cancelled = false;
    const reader = new FileReader();
    reader.onload = () => {
      if (cancelled) return;
      const src = reader.result as string;
      setPreview(src);
      // Figure form: read the natural pixel dimensions for the width/height inputs
      // (7-10) — client-side now that the upload is deferred to save time.
      const onDims = onDimensionsRef.current;
      if (onDims) {
        const img = new Image();
        img.onload = () => onDims({ width: img.naturalWidth, height: img.naturalHeight });
        img.src = src;
      }
    };
    reader.readAsDataURL(file);
    return () => {
      cancelled = true;
    };
  }, [file]);

  const previewClass = "mt-3 h-24 w-24 rounded-xl border border-line object-cover";

  // ── Cloud demo: editable text path only (uploads disabled) ──
  if (!uploadsEnabled) {
    return (
      <div>
        <label htmlFor="imgPath" className={labelClass}>
          {label}
        </label>
        <input
          id="imgPath"
          name="imgPath"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
        {value ? <Thumb src={value} alt="미리보기" className={previewClass} /> : null}
        {hint && <p className={hintClass}>{hint}</p>}
        <FieldError errors={errors} />
      </div>
    );
  }

  // ── School server: file upload; the path is carried, not typed ──
  return (
    <div>
      <label htmlFor="imgFile" className={labelClass}>
        {label}
      </label>
      {/* Carrier: saving without picking preserves the current image; picking a
          file replaces it. */}
      <input type="hidden" name="imgPath" value={value} />
      <input
        id="imgFile"
        name="file"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block w-full text-sm text-ink-2 file:mr-3 file:rounded-xl file:border-0 file:bg-accent-soft file:px-4 file:py-2 file:text-sm file:font-medium file:text-accent hover:file:bg-accent-soft/70"
      />

      {file && preview ? (
        // Local preview of the just-picked file — no server round-trip.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="미리보기" className={previewClass} />
      ) : value ? (
        // Existing saved image — the lightweight 600px thumbnail, not the original.
        <Thumb src={value} alt="미리보기" className={previewClass} />
      ) : null}

      {file ? (
        <p className={hintClass}>
          선택한 파일로 {hasExisting ? "기존 이미지를 교체합니다" : "업로드합니다"}. 선택만 하고
          저장하지 않으면 서버에 기록되지 않습니다.
        </p>
      ) : (
        <p className={hintClass}>
          {hasExisting
            ? "새 파일을 선택하면 기존 이미지를 교체합니다 "
            : "파일을 선택해 이미지를 업로드합니다 "}
          (JPG·PNG·WebP·GIF, 5MB 이하).
        </p>
      )}

      {hint && <p className={hintClass}>{hint}</p>}
      <FieldError errors={errors} />
    </div>
  );
}
