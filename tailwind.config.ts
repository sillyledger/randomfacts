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
    },
  },
  plugins: [],
};
export default config;
