/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fdap: {
          primary: '#2563eb',
          'primary-dark': '#1d4ed8',
          accent: '#10b981',
          'accent-dark': '#059669',
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          text: '#1e293b',
          'text-light': '#64748b',
        }
      },
      borderRadius: {
        'fdap': '16px',
        'fdap-sm': '10px',
      },
      boxShadow: {
        'fdap': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        'fdap-md': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'fdap-lg': '0 10px 25px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}