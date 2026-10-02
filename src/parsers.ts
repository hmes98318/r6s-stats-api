import {R6StatsError} from './errors.ts';
import {
    list,
    normalizeMetrics,
    number,
    optionalRecord,
    record,
    text,
    timestamp,
    unwrap,
} from './normalize.ts';
import type {Metric} from './normalize.ts';
import type {
    MapStats,
    Match,
    MatchPage,
    OperatorStats,
    Platform,
    PlayerOverview,
    Playlist,
    Rank,
    Statistics,
    StatsSegment,
} from './types.ts';

/** Map source identifiers without merging separate playlists. */
export const PLAYLISTS: Readonly<Record<Playlist, string>> = {
    ranked: 'pvp_ranked',
    unranked: 'pvp_standard',
    'quick-match': 'pvp_casual',
    'unranked-and-quick-match': 'pvp_quickplay',
    'dual-front': 'pvp_living_game_mode',
    'siege-cup': 'pvp_r6cup',
    arcade: 'pvp_warmup',
    event: 'pvp_event',
};

/** Resolve only known source playlist identifiers. */
function playlist(value: unknown): Playlist | null {
    for (const key of Object.keys(PLAYLISTS) as Playlist[]) {
        if (PLAYLISTS[key] === value) {
            return key;
        }
    }
    return null;
}

/** Read the first available normalized numeric metric, retaining zeroes. */
function metricNumber(
    metrics: Record<string, Metric>,
    ...keys: string[]
): number | null {
    for (const key of keys) {
        const value = metrics[key]?.value;
        if (typeof value === 'number') {
            return value;
        }
    }
    return null;
}

/** Build the fixed contract from named source statistics, never derived totals. */
function statistics(metrics: Record<string, Metric>): Statistics {
    return {
        matchesPlayed: metricNumber(metrics, 'matchesPlayed', 'matches'),
        wins: metricNumber(metrics, 'matchesWon', 'wins'),
        losses: metricNumber(metrics, 'matchesLost', 'losses'),
        abandons: metricNumber(metrics, 'matchesAbandoned', 'abandons'),
        timePlayedSeconds: metricNumber(metrics, 'timePlayed'),
        kills: metricNumber(metrics, 'kills'),
        deaths: metricNumber(metrics, 'deaths'),
        assists: metricNumber(metrics, 'assists'),
        headshots: metricNumber(metrics, 'headshots'),
        headshotPercentage: metricNumber(
            metrics,
            'headshotPercentage',
            'headshotPct',
        ),
        kdRatio: metricNumber(metrics, 'kdRatio'),
        winPercentage: metricNumber(metrics, 'winPercentage', 'matchesWinPct'),
        killsPerMatch: metricNumber(metrics, 'killsPerMatch', 'killsPerGame'),
        roundsPlayed: metricNumber(metrics, 'roundsPlayed'),
        roundsWon: metricNumber(metrics, 'roundsWon'),
        roundsLost: metricNumber(metrics, 'roundsLost'),
        roundWinPercentage: metricNumber(metrics, 'roundWinPct'),
        aces: metricNumber(metrics, 'kills5K', 'aces'),
        teamKills: metricNumber(metrics, 'teamKills'),
    };
}

/** Require stable identifiers so a schema change cannot create anonymous data. */
function identifier(value: unknown, label: string): string {
    const result = text(value);
    if (!result) {
        throw new R6StatsError('PARSE_ERROR', `Tracker omitted ${label}.`);
    }
    return result;
}

/** Read a rank from points metadata rather than recalculating tier boundaries. */
function rank(
    rawStats: Record<string, unknown>,
    metrics: Record<string, Metric>,
    rankType: unknown,
    peak: boolean,
): Rank | null {
    const key = peak ? 'maxRankPoints' : 'rankPoints';
    const historicalKey = peak ? 'maxMmr' : 'mmr';
    const source = rawStats[key] ?? rawStats[historicalKey];
    const tier = metricNumber(metrics, peak ? 'maxRank' : 'rank');
    if (source === undefined && tier === null) {
        return null;
    }
    const metadata = optionalRecord(optionalRecord(source).metadata);
    return {
        name: text(metadata.name),
        imageUrl: text(metadata.imageUrl),
        tier,
        points: metricNumber(metrics, key, historicalKey),
        pointsType: rankType === 'rp' || rankType === 'mmr' ? rankType : null,
    };
}

/** Normalize one recorded profile segment. */
function segment(value: unknown): StatsSegment {
    const source = record(value, 'segment');
    const attributes = optionalRecord(source.attributes);
    const metadata = optionalRecord(source.metadata);
    const rawStats = record(source.stats, 'statistics');
    const metrics = normalizeMetrics(rawStats);
    const seasonId = number(attributes.season);
    let season: StatsSegment['season'] = null;
    if (seasonId !== null) {
        season = {
            id: seasonId,
            name: text(metadata.seasonName),
            shortName: text(metadata.shortName),
        };
    }
    return {
        type: identifier(source.type, 'segment type'),
        name: text(metadata.gamemodeName) ?? text(metadata.name),
        playlist: playlist(attributes.gamemode),
        sourcePlaylist: text(attributes.gamemode),
        season,
        stats: statistics(metrics),
        rank: rank(rawStats, metrics, metadata.rankType, false),
        peakRank: rank(rawStats, metrics, metadata.rankType, true),
        metrics,
    };
}

/** Clean a public profile while excluding unrelated Tracker account metadata. */
export function parseOverview(
    payload: unknown,
    platform: Platform,
    username: string,
    profileUrl: string,
): PlayerOverview {
    const source = record(unwrap(payload), 'profile');
    const platformInfo = record(source.platformInfo, 'platformInfo');
    if (platformInfo.platformSlug !== platform) {
        throw new R6StatsError(
            'PARSE_ERROR',
            'Tracker returned a different platform.',
        );
    }
    const metadata = optionalRecord(source.metadata);
    const segments = list(source.segments, 'profile segments').map(segment);
    const aliases = list(metadata.nameChanges ?? [], 'aliases').map(value => {
        const alias = record(value, 'alias');
        return {
            name: identifier(alias.name, 'alias name'),
            changedAt: timestamp(alias.timestamp),
        };
    });
    return {
        player: {
            platform,
            username: text(platformInfo.platformUserHandle) ?? username,
            userId: text(platformInfo.platformUserId),
            avatarUrl: text(platformInfo.avatarUrl),
            profileUrl,
        },
        clearanceLevel: number(metadata.clearanceLevel),
        battlePassLevel: number(metadata.battlepassLevel),
        currentSeasonId: number(metadata.currentSeason),
        aliases,
        overall: segments.find(entry => entry.type === 'overview') ?? null,
        playlists: segments.filter(entry => entry.type === 'gamemode'),
        seasons: segments.filter(entry => entry.type === 'season'),
    };
}

/** Clean operator segments with both round and match statistics. */
export function parseOperators(payload: unknown): OperatorStats[] {
    return list(unwrap(payload), 'operators').map(value => {
        const source = record(value, 'operator');
        const attributes = record(source.attributes, 'operator attributes');
        const metadata = optionalRecord(source.metadata);
        const metrics = normalizeMetrics(source.stats);
        const side = attributes.side;
        return {
            operator: identifier(attributes.operator, 'operator identifier'),
            name: text(metadata.operatorName),
            imageUrl: text(metadata.operatorImageUrl),
            side: side === 'attacker' || side === 'defender' ? side : null,
            stats: statistics(metrics),
            metrics,
            coverage: {fromSeason: 'Y8S1', excludes: ['arcade', 'event']},
        };
    });
}

/** Clean map segments without hiding source-provided zero-match maps. */
export function parseMaps(payload: unknown): MapStats[] {
    return list(unwrap(payload), 'maps').map(value => {
        const source = record(value, 'map');
        const attributes = record(source.attributes, 'map attributes');
        const metadata = optionalRecord(source.metadata);
        const metrics = normalizeMetrics(source.stats);
        return {
            map: identifier(attributes.map, 'map identifier'),
            name: text(metadata.mapName),
            imageUrl: text(metadata.mapImageUrl),
            stats: statistics(metrics),
            metrics,
            coverage: {fromSeason: 'Y9S3', excludes: ['arcade', 'event']},
        };
    });
}

/** Select the requesting player's overview when matches contain a roster. */
function playerSegment(
    value: unknown,
    playerId: string | null,
    username: string,
): Record<string, unknown> {
    const segments = list(value, 'match segments').map(entry =>
        record(entry, 'match segment'),
    );
    const matched = segments.find(entry => {
        const attributes = optionalRecord(entry.attributes);
        const metadata = optionalRecord(entry.metadata);
        return (
            entry.type === 'overview' &&
            ((playerId !== null && attributes.playerId === playerId) ||
                text(metadata.platformUserIdentifier)?.toLowerCase() ===
                    username.toLowerCase())
        );
    });
    if (matched) {
        return matched;
    }
    throw new R6StatsError(
        'PARSE_ERROR',
        'Tracker omitted the requesting player from a match.',
    );
}

/** Normalize one requesting player's match and its exact duration. */
function match(
    value: unknown,
    playerId: string | null,
    username: string,
): Match {
    const source = record(value, 'match');
    const attributes = record(source.attributes, 'match attributes');
    const metadata = optionalRecord(source.metadata);
    const player = playerSegment(source.segments, playerId, username);
    const playerMetadata = optionalRecord(player.metadata);
    const metrics = normalizeMetrics(player.stats);
    const stats = statistics(metrics);
    const result = playerMetadata.result;
    return {
        id: identifier(attributes.id, 'match identifier'),
        playlist: playlist(attributes.gamemode),
        sourcePlaylist: text(attributes.gamemode),
        map: text(attributes.sessionMap),
        mapName: text(metadata.sessionMapName),
        result:
            result === 'win' || result === 'loss' || result === 'draw'
                ? result
                : 'unknown',
        playedAt: timestamp(metadata.timestamp),
        durationSeconds: stats.timePlayedSeconds,
        score: {team: stats.roundsWon, opponent: stats.roundsLost},
        operators: list(playerMetadata.operators ?? [], 'match operators').map(
            operator =>
                identifier(record(operator, 'operator').name, 'operator name'),
        ),
        stats,
        metrics,
    };
}

/** Clean one match page and retain its explicit next-page cursor. */
export function parseMatches(payload: unknown, username: string): MatchPage {
    const source = record(unwrap(payload), 'match page');
    const attributes = optionalRecord(source.requestingPlayerAttributes);
    const metadata = optionalRecord(source.metadata);
    const playerId = text(attributes.playerId);
    return {
        matches: list(source.matches, 'matches').map(value =>
            match(value, playerId, username),
        ),
        next: number(metadata.next),
    };
}
