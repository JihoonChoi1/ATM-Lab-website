"use client";

import type { CSSProperties } from "react";

// Last-resort boundary for errors thrown in the root layout itself. It replaces
// the root layout entirely and renders its own <html>/<body>. Measured (8-7):
// on this fallback path Next does NOT link the global stylesheet or the next/font
// face (0 <link>/<style>, computed font fell back to serif, bg transparent), so
// Tailwind classes and `import "./globals.css"` are inert here. The page is
// therefore made fully self-contained with inline styles + a system font stack
// (CSP allows them: style-src 'self' 'unsafe-inline'). Brand hexes are inlined
// from tailwind.config.ts (accent #0066FF / accent-dark #0047D9 / ink #0c111d /
// ink-2 #3a4150 / ink-3 #6b7280 / bg #fbfbfb / line #ececef).
// Note: error boundaries only render in production — `next dev` shows its own
// dev error overlay instead.

const SANS =
  "-apple-system, BlinkMacSystemFont, 'Pretendard', 'Apple SD Gothic Neo', sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const body: CSSProperties = {
  margin: 0,
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "96px 24px",
  background: "#fbfbfb",
  color: "#0c111d",
  fontFamily: SANS,
  lineHeight: 1.55,
  WebkitFontSmoothing: "antialiased",
};
const eyebrow: CSSProperties = {
  margin: 0,
  fontFamily: MONO,
  fontSize: 13,
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  color: "#0047D9",
};
const heading: CSSProperties = {
  margin: "20px 0 0",
  fontSize: "clamp(28px, 5vw, 44px)",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  lineHeight: 1.15,
  color: "#0c111d",
};
const lede: CSSProperties = {
  margin: "20px 0 0",
  fontSize: 16,
  lineHeight: 1.7,
  color: "#3a4150",
};
const actions: CSSProperties = {
  marginTop: 36,
  display: "flex",
  flexWrap: "wrap",
  gap: 14,
  justifyContent: "center",
};
const primaryBtn: CSSProperties = {
  appearance: "none",
  border: "none",
  borderRadius: 9999,
  padding: "12px 24px",
  fontSize: 14,
  fontWeight: 600,
  fontFamily: SANS,
  color: "#ffffff",
  background: "#0066FF",
  cursor: "pointer",
};
const secondaryLink: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: 9999,
  padding: "12px 24px",
  fontSize: 14,
  fontWeight: 500,
  color: "#0047D9",
  background: "#ffffff",
  border: "1px solid #ececef",
  textDecoration: "none",
};
const code: CSSProperties = {
  margin: "28px 0 0",
  fontFamily: MONO,
  fontSize: 12,
  color: "#6b7280",
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <head>
        <title>오류가 발생했습니다 · ATM Lab</title>
      </head>
      <body style={body}>
        <main style={{ width: "100%", maxWidth: 560, textAlign: "center" }}>
          <p style={eyebrow}>Error</p>
          <h1 style={heading}>문제가 발생했습니다</h1>
          <p style={lede}>
            페이지를 표시하는 중 예기치 못한 오류가 발생했습니다. 잠시 후 다시
            시도해 주세요. Something went wrong while loading this page.
          </p>
          <div style={actions}>
            <button type="button" onClick={() => reset()} style={primaryBtn}>
              다시 시도
            </button>
            <a href="/" style={secondaryLink}>
              홈으로
            </a>
          </div>
          {error.digest && <p style={code}>오류 코드: {error.digest}</p>}
        </main>
      </body>
    </html>
  );
}
