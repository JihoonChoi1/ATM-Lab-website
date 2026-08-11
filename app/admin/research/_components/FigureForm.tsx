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
import { createFigure, updateFigure, type ResearchFormState } from "../actions";

// Create + edit form. width/height are controlled number inputs: required even
// for a placeholder figure (they drive the public aspect-ratio box + portrait
// pairing). Picking an image auto-fills them from its client-read pixel
// dimensions (8-7), and the admin can still type them in by hand for a pathless
// placeholder.

export type FigureFormValues = {
  id: string;
  imgPath: string | null;
  caption: string;
  width: number;
  height: number;
  wide: boolean;
};

const initialState: ResearchFormState = {};

export default function FigureForm({
  topicId,
  subsectionId,
  figure,
  uploadsEnabled,
  cancelHref,
}: {
  topicId: string;
  subsectionId: string;
  figure?: FigureFormValues;
  uploadsEnabled: boolean;
  cancelHref: string;
}) {
  const action = figure
    ? updateFigure.bind(null, topicId, subsectionId, figure.id)
    : createFigure.bind(null, topicId, subsectionId);
  const [state, formAction] = useFormState(action, initialState);

  // Default to a landscape placeholder so a pathless figure still renders sanely.
  const [width, setWidth] = useState(String(figure?.width ?? 600));
  const [height, setHeight] = useState(String(figure?.height ?? 400));

  return (
    <form action={formAction} onKeyDown={blockImplicitSubmit} className="flex flex-col gap-5">
      <ImageUploadField
        label="Image path"
        defaultValue={figure?.imgPath}
        hint="Leave empty to show a placeholder figure on the public page. Choosing an image fills in the dimensions below automatically."
        errors={state.errors?.imgPath}
        uploadsEnabled={uploadsEnabled}
        onDimensions={({ width: w, height: h }) => {
          setWidth(String(w));
          setHeight(String(h));
        }}
      />

      <div>
        <label htmlFor="caption" className={labelClass}>
          Caption
        </label>
        <textarea
          id="caption"
          name="caption"
          rows={3}
          defaultValue={figure?.caption}
          placeholder="Fig. 1.1 — High-speed visualization of pool boiling."
          className={inputClass}
        />
        <p className={hintClass}>
          With the “Fig. 1.1 — caption” format, the public page shows the label and caption separately.
        </p>
        <FieldError errors={state.errors?.caption} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="width" className={labelClass}>
            Width (px)
          </label>
          <input
            id="width"
            name="width"
            type="number"
            min={1}
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className={inputClass}
          />
          <FieldError errors={state.errors?.width} />
        </div>
        <div>
          <label htmlFor="height" className={labelClass}>
            Height (px)
          </label>
          <input
            id="height"
            name="height"
            type="number"
            min={1}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={inputClass}
          />
          <FieldError errors={state.errors?.height} />
        </div>
      </div>
      <p className={hintClass}>
        Two consecutive portrait figures (width/height &lt; 0.95) pair side by side
        on the public page automatically; otherwise a figure shows full-width.
      </p>

      <fieldset>
        <legend className={labelClass}>Display size</legend>
        <div className="mt-1 grid grid-cols-2 gap-3">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="wide"
              value="normal"
              defaultChecked={!figure?.wide}
              className="peer sr-only"
            />
            <div className="rounded-xl border border-line p-3 transition peer-checked:border-accent peer-checked:bg-accent-soft peer-focus-visible:ring-2 peer-focus-visible:ring-accent/30">
              <div className="mb-2 flex gap-1" aria-hidden>
                <div className="h-9 flex-1 rounded bg-accent/70" />
                <div className="h-9 flex-1 rounded bg-line" />
                <div className="h-9 flex-1 rounded bg-line" />
              </div>
              <div className="text-sm font-medium text-ink">Normal</div>
              <div className="text-xs text-ink-3">Side by side with other figures</div>
            </div>
          </label>

          <label className="cursor-pointer">
            <input
              type="radio"
              name="wide"
              value="wide"
              defaultChecked={figure?.wide ?? false}
              className="peer sr-only"
            />
            <div className="rounded-xl border border-line p-3 transition peer-checked:border-accent peer-checked:bg-accent-soft peer-focus-visible:ring-2 peer-focus-visible:ring-accent/30">
              <div className="mb-1 flex" aria-hidden>
                <div className="h-9 flex-1 rounded bg-accent/70" />
              </div>
              <div className="mb-2 flex gap-1" aria-hidden>
                <div className="h-4 flex-1 rounded bg-line" />
                <div className="h-4 flex-1 rounded bg-line" />
              </div>
              <div className="text-sm font-medium text-ink">Large</div>
              <div className="text-xs text-ink-3">This figure alone spans the full row</div>
            </div>
          </label>
        </div>
        <p className={hintClass}>
          In a subsection with two or more figures, one marked “Large” spans the
          full row on the public page.
        </p>
      </fieldset>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label={figure ? "Save changes" : "Add figure"} />
        <Link href={cancelHref} className={cancelLinkClass}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
