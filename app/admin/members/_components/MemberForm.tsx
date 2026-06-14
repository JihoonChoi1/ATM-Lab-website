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
import { createMember, updateMember, type MemberFormState } from "../actions";
import {
  DEGREE_OPTIONS,
  MEMBER_ROLES,
  POSITION_OPTIONS,
  ROLE_LABELS,
  type MemberRole,
} from "../schema";

// Create + edit form (React 18: useFormState, same pattern as login-form).
// Fields are uncontrolled except `role`, which drives which fields render.

export type MemberFormValues = {
  id: string;
  name: string;
  role: MemberRole;
  position: string;
  email: string | null;
  year: string | null;
  degree: string | null;
  currentPosition: string | null;
  interests: string[];
  imgPath: string | null;
  published: boolean;
};

const initialState: MemberFormState = {};

export default function MemberForm({
  member,
  uploadsEnabled,
}: {
  member?: MemberFormValues;
  uploadsEnabled: boolean;
}) {
  const action = member ? updateMember.bind(null, member.id) : createMember;
  const [state, formAction] = useFormState(action, initialState);
  const [role, setRole] = useState<MemberRole>(member?.role ?? "STUDENT");

  const positionOptions =
    role === "RESEARCHER" || role === "STUDENT" ? POSITION_OPTIONS[role] : null;
  const isAlumni = role === "ALUMNI";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="role" className={labelClass}>
          구분
        </label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value as MemberRole)}
          className={inputClass}
        >
          {MEMBER_ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
        <FieldError errors={state.errors?.role} />
      </div>

      {role === "PROFESSOR" && (
        <p className="rounded-2xl bg-accent-soft px-4 py-2.5 text-sm text-accent">
          학력·경력·연구분야·강의 항목은 추후 별도 편집기에서 관리합니다. 이
          폼은 해당 데이터를 변경하지 않습니다.
        </p>
      )}

      <div>
        <label htmlFor="name" className={labelClass}>
          이름
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={member?.name}
          className={inputClass}
        />
        <FieldError errors={state.errors?.name} />
      </div>

      {positionOptions && (
        // key={role} remounts the select when the role flips, so the default
        // re-applies instead of the browser keeping a now-invalid option.
        <div>
          <label htmlFor="position" className={labelClass}>
            직책
          </label>
          <select
            key={role}
            id="position"
            name="position"
            defaultValue={member?.position ?? ""}
            className={inputClass}
          >
            <option value="">선택하세요</option>
            {positionOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <FieldError errors={state.errors?.position} />
        </div>
      )}

      {isAlumni && (
        <div>
          <label htmlFor="degree" className={labelClass}>
            학위
          </label>
          <select
            id="degree"
            name="degree"
            defaultValue={member?.degree ?? ""}
            className={inputClass}
          >
            <option value="">선택하세요</option>
            {DEGREE_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <FieldError errors={state.errors?.degree} />
        </div>
      )}

      {role !== "PROFESSOR" && (
        <div>
          <label htmlFor="year" className={labelClass}>
            {isAlumni ? "졸업년도" : "입학년도"}
          </label>
          <input
            id="year"
            name="year"
            type="text"
            defaultValue={member?.year ?? ""}
            placeholder={isAlumni ? "2024" : "'25"}
            className={inputClass}
          />
          <p className={hintClass}>
            {isAlumni
              ? "4자리 연도 — 공개 페이지에서 연도별 그룹핑에 사용됩니다."
              : "카드에 표시되는 표기 그대로 입력 (예: '25). 비워도 됩니다."}
          </p>
          <FieldError errors={state.errors?.year} />
        </div>
      )}

      {isAlumni && (
        <div>
          <label htmlFor="currentPosition" className={labelClass}>
            현재 소속
          </label>
          <input
            id="currentPosition"
            name="currentPosition"
            type="text"
            defaultValue={member?.currentPosition ?? ""}
            placeholder="Samsung Electronics"
            className={inputClass}
          />
          <FieldError errors={state.errors?.currentPosition} />
        </div>
      )}

      <div>
        <label htmlFor="email" className={labelClass}>
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="text"
          defaultValue={member?.email ?? ""}
          className={inputClass}
        />
        <FieldError errors={state.errors?.email} />
      </div>

      {positionOptions && (
        <div>
          <label htmlFor="interests" className={labelClass}>
            연구 분야 태그
          </label>
          <input
            id="interests"
            name="interests"
            type="text"
            defaultValue={member?.interests.join(", ") ?? ""}
            placeholder="Spray cooling, Battery thermal management"
            className={inputClass}
          />
          <p className={hintClass}>쉼표(,)로 구분 — 멤버 카드에 태그로 표시됩니다.</p>
          <FieldError errors={state.errors?.interests} />
        </div>
      )}

      <ImageUploadField
        label="사진 경로"
        defaultValue={member?.imgPath}
        placeholder="/legacy/photo.jpg"
        hint="/로 시작하는 사이트 내부 경로입니다."
        errors={state.errors?.imgPath}
        uploadsEnabled={uploadsEnabled}
      />

      <label className="flex items-center gap-2.5 text-sm font-medium text-ink-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={member?.published ?? true}
          className="h-4 w-4 accent-accent"
        />
        공개 (체크 해제 시 공개 페이지에서 숨김)
      </label>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label={member ? "변경 사항 저장" : "멤버 추가"} />
        <Link href="/admin/members" className={cancelLinkClass}>
          취소
        </Link>
      </div>
    </form>
  );
}
