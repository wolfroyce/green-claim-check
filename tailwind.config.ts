import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0D5C3D",
          light: "#10B981",
          dark: "#064E3B",
        },
        accent: {
          DEFAULT: "#F59E0B",
          light: "#FCD34D",
          dark: "#D97706",
        },
        danger: {
          DEFAULT: "#EF4444",
          light: "#FCA5A5",
          dark: "#DC2626",
        },
        success: {
          DEFAULT: "#10B981",
          light: "#6EE7B7",
          dark: "#059669",
        },
      },
      fontFamily: {
        serif: ['"Instrument Serif"', "serif"],
        sans: ['"Inter"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '-0.005em' }],
        'base': ['1rem', { lineHeight: '1.7', letterSpacing: '-0.01em' }],
        'lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.7', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '1.4', letterSpacing: '-0.015em' }],
        '4xl': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.015em' }],
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '6xl': ['3.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        '7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '8xl': ['6rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-pulse": "scanPulse 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scanPulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
