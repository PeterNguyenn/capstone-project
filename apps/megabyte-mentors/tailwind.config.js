/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],

    theme: {
        extend: {
            colors: {
              primary: "#041F4A",
              secondary: {
                DEFAULT: "#00B1CD",
                100: "#00B1CD",
                200: "#75BEEB",
              },
              black: {
                DEFAULT: "#000",
                100: "#1E1E2D",
                200: "#232533",
              },
              gray: {
                100: "#CDCDE0",
              },
            },
            fontFamily: {
              pthin: ["Poppins-Thin", "sans-serif"],
              pextralight: ["Poppins-ExtraLight", "sans-serif"],
              plight: ["Poppins-Light", "sans-serif"],
              pregular: ["Poppins-Regular", "sans-serif"],
              pmedium: ["Poppins-Medium", "sans-serif"],
              psemibold: ["Poppins-SemiBold", "sans-serif"],
              pbold: ["Poppins-Bold", "sans-serif"],
              pextrabold: ["Poppins-ExtraBold", "sans-serif"],
              pblack: ["Poppins-Black", "sans-serif"],
            },
        },
    },
    plugins: []
};