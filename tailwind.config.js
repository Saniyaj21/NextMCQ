/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 1s forwards',
        popIn: 'popIn 1.2s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-in forwards',
        'reward-float': 'reward-float 2s ease-out forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        popIn: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        drawCheck: {
          '0%': { strokeDashoffset: '25' },
          '100%': { strokeDashoffset: '0' }
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' }
        },
        slideUp: {
          to: { transform: 'translateY(0)', opacity: '1' }
        },
        gentleGlow: {
          '0%, 100%': { textShadow: '0 0 0 rgba(0, 123, 255, 0)' },
          '50%': { textShadow: '0 0 10px rgba(0, 198, 255, 0.4)' }
        },
        progressBar: {
          '0%': { width: '0%' },
          '50%': { width: '100%' },
          '100%': { width: '0%' }
        },
        'reward-float': {
          '0%': { transform: 'translate(-50%, 0)', opacity: '0' },
          '10%': { transform: 'translate(-50%, -10px)', opacity: '1' },
          '90%': { transform: 'translate(-50%, -50px)', opacity: '1' },
          '100%': { transform: 'translate(-50%, -60px)', opacity: '0' }
        }
      }
    },
  },
  plugins: [],
}