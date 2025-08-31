/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ищет классы Tailwind в этих файлах
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Roboto Flex', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
        'roboto': ['Roboto Flex', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
        'cormorant': ['Cormorant SC', 'Times New Roman', 'serif'],
        'title': ['Cormorant SC', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
