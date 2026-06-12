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
import { createProject, updateProject, type ProjectFormState } from "../actions";
import { PROJECT_STATUSES, STATUS_LABELS, type ProjectStatusValue } from "../schema";

// Create + edit form (React 18: useFormState, same pattern as MemberForm).
// All fields are uncontrolled — Project has no conditional fields.

export type ProjectFormValues = {
  id: string;
  title: string;
  institution: string;
  period: string;
  scale: string | null;
  status: ProjectStatusValue;
  published: boolean;
};

const initialState: ProjectFormState = {};

export default function ProjectForm({ project }: { project?: ProjectFormValues }) {
  const action = project ? updateProject.bind(null, project.id) : createProject;
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="status" className={labelClass}>
          상태
        </label>
        <select
          id="status"
          name="status"
          defaultValue={project?.status ?? "ACTIVE"}
          className={inputClass}
        >
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <FieldError errors={state.errors?.status} />
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          프로젝트명
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={project?.title}
          className={inputClass}
        />
        <FieldError errors={state.errors?.title} />
      </div>

      <div>
        <label htmlFor="institution" className={labelClass}>
          기관
        </label>
        <input
          id="institution"
          name="institution"
          type="text"
          defaultValue={project?.institution}
          placeholder="National Research Foundation of Korea (NRF)"
          className={inputClass}
        />
        <FieldError errors={state.errors?.institution} />
      </div>

      <div>
        <label htmlFor="period" className={labelClass}>
          기간
        </label>
        <input
          id="period"
          name="period"
          type="text"
          defaultValue={project?.period}
          placeholder="2023.08.01~2025.07.31"
          className={inputClass}
        />
        <p className={hintClass}>공개 카드에 입력한 표기 그대로 표시됩니다.</p>
        <FieldError errors={state.errors?.period} />
      </div>

      <div>
        <label htmlFor="scale" className={labelClass}>
          규모
        </label>
        <input
          id="scale"
          name="scale"
          type="text"
          defaultValue={project?.scale ?? ""}
          placeholder="₩300,000,000"
          className={inputClass}
        />
        <p className={hintClass}>비워도 됩니다 — 공개 카드에는 “—”로 표시됩니다.</p>
        <FieldError errors={state.errors?.scale} />
      </div>

      <label className="flex items-center gap-2.5 text-sm font-medium text-ink-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={project?.published ?? true}
          className="h-4 w-4 accent-accent"
        />
        공개 (체크 해제 시 공개 페이지에서 숨김)
      </label>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label={project ? "변경 사항 저장" : "프로젝트 추가"} />
        <Link href="/admin/projects" className={cancelLinkClass}>
          취소
        </Link>
      </div>
    </form>
  );
}
