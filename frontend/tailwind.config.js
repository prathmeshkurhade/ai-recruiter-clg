/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primeBlue: "#1a56db",
        lightBlue: "#ebf4ff",
        darkText: "#1e293b",
      },
    },
  },
  plugins: [],
};
