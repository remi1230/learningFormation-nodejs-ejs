// frontend/tailwind.config.js
const typography = require("@tailwindcss/typography");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    typography,
  ],
  daisyui: {
    attribute: "class",
    darkTheme: "dark",
    logs: true,
  },
};