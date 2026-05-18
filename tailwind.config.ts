import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0A0A0B",
          raised: "#101012",
          surface: "#141417",
          elevated: "#1B1B20",
          border: "#26262C",
        },
        ink: {
          primary: "#F5F5F6",
          secondary: "#B7B7BD",
          muted: "#7A7A82",
        },
        accent: {
          DEFAULT: "#FF0000",
          hover: "#E60000",
          soft: "rgba(255,0,0,0.12)",
          ring: "rgba(255,0,0,0.45)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,0,0,0.25), 0 10px 40px -10px rgba(255,0,0,0.35)",
        soft: "0 8px 32px -12px rgba(0,0,0,0.6)",
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 32px -16px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at top, rgba(255,0,0,0.10), transparent 55%), linear-gradient(180deg, #0A0A0B 0%, #050505 100%)",
        "red-fade":
          "linear-gradient(135deg, rgba(255,0,0,0.18) 0%, rgba(255,0,0,0) 60%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
