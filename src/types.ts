import type {Metric} from './normalize.ts';

/** Tracker's supported account platform slugs. */
export type Platform = 'ubi' | 'psn' | 'xbl';

/** Public playlist names, including the source's combined lifetime playlist. */
export type Playlist =
    | 'ranked'
    | 'unranked'
    | 'quick-match'
    | 'unranked-and-quick-match'
    | 'dual-front'
    | 'siege-cup'
    | 'arcade'
    | 'event';

/** Source provenance and retrieval time for every successful call. */
export interface TrackerResult<T> {
    source: 'tracker-network';
    sourceUrl: string;
    fetchedAt: string;
    data: T;
}

/** The public player identity supplied by Tracker. */
export interface Player {
    platform: Platform;
    username: string;
    userId: string | null;
    avatarUrl: string | null;
    profileUrl: string;
}

/** Fixed statistics; missing source values are always null. */
export interface Statistics {
    matchesPlayed: number | null;
    wins: number | null;
    losses: number | null;
    abandons: number | null;
    timePlayedSeconds: number | null;
    kills: number | null;
    deaths: number | null;
    assists: number | null;
    headshots: number | null;
    headshotPercentage: number | null;
    kdRatio: number | null;
    winPercentage: number | null;
    killsPerMatch: number | null;
    roundsPlayed: number | null;
    roundsWon: number | null;
    roundsLost: number | null;
    roundWinPercentage: number | null;
    aces: number | null;
    teamKills: number | null;
}

/** A recorded season's identity, independent of its playlist. */
export interface Season {
    id: number;
    name: string | null;
    shortName: string | null;
}

/** A rank from source metadata, with RP and historical MMR kept distinct. */
export interface Rank {
    name: string | null;
    imageUrl: string | null;
    tier: number | null;
    points: number | null;
    pointsType: 'rp' | 'mmr' | null;
}

/** One lifetime, playlist or season statistics segment. */
export interface StatsSegment {
    type: string;
    name: string | null;
    playlist: Playlist | null;
    sourcePlaylist: string | null;
    season: Season | null;
    stats: Statistics;
    rank: Rank | null;
    peakRank: Rank | null;
    metrics: Record<string, Metric>;
}

/** Public profile overview and its recorded lifetime and season segments. */
export interface PlayerOverview {
    player: Player;
    clearanceLevel: number | null;
    battlePassLevel: number | null;
    currentSeasonId: number | null;
    aliases: Array<{name: string; changedAt: string | null}>;
    overall: StatsSegment | null;
    playlists: StatsSegment[];
    seasons: StatsSegment[];
}

/** One operator, with round counters separate from match counters. */
export interface OperatorStats {
    operator: string;
    name: string | null;
    imageUrl: string | null;
    side: 'attacker' | 'defender' | null;
    stats: Statistics;
    metrics: Record<string, Metric>;
    coverage: {fromSeason: 'Y8S1'; excludes: ['arcade', 'event']};
}

/** One map's statistics and documented source coverage. */
export interface MapStats {
    map: string;
    name: string | null;
    imageUrl: string | null;
    stats: Statistics;
    metrics: Record<string, Metric>;
    coverage: {fromSeason: 'Y9S3'; excludes: ['arcade', 'event']};
}

/** A requesting player's recorded match, without an inferred result. */
export interface Match {
    id: string;
    playlist: Playlist | null;
    sourcePlaylist: string | null;
    map: string | null;
    mapName: string | null;
    result: 'win' | 'loss' | 'draw' | 'unknown';
    playedAt: string | null;
    durationSeconds: number | null;
    score: {team: number | null; opponent: number | null};
    operators: string[];
    stats: Statistics;
    metrics: Record<string, Metric>;
}

/** One explicitly requested match page. */
export interface MatchPage {
    matches: Match[];
    next: number | null;
}

/** Filters applied to profile season segments without another request. */
export interface SeasonFilters {
    playlist?: Playlist;
    season?: number;
}

/** Playlist totals for the current season, one season or a lifetime segment. */
export interface PlaylistOptions {
    season?: number | 'current' | 'all';
}

/** Filters supported by the public operator and map source endpoints. */
export interface SegmentFilters {
    playlist?: Exclude<
        Playlist,
        'unranked-and-quick-match' | 'arcade' | 'event'
    >;
    season?: number;
}

/** Fetch one additional page using Tracker's returned numeric cursor. */
export interface MatchOptions {
    next?: number;
}
