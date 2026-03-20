/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Premium Night
        night: {
          50: '#e2e8f0', // Texto Secundário
          100: '#94a3b8', // Texto Desativado
          800: '#1e293b', // Cards e Inputs
          900: '#0f172a', // Fundo Principal (Preto Slate)
          950: '#020617', // Fundo mais escuro (Navbar)
        },
        prosis: {
          blue: '#3b82f6', // Azul Elétrico para Destaques
          green: '#10b981', // Verde para Concluído
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Necessário para o Markdown ficar bonito no Dark Mode
  ],
}