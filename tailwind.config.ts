import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "var(--color-primary-dark)",
          light: "var(--color-primary-light)",
        },
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        purple: "var(--color-purple)",
        orange: "var(--color-orange)",
        gray: {
          light: "var(--color-gray-light)",
          DEFAULT: "var(--color-gray)",
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-fira-code)', 'Fira Code', 'monospace'],
        orbitron: ['var(--font-orbitron)', 'Orbitron', 'sans-serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        'fira-code': ['var(--font-fira-code)', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      },
      animation: {
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
};
export default config;
