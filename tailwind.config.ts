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
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      // No fill mode on purpose: a transform left on the card would anchor the share Toast's `fixed` to the card.
      keyframes: {
        // One entrance for both directions; the card sets --card-enter-from to +32px (from the right) or -32px.
        "card-in": {
          from: { opacity: "0", transform: "translateX(var(--card-enter-from))" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "card-fade": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "card-in": "card-in 220ms ease-out",
        "card-fade": "card-fade 150ms ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
