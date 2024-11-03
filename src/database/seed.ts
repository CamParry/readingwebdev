import { tags as _tags } from "../content/tags";
import { blogsTable, blogTagsTable, tagsTable } from "./schema";
import { drizzle } from "drizzle-orm/connect";
import * as dotenv from "dotenv";
import { blogs as _blogs } from "./seed/blogs";
dotenv.config();

async function main() {
    console.log("Seeding started");

    const db = await drizzle("turso", {
        connection: {
            url: process.env.TURSO_DB_URL!,
            authToken: process.env.TURSO_DB_TOKEN!,
        },
    });

    const blogs = await db
        .insert(blogsTable)
        .values(
            _blogs.map((blog) => ({
                slug: blog.slug,
                title: blog.title,
                author: blog.author,
                url: blog.url,
                image: blog.image,
                description: blog.description,
                startYear: blog.startYear,
                postCount: blog.postCount,
            }))
        )
        .returning();

    const tags = await db
        .insert(tagsTable)
        .values(
            Object.entries(_tags).map(([slug, name]) => ({
                slug,
                name,
            }))
        )
        .returning();

    const blogTags: { blogId: number; tagId: number }[] = [];

    for (const blog of _blogs) {
        const blogId = blogs.find((b) => b.slug === blog.slug)?.id!;
        for (const tag of blog.tags) {
            const tagId = tags.find((t) => t.slug === tag)?.id!;
            blogTags.push({ blogId, tagId });
        }
    }

    await db.insert(blogTagsTable).values(blogTags);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        console.log("Seeding finished");
        process.exit(0);
    });
