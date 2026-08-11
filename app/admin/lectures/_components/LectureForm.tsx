"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import {
  FieldError,
  SubmitButton,
  cancelLinkClass,
  hintClass,
  inputClass,
  labelClass,
  messageClass,
  blockImplicitSubmit,
} from "@/app/admin/_components/form-ui";
import { createLecture, updateLecture, type LectureFormState } from "../actions";
import { CATEGORY_LABELS, LECTURE_CATEGORIES, type LectureCategoryValue } from "../schema";

// Create + edit form (React 18: useFormState, same pattern as ProjectForm).
// All fields are uncontrolled — Lecture has no conditional fields. The
// paragraphs String[] round-trips through one textarea: join("\n\n") here,
// split on blank lines in the schema.

export type LectureFormValues = {
  id: string;
  num: string;
  category: LectureCategoryValue;
  title: string;
  paragraphs: string[];
  published: boolean;
};

const initialState: LectureFormState = {};

export default function LectureForm({ lecture }: { lecture?: LectureFormValues }) {
  const action = lecture ? updateLecture.bind(null, lecture.id) : createLecture;
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} onKeyDown={blockImplicitSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="category" className={labelClass}>
          Type
        </label>
        <select
          id="category"
          name="category"
          defaultValue={lecture?.category ?? "UNDERGRADUATE"}
          className={inputClass}
        >
          {LECTURE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
        <FieldError errors={state.errors?.category} />
      </div>

      <div>
        <label htmlFor="num" className={labelClass}>
          Display number
        </label>
        <input
          id="num"
          name="num"
          type="text"
          defaultValue={lecture?.num}
          placeholder="01"
          className={inputClass}
        />
        <p className={hintClass}>
          The number label shown large on the public card. Unrelated to reordering.
        </p>
        <FieldError errors={state.errors?.num} />
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          Lecture name
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={lecture?.title}
          placeholder="Heat Transfer"
          className={inputClass}
        />
        <FieldError errors={state.errors?.title} />
      </div>

      <div>
        <label htmlFor="paragraphs" className={labelClass}>
          Lecture description
        </label>
        <textarea
          id="paragraphs"
          name="paragraphs"
          rows={12}
          defaultValue={lecture?.paragraphs.join("\n\n")}
          className={inputClass}
        />
        <p className={hintClass}>
          Separate paragraphs with a blank line. Leave empty to show “Course
          description not provided.” on the public card.
        </p>
        <FieldError errors={state.errors?.paragraphs} />
      </div>

      <label className="flex items-center gap-2.5 text-sm font-medium text-ink-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={lecture?.published ?? true}
          className="h-4 w-4 accent-accent"
        />
        Published (uncheck to hide from public pages)
      </label>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label={lecture ? "Save changes" : "Add lecture"} />
        <Link href="/admin/lectures" className={cancelLinkClass}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
