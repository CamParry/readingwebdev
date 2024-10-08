import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
    site: "https://readingweb.dev",
    integrations: [
        tailwind({
            config: {
                applyBaseStyles: false,
            },
        }),
    ],
    output: "server",
    server: {
        port: Number(process.env.PORT) || 4321,
        host: process.env.HOST || "0.0.0.0",
    },
    adapter: node({
        mode: "standalone",
    }),
});
