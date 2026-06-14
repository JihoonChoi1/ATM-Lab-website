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
} from "@/app/admin/_components/form-ui";
import ImageUploadField from "@/app/admin/_components/ImageUploadField";
import { createPublication, updatePublication, type PublicationFormState } from "../actions";
import { PUBLICATION_TYPES, TYPE_LABELS, type PublicationTypeValue } from "../schema";

// Create + edit form (React 18: useFormState, same pattern as MemberForm).
// Fields are uncontrolled except `type`, which drives which fields render.
// Switching type on edit is allowed — the action clears the other types'
// fields to null (see toPublicationData), so nothing stale survives.

export type PublicationFormValues = {
  id: string;
  type: PublicationTypeValue;
  year: string;
  title: string;
  authors: string | null;
  journal: string | null;
  doi: string | null;
  conference: string | null;
  inventors: string | null;
  applicationNo: string | null;
  country: string | null;
  registeredAt: string | null;
  imgPath: string | null;
  published: boolean;
};

const initialState: PublicationFormState = {};

export default function PublicationForm({
  publication,
  uploadsEnabled,
}: {
  publication?: PublicationFormValues;
  uploadsEnabled: boolean;
}) {
  const action = publication
    ? updatePublication.bind(null, publication.id)
    : createPublication;
  const [state, formAction] = useFormState(action, initialState);
  const [type, setType] = useState<PublicationTypeValue>(
    publication?.type ?? "JOURNAL",
  );

  const isJournal = type === "JOURNAL";
  const isPatent = type === "PATENT";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="type" className={labelClass}>
          구분
        </label>
        <select
          id="type"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as PublicationTypeValue)}
          className={inputClass}
        >
          {PUBLICATION_TYPES.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <FieldError errors={state.errors?.type} />
      </div>

      <div>
        <label htmlFor="year" className={labelClass}>
          연도
        </label>
        <input
          id="year"
          name="year"
          type="text"
          defaultValue={publication?.year}
          placeholder="2026"
          className={inputClass}
        />
        <p className={hintClass}>
          공개 페이지 연도 필터에 표기 그대로 사용됩니다 (그룹 표기 예:
          2014~Before).
        </p>
        <FieldError errors={state.errors?.year} />
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={publication?.title}
          className={inputClass}
        />
        <FieldError errors={state.errors?.title} />
      </div>

      {!isPatent && (
        <div>
          <label htmlFor="authors" className={labelClass}>
            저자
          </label>
          <input
            id="authors"
            name="authors"
            type="text"
            defaultValue={publication?.authors ?? ""}
            placeholder="J. Choi, S. Kim, and H. Lee"
            className={inputClass}
          />
          <FieldError errors={state.errors?.authors} />
        </div>
      )}

      {isJournal && (
        <>
          <div>
            <label htmlFor="journal" className={labelClass}>
              저널명
            </label>
            <input
              id="journal"
              name="journal"
              type="text"
              defaultValue={publication?.journal ?? ""}
              placeholder="International Journal of Heat and Mass Transfer"
              className={inputClass}
            />
            <FieldError errors={state.errors?.journal} />
          </div>

          <div>
            <label htmlFor="doi" className={labelClass}>
              DOI 링크
            </label>
            <input
              id="doi"
              name="doi"
              type="text"
              defaultValue={publication?.doi ?? ""}
              placeholder="https://doi.org/10.1016/..."
              className={inputClass}
            />
            <p className={hintClass}>
              비워도 됩니다 — 입력 시 공개 상세 페이지에 링크로 표시됩니다.
            </p>
            <FieldError errors={state.errors?.doi} />
          </div>

          <ImageUploadField
            label="이미지 경로"
            defaultValue={publication?.imgPath}
            placeholder="/legacy/paper.jpg"
            hint="/로 시작하는 사이트 내부 경로입니다."
            errors={state.errors?.imgPath}
            uploadsEnabled={uploadsEnabled}
          />
        </>
      )}

      {type === "CONFERENCE" && (
        <div>
          <label htmlFor="conference" className={labelClass}>
            학회명
          </label>
          <input
            id="conference"
            name="conference"
            type="text"
            defaultValue={publication?.conference ?? ""}
            placeholder="KSME Annual Meeting, Jeju, Korea"
            className={inputClass}
          />
          <FieldError errors={state.errors?.conference} />
        </div>
      )}

      {isPatent && (
        <>
          <div>
            <label htmlFor="inventors" className={labelClass}>
              발명자
            </label>
            <input
              id="inventors"
              name="inventors"
              type="text"
              defaultValue={publication?.inventors ?? ""}
              placeholder="J. Choi, S. Kim"
              className={inputClass}
            />
            <FieldError errors={state.errors?.inventors} />
          </div>

          <div>
            <label htmlFor="applicationNo" className={labelClass}>
              출원/등록번호
            </label>
            <input
              id="applicationNo"
              name="applicationNo"
              type="text"
              defaultValue={publication?.applicationNo ?? ""}
              placeholder="10-2026-0012345"
              className={inputClass}
            />
            <FieldError errors={state.errors?.applicationNo} />
          </div>

          <div>
            <label htmlFor="country" className={labelClass}>
              국가
            </label>
            <input
              id="country"
              name="country"
              type="text"
              defaultValue={publication?.country ?? ""}
              placeholder="Republic of Korea"
              className={inputClass}
            />
            <FieldError errors={state.errors?.country} />
          </div>

          <div>
            <label htmlFor="registeredAt" className={labelClass}>
              출원/등록일
            </label>
            <input
              id="registeredAt"
              name="registeredAt"
              type="text"
              defaultValue={publication?.registeredAt ?? ""}
              placeholder="2026-03-15"
              className={inputClass}
            />
            <p className={hintClass}>YYYY-MM-DD 형식 권장 — 표기 그대로 표시됩니다.</p>
            <FieldError errors={state.errors?.registeredAt} />
          </div>
        </>
      )}

      <label className="flex items-center gap-2.5 text-sm font-medium text-ink-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={publication?.published ?? true}
          className="h-4 w-4 accent-accent"
        />
        공개 (체크 해제 시 공개 페이지에서 숨김)
      </label>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label={publication ? "변경 사항 저장" : "게재물 추가"} />
        <Link href="/admin/publications" className={cancelLinkClass}>
          취소
        </Link>
      </div>
    </form>
  );
}
