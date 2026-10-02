/** @fileoverview Check cleaned live statistics through public API functions. */
import assert from 'node:assert/strict';
import type {Statistics} from '../src/index.ts';
import {liveClient, reportFailure} from './live-client.ts';

/** Reject nonfinite cleaned statistics without depending on a player's totals. */
function checkStats(stats: Statistics): void {
    for (const [key, value] of Object.entries(stats)) {
        assert.ok(
            value === null ||
                (typeof value === 'number' && Number.isFinite(value)),
            `${key} must be a finite number or null.`,
        );
        if (key.includes('Percentage') && value !== null) {
            assert.ok(value >= 0 && value <= 100);
        }
    }
}

/** Verify the public cleaned contracts with a small manual live run. */
async function main(): Promise<void> {
    const {client, platform, username} = liveClient();
    try {
        const overview = await client.getOverview(platform, username);
        if (overview.data.overall) {
            checkStats(overview.data.overall.stats);
        }
        for (const season of (await client.getSeasons(platform, username))
            .data) {
            checkStats(season.stats);
        }
        for (const operator of (await client.getOperators(platform, username))
            .data) {
            checkStats(operator.stats);
        }
        for (const map of (await client.getMaps(platform, username)).data) {
            checkStats(map.stats);
        }
        for (const match of (await client.getMatches(platform, username)).data
            .matches) {
            checkStats(match.stats);
        }
        console.log('Live cleaning checks passed.');
    } finally {
        await client.close();
    }
}

main().catch(reportFailure);
