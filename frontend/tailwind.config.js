/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      colors: {
        brand: {
          light: '#FFD3C6', // Light Calamine
          DEFAULT: '#FF7A59', // Calamine Orange
          dark: '#E05A3A',
        },
        secondary: '#F5F5F5', // Soft Cream
        accent: '#2D3E50', // Slate Gray
      }
    },
  },
  plugins: [],
}
