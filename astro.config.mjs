import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

import auth from "auth-astro";

// https://astro.build/config
export default defineConfig({
    site: "https://readingweb.dev",
    integrations: [
        tailwind({
            config: {
                applyBaseStyles: false,
            },
        }),
        auth(),
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
