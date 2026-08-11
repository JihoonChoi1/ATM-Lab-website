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
import { createSubsection, updateSubsection, type ResearchFormState } from "../actions";

// Create + edit form. All fields uncontrolled. body is a single paragraph
// stored as-is (the public page renders one <p>). keywords is a comma list.

export type SubsectionFormValues = {
  id: string;
  num: string;
  title: string;
  body: string;
  keywords: string[];
  published: boolean;
};

const initialState: ResearchFormState = {};

export default function SubsectionForm({
  topicId,
  subsection,
  cancelHref,
}: {
  topicId: string;
  subsection?: SubsectionFormValues;
  cancelHref: string;
}) {
  const action = subsection
    ? updateSubsection.bind(null, topicId, subsection.id)
    : createSubsection.bind(null, topicId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} onKeyDown={blockImplicitSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="num" className={labelClass}>
          No.
        </label>
        <input
          id="num"
          name="num"
          type="text"
          defaultValue={subsection?.num}
          placeholder="01.01"
          className={inputClass}
        />
        <p className={hintClass}>The number shown above the subsection (e.g. 01.01). Duplicates allowed.</p>
        <FieldError errors={state.errors?.num} />
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={subsection?.title}
          placeholder="Pool Boiling"
          className={inputClass}
        />
        <FieldError errors={state.errors?.title} />
      </div>

      <div>
        <label htmlFor="body" className={labelClass}>
          Body
        </label>
        <textarea
          id="body"
          name="body"
          rows={10}
          defaultValue={subsection?.body}
          className={inputClass}
        />
        <p className={hintClass}>Shown as a single paragraph.</p>
        <FieldError errors={state.errors?.body} />
      </div>

      <div>
        <label htmlFor="keywords" className={labelClass}>
          Keywords
        </label>
        <input
          id="keywords"
          name="keywords"
          type="text"
          defaultValue={subsection?.keywords.join(", ")}
          placeholder="ONB, HTC, CHF"
          className={inputClass}
        />
        <p className={hintClass}>Comma-separated. Leave empty to show no chips.</p>
        <FieldError errors={state.errors?.keywords} />
      </div>

      <label className="flex items-center gap-2.5 text-sm font-medium text-ink-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={subsection?.published ?? true}
          className="h-4 w-4 accent-accent"
        />
        Published (uncheck to hide from public pages)
      </label>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label={subsection ? "Save changes" : "Add subsection"} />
        <Link href={cancelHref} className={cancelLinkClass}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
