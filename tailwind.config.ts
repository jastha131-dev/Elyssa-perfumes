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
        // ── Electric Ginger palette (accent) ──────────────────────────────
        camel: {
          50:  "#FEF3EC",
          100: "#FDDFCB",
          300: "#F2956A",
          400: "#EE7B44",
          500: "#E9631A",
          600: "#C25015",
          700: "#9B3E10",
        },
        gold: {
          50:  "#FEF3EC",
          100: "#FDDFCB",
          200: "#FBC4A0",
          300: "#F49C6A",
          400: "#EF7C40",
          500: "#E9631A",
          600: "#C25015",
          700: "#9B3E10",
          800: "#7A3210",
          900: "#5C240A",
          950: "#3B1505",
        },
        // ── Deep Charcoal palette (dark / text) ────────────────────────────
        ink: {
          50:  "#F5F5F5",
          100: "#EBEBEB",
          200: "#D2D2D2",
          300: "#ABABAB",
          400: "#848484",
          500: "#5E5E5E",
          600: "#424242",
          700: "#323232",
          800: "#1E1E1E",
          900: "#121212",
          950: "#080808",
        },
        charcoal: {
          50:  "#F5F5F5",
          100: "#E8E8E8",
          200: "#CACACA",
          300: "#A6A6A6",
          400: "#828282",
          500: "#626262",
          600: "#494949",
          700: "#323232",
          800: "#202020",
          900: "#141414",
          950: "#0A0A0A",
        },
        // ── Parchment palette (background / soft) ─────────────────────────
        stone: {
          50:  "#F8F8F4",
          100: "#F4F4EE",
          200: "#EBEBDF",
          300: "#DDDDD1",
          400: "#CBCBBA",
        },
        cream: {
          50:  "#FAFAF7",
          100: "#F4F4EE",
          200: "#EBEBDF",
          300: "#DDDDD0",
          400: "#CACAB6",
          500: "#B5B59E",
        },
        // ── Azure Mist palette (secondary accent) ─────────────────────────
        azure: {
          50:  "#EFF5FB",
          100: "#D8E8F5",
          200: "#C0D6EC",
          300: "#A9C2E0",
          400: "#8AAECE",
          500: "#6A98BB",
          600: "#4E7EA3",
          700: "#3A6285",
        },
      },
      fontFamily: {
        display:  ["var(--font-display)",  "serif"],
        headline: ["var(--font-headline)", "sans-serif"],
        body:     ["var(--font-body)",     "sans-serif"],
      },
      animation: {
        "fade-in":         "fadeIn 0.6s ease forwards",
        "slide-up":        "slideUp 0.6s ease forwards",
        shimmer:           "shimmer 2s infinite",
        marquee:           "marquee 32s linear infinite",
        "marquee-reverse": "marqueeReverse 32s linear infinite",
      },
      keyframes: {
        fadeIn:         { from: { opacity: "0" },                             to: { opacity: "1" } },
        slideUp:        { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        shimmer:        { "0%": { backgroundPosition: "-200% 0" },            "100%": { backgroundPosition: "200% 0" } },
        marquee:        { from: { transform: "translateX(0)" },               to:   { transform: "translateX(-50%)" } },
        marqueeReverse: { from: { transform: "translateX(-50%)" },            to:   { transform: "translateX(0)" } },
      },
    },
  },
  plugins: [],
};

export default config;
