export class HttpError extends Error {
    code = 400;
    constructor(message: string) {
        super(message);
        this.name = "HttpError";
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string = "Bad Request") {
        super(message);
        this.code = 400;
        this.name = "BadRequestError";
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message: string = "Unauthorized") {
        super(message);
        this.code = 401;
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError extends HttpError {
    constructor(message: string = "Forbidden") {
        super(message);
        this.code = 403;
        this.name = "ForbiddenError";
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string = "Not Found") {
        super(message);
        this.code = 404;
        this.name = "NotFoundError";
    }
}
