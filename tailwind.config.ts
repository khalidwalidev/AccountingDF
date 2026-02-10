import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfdf7",
          100: "#d2f8eb",
          200: "#a6efd8",
          300: "#73e0bf",
          400: "#3ecb9f",
          500: "#05996f",
          600: "#037f5d",
          700: "#03674d",
          800: "#06533e",
          900: "#064536"
        }
      }
    }
  },
  plugins: []
};

export default config;
