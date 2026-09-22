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
          sage: '#919C7A',
          'sage-dark': '#6F795A',
          pale: '#E1F2BD',
          cream: '#F4F0EC',
          canvas: '#F4F0EC',
          surface: '#FBFAF7',
          'surface-subtle': '#ECE6E0',
          ink: '#2B2B26',
          muted: '#747468',
          olive: '#464F39',
          dark: '#1C1C1A',
          amber: '#76664E',
          'amber-light': '#F1E9DF',
        },
        odora: {
          sage: '#919C7A',
          'sage-dark': '#6F795A',
          pale: '#E1F2BD',
          canvas: '#F4F0EC',
          cream: '#F4F0EC',
          surface: '#FBFAF7',
          'surface-subtle': '#ECE6E0',
          ink: '#2B2B26',
          muted: '#747468',
          olive: '#464F39',
          dark: '#1C1C1A',
          amber: '#76664E',
          'amber-light': '#F1E9DF',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        arabic: ['Tajawal', 'Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
      },
      boxShadow: {
        'soft-card': '0 2px 3px rgba(43, 43, 38, 0.03), 0 18px 48px rgba(70, 79, 57, 0.08)',
        'lifted': '0 18px 50px rgba(70, 79, 57, 0.14)',
        'btn-dark': '0 12px 28px rgba(28, 28, 26, 0.18)',
        'btn-sage': '0 12px 30px rgba(70, 79, 57, 0.18)',
      },
      borderRadius: {
        'card': '22px',
        'pill': '9999px',
      }
    },
  },
  plugins: [],
};
