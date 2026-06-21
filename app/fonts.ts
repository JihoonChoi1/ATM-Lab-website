import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";

// Phase 8-5: self-hosted fonts via next/font, replacing the two render-blocking
// cross-origin <link>s in the document head (jsdelivr Pretendard + Google Fonts).
// next/font inlines a same-origin @font-face (display:swap) so first paint is no
// longer blocked on an external stylesheet round-trip, and removes the build's
// no-page-custom-font warning. Both deploys (Vercel + school server) serve the
// font from /_next, so no CDN dependency at runtime.

// PretendardVariable.subset.woff2 is a Latin + punctuation + symbols subset of
// the upstream variable font (the full 2 MB is ~95% Korean glyphs, which saturate
// a throttled link and starve the LCP image — measured). The site content is
// English; Korean text (names, some titles) falls through this subset to the
// system Korean font via the fallback stack — graceful per-glyph fallback, never
// tofu. Regenerate with fonttools if the glyph coverage needs to change:
//   curl -L https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/woff2/PretendardVariable.woff2 -o full.woff2
//   pyftsubset full.woff2 --output-file=app/fonts/PretendardVariable.subset.woff2 \
//     --flavor=woff2 --layout-features='*' \
//     --unicodes="U+0000-024F,U+2000-20CF,U+2070-209F,U+2100-214F,U+2190-22FF,U+2C60-2C7F,U+FB00-FB4F"
export const pretendard = localFont({
  src: "./fonts/PretendardVariable.subset.woff2",
  weight: "45 920",
  display: "swap",
  variable: "--font-pretendard",
  fallback: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});
