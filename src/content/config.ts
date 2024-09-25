import { z, defineCollection } from "astro:content";

const tagsCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
    }),
});

const blogsCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        author: z.string(),
        authorRole: z.string().optional(),
        url: z.string(),
        image: z.string().optional(),
        imageRatio: z.enum(["landscape", "square"]).default("landscape"),
        tags: z.string().array(),
        postCount: z.string().optional(),
        firstPostDate: z.string().optional(),
        date: z.string(),
    }),
});

export const collections = {
    tags: tagsCollection,
    blogs: blogsCollection,
};
