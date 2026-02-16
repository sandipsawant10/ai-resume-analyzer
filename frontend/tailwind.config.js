/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "app-bg": "#0f172a",
        "app-card": "#111827",
        "app-border": "#334155",
      },
      boxShadow: {
        soft: "0 20px 40px -20px rgba(15, 23, 42, 0.8)",
      },
      borderRadius: {
        xl: "0.9rem",
      },
    },
  },
  plugins: [],
};
