import {R6StatsError} from './errors.ts';
import {list, record, unwrap} from './normalize.ts';
import {
    parseMaps,
    parseMatches,
    parseOperators,
    parseOverview,
    PLAYLISTS,
} from './parsers.ts';
import {TrackerTransport} from './transport.ts';
import type {ClientOptions, RetrievedData} from './transport.ts';
import type {
    MapStats,
    MatchOptions,
    MatchPage,
    OperatorStats,
    Platform,
    PlayerOverview,
    Playlist,
    PlaylistOptions,
    SeasonFilters,
    SegmentFilters,
    StatsSegment,
    TrackerResult,
} from './types.ts';
import {
    validateInteger,
    validateName,
    validatePlatform,
    validatePlaylist,
} from './validation.ts';

/** Public frontend's legacy sessionType query values. */
const SESSION_TYPES: Readonly<Record<Playlist, string>> = {
    ranked: 'ranked',
    unranked: 'standard',
    'quick-match': 'quick-match',
    'unranked-and-quick-match': 'quickplay',
    'dual-front': 'dual-front',
    'siege-cup': 'r6cup',
    arcade: 'arcade',
    event: 'event',
};

/** Validated account coordinates used to construct public URLs. */
interface Identity {
    platform: Platform;
    username: string;
    profileUrl: string;
    profileApiUrl: string;
    matchesApiUrl: string;
}

/** Validate arguments and encode a username as a single path segment. */
function identity(platform: Platform, username: string): Identity {
    const validatedPlatform = validatePlatform(platform);
    const validatedName = validateName(username);
    const path = `${validatedPlatform}/${encodeURIComponent(validatedName)}`;
    const base = 'https://api.tracker.gg/api/v2/r6siege/standard';
    return {
        platform: validatedPlatform,
        username: validatedName,
        profileUrl: `https://r6.tracker.network/r6siege/profile/${path}/overview`,
        profileApiUrl: `${base}/profile/${path}`,
        matchesApiUrl: `${base}/matches/${path}`,
    };
}

/** Attach source provenance while keeping retrieval time stable for cached data. */
function result<T>(
    retrieved: RetrievedData,
    sourceUrl: string,
    data: T,
): TrackerResult<T> {
    return {
        source: 'tracker-network',
        sourceUrl,
        fetchedAt: retrieved.fetchedAt,
        data,
    };
}

/** Keep filter validation ahead of all network activity. */
function validateSeason(value: number): number {
    return validateInteger(value, 'season', 10_000, 1);
}

/** A reusable statistics client with bounded requests and explicit cleanup. */
export class R6StatsClient {
    readonly #transport: TrackerTransport;

    constructor(options: ClientOptions = {}) {
        this.#transport = new TrackerTransport(options);
    }

    /** Retrieve identity, lifetime totals, aliases and recorded season statistics. */
    async getOverview(
        platform: Platform,
        username: string,
    ): Promise<TrackerResult<PlayerOverview>> {
        const account = identity(platform, username);
        const retrieved = await this.#transport.read(
            account.profileApiUrl,
            account.profileUrl,
            account.profileApiUrl,
        );
        return result(
            retrieved,
            account.profileApiUrl,
            parseOverview(
                retrieved.payload,
                account.platform,
                account.username,
                account.profileUrl,
            ),
        );
    }

    /** Select recorded seasons from the shared profile response. */
    async getSeasons(
        platform: Platform,
        username: string,
        filters: SeasonFilters = {},
    ): Promise<TrackerResult<StatsSegment[]>> {
        if (filters.playlist !== undefined) {
            validatePlaylist(filters.playlist);
        }
        if (filters.season !== undefined) {
            validateSeason(filters.season);
        }
        const overview = await this.getOverview(platform, username);
        const data = overview.data.seasons.filter(
            segment =>
                (filters.playlist === undefined ||
                    segment.playlist === filters.playlist) &&
                (filters.season === undefined ||
                    segment.season?.id === filters.season),
        );
        return {...overview, data};
    }

    /** Retrieve one playlist's recorded current season, selected season or lifetime. */
    async getPlaylist(
        platform: Platform,
        username: string,
        playlist: Playlist,
        options: PlaylistOptions = {},
    ): Promise<TrackerResult<StatsSegment | null>> {
        validatePlaylist(playlist);
        const season = options.season ?? 'current';
        if (season !== 'all' && season !== 'current') {
            validateSeason(season);
        }
        const overview = await this.getOverview(platform, username);
        const seasonId =
            season === 'current' ? overview.data.currentSeasonId : season;
        const segments =
            season === 'all' ? overview.data.playlists : overview.data.seasons;
        const data =
            segments.find(
                segment =>
                    segment.playlist === playlist &&
                    (season === 'all' || segment.season?.id === seasonId),
            ) ?? null;
        return {...overview, data};
    }

    /** Retrieve Ranked totals using the same season semantics as getPlaylist. */
    getRanked(
        platform: Platform,
        username: string,
        options: PlaylistOptions = {},
    ): Promise<TrackerResult<StatsSegment | null>> {
        return this.getPlaylist(platform, username, 'ranked', options);
    }

    /** Retrieve Unranked without substituting combined lifetime statistics. */
    getUnranked(
        platform: Platform,
        username: string,
        options: PlaylistOptions = {},
    ): Promise<TrackerResult<StatsSegment | null>> {
        return this.getPlaylist(platform, username, 'unranked', options);
    }

    /** Retrieve Quick Match without substituting combined lifetime statistics. */
    getQuickMatch(
        platform: Platform,
        username: string,
        options: PlaylistOptions = {},
    ): Promise<TrackerResult<StatsSegment | null>> {
        return this.getPlaylist(platform, username, 'quick-match', options);
    }

    /** Retrieve exactly one recent-match page for the requesting player. */
    async getMatches(
        platform: Platform,
        username: string,
        options: MatchOptions = {},
    ): Promise<TrackerResult<MatchPage>> {
        const account = identity(platform, username);
        const url = new URL(account.matchesApiUrl);
        if (options.next !== undefined) {
            url.searchParams.set(
                'next',
                String(
                    validateInteger(
                        options.next,
                        'next',
                        Number.MAX_SAFE_INTEGER,
                    ),
                ),
            );
        }
        const retrieved = await this.#transport.read(
            url.href,
            account.profileUrl,
            account.profileApiUrl,
        );
        return result(
            retrieved,
            url.href,
            parseMatches(retrieved.payload, account.username),
        );
    }

    /** Fetch an operator or map resource with source-side filters. */
    async #segments(
        platform: Platform,
        username: string,
        type: 'operator' | 'map',
        filters: SegmentFilters,
    ): Promise<{retrieved: RetrievedData; url: string}> {
        const account = identity(platform, username);
        const url = new URL(`${account.profileApiUrl}/segments/${type}`);
        if (filters.playlist !== undefined) {
            validatePlaylist(filters.playlist);
            if (
                ['unranked-and-quick-match', 'arcade', 'event'].includes(
                    filters.playlist,
                )
            ) {
                throw new R6StatsError(
                    'INVALID_ARGUMENT',
                    'Operator and map statistics exclude combined lifetime, Arcade and Event playlists.',
                );
            }
        }
        url.searchParams.set(
            'sessionType',
            filters.playlist === undefined
                ? 'all'
                : SESSION_TYPES[filters.playlist],
        );
        url.searchParams.set(
            'season',
            filters.season === undefined
                ? 'all'
                : String(validateSeason(filters.season)),
        );
        const retrieved = await this.#transport.read(
            url.href,
            account.profileUrl,
            account.profileApiUrl,
        );
        for (const value of list(unwrap(retrieved.payload), 'segments')) {
            const attributes = record(
                record(value, 'segment').attributes,
                'attributes',
            );
            if (
                (filters.season !== undefined &&
                    attributes.season !== filters.season) ||
                (filters.playlist !== undefined &&
                    attributes.gamemode !== PLAYLISTS[filters.playlist])
            ) {
                throw new R6StatsError(
                    'PARSE_ERROR',
                    'Tracker returned statistics that do not match the requested filters.',
                );
            }
        }
        return {retrieved, url: url.href};
    }

    /** Retrieve operator match and round statistics from the public frontend. */
    async getOperators(
        platform: Platform,
        username: string,
        filters: SegmentFilters = {},
    ): Promise<TrackerResult<OperatorStats[]>> {
        const {retrieved, url} = await this.#segments(
            platform,
            username,
            'operator',
            filters,
        );
        return result(retrieved, url, parseOperators(retrieved.payload));
    }

    /** Find one operator slug without making a second request for its statistics. */
    async getOperator(
        platform: Platform,
        username: string,
        operator: string,
        filters: SegmentFilters = {},
    ): Promise<TrackerResult<OperatorStats | null>> {
        const name = validateName(operator, 'Operator').toLowerCase();
        const operators = await this.getOperators(platform, username, filters);
        const data =
            operators.data.find(
                entry => entry.operator.toLowerCase() === name,
            ) ?? null;
        return {...operators, data};
    }

    /** Retrieve map statistics, including their documented coverage boundary. */
    async getMaps(
        platform: Platform,
        username: string,
        filters: SegmentFilters = {},
    ): Promise<TrackerResult<MapStats[]>> {
        const {retrieved, url} = await this.#segments(
            platform,
            username,
            'map',
            filters,
        );
        return result(retrieved, url, parseMaps(retrieved.payload));
    }

    /** Close this client's browser and discard its response cache. */
    close(): Promise<void> {
        return this.#transport.close();
    }
}

/** Create a reusable client with headless browser handling enabled by default. */
export function createClient(options: ClientOptions = {}): R6StatsClient {
    return new R6StatsClient(options);
}
