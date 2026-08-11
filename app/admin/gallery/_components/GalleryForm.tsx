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
import ImageUploadField from "@/app/admin/_components/ImageUploadField";
import { createGalleryItem, updateGalleryItem, type GalleryFormState } from "../actions";

// Create + edit form (React 18: useFormState, same pattern as NewsForm).
// Fields are uncontrolled except imgPath, which ImageUploadField owns (7-8).
// Empty imgPath renders the board placeholder card and keeps the row off the
// home grid (not-null filter).

export type GalleryFormValues = {
  id: string;
  date: string; // YYYY-MM-DD (UTC), pre-formatted by the server page
  title: string;
  imgPath: string | null;
  published: boolean;
};

const initialState: GalleryFormState = {};

export default function GalleryForm({
  item,
  uploadsEnabled,
}: {
  item?: GalleryFormValues;
  uploadsEnabled: boolean;
}) {
  const action = item ? updateGalleryItem.bind(null, item.id) : createGalleryItem;
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} onKeyDown={blockImplicitSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="date" className={labelClass}>
          Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          defaultValue={item?.date}
          className={inputClass}
        />
        <p className={hintClass}>
          Sort key for the public /board Gallery section (newest first).
        </p>
        <FieldError errors={state.errors?.date} />
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={item?.title}
          className={inputClass}
        />
        <FieldError errors={state.errors?.title} />
      </div>

      <ImageUploadField
        label="Image"
        defaultValue={item?.imgPath}
        hint="You can save without an image — the board list shows a placeholder card with the title instead of a photo, and it is excluded from the home-page gallery."
        errors={state.errors?.imgPath}
        uploadsEnabled={uploadsEnabled}
      />

      <label className="flex items-center gap-2.5 text-sm font-medium text-ink-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={item?.published ?? true}
          className="h-4 w-4 accent-accent"
        />
        Published (uncheck to hide from public pages)
      </label>

      {state.message && <p className={messageClass}>{state.message}</p>}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label={item ? "Save changes" : "Add item"} />
        <Link href="/admin/gallery" className={cancelLinkClass}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
