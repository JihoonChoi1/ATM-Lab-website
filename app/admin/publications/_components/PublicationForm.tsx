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
          Type
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
          Year
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
          Used exactly as entered in the public Year filter (group example:
          2014~Before).
        </p>
        <FieldError errors={state.errors?.year} />
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          Title
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
            Authors
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
              Journal
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
              DOI link
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
              Optional — if set, it appears as a link on the public detail page.
            </p>
            <FieldError errors={state.errors?.doi} />
          </div>

          <ImageUploadField
            label="Cover image"
            defaultValue={publication?.imgPath}
            errors={state.errors?.imgPath}
            uploadsEnabled={uploadsEnabled}
          />
        </>
      )}

      {type === "CONFERENCE" && (
        <div>
          <label htmlFor="conference" className={labelClass}>
            Conference
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
              Inventors
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
              Application / registration no.
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
              Country / patent office
            </label>
            <input
              id="country"
              name="country"
              type="text"
              defaultValue={publication?.country ?? ""}
              placeholder="Republic of Korea or European Patent Office (EPO)"
              className={inputClass}
            />
            <p className={hintClass}>
              Shown as &ldquo;Jurisdiction&rdquo; on the public page.
            </p>
            <FieldError errors={state.errors?.country} />
          </div>

          <div>
            <label htmlFor="registeredAt" className={labelClass}>
              Filing / registration date
            </label>
            <input
              id="registeredAt"
              name="registeredAt"
              type="text"
              defaultValue={publication?.registeredAt ?? ""}
              placeholder="2026-03-15"
              className={inputClass}
            />
            <p className={hintClass}>YYYY-MM-DD recommended — shown exactly as entered.</p>
            <FieldError errors={state.errors?.registeredAt} />
          </div>
        </>
      )}

      <div>
        <span className={labelClass}>Lab members</span>
        <p className={hintClass}>
          Selecting lab members among the authors/inventors makes this publication
          appear on their profile pages. External authors only need to be listed in
          the Authors field above.
        </p>
        {selectedMembers.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {selectedMembers.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleMember(m.id)}
                title="Click to remove"
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
          placeholder="Search by name (e.g. Choi)"
          aria-label="Search member names"
          className={inputClass}
        />
        <div className="mt-2 max-h-44 overflow-y-auto rounded-2xl border border-line">
          {matchingMembers.length === 0 ? (
            <p className="px-3.5 py-3 text-sm text-ink-3">No matching members.</p>
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
        Published (uncheck to hide from public pages)
      </label>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label={publication ? "Save changes" : "Add publication"} />
        <Link href="/admin/publications" className={cancelLinkClass}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
