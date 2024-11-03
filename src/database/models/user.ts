import { z } from "astro/zod";
import { eq } from "drizzle-orm";
import { db } from "../client";
import { userRoles, usersTable, type UserRole } from "../schema";

export const UserSchema = z.object({
    name: z.string(),
    email: z.string(),
    role: z.enum(userRoles),
});

export const UserRoleSchema = z.enum(userRoles);

export type UserDTO = z.infer<typeof UserSchema>;

export type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: Date | null;
};

export const userService = {
    getAll: async () => {
        return (await db.query.usersTable.findMany()) as User[];
    },
    getOne: async (id: string) => {
        return (await db.query.usersTable.findFirst({
            where: eq(usersTable.id, id),
        })) as User | undefined;
    },
    updateRole: async (id: string, role: UserRole) => {
        const res = await db
            .update(usersTable)
            .set({ role })
            .where(eq(usersTable.id, id))
            .returning();
        return await userService.getOne(res[0].id);
    },
};
