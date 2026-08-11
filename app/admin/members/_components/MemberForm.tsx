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
    <form action={formAction} onKeyDown={blockImplicitSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="role" className={labelClass}>
          Type
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
        <p className="rounded-2xl bg-accent-soft px-4 py-2.5 text-sm text-accent-dark">
          Education, work history, research fields, and lectures are managed in the{" "}
          <Link href="/admin/members/professor" className="font-semibold underline">
            professor profile editor
          </Link>
          . This form does not change that data.
        </p>
      )}

      <div>
        <label htmlFor="name" className={labelClass}>
          Name
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
            Position
          </label>
          <select
            key={role}
            id="position"
            name="position"
            defaultValue={member?.position ?? ""}
            className={inputClass}
          >
            <option value="">Select…</option>
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
            Degree
          </label>
          <select
            id="degree"
            name="degree"
            defaultValue={member?.degree ?? ""}
            className={inputClass}
          >
            <option value="">Select…</option>
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
            {isAlumni ? "Graduation year" : "Entry year"}
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
              ? "Four-digit year — used to group by year on the public page."
              : "Enter exactly as shown on the card (e.g. '25). Optional."}
          </p>
          <FieldError errors={state.errors?.year} />
        </div>
      )}

      {isAlumni && (
        <div>
          <label htmlFor="currentPosition" className={labelClass}>
            Current position
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
          Email
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
            Research interest tags
          </label>
          <input
            id="interests"
            name="interests"
            type="text"
            defaultValue={member?.interests.join(", ") ?? ""}
            placeholder="Spray cooling, Battery thermal management"
            className={inputClass}
          />
          <p className={hintClass}>Comma-separated — shown as tags on the member card.</p>
          <FieldError errors={state.errors?.interests} />
        </div>
      )}

      <ImageUploadField
        label="Photo"
        defaultValue={member?.imgPath}
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
        Published (uncheck to hide from public pages)
      </label>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label={member ? "Save changes" : "Add member"} />
        <Link href="/admin/members" className={cancelLinkClass}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
