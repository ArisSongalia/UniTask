/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        merriweather: ['Merriweather', 'serif'],
      },
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        surface: {
          base: '#ffffff',
          muted: '#f8fafc',
        },
        text: {
          primary: '#0f172a',
          muted: '#64748b',
        },
      },
      spacing: {
        card: '1rem',
        cardCompact: '0.625rem',
        section: '1.5rem',
      },
      borderRadius: {
        card: '0.75rem',
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
    }
  },
  plugins: [],
}






