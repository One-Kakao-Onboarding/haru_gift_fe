// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kakao-yellow': '#FEE500',
        'kakao-brown': '#3A1D1D',
        'kakao-bg': '#bacee0', // 채팅방 하늘색 배경
      },
      fontFamily: {
        'kakao': ['KakaoBigSans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}