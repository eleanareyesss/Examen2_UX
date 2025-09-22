/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Escanea tus archivos de React
  ],
  theme: {
    extend: {
      colors: {
        // Colores personalizados
        brand: {
          DEFAULT: "#1e40af", // Azul oscuro
          light: "#3b82f6",   // Azul claro
        },
      },
      fontFamily: {
        // Tipografías personalizadas
        sans: ['Inter', 'sans-serif'],
        title: ['"Segoe UI"', 'sans-serif'],
      },
      spacing: {
        // Espaciados personalizados
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
  plugins: [
    // Aquí puedes agregar plugins como forms, typography, etc.
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};