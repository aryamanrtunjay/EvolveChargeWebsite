module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          white: "#ffffff",
          light: "#f7f7f7"
        },
        primary: "#b2dfdb",   // Light blue-green
        secondary: "#80deea"  // Aqua
      },
    },
  },
  plugins: [],
};
