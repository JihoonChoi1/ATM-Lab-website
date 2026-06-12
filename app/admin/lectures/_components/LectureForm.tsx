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
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="category" className={labelClass}>
          구분
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
          표시 번호
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
          공개 카드에 크게 표시되는 번호 라벨입니다. 순서 이동과는 무관합니다.
        </p>
        <FieldError errors={state.errors?.num} />
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          강의명
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
          강의 설명
        </label>
        <textarea
          id="paragraphs"
          name="paragraphs"
          rows={12}
          defaultValue={lecture?.paragraphs.join("\n\n")}
          className={inputClass}
        />
        <p className={hintClass}>
          빈 줄로 단락을 구분합니다. 비워두면 공개 카드에 “Course description not
          provided.”로 표시됩니다.
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
        공개 (체크 해제 시 공개 페이지에서 숨김)
      </label>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label={lecture ? "변경 사항 저장" : "강의 추가"} />
        <Link href="/admin/lectures" className={cancelLinkClass}>
          취소
        </Link>
      </div>
    </form>
  );
}
