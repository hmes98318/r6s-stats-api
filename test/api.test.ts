import assert from 'node:assert/strict';
import {test} from 'node:test';
import {MockAgent} from 'undici';
import {createClient, R6StatsError} from '../src/index.ts';
import type {TrackerRenderer, TrackerResource} from '../src/index.ts';
import {normalizeMetric, number} from '../src/normalize.ts';
import {maps, matches, metric, operators, profile} from './fixtures.ts';

const base = 'https://api.tracker.gg';
const path = '/api/v2/r6siege/standard/profile/ubi/Test.Player';

/** Create a test agent that cannot fall back to the real network. */
function agent(): MockAgent {
    const mock = new MockAgent();
    mock.disableNetConnect();
    return mock;
}

void test('cleans grouped numbers, percentages, durations, zeroes and missing values', () => {
    assert.equal(number('1,234'), 1234);
    assert.equal(number(''), null);
    assert.equal(number(false), null);
    assert.equal(normalizeMetric(metric(0)).value, 0);
    assert.equal(normalizeMetric(metric(null)).value, null);
    assert.equal(
        normalizeMetric(metric(90_500, 'TimeMilliseconds')).value,
        90.5,
    );
    assert.equal(
        normalizeMetric(metric('1h 2m 3s', 'TimeSeconds')).value,
        3723,
    );
    assert.equal(
        normalizeMetric(metric('52.3%', 'NumberPercentage')).value,
        52.3,
    );
    assert.equal(normalizeMetric(metric(Infinity)).value, null);
});

void test('shares profile requests and preserves season and combined-playlist semantics', async () => {
    const mock = agent();
    mock.get(base).intercept({path}).reply(200, profile);
    const client = createClient({
        browser: false,
        dispatcher: mock,
        minRequestIntervalMs: 0,
        retries: 0,
    });
    try {
        const [overview, seasons] = await Promise.all([
            client.getOverview('ubi', 'Test.Player'),
            client.getSeasons('ubi', 'Test.Player'),
        ]);
        assert.equal(overview.data.overall?.stats.kills, 1234);
        assert.equal(overview.data.overall?.stats.assists, 0);
        assert.equal(overview.data.overall?.stats.headshots, null);
        assert.equal(
            overview.data.aliases[0]?.changedAt,
            '2024-01-01T00:00:00.000Z',
        );
        assert.equal(seasons.data.length, 2);
        assert.equal(seasons.fetchedAt, overview.fetchedAt);
        assert.equal((await client.getRanked('ubi', 'Test.Player')).data, null);
        assert.equal(
            (await client.getRanked('ubi', 'Test.Player', {season: 33})).data
                ?.rank?.pointsType,
            'rp',
        );
        assert.equal(
            (await client.getRanked('ubi', 'Test.Player', {season: 20})).data
                ?.rank?.pointsType,
            'mmr',
        );
        assert.equal(
            (await client.getUnranked('ubi', 'Test.Player', {season: 'all'}))
                .data,
            null,
        );
        assert.equal(
            (await client.getQuickMatch('ubi', 'Test.Player', {season: 'all'}))
                .data,
            null,
        );
        assert.equal(
            (
                await client.getPlaylist(
                    'ubi',
                    'Test.Player',
                    'unranked-and-quick-match',
                    {season: 'all'},
                )
            ).data?.stats.matchesPlayed,
            10,
        );
        if (overview.data.overall) {
            overview.data.overall.stats.kills = -1;
        }
        assert.equal(
            (await client.getOverview('ubi', 'Test.Player')).data.overall?.stats
                .kills,
            1234,
        );
        mock.assertNoPendingInterceptors();
    } finally {
        await client.close();
        await mock.close();
    }
});

void test('operator and map functions distinguish round statistics and share cached operators', async () => {
    const mock = agent();
    const pool = mock.get(base);
    pool.intercept({
        path: `${path}/segments/operator?sessionType=all&season=all`,
    }).reply(200, operators);
    pool.intercept({
        path: `${path}/segments/map?sessionType=all&season=all`,
    }).reply(200, maps);
    const client = createClient({
        browser: false,
        dispatcher: mock,
        minRequestIntervalMs: 0,
        retries: 0,
    });
    try {
        const list = await client.getOperators('ubi', 'Test.Player');
        assert.equal(list.data[0]?.stats.winPercentage, 60);
        assert.equal(list.data[0]?.stats.roundWinPercentage, 66.7);
        assert.equal(list.data[0]?.stats.aces, 3);
        assert.equal(list.data[0]?.metrics.aces?.value, 1);
        assert.equal(
            (await client.getOperator('ubi', 'Test.Player', 'ACE')).data
                ?.operator,
            'ace',
        );
        assert.equal(
            (await client.getOperator('ubi', 'Test.Player', 'missing')).data,
            null,
        );
        assert.equal(
            (await client.getMaps('ubi', 'Test.Player')).data[0]?.map,
            'bank',
        );
        mock.assertNoPendingInterceptors();
    } finally {
        await client.close();
        await mock.close();
    }
});

void test('matches select the requesting player and retain timestamp, duration and pagination', async () => {
    const mock = agent();
    mock.get(base)
        .intercept({
            path: '/api/v2/r6siege/standard/matches/ubi/Test.Player?next=1',
        })
        .reply(200, matches);
    const client = createClient({
        browser: false,
        dispatcher: mock,
        minRequestIntervalMs: 0,
        retries: 0,
    });
    try {
        const result = await client.getMatches('ubi', 'Test.Player', {next: 1});
        assert.equal(result.data.matches[0]?.stats.kills, 1234);
        assert.equal(result.data.matches[0]?.result, 'win');
        assert.equal(result.data.matches[0]?.durationSeconds, 90.5);
        assert.equal(
            result.data.matches[0]?.playedAt,
            '2024-01-01T00:00:00.000Z',
        );
        assert.equal(result.data.next, 1);
        mock.assertNoPendingInterceptors();
    } finally {
        await client.close();
        await mock.close();
    }
});

void test('invalid arguments and closed clients fail before requesting Tracker', async () => {
    const mock = agent();
    const client = createClient({browser: false, dispatcher: mock});
    try {
        await assert.rejects(client.getOverview('ubi', '  '), {
            code: 'INVALID_ARGUMENT',
        });
        await assert.rejects(client.getOverview('ubi', '..'), {
            code: 'INVALID_ARGUMENT',
        });
        await assert.rejects(
            client.getRanked('ubi', 'Test.Player', {season: NaN}),
            {code: 'INVALID_ARGUMENT'},
        );
        await assert.rejects(
            client.getMatches('ubi', 'Test.Player', {next: -1}),
            {code: 'INVALID_ARGUMENT'},
        );
        await client.close();
        await assert.rejects(client.getOverview('ubi', 'Test.Player'), {
            code: 'CLIENT_CLOSED',
        });
        assert.throws(() => createClient({retries: 99}), R6StatsError);
    } finally {
        await client.close();
        await mock.close();
    }
});

void test('a challenge invokes the renderer once and subsequent resources reuse it', async () => {
    const mock = agent();
    mock.get(base)
        .intercept({path})
        .reply(403, '<title>Just a moment...</title>');
    const calls: string[] = [];
    let closed = false;
    const renderer: TrackerRenderer = {
        fetch(resource: TrackerResource): Promise<{
            status: number;
            body: string;
            contentType: string;
            retryAfter: null;
        }> {
            calls.push(resource.url);
            return Promise.resolve({
                status: 200,
                body: JSON.stringify(
                    resource.url.includes('/segments/map') ? maps : profile,
                ),
                contentType: 'application/json',
                retryAfter: null,
            });
        },
        close(): Promise<void> {
            closed = true;
            return Promise.resolve();
        },
    };
    const client = createClient({
        dispatcher: mock,
        renderer,
        minRequestIntervalMs: 0,
        retries: 0,
    });
    try {
        assert.equal(
            (await client.getOverview('ubi', 'Test.Player')).data
                .clearanceLevel,
            50,
        );
        await client.getOverview('ubi', 'Test.Player');
        assert.equal(
            (await client.getMaps('ubi', 'Test.Player')).data[0]?.map,
            'bank',
        );
        assert.equal(calls.length, 2);
    } finally {
        await client.close();
        await mock.close();
    }
    assert.equal(closed, true);
});

void test('HTTP-only clients report access denial, malformed JSON and missing players', async () => {
    for (const [status, body, code] of [
        [403, 'Blocked', 'ACCESS_DENIED'],
        [200, '<html>unexpected page</html>', 'PARSE_ERROR'],
        [404, '{}', 'PLAYER_NOT_FOUND'],
    ] as const) {
        const mock = agent();
        mock.get(base).intercept({path}).reply(status, body);
        const client = createClient({
            browser: false,
            dispatcher: mock,
            retries: 0,
            minRequestIntervalMs: 0,
        });
        try {
            await assert.rejects(client.getOverview('ubi', 'Test.Player'), {
                code,
            });
        } finally {
            await client.close();
            await mock.close();
        }
    }
});

void test('respects a long Retry-After instead of retrying early', async () => {
    const mock = agent();
    mock.get(base)
        .intercept({path})
        .reply(429, '{}', {headers: {'retry-after': '60'}});
    const client = createClient({
        browser: false,
        dispatcher: mock,
        minRequestIntervalMs: 0,
    });
    try {
        await assert.rejects(client.getOverview('ubi', 'Test.Player'), {
            code: 'RATE_LIMITED',
            retryAfterMs: 60_000,
        });
        await assert.rejects(client.getMaps('ubi', 'Test.Player'), {
            code: 'RATE_LIMITED',
        });
        mock.assertNoPendingInterceptors();
    } finally {
        await client.close();
        await mock.close();
    }
});

void test('retries a transient upstream failure within the configured bound', async () => {
    const mock = agent();
    const pool = mock.get(base);
    pool.intercept({path}).reply(503, '{}', {headers: {'retry-after': '0'}});
    pool.intercept({path}).reply(200, profile);
    const client = createClient({
        browser: false,
        dispatcher: mock,
        minRequestIntervalMs: 0,
        retries: 1,
    });
    try {
        assert.equal(
            (await client.getOverview('ubi', 'Test.Player')).data
                .clearanceLevel,
            50,
        );
        mock.assertNoPendingInterceptors();
    } finally {
        await client.close();
        await mock.close();
    }
});
