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
import RichTextEditor from "@/app/admin/_components/RichTextEditor";
import { createNews, updateNews, type NewsFormState } from "../actions";

// Create + edit form (React 18: useFormState, same pattern as LectureForm).
// The date/title fields are uncontrolled; the body is a WYSIWYG editor (7-12)
// that serializes its closed-vocabulary HTML into a hidden "content" input, so
// this submit path stays the same useFormState flow. The server re-sanitizes to
// the same allowlist (single trusted admin model).

export type NewsFormValues = {
  id: string;
  date: string; // YYYY-MM-DD (UTC), pre-formatted by the server page
  title: string;
  content: string | null;
  published: boolean;
};

const initialState: NewsFormState = {};

export default function NewsForm({
  news,
  uploadsEnabled,
}: {
  news?: NewsFormValues;
  uploadsEnabled: boolean;
}) {
  const action = news ? updateNews.bind(null, news.id) : createNews;
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} onKeyDown={blockImplicitSubmit} className="flex flex-col gap-5">
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
        <span className={labelClass}>본문</span>
        <RichTextEditor
          name="content"
          defaultValue={news?.content ?? ""}
          uploadsEnabled={uploadsEnabled}
          withImage
        />
        <p className={hintClass}>
          단락·굵게·기울임·링크·목록·사진을 지원합니다. 비워두면 상세 페이지에
          &lsquo;No content.&rsquo;로 표시됩니다.
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
