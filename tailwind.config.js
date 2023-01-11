/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
      boxShadow: {
        "clay-card":
          "inset -10px -10px 20px hsl(220deg 60% 16% / 70%), inset 0 16px 32px hsl(220deg 60% 16%)",
        "clay-btn":
          "16px 16px 32px 0 hsl(201deg 38% 32% / 70%), inset -16px -16px 32px 0 hsl(201deg 38% 32%), inset 8px 8px 16px 0 hsl(201deg 38% 32% / 70%)",
      },
      dropShadow: {
        clay: "15px 15px 15px hsl(220deg 60% 16%)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
