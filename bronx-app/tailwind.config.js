/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zenith: {
          black: "#050505",
          orange: "#F97316",
          neutral: {
            400: "#A3A3A3",
            800: "#262626",
            900: "#171717",
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'zenith-bokeh': "radial-gradient(circle at center, var(--tw-gradient-stops))",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
