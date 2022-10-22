// Type definitions for ./index.js

import { StatsGeneral } from './types/general'
import { StatsCasual } from './types/casual'
import { StatsRank } from './types/rank'
import { StatsUnrank } from './types/unrank'
import { StatsDeathmatch } from './types/deathmatch'
import { StatsOperator } from './types/operator'

/**
 * Fetch General stats.
 * @param {string} platform: "pc" | "xbox" | "psn".
 * @param {string} name: Player name.
 * @returns Stats | "FORMAT_ERROR" | "PLATFORM_ERROR" | "NOT_FOUND" | "TIME_OUT"
 * @typedef "FORMAT_ERROR": Input format error.
 * @typedef "PLATFORM_ERROR": Input platform error.
 * @typedef "NOT_FOUND": No stats found or any errors.
 * @typedef "TIME_OUT": Fetch stats request time out.
 */
async function general(
    platform: string,
    name: string
): Promise<StatsGeneral | 'ERROR'>

/**
 * Fetch Casual stats.
 * @param {string} platform: "pc" | "xbox" | "psn".
 * @param {string} name: Player name.
 * @returns Stats | "FORMAT_ERROR" | "PLATFORM_ERROR" | "NOT_FOUND" | "TIME_OUT"
 * @typedef "FORMAT_ERROR": Input format error.
 * @typedef "PLATFORM_ERROR": Input platform error.
 * @typedef "NOT_FOUND": No stats found or any errors.
 * @typedef "TIME_OUT": Fetch stats request time out.
 */
declare async function casual(
    platform: string,
    name: string
): Promise<StatsCasual | 'ERROR'>

/**
 * Fetch Rank stats.
 * @param {string} platform: "pc" | "xbox" | "psn".
 * @param {string} name: Player name.
 * @returns Stats | "FORMAT_ERROR" | "PLATFORM_ERROR" | "NOT_FOUND" | "TIME_OUT"
 * @typedef "FORMAT_ERROR": Input format error.
 * @typedef "PLATFORM_ERROR": Input platform error.
 * @typedef "NOT_FOUND": No stats found or any errors.
 * @typedef "TIME_OUT": Fetch stats request time out.
 */
declare async function rank(
    platform: string,
    name: string
): Promise<StatsRank | 'ERROR'>

/**
 * Fetch Deathmatch stats.
 * @param {string} platform: "pc" | "xbox" | "psn".
 * @param {string} name: Player name.
 * @returns Stats | "FORMAT_ERROR" | "PLATFORM_ERROR" | "NOT_FOUND" | "TIME_OUT"
 * @typedef "FORMAT_ERROR": Input format error.
 * @typedef "PLATFORM_ERROR": Input platform error.
 * @typedef "NOT_FOUND": No stats found or any errors.
 * @typedef "TIME_OUT": Fetch stats request time out.
 */
declare async function deathmatch(
    platform: string,
    name: string
): Promise<StatsDeathmatch | 'ERROR'>

/**
 * Fetch Operators stats.
 * @param {string} platform: "pc" | "xbox" | "psn".
 * @param {string} name: Player name.
 * @returns Stats | "FORMAT_ERROR" | "PLATFORM_ERROR" | "NOT_FOUND" | "TIME_OUT"
 * @typedef "FORMAT_ERROR": Input format error.
 * @typedef "PLATFORM_ERROR": Input platform error.
 * @typedef "NOT_FOUND": No stats found or any errors.
 * @typedef "TIME_OUT": Fetch stats request time out.
 */
declare async function operator(
    platform: string,
    name: string,
    operator: string
): Promise<StatsOperator | 'ERROR'>

export { general, casual, rank, deathmatch, operator }
