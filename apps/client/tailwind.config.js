export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#FF3B3B",
          orange: "#FF7A00",
          coal: "#0A0A0A"
        }
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 59, 59, 0.22)",
        card: "0 24px 80px rgba(0, 0, 0, 0.28)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      }
    }
  }
};
