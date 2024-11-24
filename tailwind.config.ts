import resolveConfig from "tailwindcss/resolveConfig"

export default resolveConfig({
    darkMode: "class",
    content: [
      "./src/renderer/**/*.{html, tsx, ts}"
    ]
})