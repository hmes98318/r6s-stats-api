import {createRequire} from 'node:module';
import type {Browser, Page} from 'playwright';
import {R6StatsError} from './errors.ts';

/** Public browser settings; no personal profile or saved credentials are used. */
export interface BrowserOptions {
    /** Full Chromium by default; installed Chrome and Edge are also supported. */
    channel?: 'chromium' | 'chrome' | 'msedge';
    /**
     * Run in the background by default.
     * Set false only for interactive debugging.
     */
    headless?: boolean;
}

/** A public API resource and the profile used to establish its browser context. */
export interface TrackerResource {
    url: string;
    profileUrl: string;
    profileApiUrl: string;
    timeoutMs: number;
    maxBytes: number;
}

/** A bounded raw response before JSON validation. */
export interface TrackerResponse {
    status: number;
    body: string;
    contentType: string;
    retryAfter: string | null;
}

/** Browser rendering boundary, also usable with fabricated data in tests. */
export interface TrackerRenderer {
    fetch(resource: TrackerResource): Promise<TrackerResponse>;
    close(): Promise<void>;
}

/** An isolated browser session and the profile response loaded during startup. */
interface BrowserSession {
    browser: Browser;
    page: Page;
    profileApiUrl: string;
    profileResponse: TrackerResponse;
}

/** Resolve the managed browser without changing the host's Playwright registry. */
async function chromiumExecutablePath(timeoutMs: number): Promise<string> {
    const {execFile} = await import('node:child_process');
    const require = createRequire(import.meta.url);
    return new Promise((resolve, reject) => {
        execFile(
            process.execPath,
            [
                '-e',
                'process.stdout.write(require(process.argv[1]).chromium.executablePath());',
                require.resolve('playwright'),
            ],
            {
                env: {...process.env, PLAYWRIGHT_BROWSERS_PATH: '0'},
                encoding: 'utf8',
                timeout: timeoutMs,
                maxBuffer: 65_536,
                windowsHide: true,
            },
            (error, stdout) => {
                if (error) {
                    reject(new Error('Could not resolve local Chromium.', {
                        cause: error,
                    }));
                } else {
                    resolve(stdout.trim());
                }
            },
        );
    });
}

/** Reuse normal browser access when a public HTTP endpoint challenges undici. */
class PlaywrightRenderer implements TrackerRenderer {
    readonly #options: BrowserOptions;
    #session: Promise<BrowserSession> | undefined;

    constructor(options: BrowserOptions) {
        this.#options = options;
    }

    /** Start the managed browser only when a request needs rendering. */
    async #start(resource: TrackerResource): Promise<BrowserSession> {
        let browser: Browser | undefined;
        try {
            const {chromium} = await import('playwright');
            const channel = this.#options.channel ?? 'chromium';
            browser = await chromium.launch({
                headless: this.#options.headless ?? true,
                channel,
                ...(channel === 'chromium' ? {
                    executablePath: await chromiumExecutablePath(
                        resource.timeoutMs,
                    ),
                } : {}),
            });
            const metadata = await browser.newBrowserCDPSession();
            let userAgent: string;
            try {
                const version = await metadata.send('Browser.getVersion');
                userAgent = version.userAgent.replace('HeadlessChrome/', 'Chrome/');
            } finally {
                await metadata.detach();
            }
            const context = await browser.newContext({userAgent});
            const page = await context.newPage();
            const ready = page
                .waitForResponse(
                    response =>
                        response.url().split('?')[0] === resource.profileApiUrl,
                    {timeout: resource.timeoutMs},
                )
                .then(async response => ({
                    response: {
                        status: response.status(),
                        body: await response.text(),
                        contentType: response.headers()['content-type'] ?? '',
                        retryAfter: response.headers()['retry-after'] ?? null,
                    },
                }))
                .catch((error: unknown) => ({error}));
            const navigation = await page.goto(resource.profileUrl, {
                waitUntil: 'domcontentloaded',
                timeout: resource.timeoutMs,
            });
            const result = await ready;
            if ('error' in result) {
                const status = navigation?.status();
                const denied = status === 401 || status === 403;
                const timedOut = result.error instanceof Error &&
                    result.error.name === 'TimeoutError';
                throw new R6StatsError(
                    denied ? 'ACCESS_DENIED' :
                        timedOut ? 'TIMEOUT' : 'UPSTREAM_ERROR',
                    'The browser did not obtain the public player profile.',
                    {
                        cause: result.error,
                        ...(status === undefined ? {} : {status}),
                    },
                );
            }
            if (Buffer.byteLength(result.response.body) > resource.maxBytes) {
                throw new R6StatsError(
                    'RESPONSE_TOO_LARGE',
                    'Tracker response exceeded the size limit.',
                );
            }
            return {
                browser,
                page,
                profileApiUrl: resource.profileApiUrl,
                profileResponse: result.response,
            };
        } catch (error) {
            await browser?.close().catch(() => undefined);
            if (error instanceof R6StatsError) {
                throw error;
            }
            if (!browser) {
                throw new R6StatsError(
                    'BROWSER_UNAVAILABLE',
                    'Reinstall r6s-stats-api with npm lifecycle scripts enabled to restore its local Chromium runtime.',
                    {cause: error},
                );
            }
            throw new R6StatsError(
                error instanceof Error && error.name === 'TimeoutError'
                    ? 'TIMEOUT' : 'UPSTREAM_ERROR',
                'The browser could not initialize a player session.',
                {cause: error},
            );
        }
    }

    /** Fetch public frontend JSON within the isolated browser's normal context. */
    async fetch(resource: TrackerResource): Promise<TrackerResponse> {
        const firstRequest = this.#session === undefined;
        this.#session ??= this.#start(resource).catch((error: unknown) => {
            this.#session = undefined;
            throw error;
        });
        const session = await this.#session;
        if (firstRequest && resource.url === session.profileApiUrl) {
            return session.profileResponse;
        }
        try {
            return await session.page.evaluate(
                async args => {
                    const response = await fetch(args.url, {
                        credentials: 'include',
                        headers: {accept: 'application/json'},
                        redirect: 'error',
                        signal: AbortSignal.timeout(args.timeoutMs),
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
                            bytes += chunk.value.byteLength;
                            if (bytes > args.maxBytes) {
                                await reader.cancel();
                                return {
                                    status: 0,
                                    body: '',
                                    contentType: '',
                                    retryAfter: null,
                                };
                            }
                            body += decoder.decode(chunk.value, {stream: true});
                        }
                        body += decoder.decode();
                    }
                    return {
                        status: response.status,
                        body,
                        contentType: response.headers.get('content-type') ?? '',
                        retryAfter: response.headers.get('retry-after'),
                    };
                },
                {
                    url: resource.url,
                    timeoutMs: resource.timeoutMs,
                    maxBytes: resource.maxBytes,
                },
            );
        } catch (error) {
            throw new R6StatsError(
                'UPSTREAM_ERROR',
                'The browser could not fetch public Tracker data.',
                {cause: error},
            );
        }
    }

    /** Release the isolated context and every tab created by this renderer. */
    async close(): Promise<void> {
        if (this.#session) {
            const session = await this.#session.catch(() => undefined);
            await session?.browser.close();
            this.#session = undefined;
        }
    }
}

/** Create an isolated browser renderer without eagerly launching a browser. */
export function createBrowserRenderer(
    options: BrowserOptions = {},
): TrackerRenderer {
    return new PlaywrightRenderer(options);
}
