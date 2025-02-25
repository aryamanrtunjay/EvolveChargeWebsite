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
          light: "#e0e0e0"  // consistent light gray
        },
        primary: "#359ba5",   // Blue-Green Mix: (53,155,165)
        secondary: "#57e0b2",  // Aqua/Teal Shade: (87,224,178)
        aqua: {
          50: "#94ffc2",   // (148,255,194)
          100: "#57e0b2",  // (87,224,178)
          200: "#89ffc3",  // (137,255,195)
          300: "#8fffc0",  // (143,255,192)
          400: "#8dffb8",  // (141,255,184)
          500: "#7fffb1",  // (127,255,177)
          600: "#80ffb1",  // (128,255,177)
          700: "#7cffb3",  // (124,255,179)
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
