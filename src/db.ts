import { getCollection, type CollectionEntry } from "astro:content";
import { shuffleWithSeed } from "./utils/shuffleWithSeed";
import { startOfDay } from "./utils/startOfDay";
import { title, url } from "valibot";
import { tags } from "./content/tags";
import { calculateYearsSince } from "./utils/calculateYearsSince";

type Blog = CollectionEntry<"blogs">;

export const getBlogs = async ({
    sort = "newest",
    tag,
    limit,
}: {
    sort?: "newest" | "oldest" | "daily";
    tag?: string;
    limit?: number;
}) => {
    let blogs = await getCollection("blogs", ({ data }) =>
        tag ? data.tags?.includes(tag) : true
    );

    if (sort === "daily") {
        blogs = await sortBlogsByDaily(blogs);
    } else if (sort === "oldest") {
        blogs = await sortBlogsByOldest(blogs);
    } else {
        blogs = await sortBlogsByLatest(blogs);
    }

    if (limit) {
        blogs = blogs.slice(0, limit);
    }

    return blogs;
};

export const getBlog = (blog: CollectionEntry<"blogs">) => {
    const years = blog.data.firstPostDate
        ? calculateYearsSince(new Date(blog.data.firstPostDate))
        : null;

    const bullets = [];

    if (years) {
        bullets.push(
            `First posted ${years} ${years > 1 ? "years" : "year"} ago`
        );
    }

    if (blog.data.postCount) {
        bullets.push(`${blog.data.postCount} posts`);
    }

    return {
        slug: blog.slug,
        title: blog.data.title,
        author: blog.data.author,
        url: blog.data.url,
        image: blog.data.image,
        imageRatio: blog.data.imageRatio,
        description: blog.body,
        date: blog.data.date,
        tags: blog.data.tags?.map((tag) => tags[tag as keyof typeof tags]),
        bullets,
    };
};

export const sortBlogsByDaily = async (blogs: Blog[]) => {
    return shuffleWithSeed(blogs, startOfDay(new Date()));
};

export const sortBlogsByLatest = async (blogs: Blog[]) => {
    return blogs.sort(
        (a, b) =>
            new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()
    );
};

export const sortBlogsByOldest = async (blogs: Blog[]) => {
    return blogs.sort(
        (a, b) =>
            new Date(a.data.date).valueOf() - new Date(b.data.date).valueOf()
    );
};
