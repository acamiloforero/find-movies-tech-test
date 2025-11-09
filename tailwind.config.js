/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FFEB3B',
        'yellow-600': '#FDD835',
        'gray-900':'#212121',
        'gray-100':'#F5F5F5',
      },
    },
  },
  plugins: [],
}

