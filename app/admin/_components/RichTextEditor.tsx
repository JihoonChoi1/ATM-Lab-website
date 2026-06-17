"use client";

import { useCallback, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, Color, FontSize, BackgroundColor } from "@tiptap/extension-text-style";
import { uploadImage } from "./upload-action";

// Phase 7-12: reusable WYSIWYG editor with a closed vocabulary — paragraph,
// bold, italic, link, bullet/ordered lists, center/right align, bounded font-
// size steps, text color, highlight (background color), image. Tables and
// free px sizes stay out (the size steps are em-based and bounded so they stay
// mobile-safe). The serialized HTML rides a hidden input so the existing
// useFormState + Zod action flow is untouched (same hidden-input pattern as the
// 7-11 professor editor). The server re-sanitizes to the same allowlist — the
// client limit is only a promise. Built to be reused (withImage toggles the
// image affordances) but attached only to NewsForm for now.

// Font-size steps — em (relative to the body measure) and bounded, so "크게"
// can't overflow a phone the way an arbitrary 40px would. Must match the
// font-size allowlist in lib/sanitize-rich-text.ts.
const SIZE_SMALL = "0.85em";
const SIZE_LARGE = "1.4em";

const hexOr = (v: unknown, fallback: string) =>
  typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback;

// Applied to the .ProseMirror surface. Tailwind's preflight strips list markers,
// so list-disc/decimal must be restated here (and on the public detail page).
const EDITOR_CLASS =
  "min-h-[280px] w-full px-4 py-3 text-base leading-[1.7] text-ink focus:outline-none " +
  "[&_p]:my-2 " +
  "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 " +
  "[&_li]:my-1 [&_li>p]:my-0 " +
  "[&_a]:text-accent [&_a]:underline " +
  "[&_strong]:font-semibold [&_strong]:text-ink " +
  "[&_img]:my-3 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:border [&_img]:border-line";

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      // Keep the editor selection: a plain button steals focus on mousedown,
      // collapsing the selection before onClick runs, so formatting a selection
      // (or inserting an image at the cursor) would silently miss.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-2.5 py-1.5 text-sm font-medium transition disabled:opacity-50 ${
        active ? "bg-accent-soft text-accent" : "text-ink-2 hover:bg-bg"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden className="mx-0.5 h-5 w-px shrink-0 bg-line" />;
}

export default function RichTextEditor({
  name,
  defaultValue,
  withImage = false,
  uploadsEnabled = false,
}: {
  name: string;
  defaultValue?: string | null;
  withImage?: boolean;
  uploadsEnabled?: boolean;
}) {
  const [html, setHtml] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);

  // Image affordances need both the host opting in and the env allowing uploads
  // (the cloud demo disables uploads).
  const imageEnabled = withImage && uploadsEnabled;

  // Empty doc serializes to "" (not "<p></p>") so emptyToNull → null holds and
  // the detail page falls back to "No content.".
  const serialize = (ed: Editor) => setHtml(ed.isEmpty ? "" : ed.getHTML());

  // The three image paths (toolbar / drag-drop / paste) all funnel here, so a
  // single upload + insert handler covers them. Reached via editorRef because
  // the editorProps closures are captured once at editor creation.
  const insertImage = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadImage(fd);
      if (res.ok) editorRef.current?.chain().focus().setImage({ src: res.path }).run();
      else setUploadError(res.error);
    } catch {
      setUploadError("이미지 업로드에 실패했습니다. 다시 시도하세요.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }, []);

  const editor = useEditor({
    immediatelyRender: false, // SSR: Next App Router would hydration-mismatch otherwise
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        underline: false,
        link: {
          openOnClick: false,
          autolink: false,
          HTMLAttributes: { target: "_blank", rel: "noopener noreferrer nofollow" },
        },
      }),
      Image,
      // Paragraph alignment only (e.g. centered image captions). Color/size/
      // tables stay out; text-align is responsive-safe. Emits inline
      // style="text-align:…" which the server sanitize restricts to l/c/r.
      TextAlign.configure({ types: ["paragraph"], alignments: ["left", "center", "right"] }),
      // Text color / highlight / size all ride the TextStyle mark → emit
      // <span style="color:… | background-color:… | font-size:…">. The server
      // sanitize keeps only those three properties on span (color/bg = any
      // color value; font-size = the two bounded steps) and drops the rest.
      TextStyle,
      Color,
      BackgroundColor,
      FontSize,
    ],
    content: defaultValue || "",
    editorProps: {
      attributes: { class: EDITOR_CLASS },
      handlePaste: (_view, event) => {
        if (!imageEnabled) return false;
        const file = Array.from(event.clipboardData?.files ?? []).find((f) =>
          f.type.startsWith("image/"),
        );
        if (!file) return false;
        event.preventDefault();
        void insertImage(file);
        return true;
      },
      handleDrop: (_view, event) => {
        if (!imageEnabled) return false;
        const file = Array.from((event as DragEvent).dataTransfer?.files ?? []).find((f) =>
          f.type.startsWith("image/"),
        );
        if (!file) return false;
        event.preventDefault();
        void insertImage(file);
        return true;
      },
    },
    onCreate: ({ editor }) => {
      editorRef.current = editor;
      // Legacy rows normalize to the closed vocab on open (lazy migration), so a
      // bare open + save already records the cleaned-up HTML.
      serialize(editor);
    },
    onUpdate: ({ editor }) => serialize(editor),
  });

  function toggleLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("링크 URL을 입력하세요", prev ?? "https://");
    if (url === null) return; // cancelled
    const trimmed = url.trim();
    const chain = editor.chain().focus().extendMarkRange("link");
    if (trimmed === "") chain.unsetLink().run();
    else chain.setLink({ href: trimmed }).run();
  }

  return (
    <div className="rounded-2xl border border-line bg-surface transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
      {editor && (
        <div className="flex flex-wrap items-center gap-1 border-b border-line px-2 py-1.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editor.isActive("paragraph")}
          >
            단락
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
          >
            <span className="font-bold">굵게</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
          >
            <span className="italic">기울임</span>
          </ToolbarButton>
          <ToolbarButton onClick={toggleLink} active={editor.isActive("link")}>
            링크
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            onClick={() => editor.chain().focus().setFontSize(SIZE_SMALL).run()}
            active={editor.isActive("textStyle", { fontSize: SIZE_SMALL })}
          >
            작게
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().unsetFontSize().run()}>
            보통
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setFontSize(SIZE_LARGE).run()}
            active={editor.isActive("textStyle", { fontSize: SIZE_LARGE })}
          >
            크게
          </ToolbarButton>

          <Divider />

          {/* Explicit 3-way group (not toggles) so the active alignment is
              always visible and 왼쪽 is how you revert. 왼쪽 = unset → no
              text-align style (clean default); active when neither c/r is set. */}
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetTextAlign().run()}
            active={
              !editor.isActive({ textAlign: "center" }) &&
              !editor.isActive({ textAlign: "right" })
            }
          >
            왼쪽
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
          >
            가운데
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
          >
            오른쪽
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
          >
            • 목록
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
          >
            1. 목록
          </ToolbarButton>

          <Divider />

          {/* Native pickers = any color. The picker blurs the editor; chain()
              .focus() reapplies to the remembered selection (same as the link
              prompt). Sanitize keeps only color / background-color on the span. */}
          <label
            title="글자색"
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-2 transition hover:bg-bg"
          >
            <input
              type="color"
              aria-label="글자색"
              value={hexOr(editor.getAttributes("textStyle").color, "#111827")}
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
            />
            글자색
          </label>
          <label
            title="배경색 (형광펜)"
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-2 transition hover:bg-bg"
          >
            <input
              type="color"
              aria-label="배경색"
              value={hexOr(editor.getAttributes("textStyle").backgroundColor, "#fde68a")}
              onChange={(e) => editor.chain().focus().setBackgroundColor(e.target.value).run()}
              className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
            />
            배경색
          </label>
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetColor().unsetBackgroundColor().run()}
          >
            색 지우기
          </ToolbarButton>

          {imageEnabled && (
            <>
              <Divider />
              <ToolbarButton onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? "업로드 중…" : "사진"}
              </ToolbarButton>
            </>
          )}
        </div>
      )}

      <EditorContent editor={editor} />

      {imageEnabled && (
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void insertImage(file);
          }}
        />
      )}
      {uploadError && (
        <p className="px-4 pb-2 text-sm text-ajou-yellow">{uploadError}</p>
      )}

      <input type="hidden" name={name} value={html} />
    </div>
  );
}
