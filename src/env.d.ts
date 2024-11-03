/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
        user: { id: string; name: string; email: string; role: string } | null;
        guards: {
            loggedInOnly(): Promise<void>;
            adminOnly(): Promise<void>;
        };
    }
}
