import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Warna tema dari variabel CSS (lihat globals.css). Terang secara default,
        // gelap di dalam elemen ber-class "theme-dark".
        ink: "rgb(var(--ink) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        raised: "rgb(var(--raised) / <alpha-value>)",
        line: "var(--line)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        tide: {
          1: "#38C8F8",
          2: "#1B5BFF",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', "system-ui", "sans-serif"],
      },
      maxWidth: {
        page: "72rem",
      },
      keyframes: {
        "order-in": {
          "0%, 8%": { opacity: "0", transform: "translateY(-12px) scale(0.98)" },
          "14%, 86%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "94%, 100%": { opacity: "0", transform: "translateY(0) scale(1)" },
        },
        ping: {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        "bar-grow": {
          from: { transform: "scaleY(0.15)" },
          to: { transform: "scaleY(1)" },
        },
        flow: {
          to: { strokeDashoffset: "-200" },
        },
        slide: {
          from: { left: "2rem" },
          to: { left: "calc(100% - 4.5rem)" },
        },
      },
      animation: {
        "order-in": "order-in 7s ease-out infinite",
        ping: "ping 1.6s ease-out infinite",
        "bar-grow": "bar-grow 1.1s cubic-bezier(.2,.8,.2,1) both",
        flow: "flow 3.2s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
