/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg, #0B0E14)",
        card: "var(--card, #131722)",
        card2: "var(--card2, #1A1F2C)",
        line: "var(--line, #242A38)",
        up: "#3DDC84",
        down: "#FF4D6D",
        slow: "#FFC93D",
        accent: "#5B8CFF",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
