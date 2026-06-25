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
} from "./form-ui";
import type { HeroMetaFormState } from "../_lib/hero-meta";

// Shared edit form for every {Section}PageMeta singleton (Phase 2): a multi-line
// hero headline + an intro paragraph. The per-section server action is passed in
// (it owns the model + redirect), so this one component serves all five pages.
const initialState: HeroMetaFormState = {};

export default function HeroMetaForm({
  action,
  defaults,
  cancelHref,
}: {
  action: (prev: HeroMetaFormState, formData: FormData) => Promise<HeroMetaFormState>;
  defaults: { heroHeadline: string; heroParagraph: string };
  cancelHref: string;
}) {
  // On the success path the action redirect()s back to this same meta route, so
  // (unlike the Research forms, which redirect to a different list page and
  // unmount) this form stays mounted and useFormState briefly yields an
  // undefined state during the navigation. Default it back to initialState so
  // the post-redirect render — and any rapid double-submit — can't read
  // `.errors`/`.message` off undefined.
  const [state = initialState, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} onKeyDown={blockImplicitSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="heroHeadline" className={labelClass}>
          Hero 제목
        </label>
        <textarea
          id="heroHeadline"
          name="heroHeadline"
          rows={2}
          defaultValue={defaults.heroHeadline}
          className={inputClass}
        />
        <p className={hintClass}>줄바꿈으로 여러 줄을 구분합니다.</p>
        <FieldError errors={state.errors?.heroHeadline} />
      </div>

      <div>
        <label htmlFor="heroParagraph" className={labelClass}>
          Hero 소개 문단
        </label>
        <textarea
          id="heroParagraph"
          name="heroParagraph"
          rows={6}
          defaultValue={defaults.heroParagraph}
          className={inputClass}
        />
        <FieldError errors={state.errors?.heroParagraph} />
      </div>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label="변경 사항 저장" />
        <Link href={cancelHref} className={cancelLinkClass}>
          취소
        </Link>
      </div>
    </form>
  );
}
