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
          pale: '#E1F2BD',
          cream: '#F4F0EC',
          surface: '#FFFFFF',
          'surface-subtle': '#FBFAF7',
          ink: '#2B2B26',
          muted: '#8A8A7E',
          olive: '#464F39',
          dark: '#1C1C1A',
        },
        odora: {
          sage: '#919C7A',
          pale: '#E1F2BD',
          canvas: '#F4F0EC',
          cream: '#F4F0EC',
          surface: '#FFFFFF',
          'surface-subtle': '#FBFAF7',
          ink: '#2B2B26',
          muted: '#8A8A7E',
          olive: '#464F39',
          dark: '#1C1C1A',
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
