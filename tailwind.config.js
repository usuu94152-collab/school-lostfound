/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#10253b',
          900: '#18344f',
          700: '#315675',
        },
        paper: {
          50: '#fffdf8',
          100: '#f8f2e8',
          200: '#efe4d4',
        },
        sky: {
          100: '#d9ebf7',
          200: '#c0dff5',
          500: '#5ca8d5',
        },
        mint: {
          100: '#d8eee7',
          500: '#3d9975',
          700: '#22624a',
        },
        coral: {
          100: '#fee4d9',
          500: '#d16d51',
          700: '#a14831',
        },
        gold: {
          100: '#f8ecbc',
          600: '#ab7e18',
        },
      },
      fontFamily: {
        sans: [
          'SUIT Variable',
          'Pretendard',
          'Noto Sans KR',
          'Apple SD Gothic Neo',
          'sans-serif',
        ],
        display: [
          'SUIT Variable',
          'Pretendard',
          'Noto Sans KR',
          'Apple SD Gothic Neo',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
