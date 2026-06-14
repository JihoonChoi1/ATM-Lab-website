"use client";

import { useRef, useState, type ReactNode } from "react";
import { FieldError, hintClass, inputClass, labelClass } from "./form-ui";
import { uploadImage } from "./upload-action";

// Phase 7-8: imgPath field with an inline upload button, shared by the
// Members/Publications/Gallery forms. The text input stays as a direct-path
// fallback — for legacy "/legacy/…" paths, and as the only path on the cloud
// demo where uploads are disabled; a successful upload simply writes its
// returned path into that same input. Only this field is controlled (its value
// is driven by uploads); the rest of each form stays uncontrolled.

export default function ImageUploadField({
  label,
  defaultValue,
  placeholder,
  hint,
  errors,
  uploadsEnabled,
}: {
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
  hint?: ReactNode;
  errors?: string[];
  uploadsEnabled: boolean;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImage(formData);
      if (result.ok) {
        setValue(result.path);
      } else {
        setError(result.error);
      }
    } catch {
      setError("업로드에 실패했습니다. 다시 시도하세요.");
    } finally {
      setUploading(false);
      // Clear the picker so re-selecting the same file fires onChange again.
      if (fileRef.current) fileRef.current.value = "";
    }
  }

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

      {uploadsEnabled && (
        <div className="mt-2 flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="block w-full text-sm text-ink-2 file:mr-3 file:rounded-xl file:border-0 file:bg-accent-soft file:px-4 file:py-2 file:text-sm file:font-medium file:text-accent hover:file:bg-accent-soft/70 disabled:opacity-60"
          />
          {uploading && <span className="shrink-0 text-sm text-ink-3">업로드 중…</span>}
        </div>
      )}

      {value && (
        <img
          src={value}
          alt="미리보기"
          className="mt-3 h-24 w-24 rounded-xl border border-line object-cover"
        />
      )}

      {uploadsEnabled && (
        <p className={hintClass}>
          파일을 선택하면 자동으로 업로드되어 위 경로가 채워집니다 (JPG·PNG·WebP·GIF,
          5MB 이하).
        </p>
      )}
      {hint && <p className={hintClass}>{hint}</p>}
      {error && <p className="mt-1.5 text-sm text-ajou-yellow">{error}</p>}
      <FieldError errors={errors} />
    </div>
  );
}
