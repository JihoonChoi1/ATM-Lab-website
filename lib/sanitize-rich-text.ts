import sanitizeHtml from "sanitize-html";

// Phase 7-12: server-side allowlist for the News rich-text body. The Tiptap
// editor only emits this closed vocabulary, but the client limit is just a
// promise — sanitizing here guarantees the DB carries the closed tag set the
// public .news-body CSS is written against (it also normalizes a direct POST or
// a legacy blob opened+saved through the editor). Single trusted admin, so this
// is a rendering-consistency control first, defense-in-depth second. The img
// rule mirrors the imgPath policy elsewhere (root-relative internal paths only)
// and blocks data: URLs so a pasted base64 image can't land as MB of text.
// Color value syntaxes only (hex / rgb(a) / hsl(a) / named) — blocks url(),
// expression(), and anything else that could ride a style attribute.
const COLOR = /^(#(?:[0-9a-fA-F]{3,8})|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%]+\)|[a-zA-Z]+)$/;
// Font size is stepped, not free: only the two em values the editor emits pass,
// so a direct POST can't inject font-size:200px. Keep in sync with
// SIZE_SMALL/SIZE_LARGE in RichTextEditor.tsx.
const FONT_SIZE = /^(0\.85em|1\.4em)$/;

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "em", "a", "ul", "ol", "li", "img", "span"],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt"],
    // style is allowed only so allowedStyles below can keep one property each
    // (paragraph alignment / span text color) and strip everything else.
    p: ["style"],
    span: ["style"],
  },
  // Per-tag: paragraphs keep only text-align l/c/r; spans keep only a text color,
  // a background color, and a stepped font-size. No other property/value
  // survives, so the align/color/highlight/size extensions work without opening
  // a style-injection hole.
  allowedStyles: {
    p: { "text-align": [/^(left|right|center)$/] },
    span: { color: [COLOR], "background-color": [COLOR], "font-size": [FONT_SIZE] },
  },
  // href: external http(s)/mailto + internal "/..." (relative URLs always pass).
  allowedSchemes: ["http", "https", "mailto"],
  // img: no scheme allowed → only relative URLs survive (data:/http(s) stripped).
  allowedSchemesByTag: { img: [] },
  allowProtocolRelative: false, // reject //host/x for both a and img
  // Normalize every surviving link; returning only href/target/rel also drops
  // any on* / style the parser carried in.
  transformTags: {
    a: (_tagName, attribs) => ({
      tagName: "a",
      attribs: {
        ...(attribs.href ? { href: attribs.href } : {}),
        target: "_blank",
        rel: "noopener noreferrer nofollow",
      },
    }),
  },
  exclusiveFilter: (frame) => {
    // Drop <img> whose src is not a root-relative internal path. A data:/external
    // src was already stripped above, leaving src="" which also fails here.
    if (frame.tag === "img") {
      const src = frame.attribs.src ?? "";
      return !src.startsWith("/") || src.startsWith("//");
    }
    // Drop links left hrefless after scheme filtering (e.g. javascript:).
    if (frame.tag === "a") return !frame.attribs.href;
    return false;
  },
};

// Returns null for empty / tag-only input so the detail page shows "No content."
// and the home snippet stays "".
export function sanitizeRichText(html: string | null | undefined): string | null {
  if (!html) return null;
  const clean = sanitizeHtml(html, OPTIONS).trim();
  return hasContent(clean) ? clean : null;
}

function hasContent(html: string): boolean {
  if (/<img\b/i.test(html)) return true;
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0;
}
