"use client";

import { useEffect } from "react";

/**
 * Sets up the scroll-reveal IntersectionObserver used across pages.
 * `.reveal` / `.reveal-stagger` / `.wo-cell` start hidden (opacity:0) and get
 * the `.in` class when they enter the viewport.
 *
 * Pass `watch` when the page swaps revealable content on the client (e.g. a
 * category filter) so the observer re-attaches to the new elements.
 */
export default function RevealOnScroll({
  watch,
  threshold = 0.12,
}: {
  watch?: unknown;
  threshold?: number;
}) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
          else e.target.classList.remove("in");
        }),
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    document
      .querySelectorAll(".reveal, .reveal-stagger, .wo-cell")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [watch, threshold]);

  return null;
}
