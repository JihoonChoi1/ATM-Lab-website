"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VisitorTracker from "@/app/_components/VisitorTracker";
import DemoBanner from "@/app/_components/DemoBanner";

// Hide the public marketing chrome on admin routes — they have their own shell
// (sidebar layout). Home, the public pages, and login all keep it. This lives in
// a client component because the root layout is a server component and can't read
// the current path (usePathname is client-only). `demo` comes from the layout
// (!uploadsEnabled()) so the demo banner only shows on the public Vercel deploy.
export default function SiteChrome({
  children,
  demo,
}: {
  children: React.ReactNode;
  demo: boolean;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  // Skip /login too — it already surfaces the demo credentials, and the banner's
  // "Try the admin CMS" link would just bounce back here.
  const showDemoBanner = demo && !isAdmin && pathname !== "/login";
  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
      {!isAdmin && <VisitorTracker />}
      {showDemoBanner && <DemoBanner />}
    </>
  );
}
