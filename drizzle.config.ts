import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: "./src/database/schema.ts",
    dialect: "turso",
    dbCredentials: {
        url: process.env.TURSO_DB_URL!,
        authToken: process.env.TURSO_DB_TOKEN!,
    },
});