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
import { createTopic, updateTopic, type ResearchFormState } from "../actions";
import { TOPIC_BG, TOPIC_BG_LABELS, type TopicBgValue } from "../schema";

// Create + edit form (React 18: useFormState, same pattern as the other CRUD
// forms). All fields uncontrolled. keywords round-trips through one input as a
// comma-separated list. On edit this lives at the top of the topic detail page,
// above the subsection list.

export type TopicFormValues = {
  id: string;
  num: string;
  title: string;
  lead: string;
  keywords: string[];
  bg: TopicBgValue;
  published: boolean;
};

const initialState: ResearchFormState = {};

export default function TopicForm({
  topic,
  cancelHref,
}: {
  topic?: TopicFormValues;
  cancelHref: string;
}) {
  const action = topic ? updateTopic.bind(null, topic.id) : createTopic;
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
          defaultValue={topic?.num}
          placeholder="01"
          className={inputClass}
        />
        <p className={hintClass}>
          The number shown large on the public page, and its anchor ID. Must be
          unique across topics.
        </p>
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
          defaultValue={topic?.title}
          placeholder="Phase-Change Heat Transfer"
          className={inputClass}
        />
        <FieldError errors={state.errors?.title} />
      </div>

      <div>
        <label htmlFor="lead" className={labelClass}>
          Lead sentence
        </label>
        <textarea
          id="lead"
          name="lead"
          rows={3}
          defaultValue={topic?.lead}
          className={inputClass}
        />
        <p className={hintClass}>A one- or two-sentence intro shown under the topic title.</p>
        <FieldError errors={state.errors?.lead} />
      </div>

      <div>
        <label htmlFor="keywords" className={labelClass}>
          Keywords
        </label>
        <input
          id="keywords"
          name="keywords"
          type="text"
          defaultValue={topic?.keywords.join(", ")}
          placeholder="Pool Boiling, Flow Boiling, CHF"
          className={inputClass}
        />
        <p className={hintClass}>Comma-separated. Leave empty to show no keyword chips.</p>
        <FieldError errors={state.errors?.keywords} />
      </div>

      <div>
        <label htmlFor="bg" className={labelClass}>
          Highlight
        </label>
        <select
          id="bg"
          name="bg"
          defaultValue={topic?.bg ?? "white"}
          className={inputClass}
        >
          {TOPIC_BG.map((b) => (
            <option key={b} value={b}>
              {TOPIC_BG_LABELS[b]}
            </option>
          ))}
        </select>
        <p className={hintClass}>Choose a white or tinted background so topic sections alternate.</p>
        <FieldError errors={state.errors?.bg} />
      </div>

      <label className="flex items-center gap-2.5 text-sm font-medium text-ink-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={topic?.published ?? true}
          className="h-4 w-4 accent-accent"
        />
        Published (uncheck to hide from public pages)
      </label>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label={topic ? "Save changes" : "Add topic"} />
        <Link href={cancelHref} className={cancelLinkClass}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
