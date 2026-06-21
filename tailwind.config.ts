import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ajou University brand colors
        ajou: {
          blue: "#0066FF",   // Pantone 285 — CMYK(100,60,0,0)
          gold: "#B38000",   // Pantone 874 — CMYK(30,50,100,0)
          sky: "#8CCCFF",    // Pantone 283 — CMYK(45,20,0,0)
          yellow: "#FF801A", // Pantone 137 — CMYK(0,50,90,0)
          silver: "#8CA8A8", // Pantone 877 — CMYK(45,34,34,0)
        },
        accent: {
          DEFAULT: "#0066FF", // Ajou Blue
          dark: "#0047D9",
          light: "#3385FF",
          lighter: "#66A3FF",
          lightest: "#99C2FF",
          soft: "rgba(0,102,255,0.08)",
        },
        bg: "#fbfbfb",
        surface: "#ffffff",
        ink: {
          DEFAULT: "#0c111d",
          2: "#3a4150",
          3: "#6b7280",
        },
        line: "#ececef",
        dark: {
          DEFAULT: "#0d0f12",
          2: "#16191e",
          line: "rgba(255,255,255,0.08)",
        },
        success: {
          DEFAULT: "#0e9f6e",
          soft: "rgba(16,185,129,0.1)",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-pretendard)",
          "'Pretendard Variable'",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: [
          "var(--font-jetbrains-mono)",
          "'JetBrains Mono'",
          "ui-monospace",
          "monospace",
        ],
      },
      borderRadius: {
        "2xl": "14px",
        "3xl": "18px",
        "4xl": "20px",
        "5xl": "24px",
        "6xl": "28px",
      },
      maxWidth: {
        container: "1240px",
      },
    },
  },
  plugins: [],
};
export default config;
