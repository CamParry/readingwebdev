export const success = (data: any = null) => {
    return new Response(data ? JSON.stringify(data) : null, { status: 200 });
};

export const badRequest = (message: string) => {
    return new Response(
        JSON.stringify({
            message: message ?? "Bad request",
        }),
        { status: 400 }
    );
};

export const unauthorized = () => {
    return new Response(
        JSON.stringify({
            message: "Unauthorized",
        }),
        { status: 401 }
    );
};

export const forbidden = () => {
    return new Response(
        JSON.stringify({
            message: "Forbidden",
        }),
        { status: 403 }
    );
};

export const notFound = () => {
    return new Response(
        JSON.stringify({
            message: "Not found",
        }),
        { status: 404 }
    );
};
