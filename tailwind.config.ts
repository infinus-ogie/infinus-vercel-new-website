import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-ibm-plex-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Unified Infinus Design System
        primary: {
          700: "hsl(var(--primary-700))",
          600: "hsl(var(--primary-600))",
          500: "hsl(var(--primary-500))",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          600: "hsl(var(--accent-600))",
          400: "hsl(var(--accent-400))",
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        surface: {
          0: "hsl(var(--surface-0))",
          1: "hsl(var(--surface-1))",
        },
        ink: {
          900: "hsl(var(--ink-900))",
        },
        // Legacy compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Enhanced slate color scale for better contrast
        slate: {
          900: "hsl(var(--slate-900))",
          800: "hsl(var(--slate-800))",
          700: "hsl(var(--slate-700))",
          600: "hsl(var(--slate-600))",
          500: "hsl(var(--slate-500))",
          400: "hsl(var(--slate-400))",
          300: "hsl(var(--slate-300))",
          200: "hsl(var(--slate-200))",
          100: "hsl(var(--slate-100))",
          50: "hsl(var(--slate-50))",
        },
      },
      boxShadow: {
        card: "0 1px 1px rgba(0,0,0,.06), 0 12px 24px -12px rgba(0,0,0,.18)",
        cardHover: "0 1px 1px rgba(0,0,0,.08), 0 18px 34px -14px rgba(0,0,0,.22)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      container: { 
        center: true, 
        padding: "1.5rem" 
      },
      maxWidth: { 
        "7xl": "80rem" 
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
