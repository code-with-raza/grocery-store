/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {
    colors: { brand: { orange: "#FF6B00", green: "#1a7a3f", ink: "#1a1a1a" } },
    fontFamily: { sans: ["Nunito", "sans-serif"], display: ["Poppins", "sans-serif"] },
    borderRadius: { brand: "16px" },
  } },
  plugins: [],
};
