"use client";

import { useEffect } from "react";

// Server-action redirects (the ?saved=1 success flow) land back on a parent page
// whose prior scroll position the browser restores — which hides the success
// banner sitting at the very top. Mounting this (only when the banner shows)
// forces the viewport back to the top so the banner is actually seen. The
// requestAnimationFrame beats the router's own scroll restoration.
export default function ScrollTopOnMount() {
  useEffect(() => {
    const id = requestAnimationFrame(() => window.scrollTo(0, 0));
    return () => cancelAnimationFrame(id);
  }, []);
  return null;
}
