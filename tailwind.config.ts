import resolveConfig from "tailwindcss/resolveConfig"

export default resolveConfig({
    darkMode: "class",
    content: [
      "./window/**/*.{html,js}"
    ]
})