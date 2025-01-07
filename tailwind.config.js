/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#01959F",
          50: "#F7FEFF",
          100: "#4DB5BC",
        },

        warning: {
          DEFAULT: "#FA9810",
          50: "#FFFCF5",
          100: "#FEEABC",
        },
        black: {
          DEFAULT: "#1D1F20",
          100: "#E0E0E0",
          400: "#FAFAFA",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
