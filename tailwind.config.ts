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
        pageBg: "#E7E8EA",
        ink: "#15171A",
        muted: "#31333A",
        brand: "#4C6FFF",
        chromeText: "#23252A",
        chromeBorder: "rgba(21,23,26,0.16)",
        ghostFar: "rgba(21,23,26,0.05)",
        ghostNear: "rgba(21,23,26,0.09)",
        ringTrack: "#CFD0D3",
        category: {
          science: { bg: "#DDD6FE", accent: "#8B5CF6" },
          nature: { bg: "#BBF7D0", accent: "#22C55E" },
          space: { bg: "#BFDBFE", accent: "#3B82F6" },
          history: { bg: "#FDE68A", accent: "#D97706" },
          food: { bg: "#FECACA", accent: "#EF4444" },
          culture: { bg: "#FBCFE8", accent: "#EC4899" },
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
