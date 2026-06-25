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
import { createSubsection, updateSubsection, type ResearchFormState } from "../actions";

// Create + edit form. All fields uncontrolled. body is a single paragraph
// stored as-is (the public page renders one <p>). keywords is a comma list.

export type SubsectionFormValues = {
  id: string;
  num: string;
  title: string;
  body: string;
  keywords: string[];
  published: boolean;
};

const initialState: ResearchFormState = {};

export default function SubsectionForm({
  topicId,
  subsection,
  cancelHref,
}: {
  topicId: string;
  subsection?: SubsectionFormValues;
  cancelHref: string;
}) {
  const action = subsection
    ? updateSubsection.bind(null, topicId, subsection.id)
    : createSubsection.bind(null, topicId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} onKeyDown={blockImplicitSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="num" className={labelClass}>
          번호
        </label>
        <input
          id="num"
          name="num"
          type="text"
          defaultValue={subsection?.num}
          placeholder="01.01"
          className={inputClass}
        />
        <p className={hintClass}>서브섹션 위에 표시되는 번호입니다 (예: 01.01). 중복 허용.</p>
        <FieldError errors={state.errors?.num} />
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={subsection?.title}
          placeholder="Pool Boiling"
          className={inputClass}
        />
        <FieldError errors={state.errors?.title} />
      </div>

      <div>
        <label htmlFor="body" className={labelClass}>
          본문
        </label>
        <textarea
          id="body"
          name="body"
          rows={10}
          defaultValue={subsection?.body}
          className={inputClass}
        />
        <p className={hintClass}>한 문단으로 표시됩니다.</p>
        <FieldError errors={state.errors?.body} />
      </div>

      <div>
        <label htmlFor="keywords" className={labelClass}>
          키워드
        </label>
        <input
          id="keywords"
          name="keywords"
          type="text"
          defaultValue={subsection?.keywords.join(", ")}
          placeholder="ONB, HTC, CHF"
          className={inputClass}
        />
        <p className={hintClass}>쉼표로 구분합니다. 비워두면 칩이 표시되지 않습니다.</p>
        <FieldError errors={state.errors?.keywords} />
      </div>

      <label className="flex items-center gap-2.5 text-sm font-medium text-ink-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={subsection?.published ?? true}
          className="h-4 w-4 accent-accent"
        />
        공개 (체크 해제 시 공개 페이지에서 숨김)
      </label>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label={subsection ? "변경 사항 저장" : "서브섹션 추가"} />
        <Link href={cancelHref} className={cancelLinkClass}>
          취소
        </Link>
      </div>
    </form>
  );
}
