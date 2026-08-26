/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        background: '#030303', // Deepest obsidian
        surface: '#0b0c10', // Slightly lighter glass
        surfaceHover: '#12141a',
        border: 'rgba(255, 255, 255, 0.06)',
        primary: '#10b981', // Glowing Emerald
        secondary: '#8b5cf6', // Iridescent Amethyst
        accent: '#f43f5e', // Cyber rose for critical alerts
        gray: {
          50: '#f8f9fa',
          100: '#eef0f3',
          200: '#d5d9e0',
          300: '#b2b8c5',
          400: '#8c95a6',
          500: '#6c7689',
          600: '#535c6e',
          700: '#414859',
          800: '#14161c', // Replaces gray-800 heavily used in panels
          900: '#0a0b0e', // Replaces gray-900 heavily used in backgrounds
        },
        cyan: {
          300: '#34d399', // Emerald 400
          400: '#10b981', // Emerald 500
          500: '#059669', // Emerald 600
          600: '#047857', // Emerald 700
        },
        blue: {
          400: '#a78bfa', // Violet 400
          500: '#8b5cf6', // Violet 500
          600: '#7c3aed', // Violet 600
        },
        purple: {
          400: '#f472b6', // Pink 400
          500: '#ec4899', // Pink 500
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-primary': '0 0 15px rgba(16, 185, 129, 0.3)',
        'glow-secondary': '0 0 15px rgba(139, 92, 246, 0.3)',
      },
      backdropBlur: {
        'glass': '12px',
      }
    },
  },
  plugins: [],
}
