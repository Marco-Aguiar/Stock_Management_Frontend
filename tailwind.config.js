// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Certifique-se de que o dark mode está configurado se você usa
  theme: {
    extend: {
      keyframes: {
        // Keyframes para animate-fade-in
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Keyframes para animate-scale-in-smooth
        scaleInSmooth: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards', // 'forwards' mantém o estado final da animação
        'scale-in-smooth': 'scaleInSmooth 0.3s ease-out forwards', // Ajuste a duração e timing conforme necessário
      },
    },
  },
  plugins: [],
}