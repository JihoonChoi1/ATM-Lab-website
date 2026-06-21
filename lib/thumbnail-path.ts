// Phase 7-9: pure path helpers for the thumbnail scheme — no sharp, no fs, so
// this is safe to import from client components (Thumb) as well as the server.
//
// Rule: /legacy/foo.jpg → /legacy/thumbs/foo.webp and /uploads/bar.png →
// /uploads/thumbs/bar.webp. Anything else (static assets like /professor.png)
// is returned unchanged — those have no pre-baked thumbnail and render as-is.
// Phase 8-5 adds a parallel `details/` variant (1400px WebP) for detail pages,
// which previously served the multi-MB original.

const VARIANTED_PREFIXES = ["/legacy/", "/uploads/"] as const;

// Map /legacy/foo.jpg → /legacy/<kind>/foo.webp (idempotent — a path already in
// that variant folder is returned unchanged). Non-varianted paths pass through.
function variantUrl(webPath: string, kind: "thumbs" | "details"): string {
  for (const prefix of VARIANTED_PREFIXES) {
    if (webPath.startsWith(prefix) && !webPath.startsWith(`${prefix}${kind}/`)) {
      const base = webPath.slice(prefix.length).replace(/\.[^./]+$/, "");
      return `${prefix}${kind}/${base}.webp`;
    }
  }
  return webPath;
}

// Map a public image path to the path of its 600px WebP thumbnail (list/cards).
export function thumbUrl(webPath: string): string {
  return variantUrl(webPath, "thumbs");
}

// Map a public image path to the path of its 1400px WebP detail variant.
export function detailUrl(webPath: string): string {
  return variantUrl(webPath, "details");
}
