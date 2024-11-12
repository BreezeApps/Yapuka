import { defineConfig } from "drizzle-kit"

export default defineConfig({
    schema: "./src/main/database/schema.ts",
    out: "./migrations",
    dialect: "sqlite",
    driver: "expo"
})