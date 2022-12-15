// Type definitions for ./index.js

import { StatsGeneral } from './types/general';
import { StatsCasual } from './types/casual';
import { StatsRank } from './types/rank';
import { StatsDeathmatch } from './types/deathmatch';
import { StatsOperator } from './types/operator';


/**
 * Fetch General stats.
 * @param {string} platform: pc | xbox | psn.
 * @param {string} name: Player name.
 * @returns Stats | `FORMAT_ERROR` | `PLATFORM_ERROR` | `NOT_FOUND` | `TIME_OUT`
 * @typedef `FORMAT_ERROR`: Input format error.
 * @typedef `PLATFORM_ERROR`: Input platform error.
 * @typedef `NOT_FOUND`: No stats found or any errors.
 * @typedef `TIME_OUT`: Fetch stats request time out.
 */
async function general(
    platform: string,
    name: string
): Promise<StatsGeneral | 'FORMAT_ERROR' | 'PLATFORM_ERROR' | 'NOT_FOUND' | 'TIME_OUT'>;

/**
 * Fetch Casual stats.
 * @param {string} platform: pc | xbox | psn.
 * @param {string} name: Player name.
 * @returns Stats | `FORMAT_ERROR` | `PLATFORM_ERROR` | `NOT_FOUND` | `TIME_OUT`
 * @typedef `FORMAT_ERROR`: Input format error.
 * @typedef `PLATFORM_ERROR`: Input platform error.
 * @typedef `NOT_FOUND`: No stats found or any errors.
 * @typedef `TIME_OUT`: Fetch stats request time out.
 */
declare async function casual(
    platform: string,
    name: string
): Promise<StatsCasual | 'FORMAT_ERROR' | 'PLATFORM_ERROR' | 'NOT_FOUND' | 'TIME_OUT'>;

/**
 * Fetch Rank stats.
 * @param {string} platform: pc | xbox | psn.
 * @param {string} name: Player name.
 * @returns Stats | `FORMAT_ERROR` | `PLATFORM_ERROR` | `NOT_FOUND` | `TIME_OUT`
 * @typedef `FORMAT_ERROR`: Input format error.
 * @typedef `PLATFORM_ERROR`: Input platform error.
 * @typedef `NOT_FOUND`: No stats found or any errors.
 * @typedef `TIME_OUT`: Fetch stats request time out.
 */
declare async function rank(
    platform: string,
    name: string
): Promise<StatsRank | 'FORMAT_ERROR' | 'PLATFORM_ERROR' | 'NOT_FOUND' | 'TIME_OUT'>;

/**
 * Fetch Deathmatch stats.
 * @param {string} platform: pc | xbox | psn.
 * @param {string} name: Player name.
 * @returns Stats | `FORMAT_ERROR` | `PLATFORM_ERROR` | `NOT_FOUND` | `TIME_OUT` | `NEVER_PLAY`
 * @typedef `FORMAT_ERROR`: Input format error.
 * @typedef `PLATFORM_ERROR`: Input platform error.
 * @typedef `NOT_FOUND`: No stats found or any errors.
 * @typedef `TIME_OUT`: Fetch stats request time out.
 * @typedef `NEVER_PLAY`: Haven't played this mode this season.
 */
declare async function deathmatch(
    platform: string,
    name: string
): Promise<StatsDeathmatch | 'FORMAT_ERROR' | 'PLATFORM_ERROR' | 'NOT_FOUND' | 'TIME_OUT' | 'NEVER_PLAY'>;

/**
 * Fetch Operators stats.
 * @param {string} platform: pc | xbox | psn.
 * @param {string} name: Player name.
 * @returns Stats | `FORMAT_ERROR` | `PLATFORM_ERROR` | `NOT_FOUND` | `TIME_OUT` | `OPERATOR_ERROR`
 * @typedef `FORMAT_ERROR`: Input format error.
 * @typedef `PLATFORM_ERROR`: Input platform error.
 * @typedef `NOT_FOUND`: No stats found or any errors.
 * @typedef `TIME_OUT`: Fetch stats request time out.
 * @typedef `OPERATOR_ERROR`: Wrong operator name.
 */
declare async function operator(
    platform: string,
    name: string,
    operator: string
): Promise<StatsOperator | 'FORMAT_ERROR' | 'PLATFORM_ERROR' | 'NOT_FOUND' | 'TIME_OUT' | 'OPERATOR_ERROR'>;

export { general, casual, rank, deathmatch, operator };