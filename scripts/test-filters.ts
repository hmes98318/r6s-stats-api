/** @fileoverview Manually verify source filters and one match pagination step. */
import assert from 'node:assert/strict';
import {liveClient, reportFailure} from './live-client.ts';

/** Exercise filtered public API calls with a bounded live request count. */
async function main(): Promise<void> {
    const {client, platform, username} = liveClient();
    try {
        const seasons = await client.getSeasons(platform, username, {
            playlist: 'ranked',
        });
        const played = seasons.data.find(
            season => (season.stats.matchesPlayed ?? 0) > 0,
        );
        if (played?.season) {
            const season = played.season.id;
            const ranked = await client.getRanked(platform, username, {season});
            const operators = await client.getOperators(platform, username, {
                playlist: 'ranked',
                season,
            });
            assert.equal(ranked.data?.season?.id, season);
            console.log(
                JSON.stringify({
                    season,
                    rankedMatches: ranked.data?.stats.matchesPlayed,
                    filteredOperators: operators.data.length,
                }),
            );
        }
        const maps = await client.getMaps(platform, username, {
            playlist: 'unranked',
        });
        console.log(`Unranked map rows: ${maps.data.length}`);
        const first = await client.getMatches(platform, username);
        if (first.data.next !== null) {
            const next = await client.getMatches(platform, username, {
                next: first.data.next,
            });
            const firstIds = new Set(first.data.matches.map(match => match.id));
            assert.ok(
                next.data.matches.every(match => !firstIds.has(match.id)),
                'Pagination must advance to different matches.',
            );
            console.log(`Next match page: ${next.data.matches.length} rows`);
        }
    } finally {
        await client.close();
    }
}

main().catch(reportFailure);
