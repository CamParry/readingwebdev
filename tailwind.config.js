/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "clr-background": "var(--clr-background)",
                "clr-foreground": "var(--clr-foreground)",
                "clr-foreground-hover": "var(--clr-foreground-hover)",
                "clr-foreground-active": "var(--clr-foreground-active)",
                "clr-text": "var(--clr-text)",
                "clr-text-inverted": "var(--clr-text-inverted)",
                "clr-border": "var(--clr-border)",
            },
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
        require("@tailwindcss/forms"),
    ],
};
