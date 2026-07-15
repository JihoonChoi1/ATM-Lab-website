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
import { createPublication, updatePublication, type PublicationFormState } from "../actions";
import { PUBLICATION_TYPES, TYPE_LABELS, type PublicationTypeValue } from "../schema";

// Create + edit form (React 18: useFormState, same pattern as MemberForm).
// Fields are uncontrolled except `type`, which drives which fields render,
// and the lab-member tags, whose hidden inputs are rendered from state.
// Switching type on edit is allowed — the action clears the other types'
// fields to null (see toPublicationData), so nothing stale survives.

export type MemberOption = {
  id: string;
  name: string;
  position: string;
};

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
  memberIds: string[];
};

const initialState: PublicationFormState = {};

export default function PublicationForm({
  publication,
  members,
  uploadsEnabled,
}: {
  publication?: PublicationFormValues;
  members: MemberOption[];
  uploadsEnabled: boolean;
}) {
  const action = publication
    ? updatePublication.bind(null, publication.id)
    : createPublication;
  const [state, formAction] = useFormState(action, initialState);
  const [type, setType] = useState<PublicationTypeValue>(
    publication?.type ?? "JOURNAL",
  );
  const [memberQuery, setMemberQuery] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>(
    publication?.memberIds ?? [],
  );

  const isJournal = type === "JOURNAL";
  const isPatent = type === "PATENT";

  const toggleMember = (id: string) =>
    setMemberIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  const q = memberQuery.trim().toLowerCase();
  const matchingMembers = q
    ? members.filter((m) => m.name.toLowerCase().includes(q))
    : members;
  const selectedMembers = memberIds
    .map((id) => members.find((m) => m.id === id))
    .filter((m): m is MemberOption => m !== undefined);

  return (
    <form action={formAction} onKeyDown={blockImplicitSubmit} className="flex flex-col gap-5">
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
            label="표지 이미지"
            defaultValue={publication?.imgPath}
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
              국가/특허청
            </label>
            <input
              id="country"
              name="country"
              type="text"
              defaultValue={publication?.country ?? ""}
              placeholder="Republic of Korea 또는 European Patent Office (EPO)"
              className={inputClass}
            />
            <p className={hintClass}>
              공개 페이지에는 &ldquo;Jurisdiction&rdquo;으로 표시됩니다.
            </p>
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

      <div>
        <span className={labelClass}>참여 멤버</span>
        <p className={hintClass}>
          저자/발명자 중 랩 멤버를 선택하면 그 멤버의 프로필 페이지에 이 게재물이
          표시됩니다. 외부 저자는 위 저자 칸에 적는 것으로 충분합니다.
        </p>
        {selectedMembers.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {selectedMembers.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleMember(m.id)}
                title="클릭하여 제외"
                className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent-dark transition-colors hover:bg-accent hover:text-white"
              >
                {m.name}
                <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        )}
        <input
          type="text"
          value={memberQuery}
          onChange={(e) => setMemberQuery(e.target.value)}
          placeholder="이름 검색 (예: Choi)"
          aria-label="멤버 이름 검색"
          className={inputClass}
        />
        <div className="mt-2 max-h-44 overflow-y-auto rounded-2xl border border-line">
          {matchingMembers.length === 0 ? (
            <p className="px-3.5 py-3 text-sm text-ink-3">일치하는 멤버가 없습니다.</p>
          ) : (
            matchingMembers.map((m) => (
              <label
                key={m.id}
                className="flex cursor-pointer items-center gap-2.5 px-3.5 py-2 text-sm transition-colors hover:bg-accent-soft"
              >
                <input
                  type="checkbox"
                  checked={memberIds.includes(m.id)}
                  onChange={() => toggleMember(m.id)}
                  className="h-4 w-4 accent-accent"
                />
                <span className="font-medium text-ink">{m.name}</span>
                <span className="text-xs text-ink-3">{m.position}</span>
              </label>
            ))
          )}
        </div>
        {memberIds.map((id) => (
          <input key={id} type="hidden" name="memberIds" value={id} />
        ))}
      </div>

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
