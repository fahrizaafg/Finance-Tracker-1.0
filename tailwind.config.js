/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // Blue 500 (Lebih terang untuk dark mode)
          dark: '#2563eb',    // Blue 600
        },
        surface: {
          light: '#1e293b',   // Slate 800 (Card BG)
          dark: '#0f172a',    // Slate 900
        },
        background: {
          light: '#0f172a',   // Slate 900 (Main BG)
          dark: '#020617',    // Slate 950
        },
        emerald: {
          custom: '#34d399', // Emerald 400 (Lebih terang)
        },
        rose: {
          custom: '#fb7185', // Rose 400 (Lebih terang)
        },
        slate: {
            850: '#172033', // Custom dark
        }
      }
    },
  },
  plugins: [],
}
