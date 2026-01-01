/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-primary': '#000000',
        'dark-secondary': '#0A0A0A',
        'dark-tertiary': '#0F0F0F',
        'dark-card': '#151515',
        'dark-border': '#1A1A1A',
        'crimson': '#DC143C',
        'electric-blue': '#0080FF',
        'fiery-orange': '#FF6B35',
        'deep-purple': '#9D4EDD',
        'hot-magenta': '#FF006E',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B0B0B0',
        'text-muted': '#808080'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'sans-serif']
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(220, 20, 60, 0.5)',
        'glow-blue': '0 0 20px rgba(0, 128, 255, 0.5)',
        'glow-orange': '0 0 20px rgba(255, 107, 53, 0.5)',
        'glow-purple': '0 0 20px rgba(157, 78, 221, 0.5)',
        'glow-magenta': '0 0 20px rgba(255, 0, 110, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
