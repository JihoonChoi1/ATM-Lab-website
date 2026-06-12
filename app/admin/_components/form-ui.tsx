"use client";

import { useFormStatus } from "react-dom";

// Shared controls for admin CRUD forms (7-2+) — same rationale as table-ui:
// one source of truth for field/button styling across all content sections.

export const inputClass =
  "w-full rounded-2xl border border-line bg-surface px-4 py-3 text-base text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";
export const labelClass = "mb-1.5 block text-sm font-medium text-ink-2";
export const hintClass = "mt-1.5 text-xs text-ink-3";
export const messageClass =
  "rounded-2xl bg-ajou-yellow/10 px-4 py-2.5 text-sm text-ajou-yellow";
export const cancelLinkClass =
  "rounded-2xl border border-line px-6 py-3 text-base font-medium text-ink-2 transition hover:border-ink-3 hover:text-ink";

export function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1.5 text-sm text-ajou-yellow">{errors[0]}</p>;
}

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-2xl bg-accent px-6 py-3 text-base font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
    >
      {pending ? "저장 중…" : label}
    </button>
  );
}
