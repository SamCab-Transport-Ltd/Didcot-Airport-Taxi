import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
        status: {
          pending: "#F4B400",
          confirmed: "#3D8BFD",
          assigned: "#A56CFF",
          in_progress: "#22D3EE",
          completed: "#22C55E",
          cancelled: "#9CA3AF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,0,0,0.18), 0 0 32px -8px rgba(255,0,0,0.35)",
        soft: "0 4px 14px -4px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
