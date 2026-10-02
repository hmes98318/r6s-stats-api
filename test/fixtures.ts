/** @fileoverview Fabricated statistics; no live player responses are used here. */

/** Build a source-shaped scalar metric for offline behavior tests. */
export function metric(
    value: number | string | null,
    displayType = 'Number',
): Record<string, unknown> {
    return {
        value,
        displayType,
        displayValue: value === null ? null : String(value),
        metadata: {},
    };
}

/** Small fabricated match and round statistics. */
export const stats = {
    matchesPlayed: metric(10),
    matchesWon: metric(6),
    matchesLost: metric(4),
    kills: metric('1,234'),
    deaths: metric(100),
    assists: metric(0),
    kdRatio: metric(12.34, 'NumberPrecision2'),
    winPercentage: metric(60, 'NumberPercentage'),
    timePlayed: metric(90_500, 'TimeMilliseconds'),
    roundsPlayed: metric(30),
    roundsWon: metric(20),
    roundsLost: metric(10),
    roundWinPct: metric(66.7, 'NumberPercentage'),
    aces: metric(1),
    kills5K: metric(3),
};

/** A fabricated profile with combined lifetime totals and two ranking systems. */
export const profile = {
    data: {
        platformInfo: {
            platformSlug: 'ubi',
            platformUserHandle: 'Test.Player',
            platformUserId: 'test-player',
        },
        metadata: {
            clearanceLevel: 50,
            currentSeason: 43,
            nameChanges: [
                {name: 'Old.Player', timestamp: '2024-01-01T08:00:00+08:00'},
            ],
        },
        segments: [
            {type: 'overview', attributes: {}, metadata: {}, stats},
            {
                type: 'gamemode',
                attributes: {gamemode: 'pvp_quickplay'},
                metadata: {gamemodeName: 'Unranked + Quick Match'},
                stats,
            },
            {
                type: 'season',
                attributes: {gamemode: 'pvp_ranked', season: 33},
                metadata: {seasonName: 'Test Season', rankType: 'rp'},
                stats: {
                    ...stats,
                    rank: metric(26),
                    rankPoints: {
                        ...metric(3500),
                        metadata: {
                            name: 'EMERALD V',
                            imageUrl: 'https://example.com/rank.png',
                        },
                    },
                },
            },
            {
                type: 'season',
                attributes: {gamemode: 'pvp_ranked', season: 20},
                metadata: {rankType: 'mmr'},
                stats: {
                    ...stats,
                    mmr: {...metric(2500), metadata: {name: 'TEST RANK'}},
                },
            },
        ],
    },
};

/** A fabricated operator with different match and round win percentages. */
export const operators = {
    data: [
        {
            type: 'operator',
            attributes: {
                operator: 'ace',
                side: 'attacker',
                gamemode: 'all',
                season: null,
            },
            metadata: {operatorName: 'Ace'},
            stats,
        },
    ],
};

/** A fabricated map response for public API and renderer tests. */
export const maps = {
    data: [
        {
            type: 'map',
            attributes: {map: 'bank', gamemode: 'all', season: null},
            metadata: {mapName: 'Bank'},
            stats,
        },
    ],
};

/** A fabricated roster with the requesting player deliberately placed second. */
export const matches = {
    data: {
        requestingPlayerAttributes: {playerId: 'test-player'},
        metadata: {next: 1},
        matches: [
            {
                attributes: {
                    id: 'match-1',
                    gamemode: 'pvp_ranked',
                    sessionMap: 'bank',
                },
                metadata: {
                    timestamp: '2024-01-01T08:00:00+08:00',
                    sessionMapName: 'Bank',
                },
                segments: [
                    {
                        type: 'overview',
                        attributes: {playerId: 'someone-else'},
                        metadata: {result: 'loss'},
                        stats: {kills: metric(99)},
                    },
                    {
                        type: 'overview',
                        attributes: {playerId: 'test-player'},
                        metadata: {result: 'win', operators: [{name: 'Ace'}]},
                        stats,
                    },
                ],
            },
        ],
    },
};
