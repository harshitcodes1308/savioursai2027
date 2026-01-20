import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#8B5CF6", // Futuristic Purple (Violet 500)
        "primary-glow": "#A78BFA", // Lighter lavender for glows
        background: "#030303", // Deep Void Black
        card: {
          dark: "#0E0E10", // Soft Graphite
          light: "#E5E7EB", // Light gray cards
          beige: "#D1D5DB", // Beige/tan cards (legacy)
        },
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
