/**
 * Custom error classes for better error handling
 */

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public code?: string
    ) {
        super(message);
        this.name = "AppError";
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string, public fieldErrors?: Record<string, string>) {
        super(message, 400, "VALIDATION_ERROR");
        this.name = "ValidationError";
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = "Authentication required") {
        super(message, 401, "AUTHENTICATION_ERROR");
        this.name = "AuthenticationError";
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = "Insufficient permissions") {
        super(message, 403, "AUTHORIZATION_ERROR");
        this.name = "AuthorizationError";
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} not found`, 404, "NOT_FOUND");
        this.name = "NotFoundError";
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409, "CONFLICT");
        this.name = "ConflictError";
    }
}

/**
 * Format error for client response
 */
export function formatError(error: unknown) {
    if (error instanceof AppError) {
        return {
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
            ...(error instanceof ValidationError && { fieldErrors: error.fieldErrors }),
        };
    }

    if (error instanceof Error) {
        return {
            message: error.message,
            code: "INTERNAL_ERROR",
            statusCode: 500,
        };
    }

    return {
        message: "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
        statusCode: 500,
    };
}
