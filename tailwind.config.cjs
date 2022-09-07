/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "palette": {
          100: "#000000",
          200: "#5c5edc",
          300: "#634acd",
          400: "#6a36be",
          500: "#7123af",
        }
      },
    },
  },
  plugins: [],
};
