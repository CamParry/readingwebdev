import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
    integrations: [
        tailwind({
            config: {
                applyBaseStyles: false,
            },
        }),
    ],
    output: "server",
    server: {
        port: import.meta.env.PORT || 4321,
        host: import.meta.env.HOST || "0.0.0.0",
    },
    adapter: node({
        mode: "standalone",
    }),
});
