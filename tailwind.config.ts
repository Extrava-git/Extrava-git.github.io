import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#050608",
          subtle: "#08090d",
          muted: "#0f1118",
          ink: "#e8eaef",
          inkSoft: "#c5c9d4",
        },
        line: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.16)",
          onDark: "rgba(255,255,255,0.10)",
        },
        ink: {
          DEFAULT: "#e8eaef",
          soft: "#c5c9d4",
          muted: "#8b91a3",
          subtle: "#5a6175",
          faint: "#3a4050",
          950: "#050608",
          900: "#0a0b0f",
          800: "#111319",
          700: "#1a1d26",
          600: "#262b37",
          500: "#3a4050",
          400: "#5a6175",
          300: "#8b91a3",
          200: "#c5c9d4",
          100: "#e8eaef",
        },
        signal: {
          cyan: "#00d4ff",
          teal: "#14e0c5",
          coral: "#ff5a6a",
          magenta: "#ff3d8a",
          amber: "#ffb547",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      letterSpacing: {
        tighter: "-0.028em",
        tightish: "-0.015em",
      },
      maxWidth: {
        prose: "62ch",
        site: "1200px",
      },
      fontSize: {
        "display-2xl": [
          "clamp(3.25rem, 6vw, 5.5rem)",
          { lineHeight: "1.02", letterSpacing: "-0.035em" },
        ],
        "display-xl": [
          "clamp(2.5rem, 4.6vw, 4.25rem)",
          { lineHeight: "1.05", letterSpacing: "-0.03em" },
        ],
        "display-lg": [
          "clamp(2rem, 3.4vw, 3.25rem)",
          { lineHeight: "1.08", letterSpacing: "-0.025em" },
        ],
      },
      backgroundImage: {
        "gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
        "grad-signal":
          "linear-gradient(120deg, #14e0c5 0%, #00d4ff 45%, #ff3d8a 100%)",
        "grad-heat":
          "linear-gradient(135deg, #ff5a6a 0%, #ff3d8a 50%, #7a3dff 100%)",
        "grad-radial":
          "radial-gradient(circle at 30% 20%, rgba(20,224,197,0.18), transparent 55%), radial-gradient(circle at 75% 80%, rgba(255,61,138,0.18), transparent 55%)",
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        pulseRing: "pulseRing 2.6s cubic-bezier(0.16,1,0.3,1) infinite",
        floaty: "floaty 5s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
