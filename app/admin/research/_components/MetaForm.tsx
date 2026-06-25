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
import { updatePageMeta, type ResearchFormState } from "../actions";

// ResearchPageMeta singleton edit form. Topics/Subtopics counts are derived
// from the DB at query time (not stored here), so they are shown read-only on
// the page, not in this form.

export type MetaFormValues = {
  heroHeadline: string;
  heroParagraph: string;
  yearsValue: string;
};

const initialState: ResearchFormState = {};

export default function MetaForm({ meta }: { meta: MetaFormValues }) {
  const [state, formAction] = useFormState(updatePageMeta, initialState);

  return (
    <form action={formAction} onKeyDown={blockImplicitSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="heroHeadline" className={labelClass}>
          Hero 헤드라인
        </label>
        <textarea
          id="heroHeadline"
          name="heroHeadline"
          rows={2}
          defaultValue={meta.heroHeadline}
          className={inputClass}
        />
        <p className={hintClass}>줄바꿈으로 두 줄을 구분합니다.</p>
        <FieldError errors={state.errors?.heroHeadline} />
      </div>

      <div>
        <label htmlFor="heroParagraph" className={labelClass}>
          Hero 소개 문단
        </label>
        <textarea
          id="heroParagraph"
          name="heroParagraph"
          rows={6}
          defaultValue={meta.heroParagraph}
          className={inputClass}
        />
        <FieldError errors={state.errors?.heroParagraph} />
      </div>

      <div>
        <label htmlFor="yearsValue" className={labelClass}>
          Years 통계값
        </label>
        <input
          id="yearsValue"
          name="yearsValue"
          type="text"
          defaultValue={meta.yearsValue}
          placeholder="10+"
          className={inputClass}
        />
        <p className={hintClass}>Hero 통계 카드의 “Years” 칸에 그대로 표시됩니다.</p>
        <FieldError errors={state.errors?.yearsValue} />
      </div>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label="변경 사항 저장" />
        <Link href="/admin/research" className={cancelLinkClass}>
          취소
        </Link>
      </div>
    </form>
  );
}
