import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#04060A",
        panel: "#0D1118",
        raised: "#141A23",
        line: "rgba(148, 163, 184, 0.14)",
        fg: "#E8EDF5",
        muted: "#8E98AA",
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
