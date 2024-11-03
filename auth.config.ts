import GitHub from "@auth/core/providers/github";
import { defineConfig } from "auth-astro";
import {
    sessionsTable,
    usersTable,
    accountsTable,
} from "./src/database/schema";
import { db } from "./src/database/client";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { DefaultSession } from "@auth/core/types";

declare module "@auth/core/types" {
    interface User {
        role: string;
    }
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        } & DefaultSession["user"];
    }
}

declare module "@auth/core/adapters" {
    interface AdapterUser {
        id: string;
        name: string;
        email: string;
        role: string;
    }
    interface AdapterSession {
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        } & DefaultSession["user"];
    }
}

export default defineConfig({
    providers: [
        GitHub({
            clientId: import.meta.env.GITHUB_CLIENT_ID,
            clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
        }),
    ],
    adapter: DrizzleAdapter(db, {
        usersTable: usersTable,
        accountsTable: accountsTable,
        sessionsTable: sessionsTable,
    }),
    callbacks: {
        session({ session, user }) {
            session.user.role = user.role;
            return session;
        },
    },
});
