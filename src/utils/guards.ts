import { ForbiddenError } from "@/errors";
import type { AstroGlobal } from "astro";
import { getSession } from "auth-astro/server";

export const guardAdminOnly = async (astro: AstroGlobal) => {
    const session = await getSession(astro.request);
    if (!session || session.user.role !== "admin") {
        throw new ForbiddenError();
    }
};
