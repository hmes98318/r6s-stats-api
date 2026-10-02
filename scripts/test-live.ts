/** @fileoverview Run one developer-controlled live API smoke check. */
import {liveClient, reportFailure} from './live-client.ts';

/** Exercise the public functions while reusing this run's profile cache. */
async function main(): Promise<void> {
    const {client, platform, username} = liveClient();
    try {
        const overview = await client.getOverview(platform, username);
        console.log(
            JSON.stringify(
                {
                    player: overview.data.player,
                    overall: overview.data.overall?.stats,
                },
                null,
                4,
            ),
        );
        const seasons = await client.getSeasons(platform, username);
        const ranked = await client.getRanked(platform, username);
        const unranked = await client.getUnranked(platform, username);
        const quickMatch = await client.getQuickMatch(platform, username);
        console.log(
            JSON.stringify(
                {
                    seasons: seasons.data.length,
                    currentRanked: ranked.data?.stats ?? null,
                    currentUnranked: unranked.data?.stats ?? null,
                    currentQuickMatch: quickMatch.data?.stats ?? null,
                },
                null,
                4,
            ),
        );
        const operators = await client.getOperators(platform, username);
        const ace = await client.getOperator(platform, username, 'ace');
        const maps = await client.getMaps(platform, username);
        const matches = await client.getMatches(platform, username);
        console.log(
            JSON.stringify(
                {
                    operators: operators.data.length,
                    ace: ace.data?.stats,
                    maps: maps.data.length,
                    matches: matches.data.matches.length,
                    next: matches.data.next,
                },
                null,
                4,
            ),
        );
    } finally {
        await client.close();
    }
}

main().catch(reportFailure);
