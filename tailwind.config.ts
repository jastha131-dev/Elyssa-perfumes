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
        // NEW warm editorial palette
        stone: {
          50:  "#FDFAF7",
          100: "#F7F0E6",
          200: "#EDE0CC",
          300: "#DDD0B8",
          400: "#CAB898",
        },
        camel: {
          300: "#D4A96A",
          400: "#C49A5A",
          500: "#B08040",
          600: "#9A6E32",
          700: "#7D5828",
        },
        ink: {
          50:  "#F5F5F5",
          100: "#EBEBEB",
          200: "#D6D6D6",
          300: "#ADADAD",
          400: "#858585",
          500: "#5C5C5C",
          600: "#3D3D3D",
          700: "#2D2D2D",
          800: "#1A1A1A",
          900: "#0D0D0D",
          950: "#080808",
        },
        // Keep existing
        gold: {
          50: "#fdfaed",
          100: "#f9f0cc",
          200: "#f3df94",
          300: "#ecc85c",
          400: "#e6b330",
          500: "#d99a1b",
          600: "#c07a13",
          700: "#9f5a13",
          800: "#834616",
          900: "#6c3a17",
          950: "#3e1e08",
        },
        cream: {
          50: "#fefdf8",
          100: "#fdf9ec",
          200: "#f9f0cc",
          300: "#f4e4a4",
          400: "#edd474",
          500: "#e5c24a",
        },
        charcoal: {
          50: "#f7f7f7",
          100: "#e3e3e3",
          200: "#c8c8c8",
          300: "#a4a4a4",
          400: "#818181",
          500: "#666666",
          600: "#515151",
          700: "#434343",
          800: "#383838",
          900: "#1a1a1a",
          950: "#0d0d0d",
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
