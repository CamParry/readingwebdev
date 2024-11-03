import { z } from "astro/zod";
import { db } from "../client";
import { count, eq, getTableColumns } from "drizzle-orm";
import { blogTagsTable, tagsTable } from "../schema";

export const TagSchema = z.object({
    slug: z.string(),
    name: z.string(),
});

export type TagDTO = z.infer<typeof TagSchema>;

export type Tag = TagDTO & {
    id: number;
};

export const tagService = {
    getMany: async () => {
        return (await db.query.tagsTable.findMany()) as Tag[];
    },
    getManyWithPostCount: async () => {
        return await db
            .select({
                id: tagsTable.id,
                slug: tagsTable.slug,
                name: tagsTable.name,
                postCount: count(blogTagsTable.tagId),
            })
            .from(tagsTable)
            .leftJoin(blogTagsTable, eq(tagsTable.id, blogTagsTable.tagId))
            .groupBy(tagsTable.id);
    },
    getOne: async (where: { id: number } | { slug: string }) => {
        return (await db.query.tagsTable.findFirst({
            where:
                "id" in where
                    ? eq(tagsTable.id, where.id)
                    : eq(tagsTable.slug, where.slug),
        })) as Tag | undefined;
    },
    create: async (data: TagDTO) => {
        // const valid = TagSchema.parse(data);
        // return await db
        //     .insert(TagTable)
        //     .values({
        //         id: generateId(),
        //         ...valid,
        //     })
        //     .returning();
    },
    update: async (id: number, data: TagDTO) => {
        const valid = TagSchema.parse(data);
        return await db
            .update(tagsTable)
            .set(valid)
            .where(eq(tagsTable.id, id))
            .returning();
    },
    delete: async (id: string) => {
        // return await db.delete(TagTable).where(eq(TagTable.id, id));
    },
};
