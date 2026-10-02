/** @fileoverview Browser behavior with fabricated Playwright responses only. */
import assert from 'node:assert/strict';
import {mock, test} from 'node:test';
import type {ExecFileOptions} from 'node:child_process';
import {getGlobalDispatcher, MockAgent, setGlobalDispatcher} from 'undici';
import {createBrowserRenderer} from '../src/browser.ts';
import type {TrackerResource} from '../src/browser.ts';
import {R6StatsError} from '../src/errors.ts';
import type {ErrorCode} from '../src/errors.ts';
import {createClient} from '../src/index.ts';
import {operators, profile} from './fixtures.ts';

type Failure = 'launch' | 'denied' | 'profile-timeout' | 'navigation-timeout';

const resource: TrackerResource = {
    url: 'https://api.tracker.gg/api/v2/r6siege/standard/profile/ubi/Test.Player',
    profileApiUrl:
        'https://api.tracker.gg/api/v2/r6siege/standard/profile/ubi/Test.Player',
    profileUrl:
        'https://r6.tracker.network/r6siege/profile/ubi/Test.Player/overview',
    timeoutMs: 100,
    maxBytes: 100_000,
};
const response = {
    status: 200,
    body: JSON.stringify(profile),
    contentType: 'application/json',
    retryAfter: null,
};
const userAgent =
    'Mozilla/5.0 (X11; Linux x86_64) HeadlessChrome/153.0.0.0 Safari/537.36';
const executablePath =
    '/fabricated/node_modules/playwright-core/.local-browsers/chromium/chrome';
let failure: Failure | null = null;
let contextUserAgent: string | undefined;
let closed = 0;
let detached = 0;

/** Create the minimum browser surface used by the renderer, without I/O. */
const launch = mock.fn((options: {
    headless: boolean;
    channel?: string;
    executablePath?: string;
}): Promise<unknown> => {
    assert.equal(typeof options.headless, 'boolean');
    if (failure === 'launch') {
        return Promise.reject(new Error('Missing fabricated browser runtime'));
    }
    return Promise.resolve({
        newBrowserCDPSession: (): Promise<unknown> => Promise.resolve({
            send: (method: string): Promise<{userAgent: string}> => {
                assert.equal(method, 'Browser.getVersion');
                return Promise.resolve({userAgent});
            },
            detach: (): Promise<void> => {
                detached++;
                return Promise.resolve();
            },
        }),
        newContext: (settings: {userAgent?: string} = {}): Promise<unknown> => {
            contextUserAgent = settings.userAgent;
            return Promise.resolve({
                newPage: (): Promise<unknown> => Promise.resolve({
                    waitForResponse: (): Promise<unknown> => {
                        if (failure === 'denied' || failure === 'profile-timeout') {
                            return Promise.reject(Object.assign(
                                new Error('Profile timeout'),
                                {name: 'TimeoutError'},
                            ));
                        }
                        return Promise.resolve({
                            status: (): number => response.status,
                            text: (): Promise<string> =>
                                Promise.resolve(response.body),
                            headers: (): Record<string, string> => ({
                                'content-type': response.contentType,
                            }),
                        });
                    },
                    goto: (): Promise<unknown> => {
                        if (failure === 'navigation-timeout') {
                            return Promise.reject(Object.assign(
                                new Error('Navigation timeout'),
                                {name: 'TimeoutError'},
                            ));
                        }
                        return Promise.resolve({
                            status: (): number => failure === 'denied' ? 403 : 200,
                        });
                    },
                    evaluate: (): Promise<typeof response> =>
                        Promise.resolve(response),
                }),
            });
        },
        close: (): Promise<void> => {
            closed++;
            return Promise.resolve();
        },
    });
});

mock.module('playwright', {exports: {chromium: {launch}}});
const resolveExecutable = mock.fn((
    executable: string,
    args: string[],
    options: ExecFileOptions,
    callback: (error: Error | null, stdout: string) => void,
): void => {
    assert.equal(executable, process.execPath);
    assert.equal(args[0], '-e');
    assert.equal(options.env?.PLAYWRIGHT_BROWSERS_PATH, '0');
    assert.equal(options.windowsHide, true);
    callback(null, executablePath);
});
mock.module('node:child_process', {exports: {execFile: resolveExecutable}});

void test('uses modern headless Chromium and reuses an isolated session', async () => {
    const renderer = createBrowserRenderer();
    const originalBrowserPath = process.env.PLAYWRIGHT_BROWSERS_PATH;
    process.env.PLAYWRIGHT_BROWSERS_PATH = '/another-project/browser-cache';
    try {
        assert.deepEqual(await renderer.fetch(resource), response);
        assert.deepEqual(await renderer.fetch(resource), response);
        assert.equal(launch.mock.callCount(), 1);
        assert.deepEqual(launch.mock.calls[0]?.arguments[0], {
            headless: true,
            channel: 'chromium',
            executablePath,
        });
        assert.equal(resolveExecutable.mock.callCount(), 1);
        assert.equal(
            process.env.PLAYWRIGHT_BROWSERS_PATH,
            '/another-project/browser-cache',
        );
        assert.equal(contextUserAgent, userAgent.replace('HeadlessChrome/', 'Chrome/'));
        assert.equal(detached, 1);
    } finally {
        await renderer.close();
        if (originalBrowserPath === undefined) {
            delete process.env.PLAYWRIGHT_BROWSERS_PATH;
        } else {
            process.env.PLAYWRIGHT_BROWSERS_PATH = originalBrowserPath;
        }
    }
    assert.equal(closed, 1);

    const debugRenderer = createBrowserRenderer({headless: false});
    try {
        await debugRenderer.fetch(resource);
        assert.equal(launch.mock.calls[1]?.arguments[0].headless, false);
    } finally {
        await debugRenderer.close();
    }
});

void test('reports startup failures accurately and can retry with a fresh session', async () => {
    const cases: Array<{
        failure: Failure;
        code: ErrorCode;
        status: number | null;
    }> = [
        {failure: 'launch', code: 'BROWSER_UNAVAILABLE', status: null},
        {failure: 'denied', code: 'ACCESS_DENIED', status: 403},
        {failure: 'profile-timeout', code: 'TIMEOUT', status: 200},
        {failure: 'navigation-timeout', code: 'TIMEOUT', status: null},
    ];
    for (const scenario of cases) {
        const renderer = createBrowserRenderer();
        failure = scenario.failure;
        try {
            await assert.rejects(renderer.fetch(resource), (error: unknown) => {
                assert.ok(error instanceof R6StatsError);
                assert.equal(error.code, scenario.code);
                assert.equal(error.status, scenario.status);
                return true;
            });
            failure = null;
            assert.deepEqual(await renderer.fetch(resource), response);
        } finally {
            failure = null;
            await renderer.close();
        }
    }
});

void test('default client starts a headless browser only after a challenge', async () => {
    const agent = new MockAgent();
    agent.disableNetConnect();
    const pool = agent.get('https://api.tracker.gg');
    const profilePath = new URL(resource.profileApiUrl).pathname;
    pool.intercept({
        path: `${profilePath}/segments/operator?sessionType=all&season=all`,
    }).reply(200, operators);
    pool.intercept({path: profilePath}).reply(403, 'Just a moment');

    const previousDispatcher = getGlobalDispatcher();
    const launchesBefore = launch.mock.callCount();
    const closedBefore = closed;
    const client = createClient();
    setGlobalDispatcher(agent);
    try {
        assert.equal(launch.mock.callCount(), launchesBefore);
        assert.equal(
            (await client.getOperators('ubi', 'Test.Player')).data[0]?.operator,
            'ace',
        );
        assert.equal(launch.mock.callCount(), launchesBefore);
        assert.equal(
            (await client.getOverview('ubi', 'Test.Player')).data.clearanceLevel,
            50,
        );
        await client.getOverview('ubi', 'Test.Player');
        assert.equal(launch.mock.callCount(), launchesBefore + 1);
        assert.equal(launch.mock.calls.at(-1)?.arguments[0].headless, true);
        agent.assertNoPendingInterceptors();
    } finally {
        setGlobalDispatcher(previousDispatcher);
        await client.close();
        await agent.close();
    }
    assert.equal(closed, closedBefore + 1);
});
