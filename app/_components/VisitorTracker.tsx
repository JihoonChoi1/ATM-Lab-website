"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// lightweight client tracker. Fires a fire-and-forget beacon to
// /api/track on each page view (initial load + client-side route changes). It is
// only mounted on public routes (SiteChrome gates it behind !isAdmin), and the
// /admin guard here is a second belt — admin traffic is never recorded.
export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    // sendBeacon survives the page unloading during navigation; fetch keepalive
    // is the fallback for the rare browser without it. Both ignore the response.
    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon("/api/track");
    } else {
      fetch("/api/track", { method: "POST", keepalive: true }).catch(() => { });
    }
  }, [pathname]);

  return null;
}
