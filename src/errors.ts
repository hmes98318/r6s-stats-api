/** Error categories exposed by version 2. */
export type ErrorCode =
    | 'INVALID_ARGUMENT'
    | 'PLAYER_NOT_FOUND'
    | 'ACCESS_DENIED'
    | 'RATE_LIMITED'
    | 'UPSTREAM_ERROR'
    | 'PARSE_ERROR'
    | 'TIMEOUT'
    | 'RESPONSE_TOO_LARGE'
    | 'BROWSER_UNAVAILABLE'
    | 'CLIENT_CLOSED';

/** Additional context that never includes an upstream response body. */
export interface ErrorDetails {
    status?: number;
    retryAfterMs?: number;
    cause?: unknown;
}

/** A predictable failure from argument validation, transport or cleaning. */
export class R6StatsError extends Error {
    readonly code: ErrorCode;
    readonly status: number | null;
    readonly retryAfterMs: number | null;

    constructor(code: ErrorCode, message: string, details: ErrorDetails = {}) {
        super(message, {cause: details.cause});
        this.name = 'R6StatsError';
        this.code = code;
        this.status = details.status ?? null;
        this.retryAfterMs = details.retryAfterMs ?? null;
    }
}
