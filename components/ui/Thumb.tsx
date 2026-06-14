"use client";

import { thumbUrl } from "@/lib/thumbnail-path";

// Phase 7-9: list/card/preview image. Serves the 600px WebP thumbnail for a
// /legacy or /uploads source, falling back to the original on error (pre-backfill
// or a failed generation). Detail pages render the original directly. GIF
// thumbnails are static first-frame WebP, so cards freeze GIFs automatically.
// `src` may be null (e.g. a member with no portrait) — then it behaves like the
// previous bare <img> with no src.
export default function Thumb({
  src,
  alt,
  className,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src ? thumbUrl(src) : undefined}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={
        src
          ? (e) => {
              const img = e.currentTarget;
              if (img.dataset.fallback) return; // avoid a loop if the original 404s too
              img.dataset.fallback = "1";
              img.src = src;
            }
          : undefined
      }
    />
  );
}
