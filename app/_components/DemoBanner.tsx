"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DISMISS_KEY = "atmlab-demo-banner-dismissed";

// Slim, dismissible notice shown only on the public demo deploy (gated
// server-side on !uploadsEnabled() in the root layout, passed through SiteChrome).
// It points recruiters at the admin CMS; /admin bounces to /login, which shows the
// demo credentials.
//
// Rendering: nothing is server-rendered, so a visitor who dismissed it never sees
// it flash on reload (the server can't read localStorage). For everyone else it
// mounts after hydration and slides up — a deliberate entrance, not a pop-in.
export default function DemoBanner() {
  const [render, setRender] = useState(false); // in the DOM at all?
  const [shown, setShown] = useState(false); // slid up (visible) vs slid down (hidden)?

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) !== "1") setRender(true);
  }, []);

  // Once mounted (translated down), flip to the shown state on the next frame so
  // the CSS transition animates in instead of appearing instantly.
  useEffect(() => {
    if (!render) return;
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [render]);

  if (!render) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setRender(false);
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 bg-accent text-white shadow-[0_-4px_24px_rgba(0,0,0,0.16)] transition-[transform,opacity] duration-300 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-container items-center justify-between gap-3 px-8 py-3 max-[640px]:px-5 max-[640px]:py-2.5">
        <p className="text-[15px] font-medium leading-snug max-[640px]:text-[13px]">
          <span aria-hidden="true">👋</span> Live portfolio demo — content resets
          periodically.
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            href="/admin"
            className="rounded-full bg-white px-4 py-1.5 text-[13.5px] font-semibold text-accent shadow-sm transition-transform hover:scale-[1.03] max-[640px]:px-3 max-[640px]:text-[12.5px]"
          >
            Try the admin CMS →
          </Link>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss demo notice"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/15 hover:text-white"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ×
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
