import { defineMiddleware, sequence } from "astro:middleware";
import { getSession } from "auth-astro/server";
import { ForbiddenError, HttpError, UnauthorizedError } from "./errors";

const errorMiddleware = defineMiddleware(async (context, next) => {
    try {
        return await next();
    } catch (error) {
        if (error instanceof HttpError) {
            return context.rewrite(`/${error.code}`);
        }
        console.error(error);
        return context.rewrite("/500");
    }
});

const authMiddleware = defineMiddleware(async (context, next) => {
    const session = await getSession(context.request);
    if (session?.user) {
        context.locals.user = session.user;
    } else {
        context.locals.user = null;
    }
    return next();
});

const guardsMiddleware = defineMiddleware(async (context, next) => {
    context.locals.guards = {
        async loggedInOnly() {
            if (!context.locals.user) {
                throw new UnauthorizedError();
            }
        },
        async adminOnly() {
            if (context.locals.user?.role !== "admin") {
                throw new ForbiddenError();
            }
        },
    };
    return next();
});

export const onRequest = sequence(
    errorMiddleware,
    authMiddleware,
    guardsMiddleware
);
