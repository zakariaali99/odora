/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          sage: '#717E57',
          'sage-dark': '#566042',
          pale: '#EEF3E2',
          cream: '#F7F7F5',
          canvas: '#F7F7F5',
          surface: '#FFFFFF',
          'surface-subtle': '#EFEFEA',
          ink: '#181816',
          muted: '#52524B',
          olive: '#242B1D',
          dark: '#141612',
          amber: '#946128',
          'amber-light': '#FDF6ED',
        },
        odora: {
          sage: '#717E57',
          'sage-dark': '#566042',
          pale: '#EEF3E2',
          canvas: '#F7F7F5',
          cream: '#F7F7F5',
          surface: '#FFFFFF',
          'surface-subtle': '#EFEFEA',
          ink: '#181816',
          muted: '#52524B',
          olive: '#242B1D',
          dark: '#141612',
          amber: '#946128',
          'amber-light': '#FDF6ED',
        },
      },
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
      },
      boxShadow: {
        'soft-card': '0 1px 2px rgba(70, 79, 57, 0.04), 0 10px 30px rgba(70, 79, 57, 0.07)',
        'lifted': '0 14px 34px rgba(70, 79, 57, 0.12)',
        'btn-dark': '0 12px 26px rgba(28, 28, 26, 0.22)',
        'btn-sage': '0 10px 22px rgba(145, 156, 122, 0.35)',
      },
      borderRadius: {
        'card': '22px',
        'pill': '9999px',
      }
    },
  },
  plugins: [],
};
