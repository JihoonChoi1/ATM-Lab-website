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
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="num" className={labelClass}>
          번호
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
          공개 페이지에 크게 표시되는 번호이자 앵커 ID입니다. 다른 토픽과 중복될 수
          없습니다.
        </p>
        <FieldError errors={state.errors?.num} />
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          제목
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
          리드 문장
        </label>
        <textarea
          id="lead"
          name="lead"
          rows={3}
          defaultValue={topic?.lead}
          className={inputClass}
        />
        <p className={hintClass}>토픽 제목 아래에 표시되는 한두 문장의 소개입니다.</p>
        <FieldError errors={state.errors?.lead} />
      </div>

      <div>
        <label htmlFor="keywords" className={labelClass}>
          키워드
        </label>
        <input
          id="keywords"
          name="keywords"
          type="text"
          defaultValue={topic?.keywords.join(", ")}
          placeholder="Pool Boiling, Flow Boiling, CHF"
          className={inputClass}
        />
        <p className={hintClass}>쉼표로 구분합니다. 비워두면 키워드 칩이 표시되지 않습니다.</p>
        <FieldError errors={state.errors?.keywords} />
      </div>

      <div>
        <label htmlFor="bg" className={labelClass}>
          배경색
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
        <p className={hintClass}>토픽 섹션이 번갈아 보이도록 흰색/연한 배경을 선택합니다.</p>
        <FieldError errors={state.errors?.bg} />
      </div>

      <label className="flex items-center gap-2.5 text-sm font-medium text-ink-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={topic?.published ?? true}
          className="h-4 w-4 accent-accent"
        />
        공개 (체크 해제 시 공개 페이지에서 숨김)
      </label>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label={topic ? "변경 사항 저장" : "토픽 추가"} />
        <Link href={cancelHref} className={cancelLinkClass}>
          취소
        </Link>
      </div>
    </form>
  );
}
