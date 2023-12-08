/** @type {import('tailwindcss').Config}           */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // "Base-color": "#0369a1",
        // "second-color": "#FFFFFF",
        "Base-color": "#395144",
        "second-color": "#F0EBCE",
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
