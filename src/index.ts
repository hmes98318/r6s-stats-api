import {createClient} from './client.ts';
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

export {createClient, R6StatsClient} from './client.ts';
export {createBrowserRenderer} from './browser.ts';
export type {
    BrowserOptions,
    TrackerRenderer,
    TrackerResource,
    TrackerResponse,
} from './browser.ts';
export {R6StatsError} from './errors.ts';
export type {ErrorCode, ErrorDetails} from './errors.ts';
export type {Metric, MetricUnit} from './normalize.ts';
export type {ClientOptions} from './transport.ts';
export type {
    MapStats,
    Match,
    MatchOptions,
    MatchPage,
    OperatorStats,
    Platform,
    Player,
    PlayerOverview,
    Playlist,
    PlaylistOptions,
    Rank,
    Season,
    SeasonFilters,
    SegmentFilters,
    Statistics,
    StatsSegment,
    TrackerResult,
} from './types.ts';

const client = createClient({browser: false});

/** Retrieve a profile using the shared HTTP-only client. */
export function getOverview(
    platform: Platform,
    username: string,
): Promise<TrackerResult<PlayerOverview>> {
    return client.getOverview(platform, username);
}

/** Retrieve recorded seasons using the shared HTTP-only client. */
export function getSeasons(
    platform: Platform,
    username: string,
    filters: SeasonFilters = {},
): Promise<TrackerResult<StatsSegment[]>> {
    return client.getSeasons(platform, username, filters);
}

/** Retrieve a selected playlist using the shared HTTP-only client. */
export function getPlaylist(
    platform: Platform,
    username: string,
    playlist: Playlist,
    options: PlaylistOptions = {},
): Promise<TrackerResult<StatsSegment | null>> {
    return client.getPlaylist(platform, username, playlist, options);
}

/** Retrieve Ranked using the shared HTTP-only client. */
export function getRanked(
    platform: Platform,
    username: string,
    options: PlaylistOptions = {},
): Promise<TrackerResult<StatsSegment | null>> {
    return client.getRanked(platform, username, options);
}

/** Retrieve Unranked using the shared HTTP-only client. */
export function getUnranked(
    platform: Platform,
    username: string,
    options: PlaylistOptions = {},
): Promise<TrackerResult<StatsSegment | null>> {
    return client.getUnranked(platform, username, options);
}

/** Retrieve Quick Match using the shared HTTP-only client. */
export function getQuickMatch(
    platform: Platform,
    username: string,
    options: PlaylistOptions = {},
): Promise<TrackerResult<StatsSegment | null>> {
    return client.getQuickMatch(platform, username, options);
}

/** Retrieve one recent-match page using the shared HTTP-only client. */
export function getMatches(
    platform: Platform,
    username: string,
    options: MatchOptions = {},
): Promise<TrackerResult<MatchPage>> {
    return client.getMatches(platform, username, options);
}

/** Retrieve operators using the shared HTTP-only client. */
export function getOperators(
    platform: Platform,
    username: string,
    filters: SegmentFilters = {},
): Promise<TrackerResult<OperatorStats[]>> {
    return client.getOperators(platform, username, filters);
}

/** Retrieve one operator using the shared HTTP-only client. */
export function getOperator(
    platform: Platform,
    username: string,
    operator: string,
    filters: SegmentFilters = {},
): Promise<TrackerResult<OperatorStats | null>> {
    return client.getOperator(platform, username, operator, filters);
}

/** Retrieve maps using the shared HTTP-only client. */
export function getMaps(
    platform: Platform,
    username: string,
    filters: SegmentFilters = {},
): Promise<TrackerResult<MapStats[]>> {
    return client.getMaps(platform, username, filters);
}
