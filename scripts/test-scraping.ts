/** @fileoverview Fetch a public profile through the real library transport. */
import {liveClient, reportFailure} from './live-client.ts';

/** Verify live profile retrieval and show transport provenance. */
async function main(): Promise<void> {
    const {client, platform, username} = liveClient();
    try {
        const result = await client.getOverview(platform, username);
        console.log(
            JSON.stringify(
                {
                    sourceUrl: result.sourceUrl,
                    fetchedAt: result.fetchedAt,
                    player: result.data.player,
                    level: result.data.clearanceLevel,
                    overall: result.data.overall?.stats,
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
