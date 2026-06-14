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
import ImageUploadField from "@/app/admin/_components/ImageUploadField";
import { createGalleryItem, updateGalleryItem, type GalleryFormState } from "../actions";

// Create + edit form (React 18: useFormState, same pattern as NewsForm).
// Fields are uncontrolled except imgPath, which ImageUploadField owns (7-8).
// Empty imgPath renders the board placeholder card and keeps the row off the
// home grid (not-null filter).

export type GalleryFormValues = {
  id: string;
  date: string; // YYYY-MM-DD (UTC), pre-formatted by the server page
  title: string;
  imgPath: string | null;
  published: boolean;
};

const initialState: GalleryFormState = {};

export default function GalleryForm({
  item,
  uploadsEnabled,
}: {
  item?: GalleryFormValues;
  uploadsEnabled: boolean;
}) {
  const action = item ? updateGalleryItem.bind(null, item.id) : createGalleryItem;
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
          defaultValue={item?.date}
          className={inputClass}
        />
        <p className={hintClass}>
          공개 /board Gallery 섹션의 정렬 기준입니다 (최신 날짜가 위).
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
          defaultValue={item?.title}
          className={inputClass}
        />
        <FieldError errors={state.errors?.title} />
      </div>

      <ImageUploadField
        label="이미지 경로"
        defaultValue={item?.imgPath}
        placeholder="/legacy/photo.jpg"
        hint="/로 시작하는 사이트 내부 경로. 비워두면 /board에는 자리표시 카드로 표시되고, 홈 갤러리에는 노출되지 않습니다."
        errors={state.errors?.imgPath}
        uploadsEnabled={uploadsEnabled}
      />

      <label className="flex items-center gap-2.5 text-sm font-medium text-ink-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={item?.published ?? true}
          className="h-4 w-4 accent-accent"
        />
        공개 (체크 해제 시 공개 페이지에서 숨김)
      </label>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label={item ? "변경 사항 저장" : "항목 추가"} />
        <Link href="/admin/gallery" className={cancelLinkClass}>
          취소
        </Link>
      </div>
    </form>
  );
}
