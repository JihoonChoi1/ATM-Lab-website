"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VisitorTracker from "@/app/_components/VisitorTracker";

// Hide the public marketing chrome on admin routes — they have their own shell
// (sidebar layout). Home, the public pages, and login all keep it. This lives in
// a client component because the root layout is a server component and can't read
// the current path (usePathname is client-only).
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const isAdmin = usePathname()?.startsWith("/admin");
  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
      {!isAdmin && <VisitorTracker />}
    </>
  );
}
