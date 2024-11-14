import z from "zod"

const envSchema = z.object({
    NODE_ENV: z.union([z.literal("development"), z.literal("production"), z.literal("test")]).default("development"),
    DATABASE_URL: z.string().min(1)
})

export const env = envSchema.parse(process.env)

export const isDevelopment = env.NODE_ENV == "development"
export const isProduction = env.NODE_ENV == "production"
export const isTest = env.NODE_ENV == "test"

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envSchema> {}
    }   
}