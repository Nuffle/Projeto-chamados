/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        coverImg: 'url(src/assets/img/cover.png)'
      }
    },
  },
  plugins: [],
}