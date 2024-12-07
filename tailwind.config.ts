import resolveConfig from "tailwindcss/resolveConfig"

export default resolveConfig({
    darkMode: "class",
    content: [
      "./src/renderer/src/index.html",
      "./src/renderer/src/**/*.{tsx, ts}"
    ]
})