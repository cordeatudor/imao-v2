/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' }
        },
        glow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 }
        }
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        gradient: 'gradient 3s ease-in-out infinite',
        bounce: 'bounce 2s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite'
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            h2: {
              color: '#111827',
            },
            h3: {
              color: '#111827',
            },
            strong: {
              color: '#111827',
            },
            a: {
              color: '#7C3AED',
              '&:hover': {
                color: '#6D28D9',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};