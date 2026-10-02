import {setTimeout as delay} from 'node:timers/promises';
import {fetch} from 'undici';
import type {Dispatcher} from 'undici';
import {createBrowserRenderer} from './browser.ts';
import type {
    BrowserOptions,
    TrackerRenderer,
    TrackerResource,
    TrackerResponse,
} from './browser.ts';
import {R6StatsError} from './errors.ts';
import {unwrap} from './normalize.ts';
import {validateInteger} from './validation.ts';

/** HTTP transport options with headless browser handling enabled by default. */
export interface ClientOptions {
    timeoutMs?: number;
    cacheTtlMs?: number;
    minRequestIntervalMs?: number;
    retries?: number;
    dispatcher?: Dispatcher;
    /** Customize the default headless browser, or disable it with false. */
    browser?: BrowserOptions | false;
    /** Replace the default renderer; cannot accompany browser settings. */
    renderer?: TrackerRenderer;
}

/** Cached public data and the time it was actually retrieved. */
export interface RetrievedData {
    payload: unknown;
    fetchedAt: string;
}

/** Convert HTTP Retry-After seconds or a date without shortening the delay. */
function retryAfterMs(value: string | null): number | null {
    if (!value) {
        return null;
    }
    if (/^\d+(?:\.\d+)?$/.test(value)) {
        return Number(value) * 1000;
    }
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp)
        ? Math.max(0, timestamp - Date.now())
        : null;
}

/** Recognize access challenges even when the upstream incorrectly returns 200. */
function challenged(response: TrackerResponse): boolean {
    const prefix = response.body.slice(0, 16_384).toLowerCase();
    return (
        response.status === 401 ||
        response.status === 403 ||
        [
            'just a moment',
            "you've been blocked",
            'cf-chl-',
            'challenge-platform',
            'verify you are human',
        ].some(marker => prefix.includes(marker))
    );
}

/** Retain typed failures and normalize low-level request errors. */
function requestFailure(error: unknown): R6StatsError {
    if (error instanceof R6StatsError) {
        return error;
    }
    const code =
        error instanceof Error && error.name === 'TimeoutError'
            ? 'TIMEOUT'
            : 'UPSTREAM_ERROR';
    return new R6StatsError(code, 'The Tracker request failed.', {
        cause: error,
    });
}

/** Own bounded HTTP requests, request coalescing, caching and renderer cleanup. */
export class TrackerTransport {
    readonly #timeoutMs: number;
    readonly #cacheTtlMs: number;
    readonly #intervalMs: number;
    readonly #retries: number;
    readonly #dispatcher: Dispatcher | undefined;
    readonly #renderer: TrackerRenderer | undefined;
    readonly #cache = new Map<
        string,
        {data: RetrievedData; expiresAt: number}
    >();
    readonly #pending = new Map<string, Promise<RetrievedData>>();
    #queue: Promise<void> = Promise.resolve();
    #lastRequest = 0;
    #browserMode = false;
    #rateLimitUntil = 0;
    #closed = false;

    constructor(options: ClientOptions = {}) {
        this.#timeoutMs = validateInteger(
            options.timeoutMs ?? 20_000,
            'timeoutMs',
            120_000,
            1,
        );
        this.#cacheTtlMs = validateInteger(
            options.cacheTtlMs ?? 60_000,
            'cacheTtlMs',
            3_600_000,
        );
        this.#intervalMs = validateInteger(
            options.minRequestIntervalMs ?? 1000,
            'minRequestIntervalMs',
            60_000,
        );
        this.#retries = validateInteger(options.retries ?? 1, 'retries', 2);
        if (options.browser && options.renderer) {
            throw new R6StatsError(
                'INVALID_ARGUMENT',
                'Configure browser or renderer, not both.',
            );
        }
        this.#dispatcher = options.dispatcher;
        this.#renderer =
            options.renderer ??
            (options.browser === false
                ? undefined
                : createBrowserRenderer(options.browser));
    }

    /** Share successful requests and serialize explicit upstream calls. */
    async read(
        url: string,
        profileUrl: string,
        profileApiUrl: string,
    ): Promise<RetrievedData> {
        if (this.#closed) {
            throw new R6StatsError('CLIENT_CLOSED', 'This client is closed.');
        }
        const cached = this.#cache.get(url);
        if (cached && cached.expiresAt > Date.now()) {
            return structuredClone(cached.data);
        }
        this.#cache.delete(url);
        let pending = this.#pending.get(url);
        if (!pending) {
            const resource = {
                url,
                profileUrl,
                profileApiUrl,
                timeoutMs: this.#timeoutMs,
                maxBytes: 8 * 1024 * 1024,
            };
            pending = this.#queue
                .then(() => this.#retrieve(resource))
                .then(data => {
                    if (this.#cacheTtlMs > 0) {
                        if (this.#cache.size >= 100) {
                            const oldest = this.#cache.keys().next().value;
                            if (oldest !== undefined) {
                                this.#cache.delete(oldest);
                            }
                        }
                        this.#cache.set(url, {
                            data,
                            expiresAt: Date.now() + this.#cacheTtlMs,
                        });
                    }
                    return data;
                })
                .finally(() => this.#pending.delete(url));
            this.#pending.set(url, pending);
            this.#queue = pending.then(
                () => undefined,
                () => undefined,
            );
        }
        return structuredClone(await pending);
    }

    /** Space explicit requests even when a challenge triggers browser fallback. */
    async #pace(): Promise<void> {
        const waitMs = this.#intervalMs - (Date.now() - this.#lastRequest);
        if (waitMs > 0) {
            await delay(waitMs);
        }
        this.#lastRequest = Date.now();
    }

    /** Read an undici response with a timeout, no redirects and a byte ceiling. */
    async #http(resource: TrackerResource): Promise<TrackerResponse> {
        const response = await fetch(resource.url, {
            headers: {
                accept: 'application/json',
                referer: 'https://r6.tracker.network/',
                origin: 'https://r6.tracker.network',
            },
            redirect: 'error',
            signal: AbortSignal.timeout(this.#timeoutMs),
            ...(this.#dispatcher ? {dispatcher: this.#dispatcher} : {}),
        });
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let body = '';
        let bytes = 0;
        if (reader) {
            while (true) {
                const chunk = await reader.read();
                if (chunk.done) {
                    break;
                }
                const value: unknown = chunk.value;
                if (!(value instanceof Uint8Array)) {
                    await reader.cancel();
                    throw new R6StatsError(
                        'PARSE_ERROR',
                        'Tracker returned an invalid response stream.',
                    );
                }
                bytes += value.byteLength;
                if (bytes > resource.maxBytes) {
                    await reader.cancel();
                    throw new R6StatsError(
                        'RESPONSE_TOO_LARGE',
                        'Tracker response exceeded the size limit.',
                    );
                }
                body += decoder.decode(value, {stream: true});
            }
            body += decoder.decode();
        }
        return {
            status: response.status,
            body,
            contentType: response.headers.get('content-type') ?? '',
            retryAfter: response.headers.get('retry-after'),
        };
    }

    /** Fetch and validate an envelope, retrying only transient failures. */
    async #retrieve(resource: TrackerResource): Promise<RetrievedData> {
        if (this.#closed) {
            throw new R6StatsError('CLIENT_CLOSED', 'This client is closed.');
        }
        if (this.#rateLimitUntil > Date.now()) {
            throw new R6StatsError(
                'RATE_LIMITED',
                'Tracker requests are cooling down.',
                {
                    status: 429,
                    retryAfterMs: this.#rateLimitUntil - Date.now(),
                },
            );
        }
        for (let attempt = 0; attempt <= this.#retries; attempt++) {
            try {
                await this.#pace();
                let response =
                    this.#browserMode && this.#renderer
                        ? await this.#renderer.fetch(resource)
                        : await this.#http(resource);
                if (
                    challenged(response) &&
                    this.#renderer &&
                    !this.#browserMode
                ) {
                    this.#browserMode = true;
                    await this.#pace();
                    response = await this.#renderer.fetch(resource);
                }
                if (
                    response.status === 0 ||
                    Buffer.byteLength(response.body) > resource.maxBytes
                ) {
                    throw new R6StatsError(
                        'RESPONSE_TOO_LARGE',
                        'Tracker response exceeded the size limit.',
                    );
                }
                if (challenged(response)) {
                    throw new R6StatsError(
                        'ACCESS_DENIED',
                        'Tracker denied access. Try again later.',
                        {status: response.status},
                    );
                }
                if (response.status === 404) {
                    throw new R6StatsError(
                        'PLAYER_NOT_FOUND',
                        'Tracker could not find the player or resource.',
                        {status: 404},
                    );
                }
                if (response.status === 429 || response.status >= 500) {
                    const waitMs = retryAfterMs(response.retryAfter);
                    if (response.status === 429) {
                        this.#rateLimitUntil = Date.now() + (waitMs ?? 1000);
                    }
                    throw new R6StatsError(
                        response.status === 429
                            ? 'RATE_LIMITED'
                            : 'UPSTREAM_ERROR',
                        'Tracker temporarily rejected the request.',
                        {
                            status: response.status,
                            ...(waitMs === null ? {} : {retryAfterMs: waitMs}),
                        },
                    );
                }
                if (response.status < 200 || response.status >= 300) {
                    throw new R6StatsError(
                        'UPSTREAM_ERROR',
                        'Tracker returned an unsuccessful response.',
                        {status: response.status},
                    );
                }
                let payload: unknown;
                try {
                    payload = JSON.parse(response.body);
                } catch (error) {
                    throw new R6StatsError(
                        'PARSE_ERROR',
                        'Tracker returned invalid JSON.',
                        {cause: error},
                    );
                }
                unwrap(payload);
                return {payload, fetchedAt: new Date().toISOString()};
            } catch (error) {
                const failure = requestFailure(error);
                const waitMs = failure.retryAfterMs ?? 1000 * 2 ** attempt;
                if (
                    attempt === this.#retries ||
                    waitMs > 5000 ||
                    (failure.code === 'UPSTREAM_ERROR' &&
                        failure.status !== null &&
                        failure.status < 500) ||
                    !['RATE_LIMITED', 'UPSTREAM_ERROR', 'TIMEOUT'].includes(
                        failure.code,
                    )
                ) {
                    throw failure;
                }
                await delay(waitMs);
            }
        }
        throw new R6StatsError(
            'UPSTREAM_ERROR',
            'Tracker request attempts were exhausted.',
        );
    }

    /** Prevent new requests, drain pending work and release browser resources. */
    async close(): Promise<void> {
        this.#closed = true;
        await Promise.allSettled(this.#pending.values());
        this.#cache.clear();
        await this.#renderer?.close();
    }
}
