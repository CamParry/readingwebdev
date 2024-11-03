import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { createClient } from "@libsql/client";

const client = createClient({
    url: import.meta.env.TURSO_DB_URL!,
    authToken: import.meta.env.TURSO_DB_TOKEN!,
});

export const db = drizzle(client, {
    schema,
});
