/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "ibm-plex-serif": ['"IBM Plex Serif"', "serif"],
      },
      fontSize: {
        "26px": "26px", // Add this line to define custom 26px font size
      },
      backgroundImage: {
        "bank-gradient": "linear-gradient(90deg, #3b82f6, #10b981)",
        "gradient-mesh": "linear-gradient(to bottom right, #ffffff, #f3f4f6)",
      },
      spacing: {
        24: "6rem",
      },
      boxShadow: {
        profile: "0 4px 6px rgba(0, 0, 0, 0.1)",
        creditCard: "0px 4px 15px rgba(0, 0, 0, 0.1)",
      },
      flex: {
        center: "justify-center items-center",
      },
    },
  },
  plugins: [],
};
