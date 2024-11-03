import { relations, sql } from "drizzle-orm";
import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "@auth/core/adapters";

export const userRoles = ["basic", "admin"] as const;

export type UserRole = (typeof userRoles)[number];

export const usersTable = sqliteTable("users", {
    id: text()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text(),
    email: text().unique(),
    emailVerified: int({ mode: "timestamp_ms" }),
    image: text(),
    role: text().$type<UserRole>().notNull().default("basic"),
    createdAt: int({ mode: "timestamp_ms" }).default(sql`(CURRENT_TIMESTAMP)`),
});

export const usersRelations = relations(usersTable, ({ one }) => ({
    session: one(sessionsTable, {
        fields: [usersTable.id],
        references: [sessionsTable.userId],
    }),
    submittedBlogs: one(blogsTable, {
        fields: [usersTable.id],
        references: [blogsTable.submittedBy],
    }),
}));

export const accountsTable = sqliteTable(
    "accounts",
    {
        userId: text()
            .notNull()
            .references(() => usersTable.id, { onDelete: "cascade" }),
        type: text().$type<AdapterAccountType>().notNull(),
        provider: text().notNull(),
        providerAccountId: text().notNull(),
        refresh_token: text(),
        access_token: text(),
        expires_at: int(),
        token_type: text(),
        scope: text(),
        id_token: text(),
        session_state: text(),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
);

export const sessionsTable = sqliteTable("sessions", {
    sessionToken: text().primaryKey(),
    userId: text()
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    expires: int({ mode: "timestamp_ms" }).notNull(),
});

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [sessionsTable.userId],
        references: [usersTable.id],
    }),
}));

export const blogsTable = sqliteTable("blogs", {
    id: int().primaryKey({ autoIncrement: true }),
    status: text().notNull().default("submitted"),
    slug: text().notNull().unique(),
    url: text().notNull(),
    author: text().notNull(),
    title: text(),
    image: text(),
    imageRatio: text(),
    description: text(),
    startYear: text(),
    postCount: text(),
    submittedBy: text().references(() => usersTable.id, {
        onDelete: "set null",
    }),
    submitterRelation: text(),
    submittedAt: text().default(sql`(CURRENT_TIMESTAMP)`),
    publishedAt: text(),
    archivedAt: text(),
    rejectedAt: text(),
});

export const blogsRelations = relations(blogsTable, ({ many }) => ({
    tags: many(blogTagsTable),
}));

export const tagsTable = sqliteTable("tags", {
    id: int().primaryKey({ autoIncrement: true }),
    slug: text().notNull().unique(),
    name: text().notNull(),
});

export const tagsRelations = relations(tagsTable, ({ many }) => ({
    blogs: many(blogTagsTable),
}));

export const blogTagsTable = sqliteTable(
    "blog_tag",
    {
        blogId: int()
            .notNull()
            .references(() => blogsTable.id),
        tagId: int()
            .notNull()
            .references(() => tagsTable.id),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.blogId, t.tagId] }),
    })
);

export const blogTagsRelations = relations(blogTagsTable, ({ one }) => ({
    blog: one(blogsTable, {
        fields: [blogTagsTable.blogId],
        references: [blogsTable.id],
    }),
    tag: one(tagsTable, {
        fields: [blogTagsTable.tagId],
        references: [tagsTable.id],
    }),
}));
