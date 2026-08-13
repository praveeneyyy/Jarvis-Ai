/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./Jarvis/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        NONE: "0px",
        DEFAULT: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        "3xl": "0px",
        full: "0px",
        card: "0px",
        chip: "0px",
        control: "0px",
      },
      colors: {
        surface: "var(--surface)",
        field: "var(--field)",
        hover: "var(--hover)",
        "hover-2": "var(--hover-2)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
        "accent-tint": "var(--accent-tint)",
      },
    },
  },
  plugins: [],
};
