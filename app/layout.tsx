import type { Metadata } from "next";
import SiteChrome from "@/app/_components/SiteChrome";
import "./globals.css";

export const metadata: Metadata = {
  // Resolves relative Open Graph image + url to absolute URLs. Reuse AUTH_URL —
  // already the per-deploy canonical origin (dev auto, prod verify
  // http://localhost:3100, school server https://atmlab.ajou.ac.kr). AUTH_URL
  // MUST be set on every deploy (Auth.js requires it too); the localhost
  // fallback only applies to local dev.
  metadataBase: new URL(process.env.AUTH_URL ?? "http://localhost:3000"),
  title: "ATM Lab — Advanced Thermal Management Laboratory",
  description:
    "Advanced Thermal Management Lab at Ajou University. Research on two-phase cooling, battery thermal management, phase-change materials, and heat pump systems.",
  // og:title / og:description and twitter:title / twitter:description are left
  // unset so they fall back per-page to each page's title/description (the 8-1
  // text), while these site-wide fields apply everywhere. og:image /
  // twitter:image come from the app/opengraph-image.png file convention.
  openGraph: {
    siteName: "ATM Lab",
    type: "website",
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-bg text-ink antialiased">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
