import { getCollection, type CollectionEntry } from "astro:content";
import { shuffleWithSeed } from "./utils/shuffleWithSeed";
import { startOfDay } from "./utils/startOfDay";

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
