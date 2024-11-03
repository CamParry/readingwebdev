import { dailyRandom } from "@/utils/shuffleWithSeed";
import { toSlug } from "@/utils/toSlug";
import { z } from "astro/zod";
import { eq } from "drizzle-orm";
import { db } from "../client";
import { blogsTable } from "../schema";
import type { Tag } from "./tag";

export const imageRatioOptions = ["square", "wide"] as const;

export const postCountOptions = [
    "10 +",
    "25 +",
    "50 +",
    "100 +",
    "250 +",
    "500 +",
    "1000 +",
] as const;

export const statusOptions = [
    "submitted",
    "published",
    "archived",
    "rejected",
] as const;

export const submitterRelationOptions = ["Author", "Reader"] as const;

export const PublicBlogSchema = z.object({
    author: z.string().min(3, "Must be at least 3 characters"),
    title: z.string().nullable(),
    url: z.string().url("Must be a valid URL"),
    image: z.string().url("Must be a valid URL"),
    description: z.string().min(10, "Must be at least 10 characters"),
    startYear: z.string().length(4, "Must be in the format YYYY"),
    postCount: z.enum(postCountOptions),
    tags: z.string(),
    submitterRelation: z.enum(submitterRelationOptions),
});

export const BlogSchema = z.object({
    status: z.enum(statusOptions),
    author: z.string().min(3, "Must be at least 3 characters"),
    slug: z.string().min(3, "Must be at least 3 characters"),
    title: z.string().nullable(),
    url: z.string().url("Must be a valid URL"),
    image: z.string().url("Must be a valid URL"),
    description: z.string(),
    startYear: z.string(),
    postCount: z.enum(postCountOptions),
});

export type PublicBlogDTO = z.infer<typeof PublicBlogSchema>;
export type BlogDTO = z.infer<typeof BlogSchema>;

export type Blog = BlogDTO & {
    id: number;
    status: "submitted" | "published" | "archived" | "rejected";
    imageRatio: "square" | "wide" | null;
    submittedBy: string;
    submittedAt: string;
    publishedAt: string;
    archivedAt: string;
    rejectedAt: string;
    tags: Tag[];
};

export const blogService = {
    getMany: async ({
        tag,
        sort,
        limit,
        offset,
        status = "published",
    }: {
        tag?: string;
        sort?: "newest" | "oldest" | "daily";
        limit?: number;
        offset?: number;
        status?: "submitted" | "published" | "archived" | "rejected";
    }) => {
        let blogIds: number[] = [];

        if (tag) {
            const tagWithBlogs = await db.query.tagsTable.findFirst({
                where: (t, { eq }) => eq(t.slug, tag),
                with: {
                    blogs: true,
                },
            });
            blogIds = tagWithBlogs?.blogs?.map((blog) => blog.blogId) ?? [];
        }

        const blogs = await db.query.blogsTable.findMany({
            limit,
            offset,
            orderBy: (t, { desc, asc, sql }) => [
                sort === "daily"
                    ? sql`(substr(id * ${dailyRandom()}, length(id) + 2))`
                    : sort === "newest"
                      ? desc(t.publishedAt)
                      : asc(t.publishedAt),
            ],
            where: (t, { and, eq, inArray }) =>
                and(
                    eq(t.status, status),
                    tag ? inArray(t.id, blogIds) : undefined
                ),
            with: {
                tags: {
                    with: {
                        tag: true,
                    },
                },
            },
        });

        const formattedBlogs = blogs.map((blog) => ({
            ...blog,
            tags: blog.tags.map((tag) => tag.tag),
        })) as Blog[];

        return formattedBlogs;
    },
    getOne: async (where: { id: number } | { slug: string }) => {
        const blog = await db.query.blogsTable.findFirst({
            where: (t, { eq }) =>
                "id" in where ? eq(t.id, where.id) : eq(t.slug, where.slug),
            with: {
                tags: {
                    with: {
                        tag: true,
                    },
                },
            },
        });
        return blog
            ? {
                  ...blog,
                  tags: blog.tags.map((tag) => tag.tag),
              }
            : undefined;
    },
    create: async (data: BlogDTO) => {
        return await db.insert(blogsTable).values({
            ...data,
        });
    },
    submit: async (data: PublicBlogDTO & { submittedBy: string }) => {
        return await db.insert(blogsTable).values({
            ...data,
            slug: toSlug(data.author),
            imageRatio: null,
            status: "submitted",
            submittedAt: new Date().toISOString(),
        });
    },
    update: async (id: number, data: BlogDTO) => {
        const res = await db
            .update(blogsTable)
            .set(data)
            .where(eq(blogsTable.id, id))
            .returning();
        return await blogService.getOne({ id: res[0].id });
    },
    delete: async (id: number) => {
        return await db.delete(blogsTable).where(eq(blogsTable.id, id));
    },
};
