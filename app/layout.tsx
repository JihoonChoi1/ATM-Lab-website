import type { Metadata } from "next";
import SiteChrome from "@/app/_components/SiteChrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATM Lab — Advanced Thermal Management Laboratory",
  description:
    "Advanced Thermal Management Lab at Ajou University. Research on two-phase cooling, battery thermal management, phase-change materials, and heat pump systems.",
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
