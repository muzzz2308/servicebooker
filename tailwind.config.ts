import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-moss",
    "bg-moss-light",
    "bg-panel",
    "text-ink",
    "text-moss-light",
    "text-mist",
    "text-sand",
    "border-line",
    "border-moss",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: "#0c0f0c",
        panel: "#151915",
        line: "#2c322c",
        mist: "#9aa394",
        moss: "#8b9a6d",
        "moss-light": "#a7b68a",
        sand: "#e8ebe4",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
