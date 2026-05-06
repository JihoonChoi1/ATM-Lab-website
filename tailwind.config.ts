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
        accent: {
          DEFAULT: "#1A56DB",
          dark: "#0E3FA8",
          light: "#5b8def",
          lighter: "#7aa1ff",
          lightest: "#a8c2ff",
          soft: "rgba(26,86,219,0.08)",
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
          "'Pretendard Variable'",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
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
