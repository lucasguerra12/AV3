/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#10131a",
        surface: {
          container: "#1d2026",
          low: "#191c22", // Fundo da Sidebar
          high: "#272a31",
          highest: "#32353c", // Cor do hover
        },
        primary: {
          DEFAULT: "#b7c7eb", // Azul principal dos textos e barra ativa
          container: "#1b2b48", // Fundo azul escuro do item ativo
        },
        on: {
          background: "#e1e2eb", // Texto branco base
          surface: "#e1e2eb", // Texto principal
          surfaceVariant: "#c5c6ce", // Texto secundário (cinza)
        },
        outline: {
          variant: "#44474d", // Linhas e bordas
        }
      },
      fontFamily: {
        headline: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}