/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FBF9F6",
        foreground: "#3C3835",
        card: "#FFFFFF",
        "card-foreground": "#3C3835",
        primary: "#8B7355",
        "primary-foreground": "#FFFFFF",
        secondary: "#E8DDD0",
        muted: "#F5F0E8",
        accent: "#C4A57B",
        border: "#E8DDD0",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
