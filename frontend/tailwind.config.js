/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['"Inter"', 'sans-serif'], // Use "Inter" as primary font and fallback to sans-serif
        playwrite: ['"Playwrite CA Guides"', 'cursive'], // Use "Playwrite CA Guides" as primary and fallback to cursive
      },
    },
  },
  plugins: [],
}

