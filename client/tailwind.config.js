/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'regularBlack':'#000000',
      'regularWhite':'#FFFFFF',
      'regularRed':'#C70039',
      'regularBlue':'#0079FF',

      'encoredBlack':'#161616',
      'encoredGold':'#EACB7C',
      'encoredGrey':'#454545'

    },
    fontFamily:{
      'montserrat':['Montserrat'],
      'robot':['Roboto']
    },
    extend: {
      animation: {
        bounce200: 'bounce 1s infinite 200ms',
        bounce400: 'bounce 1s infinite 400ms',
      },
    },
  },
  plugins: [],
}

