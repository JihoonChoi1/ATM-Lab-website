"use client";

import { useState } from "react";
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
import ImageUploadField from "@/app/admin/_components/ImageUploadField";
import { createFigure, updateFigure, type ResearchFormState } from "../actions";

// Create + edit form. width/height are controlled number inputs: required even
// for a placeholder figure (they drive the public aspect-ratio box + portrait
// pairing). Picking an image auto-fills them from its client-read pixel
// dimensions (8-7), and the admin can still type them in by hand for a pathless
// placeholder.

export type FigureFormValues = {
  id: string;
  imgPath: string | null;
  caption: string;
  width: number;
  height: number;
  wide: boolean;
};

const initialState: ResearchFormState = {};

export default function FigureForm({
  topicId,
  subsectionId,
  figure,
  uploadsEnabled,
  cancelHref,
}: {
  topicId: string;
  subsectionId: string;
  figure?: FigureFormValues;
  uploadsEnabled: boolean;
  cancelHref: string;
}) {
  const action = figure
    ? updateFigure.bind(null, topicId, subsectionId, figure.id)
    : createFigure.bind(null, topicId, subsectionId);
  const [state, formAction] = useFormState(action, initialState);

  // Default to a landscape placeholder so a pathless figure still renders sanely.
  const [width, setWidth] = useState(String(figure?.width ?? 600));
  const [height, setHeight] = useState(String(figure?.height ?? 400));

  return (
    <form action={formAction} onKeyDown={blockImplicitSubmit} className="flex flex-col gap-5">
      <ImageUploadField
        label="이미지 경로"
        defaultValue={figure?.imgPath}
        hint="비워두면 공개 페이지에 자리표시 그림으로 표시됩니다. 이미지를 선택하면 아래 크기가 자동으로 채워집니다."
        errors={state.errors?.imgPath}
        uploadsEnabled={uploadsEnabled}
        onDimensions={({ width: w, height: h }) => {
          setWidth(String(w));
          setHeight(String(h));
        }}
      />

      <div>
        <label htmlFor="caption" className={labelClass}>
          캡션
        </label>
        <textarea
          id="caption"
          name="caption"
          rows={3}
          defaultValue={figure?.caption}
          placeholder="Fig. 1.1 — High-speed visualization of pool boiling."
          className={inputClass}
        />
        <p className={hintClass}>
          “Fig. 1.1 — 설명” 형식이면 공개 페이지가 라벨과 설명을 분리해 표시합니다.
        </p>
        <FieldError errors={state.errors?.caption} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="width" className={labelClass}>
            너비 (px)
          </label>
          <input
            id="width"
            name="width"
            type="number"
            min={1}
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className={inputClass}
          />
          <FieldError errors={state.errors?.width} />
        </div>
        <div>
          <label htmlFor="height" className={labelClass}>
            높이 (px)
          </label>
          <input
            id="height"
            name="height"
            type="number"
            min={1}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={inputClass}
          />
          <FieldError errors={state.errors?.height} />
        </div>
      </div>
      <p className={hintClass}>
        세로(너비/높이 &lt; 0.95) 그림이 연속 2장이면 공개 페이지에서 자동으로 좌우
        한 쌍이 되고, 그 외에는 전폭으로 표시됩니다.
      </p>

      <fieldset>
        <legend className={labelClass}>표시 크기</legend>
        <div className="mt-1 grid grid-cols-2 gap-3">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="wide"
              value="normal"
              defaultChecked={!figure?.wide}
              className="peer sr-only"
            />
            <div className="rounded-xl border border-line p-3 transition peer-checked:border-accent peer-checked:bg-accent-soft peer-focus-visible:ring-2 peer-focus-visible:ring-accent/30">
              <div className="mb-2 flex gap-1" aria-hidden>
                <div className="h-9 flex-1 rounded bg-accent/70" />
                <div className="h-9 flex-1 rounded bg-line" />
                <div className="h-9 flex-1 rounded bg-line" />
              </div>
              <div className="text-sm font-medium text-ink">보통</div>
              <div className="text-xs text-ink-3">다른 그림과 한 줄에 나란히</div>
            </div>
          </label>

          <label className="cursor-pointer">
            <input
              type="radio"
              name="wide"
              value="wide"
              defaultChecked={figure?.wide ?? false}
              className="peer sr-only"
            />
            <div className="rounded-xl border border-line p-3 transition peer-checked:border-accent peer-checked:bg-accent-soft peer-focus-visible:ring-2 peer-focus-visible:ring-accent/30">
              <div className="mb-1 flex" aria-hidden>
                <div className="h-9 flex-1 rounded bg-accent/70" />
              </div>
              <div className="mb-2 flex gap-1" aria-hidden>
                <div className="h-4 flex-1 rounded bg-line" />
                <div className="h-4 flex-1 rounded bg-line" />
              </div>
              <div className="text-sm font-medium text-ink">크게</div>
              <div className="text-xs text-ink-3">이 그림만 한 줄 전체로</div>
            </div>
          </label>
        </div>
        <p className={hintClass}>
          그림이 2장 이상인 소절에서, “크게”로 둔 그림은 공개 페이지에서 한 줄 전체로
          크게 표시됩니다.
        </p>
      </fieldset>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label={figure ? "변경 사항 저장" : "그림 추가"} />
        <Link href={cancelHref} className={cancelLinkClass}>
          취소
        </Link>
      </div>
    </form>
  );
}
