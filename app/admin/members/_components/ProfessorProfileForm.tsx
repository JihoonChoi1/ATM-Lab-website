"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormState } from "react-dom";
import {
  SubmitButton,
  cancelLinkClass,
  messageClass,
  blockImplicitSubmit,
} from "@/app/admin/_components/form-ui";
import { iconBtnClass } from "@/app/admin/_components/table-ui";
import { updateProfessorProfile } from "../actions";
import type { MemberFormState } from "../actions";

// Phase 7-11: structured editor for the professor-only JSON columns. All four
// fields are edited as nested React state and serialized to one hidden input
// each on submit (JSON.stringify); the action JSON.parses + Zod-validates them.
// No indexed form-field names — the JSON round-trip keeps the action simple and
// mirrors the 7-12 hidden-input pattern. The form stays mounted across a failed
// submit (errors), so controlled state survives; success redirects to the list.

// ─── Row shapes (subs is a comma-text string while editing) ───────────────────

type EntryRow = { period: string; title: string; inst: string };
type LectureRow = { title: string; code: string };
type ItemRow = { label: string; subs: string };
type GroupRow = { group: string; items: ItemRow[] };

type EntryIn = { period: string; title: string; inst: string };
type LectureIn = { title: string; code: string };
type GroupIn = { group: string; items: { label: string; subs: string[] }[] };

// ─── Small shared bits ────────────────────────────────────────────────────────

const cellInputClass =
  "w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";
const removeBtnClass =
  "shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium text-ajou-yellow transition hover:bg-ajou-yellow/10";
const addBtnClass =
  "rounded-xl border border-dashed border-line px-3 py-2 text-sm font-medium text-ink-2 transition hover:border-accent/40 hover:text-accent";

function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-3">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cellInputClass}
      />
    </label>
  );
}

function RowControls({
  onUp,
  onDown,
  onRemove,
  first,
  last,
}: {
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
  first: boolean;
  last: boolean;
}) {
  // type="button" on every control — the only submit button is SubmitButton.
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button type="button" onClick={onUp} disabled={first} className={iconBtnClass} aria-label="위로 이동">
        ↑
      </button>
      <button type="button" onClick={onDown} disabled={last} className={iconBtnClass} aria-label="아래로 이동">
        ↓
      </button>
      <button type="button" onClick={onRemove} className={removeBtnClass}>
        삭제
      </button>
    </div>
  );
}

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-lg font-semibold tracking-[-0.015em] text-ink">{title}</h2>
      {hint && <p className="mt-0.5 text-xs text-ink-3">{hint}</p>}
    </div>
  );
}

function SectionErrors({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <div className="mt-2">
      {errors.map((e, i) => (
        <p key={i} className="text-sm text-ajou-yellow">
          {e}
        </p>
      ))}
    </div>
  );
}

// ─── Education / Work Experience (identical shape) ────────────────────────────

function EntrySection({
  title,
  hint,
  rows,
  setRows,
  addLabel,
  errors,
}: {
  title: string;
  hint: string;
  rows: EntryRow[];
  setRows: (r: EntryRow[]) => void;
  addLabel: string;
  errors?: string[];
}) {
  return (
    <section className="rounded-3xl border border-line bg-surface p-5">
      <SectionHeader title={title} hint={hint} />
      <div className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <div key={i} className="rounded-2xl border border-line bg-bg p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs text-ink-3">{i + 1}</span>
              <RowControls
                first={i === 0}
                last={i === rows.length - 1}
                onUp={() => setRows(move(rows, i, -1))}
                onDown={() => setRows(move(rows, i, 1))}
                onRemove={() => setRows(rows.filter((_, k) => k !== i))}
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-[180px_1fr_1.4fr]">
              <Field
                label="기간"
                value={row.period}
                placeholder="1994.03 ~ 1999.02"
                onChange={(v) => setRows(rows.map((r, k) => (k === i ? { ...r, period: v } : r)))}
              />
              <Field
                label="직함/학위"
                value={row.title}
                placeholder="Ph.D."
                onChange={(v) => setRows(rows.map((r, k) => (k === i ? { ...r, title: v } : r)))}
              />
              <Field
                label="기관 (비워도 됨)"
                value={row.inst}
                placeholder="POSTECH"
                onChange={(v) => setRows(rows.map((r, k) => (k === i ? { ...r, inst: v } : r)))}
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setRows([...rows, { period: "", title: "", inst: "" }])} className={addBtnClass}>
          + {addLabel}
        </button>
      </div>
      <SectionErrors errors={errors} />
    </section>
  );
}

// ─── Research Field (group → items → comma sub-tags) ──────────────────────────

function ResearchSection({
  groups,
  setGroups,
  errors,
}: {
  groups: GroupRow[];
  setGroups: (g: GroupRow[]) => void;
  errors?: string[];
}) {
  const patchGroup = (gi: number, patch: Partial<GroupRow>) =>
    setGroups(groups.map((g, k) => (k === gi ? { ...g, ...patch } : g)));
  const patchItem = (gi: number, ii: number, patch: Partial<ItemRow>) =>
    patchGroup(gi, {
      items: groups[gi].items.map((it, k) => (k === ii ? { ...it, ...patch } : it)),
    });

  return (
    <section className="rounded-3xl border border-line bg-surface p-5">
      <SectionHeader
        title="연구분야 (Research Field)"
        hint="그룹 안에 항목을, 각 항목에 세부 태그(쉼표로 구분)를 둡니다. 그룹명·항목명·강의명은 중복할 수 없습니다."
      />
      <div className="flex flex-col gap-4">
        {groups.map((g, gi) => (
          <div key={gi} className="rounded-2xl border border-line bg-bg p-4">
            <div className="mb-3 flex items-end gap-2">
              <div className="flex-1">
                <Field
                  label="그룹명"
                  value={g.group}
                  placeholder="Major R&D Areas"
                  onChange={(v) => patchGroup(gi, { group: v })}
                />
              </div>
              <RowControls
                first={gi === 0}
                last={gi === groups.length - 1}
                onUp={() => setGroups(move(groups, gi, -1))}
                onDown={() => setGroups(move(groups, gi, 1))}
                onRemove={() => setGroups(groups.filter((_, k) => k !== gi))}
              />
            </div>

            <div className="flex flex-col gap-2 border-l-2 border-line pl-3">
              {g.items.map((it, ii) => (
                <div key={ii} className="rounded-xl border border-line bg-surface p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-xs text-ink-3">{ii + 1}</span>
                    <RowControls
                      first={ii === 0}
                      last={ii === g.items.length - 1}
                      onUp={() => patchGroup(gi, { items: move(g.items, ii, -1) })}
                      onDown={() => patchGroup(gi, { items: move(g.items, ii, 1) })}
                      onRemove={() => patchGroup(gi, { items: g.items.filter((_, k) => k !== ii) })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Field
                      label="항목명"
                      value={it.label}
                      placeholder="Advanced Thermal Management"
                      onChange={(v) => patchItem(gi, ii, { label: v })}
                    />
                    <Field
                      label="세부 태그 (쉼표로 구분, 비워도 됨)"
                      value={it.subs}
                      placeholder="Power Semiconductor, EV Battery"
                      onChange={(v) => patchItem(gi, ii, { subs: v })}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => patchGroup(gi, { items: [...g.items, { label: "", subs: "" }] })}
                className={addBtnClass}
              >
                + 항목 추가
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setGroups([...groups, { group: "", items: [] }])}
          className={addBtnClass}
        >
          + 그룹 추가
        </button>
      </div>
      <SectionErrors errors={errors} />
    </section>
  );
}

// ─── Lecture Subject ──────────────────────────────────────────────────────────

function LectureSection({
  rows,
  setRows,
  errors,
}: {
  rows: LectureRow[];
  setRows: (r: LectureRow[]) => void;
  errors?: string[];
}) {
  return (
    <section className="rounded-3xl border border-line bg-surface p-5">
      <SectionHeader title="강의 (Lecture Subject)" hint="강의 코드는 비워도 됩니다." />
      <div className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <div key={i} className="rounded-2xl border border-line bg-bg p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs text-ink-3">{i + 1}</span>
              <RowControls
                first={i === 0}
                last={i === rows.length - 1}
                onUp={() => setRows(move(rows, i, -1))}
                onDown={() => setRows(move(rows, i, 1))}
                onRemove={() => setRows(rows.filter((_, k) => k !== i))}
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-[1fr_180px]">
              <Field
                label="강의명"
                value={row.title}
                placeholder="Heat Transfer"
                onChange={(v) => setRows(rows.map((r, k) => (k === i ? { ...r, title: v } : r)))}
              />
              <Field
                label="코드 (비워도 됨)"
                value={row.code}
                placeholder="ME301"
                onChange={(v) => setRows(rows.map((r, k) => (k === i ? { ...r, code: v } : r)))}
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setRows([...rows, { title: "", code: "" }])} className={addBtnClass}>
          + 강의 추가
        </button>
      </div>
      <SectionErrors errors={errors} />
    </section>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────

const initialState: MemberFormState = {};

export default function ProfessorProfileForm({
  education: educationInit,
  workHistory: workHistoryInit,
  researchFields: researchFieldsInit,
  lectureSubjects: lectureSubjectsInit,
}: {
  education: EntryIn[];
  workHistory: EntryIn[];
  researchFields: GroupIn[];
  lectureSubjects: LectureIn[];
}) {
  const [state, formAction] = useFormState(updateProfessorProfile, initialState);

  const [education, setEducation] = useState<EntryRow[]>(educationInit);
  const [workHistory, setWorkHistory] = useState<EntryRow[]>(workHistoryInit);
  const [researchFields, setResearchFields] = useState<GroupRow[]>(
    researchFieldsInit.map((g) => ({
      group: g.group,
      items: g.items.map((it) => ({ label: it.label, subs: it.subs.join(", ") })),
    })),
  );
  const [lectureSubjects, setLectureSubjects] = useState<LectureRow[]>(lectureSubjectsInit);

  return (
    <form action={formAction} onKeyDown={blockImplicitSubmit} className="flex flex-col gap-6">
      {/* Serialized state — the only named fields the action reads. */}
      <input type="hidden" name="education" value={JSON.stringify(education)} />
      <input type="hidden" name="workHistory" value={JSON.stringify(workHistory)} />
      <input type="hidden" name="researchFields" value={JSON.stringify(researchFields)} />
      <input type="hidden" name="lectureSubjects" value={JSON.stringify(lectureSubjects)} />

      <EntrySection
        title="학력 (Education)"
        hint="공개 페이지의 Education 목록 순서대로 표시됩니다."
        rows={education}
        setRows={setEducation}
        addLabel="학력 추가"
        errors={state.errors?.education}
      />
      <EntrySection
        title="경력 (Work Experience)"
        hint="직함만 필수이며 기간·기관은 비워도 됩니다."
        rows={workHistory}
        setRows={setWorkHistory}
        addLabel="경력 추가"
        errors={state.errors?.workHistory}
      />
      <ResearchSection
        groups={researchFields}
        setGroups={setResearchFields}
        errors={state.errors?.researchFields}
      />
      <LectureSection
        rows={lectureSubjects}
        setRows={setLectureSubjects}
        errors={state.errors?.lectureSubjects}
      />

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="flex items-center gap-3">
        <SubmitButton label="변경 사항 저장" />
        <Link href="/admin/members" className={cancelLinkClass}>
          취소
        </Link>
      </div>
    </form>
  );
}
