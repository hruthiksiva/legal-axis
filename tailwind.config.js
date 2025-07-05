// tailwind.config.js
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0e0e0e',
        surface: '#1a1a1a',
        accent: '#00ffcc',
        textPrimary: '#ffffff',
        textSecondary: '#aaaaaa',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 15px rgba(0, 255, 204, 0.4)',
      },
    },
  },
  plugins: [],
}


