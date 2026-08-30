/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#090d16",
        card: "#111622",
        card2: "#182030",
        line: "rgba(255, 255, 255, 0.08)",
        up: "#3DDC84",
        down: "#FF4D6D",
        slow: "#FFC93D",
        accent: "#3B82F6",
        accentHover: "#2563EB",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
