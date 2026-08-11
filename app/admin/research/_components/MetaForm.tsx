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
import { updatePageMeta, type ResearchFormState } from "../actions";

// ResearchPageMeta singleton edit form. Topics/Subtopics counts are derived
// from the DB at query time (not stored here), so they are shown read-only on
// the page, not in this form.

export type MetaFormValues = {
  heroHeadline: string;
  heroParagraph: string;
  yearsValue: string;
};

const initialState: ResearchFormState = {};

export default function MetaForm({ meta }: { meta: MetaFormValues }) {
  const [state, formAction] = useFormState(updatePageMeta, initialState);

  return (
    <form action={formAction} onKeyDown={blockImplicitSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="heroHeadline" className={labelClass}>
          Hero headline
        </label>
        <textarea
          id="heroHeadline"
          name="heroHeadline"
          rows={2}
          defaultValue={meta.heroHeadline}
          className={inputClass}
        />
        <p className={hintClass}>Separate the two lines with a line break.</p>
        <FieldError errors={state.errors?.heroHeadline} />
      </div>

      <div>
        <label htmlFor="heroParagraph" className={labelClass}>
          Hero intro paragraph
        </label>
        <textarea
          id="heroParagraph"
          name="heroParagraph"
          rows={6}
          defaultValue={meta.heroParagraph}
          className={inputClass}
        />
        <FieldError errors={state.errors?.heroParagraph} />
      </div>

      <div>
        <label htmlFor="yearsValue" className={labelClass}>
          Years stat value
        </label>
        <input
          id="yearsValue"
          name="yearsValue"
          type="text"
          defaultValue={meta.yearsValue}
          placeholder="10+"
          className={inputClass}
        />
        <p className={hintClass}>Shown as-is in the “Years” box of the hero stat card.</p>
        <FieldError errors={state.errors?.yearsValue} />
      </div>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label="Save changes" />
        <Link href="/admin/research" className={cancelLinkClass}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
