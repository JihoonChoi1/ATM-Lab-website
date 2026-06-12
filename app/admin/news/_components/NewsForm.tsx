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
import { createNews, updateNews, type NewsFormState } from "../actions";

// Create + edit form (React 18: useFormState, same pattern as LectureForm).
// All fields are uncontrolled — News has no conditional fields. content is
// one raw-HTML textarea: legacy bodies are CMS-pasted HTML blobs (3.5–6KB),
// stored and rendered verbatim (single trusted admin model).

export type NewsFormValues = {
  id: string;
  date: string; // YYYY-MM-DD (UTC), pre-formatted by the server page
  title: string;
  content: string | null;
  published: boolean;
};

const initialState: NewsFormState = {};

export default function NewsForm({ news }: { news?: NewsFormValues }) {
  const action = news ? updateNews.bind(null, news.id) : createNews;
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="date" className={labelClass}>
          날짜
        </label>
        <input
          id="date"
          name="date"
          type="date"
          defaultValue={news?.date}
          className={inputClass}
        />
        <p className={hintClass}>
          공개 /board News 섹션의 정렬 기준입니다 (최신 날짜가 위).
        </p>
        <FieldError errors={state.errors?.date} />
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={news?.title}
          className={inputClass}
        />
        <FieldError errors={state.errors?.title} />
      </div>

      <div>
        <label htmlFor="content" className={labelClass}>
          본문 (HTML)
        </label>
        <textarea
          id="content"
          name="content"
          rows={16}
          defaultValue={news?.content ?? ""}
          className={`${inputClass} font-mono`}
        />
        <p className={hintClass}>
          HTML이 그대로 저장됩니다. 비워두면 상세 페이지에 &lsquo;No
          content.&rsquo;로 표시됩니다.
        </p>
        <FieldError errors={state.errors?.content} />
      </div>

      <label className="flex items-center gap-2.5 text-sm font-medium text-ink-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={news?.published ?? true}
          className="h-4 w-4 accent-accent"
        />
        공개 (체크 해제 시 공개 페이지에서 숨김)
      </label>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label={news ? "변경 사항 저장" : "소식 추가"} />
        <Link href="/admin/news" className={cancelLinkClass}>
          취소
        </Link>
      </div>
    </form>
  );
}
