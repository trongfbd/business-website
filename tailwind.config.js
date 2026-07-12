/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#C8102E',   // Đỏ PCCC chủ đạo (đỏ bình chữa cháy)
          secondary: '#E11D2E', // Đỏ sáng hơn dùng cho hover/gradient
          accent: '#F5A623',    // Vàng cảnh báo, dùng cho CTA nổi bật
          dark: '#1A1414',      // Nền tối ngả nâu-đen, tương phản tốt với đỏ
          light: '#FFF7F5',     // Nền sáng ngả ấm
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-up': 'fadeUp 0.5s ease-out both',
        'siren': 'siren 2.5s ease-in-out infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        siren: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(200,16,46,0.45)' },
          '50%': { boxShadow: '0 0 0 12px rgba(200,16,46,0)' },
        }
      }
    },
  },
  plugins: [],
}
