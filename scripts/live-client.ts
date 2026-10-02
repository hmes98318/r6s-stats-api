/** @fileoverview Shared configuration for manually invoked live checks. */
import {createClient, R6StatsError} from '../src/index.ts';
import type {Platform, R6StatsClient} from '../src/index.ts';

/** Parse account arguments and use a headless browser unless debugging. */
export function liveClient(): {
    client: R6StatsClient;
    platform: Platform;
    username: string;
} {
    const args = process.argv.slice(2);
    const headed = args.includes('--headed');
    const accountArgs = args.filter(argument => argument !== '--headed');
    const platform = accountArgs[0] ?? 'ubi';
    if (platform !== 'ubi' && platform !== 'psn' && platform !== 'xbl') {
        throw new R6StatsError(
            'INVALID_ARGUMENT',
            'Usage: node scripts/test-live.ts ' +
                '[ubi|psn|xbl] [username] [--headed]',
        );
    }
    return {
        client: headed
            ? createClient({browser: {headless: false}})
            : createClient(),
        platform,
        username: accountArgs[1] ?? 'waifu_-.',
    };
}

/** Report concise typed failures without logging full upstream responses. */
export function reportFailure(error: unknown): void {
    console.error(
        error instanceof R6StatsError
            ? `${error.code}: ${error.message}`
            : error,
    );
    process.exitCode = 1;
}
