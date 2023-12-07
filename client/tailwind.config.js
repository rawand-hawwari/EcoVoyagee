/** @type {import('tailwindcss').Config}           */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "Base-color": "#0369a1",
        "second-color": "#FFFFFF",
        // "Base-color": "#57837B",
        // "second-color": "#D6D2C4",
        "third-color": "#815B5B",
        "fourth-color": "#9E7676",
      },
      fontFamily: {
        "grape-nuts": ["Grape Nuts", "sans-serif"],
      },
    },
  },
  plugins: [],
};
