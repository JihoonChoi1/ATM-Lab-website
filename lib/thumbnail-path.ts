// Phase 7-9: pure path helpers for the thumbnail scheme — no sharp, no fs, so
// this is safe to import from client components (Thumb) as well as the server.
//
// Rule: /legacy/foo.jpg → /legacy/thumbs/foo.webp and /uploads/bar.png →
// /uploads/thumbs/bar.webp. Anything else (static assets like /professor.png)
// is returned unchanged — those have no pre-baked thumbnail and render as-is.

const THUMBNAILED_PREFIXES = ["/legacy/", "/uploads/"] as const;

// Map a public image path to the path of its 600px WebP thumbnail.
export function thumbUrl(webPath: string): string {
  for (const prefix of THUMBNAILED_PREFIXES) {
    // Skip paths that are already a thumbnail (idempotent).
    if (webPath.startsWith(prefix) && !webPath.startsWith(`${prefix}thumbs/`)) {
      const base = webPath.slice(prefix.length).replace(/\.[^./]+$/, "");
      return `${prefix}thumbs/${base}.webp`;
    }
  }
  return webPath;
}
