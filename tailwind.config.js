/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2ff',
          100: '#dbe4ff',
          200: '#bccfff',
          300: '#8fabff',
          400: '#5b80fa',
          500: '#3a5ef0',
          600: '#2540d6',
          700: '#1e33ad',
          800: '#1a2a85',
          900: '#0f1b56',
          950: '#0a1140',
        },
        saffron: {
          50: '#fff8ed',
          100: '#ffefd4',
          200: '#ffdba8',
          300: '#ffc06d',
          400: '#ff9d32',
          500: '#f97f0b',
          600: '#ea6403',
          700: '#c24a04',
          800: '#9a3a0a',
          900: '#7c3110',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,27,86,0.04), 0 8px 24px rgba(15,27,86,0.06)',
        soft: '0 1px 2px rgba(15,27,86,0.05), 0 12px 32px rgba(15,27,86,0.08)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'scale-in': { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
        'slide-up': { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
